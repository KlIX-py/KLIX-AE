import React from 'react';
import { Monitor, Smartphone, Check, AlertCircle } from 'lucide-react';

interface PlatformComparisonProps {
  onPreorderPackage: (pkg: 'windows' | 'android' | 'complete_pack') => void;
}

export const PlatformComparison: React.FC<PlatformComparisonProps> = ({ onPreorderPackage }) => {
  const windowsFeatures = [
    'Desktop focus sessions',
    'Distracting app blocking',
    'Distracting website blocking',
    'Session countdown',
    'Floating timer',
    'Schedule-based launching',
    'Session history',
    'XP and progress',
    'Scientific calculator',
    'Offline question bank',
    'Failed-question review',
    'Break controls',
  ];

  const androidFeatures = [
    'Phone focus mode',
    'Session countdown',
    'Study reminders',
    'Alarms',
    'Notifications',
    'Activity verification',
    'Scheduled-session support',
    'Focus enforcement',
    'Controlled break support',
  ];

  return (
    <section id="platforms" className="py-24 bg-[#05070A] border-t border-[#1E293B]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase tracking-widest font-bold text-[#37A0FF]">
            Cross-Device Synchronization
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            One focus system. Two devices.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Engineered to coordinate your workstation and handheld device so distractions cannot
            ambush you from another screen.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* WINDOWS .EXE CARD */}
          <div className="bg-[#101620] rounded-2xl p-8 border border-[#1E293B] hover:border-[#1677FF]/40 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#37A0FF]">
                    <Monitor className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white">WINDOWS .EXE</h3>
                    <p className="text-xs text-[#37A0FF] font-medium">
                      Main StudyLock application
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-[#05070A] text-slate-300 border border-[#1E293B]">
                  Windows 10 / 11
                </span>
              </div>

              <div className="pt-6">
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-4">
                  Full Workstation Capabilities
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                  {windowsFeatures.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-[#1E293B]">
              <button
                onClick={() => onPreorderPackage('windows')}
                className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-[#101620] hover:bg-[#1677FF] border border-[#1E293B] hover:border-transparent transition-all cursor-pointer text-center"
              >
                Reserve Windows .EXE
              </button>
            </div>
          </div>

          {/* ANDROID .APK CARD */}
          <div className="bg-[#101620] rounded-2xl p-8 border border-[#1E293B] hover:border-[#1677FF]/40 transition-all flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-[#1E293B]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1677FF]/15 border border-[#1677FF]/30 flex items-center justify-center text-[#37A0FF]">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-white">ANDROID .APK</h3>
                    <p className="text-xs text-[#37A0FF] font-medium">
                      StudyLock phone companion
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-semibold px-2.5 py-1 rounded bg-[#05070A] text-slate-300 border border-[#1E293B]">
                  Android 9.0+
                </span>
              </div>

              <div className="pt-6">
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-4">
                  Companion & Accountability Features
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-200">
                  {androidFeatures.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-[#1E293B]">
              <button
                onClick={() => onPreorderPackage('android')}
                className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-[#101620] hover:bg-[#1677FF] border border-[#1E293B] hover:border-transparent transition-all cursor-pointer text-center"
              >
                Reserve Android .APK
              </button>
            </div>
          </div>
        </div>

        {/* Android Disclaimer */}
        <div className="mt-8 max-w-3xl mx-auto p-4 rounded-xl bg-[#0B0F17] border border-[#1E293B]/70 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="font-semibold text-slate-300">Platform notice:</span> Some
            capabilities may vary depending on the Android version, phone manufacturer and system
            permissions. StudyLock operates strictly within user-granted device permissions and
            respects operating-system safety and security safeguards.
          </p>
        </div>
      </div>
    </section>
  );
};
