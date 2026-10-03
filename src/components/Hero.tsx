import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Clock,
  Sparkles,
  Smartphone,
  Monitor,
  Flame,
  CheckCircle2,
  Bell,
  Play,
  ArrowRight,
  Maximize2,
  Calendar,
  Lock,
} from 'lucide-react';

interface HeroProps {
  onPreorderClick: () => void;
  onHowItWorksClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onPreorderClick, onHowItWorksClick }) => {
  // Simulated countdown state for mockup interactivity
  const [secondsRemaining, setSecondsRemaining] = useState(48 * 60 + 20); // 48m 20s
  const [activeTab, setActiveTab] = useState<'session' | 'blocked' | 'calc'>('session');

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining(prev => (prev > 0 ? prev - 1 : 48 * 60 + 20));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#1677FF]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-[#37A0FF]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#101620] border border-[#1E293B] shadow-sm text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#1677FF] animate-pulse"></span>
            <span>Built to make distraction harder than studying.</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
            Lock in. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F3F4F6] to-[#37A0FF]">
              Finish the session.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal">
            StudyLock blocks distractions, enforces study sessions, tracks progress and helps
            keep your study routine alive across Windows and Android.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onPreorderClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-base font-semibold text-white bg-[#1677FF] hover:bg-[#1366DB] shadow-lg shadow-[#1677FF]/30 hover:shadow-[#1677FF]/50 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37A0FF]"
            >
              <span>Preorder StudyLock</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onHowItWorksClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-semibold text-slate-200 bg-[#101620] hover:bg-[#162030] border border-[#1E293B] hover:border-slate-700 transition-all cursor-pointer"
            >
              <span>See how it works</span>
            </button>
          </div>

          {/* Platform Badges */}
          <div className="flex items-center justify-center gap-6 pt-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-2 bg-[#0B0F17]/80 px-3.5 py-1.5 rounded-lg border border-[#1E293B]/80">
              <Monitor className="w-3.5 h-3.5 text-[#37A0FF]" />
              <span className="text-slate-300 font-semibold">Windows .EXE</span>
            </div>
            <div className="flex items-center gap-2 bg-[#0B0F17]/80 px-3.5 py-1.5 rounded-lg border border-[#1E293B]/80">
              <Smartphone className="w-3.5 h-3.5 text-[#37A0FF]" />
              <span className="text-slate-300 font-semibold">Android .APK</span>
            </div>
          </div>
        </div>

        {/* Product Visualization: Desktop Mockup Beside Android Mockup */}
        <div className="mt-14 lg:mt-18 max-w-5xl mx-auto">
          <div className="relative rounded-2xl bg-gradient-to-b from-[#1E293B]/80 via-[#101620]/60 to-[#0B0F17]/90 p-1 sm:p-2 border border-[#1E293B] shadow-2xl shadow-black/80">
            {/* Desktop Mockup Frame */}
            <div className="bg-[#0B0F17] rounded-xl overflow-hidden border border-[#1E293B]/60 shadow-inner">
              {/* Window Title Bar */}
              <div className="bg-[#101620] px-4 py-3 flex items-center justify-between border-b border-[#1E293B]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#EF4444]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#F59E0B]/80"></div>
                  <div className="w-3 h-3 rounded-full bg-[#10B981]/80"></div>
                  <div className="h-4 w-[1px] bg-[#1E293B] mx-2"></div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#37A0FF]" />
                    <span className="text-xs font-bold tracking-wider text-slate-200">
                      STUDY LOCK
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#1677FF]/15 text-[#37A0FF] border border-[#1677FF]/30 text-[11px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1677FF] animate-ping"></span>
                    <span>Focus Active</span>
                  </div>
                  <span className="hidden sm:inline-block text-[11px] text-slate-400">
                    Timetable Block 2 of 4
                  </span>
                </div>
              </div>

              {/* Main App Canvas */}
              <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left/Center Desktop UI (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Top Bar with schedule info */}
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-[#101620]/70 p-3 rounded-xl border border-[#1E293B]/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#1677FF]/15 flex items-center justify-center text-[#37A0FF]">
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          Current Schedule: Block 2
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Advanced Organic Chemistry • 19:00 - 20:00
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#05070A] text-xs font-semibold text-slate-300 border border-[#1E293B]">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>4-Day Streak</span>
                      </div>
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#05070A] text-xs font-semibold text-[#37A0FF] border border-[#1E293B]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+120 XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Big Session Countdown Clock */}
                  <div className="bg-gradient-to-b from-[#101620] to-[#0D131C] p-6 sm:p-8 rounded-2xl border border-[#1E293B] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#1677FF] to-transparent"></div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1677FF]/10 text-[#37A0FF] text-xs font-medium mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Session Remaining</span>
                    </div>

                    <div className="text-5xl sm:text-7xl font-black tracking-tight text-white font-mono my-2 select-none">
                      {formatTimer(secondsRemaining)}
                    </div>

                    <div className="text-xs text-slate-400 flex items-center justify-center gap-4 mt-3">
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Break in 18:20
                      </span>
                      <span>•</span>
                      <span>Target: 60 min session</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-[#05070A] h-2 rounded-full mt-5 overflow-hidden p-[1px] border border-[#1E293B]">
                      <div
                        className="bg-gradient-to-r from-[#1677FF] to-[#37A0FF] h-full rounded-full transition-all duration-1000"
                        style={{ width: `${Math.round(((60 * 60 - secondsRemaining) / 3600) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Status Pills: Distraction Shield */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-[#101620] p-3.5 rounded-xl border border-[#1E293B] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            Distractions Blocked
                          </div>
                          <div className="text-[11px] text-slate-400">
                            14 applications & websites
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>

                    <div className="bg-[#101620] p-3.5 rounded-xl border border-[#1E293B] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#1677FF]/15 flex items-center justify-center text-[#37A0FF]">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-200">
                            Focus Lock Enforced
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Routine exit prevented
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#37A0FF] bg-[#1677FF]/10 px-2 py-0.5 rounded">
                        Strict
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Phone Companion Mockup (4 cols) */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="w-full max-w-[280px] bg-[#05070A] rounded-[32px] p-2.5 border-[3px] border-[#1E293B] shadow-2xl shadow-black relative">
                    {/* Phone speaker / camera notch */}
                    <div className="w-24 h-4 bg-[#101620] mx-auto rounded-full mb-3 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                    </div>

                    {/* Phone Inner Screen */}
                    <div className="bg-[#0B0F17] rounded-[24px] p-4 space-y-4 border border-[#1E293B]/70">
                      {/* Companion Header */}
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 font-bold text-white">
                          <Smartphone className="w-3 h-3 text-[#37A0FF]" />
                          <span>StudyLock Companion</span>
                        </div>
                        <span className="text-emerald-400 text-[10px] font-semibold">Synced</span>
                      </div>

                      {/* Phone Session Status */}
                      <div className="bg-[#101620] p-3 rounded-xl border border-[#1E293B] text-center">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[#37A0FF] block mb-1">
                          Session Countdown
                        </span>
                        <div className="text-2xl font-black font-mono text-white">
                          {formatTimer(secondsRemaining)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Phone Restricted Mode Active
                        </div>
                      </div>

                      {/* Break Status card */}
                      <div className="bg-[#101620]/80 p-2.5 rounded-lg border border-[#1E293B] text-left">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-slate-300">
                            Break Status
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">10m rest</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Next scheduled break activates at 20:00.
                        </p>
                      </div>

                      {/* Wake Verification Card */}
                      <div className="bg-[#1677FF]/10 p-2.5 rounded-lg border border-[#1677FF]/30 text-left">
                        <div className="flex items-center gap-1.5 text-[#37A0FF] text-[11px] font-bold">
                          <Bell className="w-3 h-3" />
                          <span>Wake Verification</span>
                        </div>
                        <p className="text-[10px] text-slate-300 mt-1">
                          Interactive response required before early morning session.
                        </p>
                      </div>

                      <div className="pt-1 text-center">
                        <span className="text-[9px] text-slate-500 font-mono">
                          Android .APK Companion v1.0
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
