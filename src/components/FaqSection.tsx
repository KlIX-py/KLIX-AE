import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Is StudyLock released yet?',
    answer: 'Not publicly. This site is for preorder and early launch access.',
  },
  {
    question: 'Do I pay now?',
    answer:
      'Payment availability depends on the current preorder phase. The checkout will clearly show whether payment is required.',
  },
  {
    question: 'Can I preorder Windows and Android together?',
    answer: 'Yes. Select the Complete Pack.',
  },
  {
    question: 'Does StudyLock work on every Android device?',
    answer:
      'Android capabilities can vary by Android version, manufacturer and available permissions.',
  },
  {
    question: 'Can StudyLock completely prevent me from exiting?',
    answer:
      'StudyLock is designed to make distractions and quitting a session harder, while respecting device-level safety and operating-system controls.',
  },
  {
    question: 'When does StudyLock launch?',
    answer: 'The launch date will be announced to preorder members.',
  },
  {
    question: 'Will my data be private?',
    answer:
      'StudyLock will publish complete privacy terms before launch. Preorder information should only be used to manage reservations and relevant product communication.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-[#0B0F17] border-t border-[#1E293B]/60 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase tracking-widest font-bold text-[#37A0FF]">
            Common Queries
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Everything you need to know about the upcoming release and early access reservations.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-[#101620] rounded-2xl border border-[#1E293B] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-[#05070A] border border-[#1E293B] flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#37A0FF]' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#1E293B]/60 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
