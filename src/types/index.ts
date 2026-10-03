export type PlatformType = 'windows' | 'android' | 'complete_pack';

export type PaymentStatus = 'free_promo' | 'reservation' | 'pending' | 'paid';

export type PreorderStatus = 'confirmed' | 'cancelled';

export interface Preorder {
  preorderId: string;
  fullName: string;
  email: string;
  whatsapp?: string;
  platform: PlatformType;
  basePrice: number;
  currency: string;
  discountPercent: number;
  discountApplied: boolean;
  discountType?: string;
  finalAmount: number;
  paymentRequired: boolean;
  paymentStatus: PaymentStatus;
  preorderStatus: PreorderStatus;
  promotion?: string;
  source: string;
  consentMarketing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppSettings {
  windowsPrice: number | null;
  androidPrice: number | null;
  completePrice: number | null;
  currency: string;
  currencySymbol: string;
  paymentEnabled: boolean;
  reservationOnly: boolean;
  preorderEnabled: boolean;
  updatedAt?: string;
}

export interface PromoValidationResponse {
  valid: boolean;
  message?: string;
  discountPercent?: number;
  label?: string;
  code?: string;
}

export interface PreorderSubmissionPayload {
  fullName: string;
  email: string;
  whatsapp?: string;
  platform: PlatformType;
  promoCode?: string;
  consentMarketing: boolean;
}
