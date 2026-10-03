import React, { useState, useEffect } from 'react';
import { Lock, Menu, X, Shield, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onNavigateToAdmin: () => void;
  isAdminView: boolean;
  onNavigateHome: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateToAdmin,
  isAdminView,
  onNavigateHome,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (isAdminView) {
      onNavigateHome();
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05070A]/85 backdrop-blur-md border-b border-[#1E293B]/70 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => {
              if (isAdminView) onNavigateHome();
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1677FF] rounded-lg"
            aria-label="StudyLock Home"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1677FF] to-[#0A4BB5] p-[1px] shadow-md shadow-[#1677FF]/20 group-hover:shadow-[#1677FF]/40 transition-shadow">
              <div className="w-full h-full bg-[#0B0F17] rounded-[7px] flex items-center justify-center">
                <Lock className="w-4 h-4 text-[#37A0FF] group-hover:scale-110 transition-transform duration-200" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                StudyLock
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#1677FF]"></span>
              </span>
              <span className="text-[10px] tracking-wider text-slate-400 font-medium uppercase">
                Focus Systems
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          {!isAdminView ? (
            <div className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollTo('features')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo('platforms')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Platforms
              </button>
              <button
                onClick={() => scrollTo('how-it-works')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollTo('preorder')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Preorder
              </button>
              <button
                onClick={() => scrollTo('faq')}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-[#1677FF]/15 text-[#37A0FF] border border-[#1677FF]/30">
                Admin Console
              </span>
            </div>
          )}

          {/* Desktop CTA / Admin switcher */}
          <div className="hidden md:flex items-center gap-4">
            {isAdminView ? (
              <button
                onClick={onNavigateHome}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-[#101620] hover:bg-[#162030] border border-[#1E293B] transition-all cursor-pointer"
              >
                Exit Admin
              </button>
            ) : (
              <>
                <button
                  onClick={onNavigateToAdmin}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#101620] transition-colors cursor-pointer"
                  title="Admin Portal"
                  aria-label="Admin Portal"
                >
                  <Shield className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollTo('preorder')}
                  className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#1677FF] hover:bg-[#1366DB] shadow-md shadow-[#1677FF]/25 hover:shadow-[#1677FF]/40 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#37A0FF]"
                >
                  <span>Preorder StudyLock</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {!isAdminView && (
              <button
                onClick={() => scrollTo('preorder')}
                className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-[#1677FF] shadow-sm cursor-pointer"
              >
                Preorder
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#101620] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 pb-4 border-t border-[#1E293B] bg-[#0B0F17]/95 backdrop-blur-xl rounded-xl px-4 flex flex-col gap-3 shadow-xl">
            {!isAdminView ? (
              <>
                <button
                  onClick={() => scrollTo('features')}
                  className="py-2 text-left text-sm font-medium text-slate-200 hover:text-[#37A0FF]"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollTo('platforms')}
                  className="py-2 text-left text-sm font-medium text-slate-200 hover:text-[#37A0FF]"
                >
                  Platforms
                </button>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="py-2 text-left text-sm font-medium text-slate-200 hover:text-[#37A0FF]"
                >
                  How It Works
                </button>
                <button
                  onClick={() => scrollTo('preorder')}
                  className="py-2 text-left text-sm font-medium text-slate-200 hover:text-[#37A0FF]"
                >
                  Preorder
                </button>
                <button
                  onClick={() => scrollTo('faq')}
                  className="py-2 text-left text-sm font-medium text-slate-200 hover:text-[#37A0FF]"
                >
                  FAQ
                </button>
                <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigateToAdmin();
                    }}
                    className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Admin Portal</span>
                  </button>
                  <button
                    onClick={() => scrollTo('preorder')}
                    className="w-full mt-2 py-2.5 rounded-lg text-center text-sm font-semibold text-white bg-[#1677FF]"
                  >
                    Preorder StudyLock
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateHome();
                }}
                className="w-full py-2.5 rounded-lg text-center text-sm font-semibold text-white bg-[#101620] border border-[#1E293B]"
              >
                Exit Admin Console
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
