import React from 'react';
import { Calendar, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Set your timetable.',
      description: 'The student creates or follows their study schedule.',
      icon: Calendar,
      detail: 'Configure subject blocks, duration targets, and daily study hours in advance.',
    },
    {
      step: '02',
      title: 'StudyLock starts the session.',
      description: 'The focus environment activates and distractions are restricted.',
      icon: ShieldAlert,
      detail: 'Browsers, messaging apps, and phone alerts are locked down per schedule rules.',
    },
    {
      step: '03',
      title: 'Finish. Break. Repeat.',
      description: 'Complete the session, take the controlled break, earn progress and continue the schedule.',
      icon: CheckCircle,
      detail: 'Unlock controlled break time, bank earned XP, and seamlessly cycle into the next routine block.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0B0F17] border-t border-[#1E293B]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase tracking-widest font-bold text-[#37A0FF]">
            Frictionless Execution
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How it works
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            A three-phase routine designed to eliminate cognitive friction and make staying in the
            zone automatic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-[#101620] p-8 rounded-2xl border border-[#1E293B] hover:border-[#1677FF]/40 transition-all flex flex-col justify-between group shadow-lg shadow-black/20"
              >
                <div>
                  {/* Step header */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#1677FF] to-[#37A0FF]">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#05070A] border border-[#1E293B] flex items-center justify-center text-[#37A0FF] group-hover:scale-110 group-hover:border-[#1677FF]/40 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#37A0FF] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-slate-200 font-medium text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {item.detail}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#1E293B]/60 flex items-center gap-2 text-xs font-semibold text-[#37A0FF]">
                  <span>Step {index + 1} of 3</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
