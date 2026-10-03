import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Layers,
  Check,
  Tag,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Shield,
} from 'lucide-react';
import { AppSettings, PlatformType, Preorder } from '../types';

interface PreorderSectionProps {
  settings: AppSettings;
  selectedPlatform: PlatformType;
  onSelectPlatform: (platform: PlatformType) => void;
  onPreorderSuccess: (preorder: Preorder) => void;
}

export const PreorderSection: React.FC<PreorderSectionProps> = ({
  settings,
  selectedPlatform,
  onSelectPlatform,
  onPreorderSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [consentMarketing, setConsentMarketing] = useState(true);

  // Promo state
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    label: string;
    discountPercent: number;
  } | null>(null);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Format pricing display
  const formatPrice = (price: number | null | undefined) => {
    if (price === null || price === undefined || isNaN(price)) {
      return 'Preorder pricing coming soon';
    }
    const symbol = settings.currencySymbol || '₦';
    return `${symbol}${price.toLocaleString()}`;
  };

  const getCurrentBasePrice = () => {
    if (selectedPlatform === 'windows') return settings.windowsPrice;
    if (selectedPlatform === 'android') return settings.androidPrice;
    if (selectedPlatform === 'complete_pack') return settings.completePrice;
    return null;
  };

  const handleApplyPromo = async () => {
    const trimmed = discountCode.trim();
    if (!trimmed) {
      setPromoError('Enter a discount code to apply.');
      return;
    }

    setPromoLoading(true);
    setPromoError(null);

    try {
      const response = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        setPromoApplied({
          code: trimmed,
          label: data.label || 'Special Customer Discount',
          discountPercent: data.discountPercent || 100,
        });
        setPromoError(null);
      } else {
        setPromoApplied(null);
        setPromoError(data.message || "That discount code isn't valid.");
      }
    } catch (err) {
      setPromoApplied(null);
      setPromoError("That discount code isn't valid.");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!fullName.trim()) {
      setFormError('Enter your full name.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFormError('Enter a valid email address.');
      return;
    }
    if (!selectedPlatform) {
      setFormError('Select a StudyLock package.');
      return;
    }

    if (!settings.preorderEnabled) {
      setFormError('StudyLock preorders are temporarily closed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim() || undefined,
        platform: selectedPlatform,
        promoCode: promoApplied ? promoApplied.code : discountCode.trim() || undefined,
        consentMarketing,
      };

      const response = await fetch('/api/preorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success && data.preorder) {
        onPreorderSuccess(data.preorder);
      } else {
        setFormError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const basePrice = getCurrentBasePrice();
  const hasConfiguredPrice = basePrice !== null && basePrice !== undefined;
  const isFreePromo = promoApplied?.discountPercent === 100;
  const showPayment = settings.paymentEnabled && hasConfiguredPrice && !isFreePromo && basePrice > 0;

  return (
    <section id="preorder" className="py-24 bg-[#05070A] border-t border-[#1E293B]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase tracking-widest font-bold text-[#37A0FF]">
            Early Access List
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Get StudyLock before public launch.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Join the preorder list and reserve the version you want before public release.
          </p>
        </div>

        {/* Closed Banner if preorders are paused */}
        {!settings.preorderEnabled && (
          <div className="max-w-3xl mx-auto mb-12 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-center justify-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>StudyLock preorders are temporarily closed.</span>
          </div>
        )}

        {/* 3 Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-14">
          {/* Windows Early Access */}
          <div
            className={`rounded-2xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
              selectedPlatform === 'windows'
                ? 'bg-[#101620] border-[#1677FF] shadow-lg shadow-[#1677FF]/15 ring-1 ring-[#1677FF]'
                : 'bg-[#0B0F17] border-[#1E293B] hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1677FF]/15 text-[#37A0FF] flex items-center justify-center">
                  <Monitor className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">Desktop</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Windows Early Access</h3>
              <p className="text-xs text-slate-400 mb-5">Reserve the Windows .EXE</p>

              <div className="py-3 px-3.5 rounded-xl bg-[#05070A] border border-[#1E293B] mb-5">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Price</div>
                <div className="text-base font-extrabold text-white">
                  {formatPrice(settings.windowsPrice)}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!settings.preorderEnabled}
              onClick={() => {
                onSelectPlatform('windows');
                document.getElementById('preorder-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedPlatform === 'windows'
                  ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/25'
                  : 'bg-[#101620] text-slate-200 border border-[#1E293B] hover:bg-[#162030]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Reserve Windows
            </button>
          </div>

          {/* Android Early Access */}
          <div
            className={`rounded-2xl p-6 sm:p-7 border transition-all flex flex-col justify-between ${
              selectedPlatform === 'android'
                ? 'bg-[#101620] border-[#1677FF] shadow-lg shadow-[#1677FF]/15 ring-1 ring-[#1677FF]'
                : 'bg-[#0B0F17] border-[#1E293B] hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1677FF]/15 text-[#37A0FF] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-slate-400">Mobile</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Android Early Access</h3>
              <p className="text-xs text-slate-400 mb-5">Reserve the Android .APK</p>

              <div className="py-3 px-3.5 rounded-xl bg-[#05070A] border border-[#1E293B] mb-5">
                <div className="text-[11px] text-slate-400 uppercase font-semibold">Price</div>
                <div className="text-base font-extrabold text-white">
                  {formatPrice(settings.androidPrice)}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!settings.preorderEnabled}
              onClick={() => {
                onSelectPlatform('android');
                document.getElementById('preorder-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedPlatform === 'android'
                  ? 'bg-[#1677FF] text-white shadow-md shadow-[#1677FF]/25'
                  : 'bg-[#101620] text-slate-200 border border-[#1E293B] hover:bg-[#162030]'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Reserve Android
            </button>
          </div>

          {/* Complete Pack (Windows + Android) - Visually Emphasized */}
          <div
            className={`rounded-2xl p-6 sm:p-7 border relative transition-all flex flex-col justify-between ${
              selectedPlatform === 'complete_pack'
                ? 'bg-[#101620] border-[#37A0FF] shadow-xl shadow-[#1677FF]/25 ring-1 ring-[#37A0FF]'
                : 'bg-gradient-to-b from-[#101620] to-[#0B0F17] border-[#1677FF]/40 hover:border-[#1677FF]'
            }`}
          >
            {/* Visual emphasis badge */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#1677FF] to-[#37A0FF] text-[10px] font-bold tracking-wider uppercase text-white shadow-md">
              Complete Focus
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1677FF]/20 text-[#37A0FF] flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-mono text-[#37A0FF] font-semibold">Dual Setup</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">Complete Pack</h3>
              <p className="text-xs text-slate-400 mb-5">Windows + Android</p>

              <div className="py-3 px-3.5 rounded-xl bg-[#05070A] border border-[#1677FF]/30 mb-5">
                <div className="text-[11px] text-[#37A0FF] uppercase font-semibold">Price</div>
                <div className="text-base font-extrabold text-white">
                  {formatPrice(settings.completePrice)}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={!settings.preorderEnabled}
              onClick={() => {
                onSelectPlatform('complete_pack');
                document.getElementById('preorder-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#1677FF] to-[#1366DB] hover:from-[#1366DB] hover:to-[#0F54B8] shadow-md shadow-[#1677FF]/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reserve Complete Pack
            </button>
          </div>
        </div>

        {/* Preorder Form Container */}
        <div id="preorder-form" className="max-w-2xl mx-auto">
          <div className="bg-[#101620] rounded-3xl p-6 sm:p-10 border border-[#1E293B] shadow-2xl relative">
            <div className="mb-8">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Preorder Reservation Form
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Enter your details to secure your place on the early-access schedule.
              </p>
            </div>

            {formError && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="block text-xs font-semibold text-slate-300">
                  Full Name <span className="text-[#37A0FF]">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="e.g. David Adeleke"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF] transition-all"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold text-slate-300">
                  Email Address <span className="text-[#37A0FF]">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="e.g. student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF] transition-all"
                />
              </div>

              {/* WhatsApp Number (Optional) */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="whatsapp" className="block text-xs font-semibold text-slate-300">
                    WhatsApp Number
                  </label>
                  <span className="text-[11px] text-slate-400">Optional</span>
                </div>
                <input
                  id="whatsapp"
                  type="tel"
                  placeholder="e.g. 08012345678 or +234 801 234 5678"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1677FF] focus:ring-1 focus:ring-[#1677FF] transition-all"
                />
                <p className="text-[11px] text-slate-400">
                  Supports Nigerian format or international mobile numbers.
                </p>
              </div>

              {/* Platform Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Selected Platform <span className="text-[#37A0FF]">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectPlatform('windows')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedPlatform === 'windows'
                        ? 'bg-[#1677FF]/15 border-[#1677FF] text-white'
                        : 'bg-[#0B0F17] border-[#1E293B] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Monitor className="w-4 h-4" />
                    <span>Windows</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectPlatform('android')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedPlatform === 'android'
                        ? 'bg-[#1677FF]/15 border-[#1677FF] text-white'
                        : 'bg-[#0B0F17] border-[#1E293B] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Android</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectPlatform('complete_pack')}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      selectedPlatform === 'complete_pack'
                        ? 'bg-[#1677FF]/15 border-[#1677FF] text-white'
                        : 'bg-[#0B0F17] border-[#1E293B] text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    <span>Complete Pack</span>
                  </button>
                </div>
              </div>

              {/* Discount Code */}
              <div className="space-y-2 pt-2 border-t border-[#1E293B]/70">
                <label htmlFor="discountCode" className="block text-xs font-semibold text-slate-300">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="discountCode"
                      type="text"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => {
                        setDiscountCode(e.target.value);
                        if (promoError) setPromoError(null);
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#1677FF] transition-all uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || !discountCode.trim()}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#101620] hover:bg-[#162030] border border-[#1E293B] hover:border-slate-600 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {promoLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>Apply</span>
                    )}
                  </button>
                </div>

                {/* Promo Error */}
                {promoError && (
                  <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{promoError}</span>
                  </p>
                )}

                {/* Promo Success State: 100% off */}
                {promoApplied && isFreePromo && (
                  <div className="p-3 rounded-xl bg-[#1677FF]/15 border border-[#1677FF]/40 text-xs text-white space-y-1.5 mt-2">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-[#37A0FF] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Special Customer Discount</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#1677FF] text-white text-[10px]">
                        100% OFF
                      </span>
                    </div>
                    <p className="text-slate-300">
                      KLIX applied — your StudyLock preorder is free.
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary Line */}
              <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Selected Package:</span>
                  <span className="font-semibold text-slate-200 capitalize">
                    {selectedPlatform === 'complete_pack'
                      ? 'Complete Pack (Windows + Android)'
                      : `${selectedPlatform} Early Access`}
                  </span>
                </div>

                {hasConfiguredPrice ? (
                  <>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Base Price:</span>
                      <span
                        className={isFreePromo ? 'line-through text-slate-500' : 'text-slate-200'}
                      >
                        {formatPrice(basePrice)}
                      </span>
                    </div>

                    {isFreePromo && (
                      <div className="flex items-center justify-between text-xs text-[#37A0FF] font-semibold">
                        <span>Customer Discount:</span>
                        <span>-100% ({formatPrice(basePrice)})</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-sm font-bold text-white">
                      <span>Final Total:</span>
                      <span className="text-[#37A0FF]">
                        {isFreePromo ? `${settings.currencySymbol || '₦'}0` : formatPrice(basePrice)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span>Pricing Status:</span>
                    <span className="text-slate-400">Preorder pricing coming soon</span>
                  </div>
                )}
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id="consentMarketing"
                  type="checkbox"
                  checked={consentMarketing}
                  onChange={(e) => setConsentMarketing(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded bg-[#0B0F17] border-[#1E293B] text-[#1677FF] focus:ring-[#1677FF] cursor-pointer"
                />
                <label htmlFor="consentMarketing" className="text-xs text-slate-400 leading-tight">
                  I agree to receive StudyLock preorder and launch updates.
                </label>
              </div>

              {/* Submit CTA */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !settings.preorderEnabled}
                  className="w-full py-4 rounded-xl text-sm font-bold text-white bg-[#1677FF] hover:bg-[#1366DB] shadow-lg shadow-[#1677FF]/25 hover:shadow-[#1677FF]/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Securing Reservation...</span>
                    </>
                  ) : showPayment ? (
                    <span>Continue to checkout</span>
                  ) : (
                    <span>Reserve my copy</span>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2.5">
                  No spam. Product and launch updates only.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
