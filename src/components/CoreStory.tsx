import React from 'react';
import {
  Lock,
  Timer,
  CalendarDays,
  Coffee,
  Sun,
  Trophy,
  BookOpen,
  Calculator,
  RotateCcw,
  MessageSquareOff,
  WifiOff,
} from 'lucide-react';

interface FeatureItem {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
}

const features: FeatureItem[] = [
  {
    icon: Lock,
    title: 'Focus Lock',
    description: 'Block distracting apps and websites during study sessions.',
    badge: 'Core Engine',
  },
  {
    icon: Timer,
    title: 'Session Timer',
    description: 'A clear session countdown with controlled breaks and visible progress.',
    badge: 'Precision',
  },
  {
    icon: CalendarDays,
    title: 'Schedule Enforcement',
    description: 'Study sessions can follow a timetable instead of depending on whether you feel motivated.',
    badge: 'Structure',
  },
  {
    icon: Coffee,
    title: 'Smart Breaks',
    description: 'Controlled breaks between sessions without completely losing focus.',
    badge: 'Routine',
  },
  {
    icon: Sun,
    title: 'Wake Verification',
    description: 'StudyLock can require interaction before a scheduled early study session begins.',
    badge: 'Accountability',
  },
  {
    icon: Trophy,
    title: 'XP & History',
    description: 'Track completed sessions, session history and progress.',
    badge: 'Progression',
  },
  {
    icon: BookOpen,
    title: 'Offline Question Bank',
    description: 'Study without needing to remain connected to distracting websites.',
    badge: 'Distraction-Free',
  },
  {
    icon: Calculator,
    title: 'Scientific Calculator',
    description: 'Use common study tools without leaving the StudyLock environment.',
    badge: 'Integrated',
  },
  {
    icon: RotateCcw,
    title: 'Review Failed Questions',
    description: 'Return to questions you previously got wrong.',
    badge: 'Retention',
  },
  {
    icon: MessageSquareOff,
    title: 'Chat Lock',
    description: 'Designed to reduce unnecessary switching between different study conversations or workflows during a focused session.',
    badge: 'Silence',
  },
  {
    icon: WifiOff,
    title: 'Internet Control',
    description: 'Different internet access rules can be applied during focus periods and breaks.',
    badge: 'Network Rule',
  },
];

export const CoreStory: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-[#05070A] border-t border-[#1E293B]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="text-xs uppercase tracking-widest font-bold text-[#37A0FF]">
            Architecture of Discipline
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Willpower is unreliable. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1677FF] to-[#37A0FF]">
              Your system shouldn't be.
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed pt-2">
            Students often know what they should be studying but still lose time to social media,
            browsers, random apps, messages and constantly switching tasks. StudyLock is being
            designed as a system that makes leaving the study routine harder.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="group relative bg-[#101620] hover:bg-[#131B27] p-6 rounded-2xl border border-[#1E293B] hover:border-[#1677FF]/40 transition-all duration-200 shadow-sm hover:shadow-xl hover:shadow-[#1677FF]/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#1677FF]/10 border border-[#1677FF]/20 flex items-center justify-center text-[#37A0FF] group-hover:scale-105 group-hover:bg-[#1677FF]/20 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    {feat.badge && (
                      <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#05070A] text-slate-400 border border-[#1E293B]">
                        {feat.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#37A0FF] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#1E293B]/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>System Module</span>
                  <span className="font-mono text-slate-400">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
