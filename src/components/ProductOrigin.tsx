import React from 'react';
import { Target, Compass } from 'lucide-react';

export const ProductOrigin: React.FC = () => {
  return (
    <section className="py-24 bg-[#0B0F17] border-t border-[#1E293B]/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#101620] rounded-3xl p-8 sm:p-12 border border-[#1E293B] shadow-2xl relative overflow-hidden">
          {/* Subtle accent highlight */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#1677FF]/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-[#37A0FF]">
              <Compass className="w-4 h-4" />
              <span>Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Built from a real study problem.
            </h2>

            <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
              <p>
                StudyLock started as a personal focus tool designed around strict study schedules,
                distraction blocking, countdown sessions and enforced routines.
              </p>
              <p className="text-white font-medium">
                The goal is simple:{' '}
                <span className="text-[#37A0FF] font-semibold underline decoration-[#1677FF]/40 underline-offset-4">
                  make doing the study session easier than escaping from it.
                </span>
              </p>
            </div>

            <div className="pt-6 border-t border-[#1E293B] flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#1677FF]" />
                <span>Deterministic focus architecture</span>
              </div>
              <span className="font-mono text-slate-400">Release Candidate in Active Build</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
