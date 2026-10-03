import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { AppSettings, PlatformType, Preorder } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CoreStory } from './components/CoreStory';
import { HowItWorks } from './components/HowItWorks';
import { PlatformComparison } from './components/PlatformComparison';
import { ProductOrigin } from './components/ProductOrigin';
import { PreorderSection } from './components/PreorderSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { ConfirmationView } from './components/ConfirmationView';
import { PrivacyModal } from './components/PrivacyModal';
import { AdminPortal } from './components/AdminPortal';

const defaultSettings: AppSettings = {
  windowsPrice: null,
  androidPrice: null,
  completePrice: null,
  currency: 'NGN',
  currencySymbol: '₦',
  paymentEnabled: false,
  reservationOnly: true,
  preorderEnabled: true,
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'confirmation'>('home');
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType>('complete_pack');
  const [confirmedPreorder, setConfirmedPreorder] = useState<Preorder | null>(null);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  // 1. Listen for real-time changes to appSettings from Firestore
  useEffect(() => {
    // Initial fetch from backend API as immediate fallback
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data === 'object') {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});

    // Realtime Firestore subscription
    try {
      const unsub = onSnapshot(doc(db, 'appSettings', 'general'), (snap) => {
        if (snap.exists()) {
          setSettings({ ...defaultSettings, ...snap.data() } as AppSettings);
        }
      });
      return () => unsub();
    } catch (e) {
      console.warn('Realtime settings subscription error:', e);
    }
  }, []);

  // 2. Check URL pathname or hash for direct navigation to /admin
  useEffect(() => {
    const checkRoute = () => {
      if (
        window.location.pathname === '/admin' ||
        window.location.hash === '#admin' ||
        window.location.search.includes('view=admin')
      ) {
        setCurrentView('admin');
      }
    };
    checkRoute();
    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const handleNavigateToAdmin = () => {
    setCurrentView('admin');
    window.history.pushState(null, '', '#admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    if (window.location.hash === '#admin') {
      window.history.pushState(null, '', window.location.pathname);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPackageAndScroll = (platform: PlatformType) => {
    setSelectedPlatform(platform);
    if (currentView !== 'home') {
      setCurrentView('home');
    }
    setTimeout(() => {
      const el = document.getElementById('preorder-form');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePreorderSuccess = (preorder: Preorder) => {
    setConfirmedPreorder(preorder);
    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
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
    <div className="min-h-screen bg-[#05070A] text-[#F3F4F6] selection:bg-[#1677FF]/30 selection:text-white flex flex-col font-sans">
      {/* Sticky Top Navigation */}
      <Navbar
        isAdminView={currentView === 'admin'}
        onNavigateToAdmin={handleNavigateToAdmin}
        onNavigateHome={handleNavigateHome}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'admin' ? (
          <AdminPortal
            onBackToSite={handleNavigateHome}
            settings={settings}
            onSettingsUpdate={(newSettings) => setSettings(newSettings)}
          />
        ) : currentView === 'confirmation' && confirmedPreorder ? (
          <ConfirmationView
            preorder={confirmedPreorder}
            onBackHome={handleNavigateHome}
          />
        ) : (
          <>
            {/* Hero Section */}
            <Hero
              onPreorderClick={() => scrollToSection('preorder')}
              onHowItWorksClick={() => scrollToSection('how-it-works')}
            />

            {/* Core Product Story (11 Feature Cards) */}
            <CoreStory />

            {/* How It Works (3-step flow) */}
            <HowItWorks />

            {/* Platform Comparison (Windows .EXE vs Android .APK) */}
            <PlatformComparison onPreorderPackage={handleSelectPackageAndScroll} />

            {/* Product Origin Section */}
            <ProductOrigin />

            {/* Preorder Section (Product cards, pricing coming soon, form, KLIX promo) */}
            <PreorderSection
              settings={settings}
              selectedPlatform={selectedPlatform}
              onSelectPlatform={setSelectedPlatform}
              onPreorderSuccess={handlePreorderSuccess}
            />

            {/* Frequently Asked Questions */}
            <FaqSection />

            {/* Final Call to Action */}
            <FinalCta onPreorderClick={() => scrollToSection('preorder')} />
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacy={() => setPrivacyOpen(true)}
        onNavigateToAdmin={handleNavigateToAdmin}
        onNavigateSection={scrollToSection}
      />

      {/* Privacy Policy Modal */}
      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
