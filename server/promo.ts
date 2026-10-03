import crypto from 'crypto';

// The special discount secret is strictly kept server-side.
// We store the SHA-256 hash of the normalized secret "KLIX" to ensure
// no raw plaintext exists in static strings if inspected.
// SHA-256("KLIX") = e154de75e701bd6bba9f6814e137f58769b87903a7af902e0c3ec8abcbdf7528
const SPECIAL_SECRET_HASH = 'e154de75e701bd6bba9f6814e137f58769b87903a7af902e0c3ec8abcbdf7528';

// Rate limiting map: tracks IP -> attempt count & timestamp
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS_PER_WINDOW = 15;
const WINDOW_MS = 60 * 1000; // 1 minute window

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_ATTEMPTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

export interface PromoValidationResult {
  valid: boolean;
  message?: string;
  discountPercent?: number;
  label?: string;
  promotionKey?: string;
}

/**
 * Validates a promo code securely on the server side.
 * Case-insensitive, trims surrounding spaces.
 */
export function validatePromoCodeServerSide(inputCode?: string | null): PromoValidationResult {
  if (!inputCode || typeof inputCode !== 'string') {
    return { valid: false, message: "That discount code isn't valid." };
  }

  const normalized = inputCode.trim().toUpperCase();
  if (normalized.length === 0 || normalized.length > 32) {
    return { valid: false, message: "That discount code isn't valid." };
  }

  // Hash the input and compare securely
  const hash = crypto.createHash('sha256').update(normalized).digest('hex');

  // Constant-time buffer comparison to prevent timing attacks
  const isMatch =
    hash.length === SPECIAL_SECRET_HASH.length &&
    crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(SPECIAL_SECRET_HASH));

  if (isMatch) {
    return {
      valid: true,
      discountPercent: 100,
      label: 'Special Customer Discount',
      promotionKey: 'special_customer_100',
    };
  }

  return {
    valid: false,
    message: "That discount code isn't valid.",
  };
}
