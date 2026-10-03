import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  ArrowLeft,
  Mail,
  Smartphone,
  Monitor,
  Layers,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Preorder } from '../types';

interface ConfirmationViewProps {
  preorder: Preorder;
  onBackHome: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({ preorder, onBackHome }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Gentle confetti burst
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1677FF', '#37A0FF', '#ffffff'],
    });
  }, []);

  const handleCopyId = () => {
    navigator.clipboard.writeText(preorder.preorderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isFreePromo = preorder.paymentStatus === 'free_promo' || preorder.discountPercent === 100;

  const renderPlatformBadge = () => {
    if (preorder.platform === 'windows') {
      return (
        <div className="flex items-center gap-1.5 text-slate-200">
          <Monitor className="w-4 h-4 text-[#37A0FF]" />
          <span>Windows Early Access (.EXE)</span>
        </div>
      );
    }
    if (preorder.platform === 'android') {
      return (
        <div className="flex items-center gap-1.5 text-slate-200">
          <Smartphone className="w-4 h-4 text-[#37A0FF]" />
          <span>Android Early Access (.APK)</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-1.5 text-slate-200">
        <Layers className="w-4 h-4 text-[#37A0FF]" />
        <span>Complete Pack (Windows .EXE + Android .APK)</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative">
      <div className="max-w-xl w-full">
        {/* Success Card */}
        <div className="bg-[#101620] rounded-3xl p-6 sm:p-10 border border-[#1E293B] shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1677FF] to-[#37A0FF]"></div>

          {/* Header */}
          <div className="text-center space-y-3 pt-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              You're on the StudyLock list.
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              We'll use your preorder details to keep you updated on StudyLock launch access.
            </p>
          </div>

          {/* Special Customer Badge if 100% discount */}
          {isFreePromo && (
            <div className="p-3.5 rounded-2xl bg-[#1677FF]/15 border border-[#1677FF]/40 text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1677FF] text-white text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% SPECIAL CUSTOMER DISCOUNT</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Amount due: <span className="text-[#37A0FF] font-bold">₦0</span>
              </p>
            </div>
          )}

          {/* Preorder ID pill */}
          <div className="bg-[#0B0F17] p-4 rounded-2xl border border-[#1E293B] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Preorder Reference ID
              </span>
              <span className="text-base sm:text-lg font-mono font-bold text-white tracking-wide">
                {preorder.preorderId}
              </span>
            </div>
            <button
              onClick={handleCopyId}
              className="p-2 rounded-lg bg-[#101620] hover:bg-[#162030] text-slate-300 hover:text-white border border-[#1E293B] transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title="Copy Preorder ID"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Details Breakdown */}
          <div className="divide-y divide-[#1E293B] text-xs text-slate-300 bg-[#05070A]/50 rounded-2xl p-4 border border-[#1E293B]/70 space-y-3">
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400">Customer Name:</span>
              <span className="font-semibold text-white">{preorder.fullName}</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-slate-400">Email Address:</span>
              <span className="font-mono text-white flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {preorder.email}
              </span>
            </div>

            {preorder.whatsapp && (
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400">WhatsApp:</span>
                <span className="font-mono text-white">{preorder.whatsapp}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3">
              <span className="text-slate-400">Selected Package:</span>
              <span className="font-semibold">{renderPlatformBadge()}</span>
            </div>

            {preorder.basePrice > 0 && (
              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-400">Original Amount:</span>
                <span className={preorder.discountApplied ? 'line-through text-slate-500' : 'text-white'}>
                  ₦{preorder.basePrice.toLocaleString()}
                </span>
              </div>
            )}

            {preorder.discountApplied && (
              <div className="flex items-center justify-between pt-3 text-[#37A0FF]">
                <span>Discount Applied:</span>
                <span className="font-semibold">
                  {preorder.discountPercent}% OFF ({preorder.discountType || 'Customer Special'})
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 text-sm font-bold text-white">
              <span>Final Total:</span>
              <span className="text-[#37A0FF]">₦{preorder.finalAmount.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between pt-3">
              <span className="text-slate-400">Status:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {preorder.paymentStatus === 'free_promo'
                  ? 'Free Promo Confirmed'
                  : preorder.paymentStatus === 'reservation'
                  ? 'Reservation Confirmed'
                  : 'Pending Launch'}
              </span>
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              onClick={onBackHome}
              className="w-full py-3.5 rounded-xl text-xs font-semibold text-white bg-[#101620] hover:bg-[#162030] border border-[#1E293B] hover:border-slate-600 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to StudyLock</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
