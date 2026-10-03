import React from 'react';
import { X, Shield, Lock } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#101620] rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-[#1E293B] shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#37A0FF]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">StudyLock Preorder Privacy</h3>
              <p className="text-[11px] text-slate-400">Policy & Data Handling</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#05070A] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            StudyLock values transparent and straightforward data stewardship. When you submit your
            preorder or early-access reservation, we collect the minimum information necessary.
          </p>

          <div className="p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B] space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-[#37A0FF]">
              Data We Collect & Why
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
              <li>
                <strong className="text-white">Full Name:</strong> To address and identify your
                software reservation.
              </li>
              <li>
                <strong className="text-white">Email Address:</strong> To send launch notifications,
                account activation details, and fulfillment keys.
              </li>
              <li>
                <strong className="text-white">WhatsApp Number (Optional):</strong> To send direct
                launch alerts for users who prefer chat notifications.
              </li>
              <li>
                <strong className="text-white">Selected Platform:</strong> To reserve the correct
                binary version (Windows .EXE or Android .APK).
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white">How Your Data is Used</h4>
            <p>
              Your contact details are exclusively used for:
            </p>
            <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
              <li>Managing your preorder and queue position.</li>
              <li>Communicating launch timeline and beta access schedules.</li>
              <li>Fulfilling your StudyLock application license upon release.</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-white">Data Protection</h4>
            <p className="text-xs text-slate-400">
              Preorder records are stored in secure cloud database infrastructure with strict access
              controls. Customer records are never sold, rented, or shared with third-party data
              brokers. Full in-app privacy disclosures will accompany the public software release.
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#1E293B]">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1677FF] hover:bg-[#1366DB] transition-all cursor-pointer"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
