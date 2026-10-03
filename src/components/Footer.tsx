import React from 'react';
import { Lock, Shield } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onNavigateToAdmin: () => void;
  onNavigateSection: (id: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPrivacy,
  onNavigateToAdmin,
  onNavigateSection,
}) => {
  return (
    <footer className="bg-[#05070A] border-t border-[#1E293B] py-16 text-xs text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b border-[#1E293B]/60">
          {/* Brand & Subtitle */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#37A0FF]">
                <Lock className="w-3.5 h-3.5" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-white uppercase">
                STUDYLOCK
              </span>
            </div>
            <p className="text-slate-400 text-xs">Focus software for students.</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8">
            <button
              onClick={() => onNavigateSection('features')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => onNavigateSection('platforms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Platforms
            </button>
            <button
              onClick={() => onNavigateSection('how-it-works')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigateSection('preorder')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Preorder
            </button>
            <button
              onClick={() => onNavigateSection('faq')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={onOpenPrivacy}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy
            </button>
            <button
              onClick={onNavigateToAdmin}
              className="hover:text-[#37A0FF] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>© 2026 StudyLock. All rights reserved.</p>
          <p className="font-mono">Windows (.EXE) & Android (.APK) Focus Engine</p>
        </div>
      </div>
    </footer>
  );
};
