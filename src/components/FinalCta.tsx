import React from 'react';
import { ArrowRight, Lock } from 'lucide-react';

interface FinalCtaProps {
  onPreorderClick: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onPreorderClick }) => {
  return (
    <section className="py-24 bg-[#05070A] border-t border-[#1E293B]/40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-[#1677FF]/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-[#1677FF]/15 border border-[#1677FF]/30 text-[#37A0FF] mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto leading-tight">
          Your next study session shouldn't depend on motivation.
        </h2>

        <div>
          <button
            onClick={onPreorderClick}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-white bg-[#1677FF] hover:bg-[#1366DB] shadow-xl shadow-[#1677FF]/30 hover:shadow-[#1677FF]/50 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37A0FF]"
          >
            <span>Join the StudyLock preorder</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
          Windows .EXE • Android .APK
        </p>
      </div>
    </section>
  );
};
