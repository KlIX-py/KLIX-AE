import { Router, Request, Response } from 'express';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import crypto from 'crypto';
import firebaseConfig from '../firebase-applet-config.json';
import { checkRateLimit, validatePromoCodeServerSide } from './promo';
import { Preorder, AppSettings, PlatformType } from '../src/types';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const apiRouter = Router();

// In-memory cache for recent submissions to prevent accidental double clicks / duplicates
const recentSubmissions = new Map<string, { timestamp: number; preorder: Preorder }>();
const DUPLICATE_WINDOW_MS = 15000; // 15 seconds

function generatePreorderId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  const randomBytes = crypto.randomBytes(8);
  for (let i = 0; i < 8; i++) {
    code += chars[randomBytes[i] % chars.length];
  }
  return `SL-${code}`;
}

// 1. Promo code validation endpoint
apiRouter.post('/validate-promo', (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({
      valid: false,
      message: 'Too many attempts. Please wait a minute and try again.',
    });
  }

  const { code } = req.body;
  const result = validatePromoCodeServerSide(code);

  if (!result.valid) {
    return res.status(400).json({
      valid: false,
      message: result.message || "That discount code isn't valid.",
    });
  }

  // Safe response: NEVER returns secret values or unnecessary debug info
  return res.json({
    valid: true,
    discountPercent: result.discountPercent,
    label: result.label,
  });
});

// Helper to fetch live pricing settings
async function getLiveSettings(): Promise<AppSettings> {
  const defaultSettings: AppSettings = {
    windowsPrice: null,
    androidPrice: null,
    completePrice: null,
    currency: 'NGN',
    currencySymbol: '₦',
    paymentEnabled: false,
    reservationOnly: true,
    preorderEnabled: true,
  };

  try {
    const settingsDoc = await getDoc(doc(db, 'appSettings', 'general'));
    if (settingsDoc.exists()) {
      return { ...defaultSettings, ...settingsDoc.data() } as AppSettings;
    }
  } catch (err) {
    console.warn('Could not read appSettings from Firestore, using defaults:', err);
  }

  return defaultSettings;
}

// 2. Public settings fetch endpoint
apiRouter.get('/settings', async (_req: Request, res: Response) => {
  const settings = await getLiveSettings();
  res.json(settings);
});

// 3. Preorder creation endpoint
apiRouter.post('/preorder', async (req: Request, res: Response) => {
  const { fullName, email, whatsapp, platform, promoCode, consentMarketing } = req.body;

  // Validate inputs
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    return res.status(400).json({ error: 'Enter your full name.' });
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: 'Enter a valid email address.' });
  }
  const validPlatforms: PlatformType[] = ['windows', 'android', 'complete_pack'];
  if (!platform || !validPlatforms.includes(platform)) {
    return res.status(400).json({ error: 'Select a StudyLock package.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim().slice(0, 100);
  const cleanWhatsapp = typeof whatsapp === 'string' ? whatsapp.trim().slice(0, 30) : '';

  // Duplicate submission protection
  const submissionKey = `${cleanEmail}:${platform}`;
  const now = Date.now();
  const existingSub = recentSubmissions.get(submissionKey);
  if (existingSub && now - existingSub.timestamp < DUPLICATE_WINDOW_MS) {
    // Return the already created preorder to avoid double charges/records
    return res.json({ success: true, preorder: existingSub.preorder, isDuplicate: true });
  }

  // Check launch settings
  const settings = await getLiveSettings();
  if (!settings.preorderEnabled) {
    return res.status(403).json({ error: 'StudyLock preorders are temporarily closed.' });
  }

  // Calculate base price
  let basePrice = 0;
  if (platform === 'windows') {
    basePrice = settings.windowsPrice ?? 0;
  } else if (platform === 'android') {
    basePrice = settings.androidPrice ?? 0;
  } else if (platform === 'complete_pack') {
    basePrice = settings.completePrice ?? 0;
  }

  let discountPercent = 0;
  let discountApplied = false;
  let discountType: string | undefined = undefined;
  let promotionKey: string | undefined = undefined;

  // Validate promo code if provided
  if (promoCode && typeof promoCode === 'string' && promoCode.trim().length > 0) {
    const promoResult = validatePromoCodeServerSide(promoCode);
    if (!promoResult.valid) {
      return res.status(400).json({ error: "That discount code isn't valid." });
    }
    discountPercent = promoResult.discountPercent ?? 100;
    discountApplied = true;
    discountType = promoResult.label;
    promotionKey = promoResult.promotionKey; // 'special_customer_100'
  }

  // Calculate final amount server-side (never trust client amounts)
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const finalAmount = Math.max(0, basePrice - discountAmount);

  // Determine payment & preorder status
  let paymentRequired = false;
  let paymentStatus: Preorder['paymentStatus'] = 'reservation';

  if (discountApplied && finalAmount === 0) {
    paymentRequired = false;
    paymentStatus = 'free_promo';
  } else if (settings.paymentEnabled && finalAmount > 0) {
    paymentRequired = true;
    paymentStatus = 'pending';
  } else {
    paymentRequired = false;
    paymentStatus = 'reservation';
  }

  const preorderId = generatePreorderId();
  const timestampIso = new Date().toISOString();

  const newPreorder: Preorder = {
    preorderId,
    fullName: cleanName,
    email: cleanEmail,
    whatsapp: cleanWhatsapp,
    platform,
    basePrice,
    currency: settings.currency,
    discountPercent,
    discountApplied,
    discountType: discountApplied ? discountType : undefined,
    finalAmount,
    paymentRequired,
    paymentStatus,
    preorderStatus: 'confirmed',
    promotion: promotionKey,
    source: 'preorder_website',
    consentMarketing: Boolean(consentMarketing),
    createdAt: timestampIso,
    updatedAt: timestampIso,
  };

  try {
    await setDoc(doc(db, 'preorders', preorderId), newPreorder);
    // Cache for duplicate protection
    recentSubmissions.set(submissionKey, { timestamp: now, preorder: newPreorder });

    return res.json({
      success: true,
      preorder: newPreorder,
    });
  } catch (err) {
    console.error('Failed to save preorder to Firestore:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// 4. Paystack initialization endpoint stub
apiRouter.post('/paystack/initialize', async (req: Request, res: Response) => {
  const { preorderId, email, amount } = req.body;

  if (!preorderId) {
    return res.status(400).json({ error: 'Preorder ID required' });
  }

  // When amount is 0, Paystack must not be called
  if (!amount || amount <= 0) {
    return res.json({
      requiresPayment: false,
      message: 'Zero balance order. No payment processing needed.',
    });
  }

  // Placeholder for real Paystack keys (can be configured in .env or settings)
  // Ensures architecture is completely ready for Paystack checkout
  res.json({
    requiresPayment: true,
    preorderId,
    amount,
    currency: 'NGN',
    message: 'Paystack integration ready. In reservation phase or with promo code, payment is not required.',
  });
});
