import React, { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  getDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  auth,
  googleProvider,
  db,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { AppSettings, Preorder, PlatformType, PaymentStatus } from '../types';
import {
  Shield,
  LogOut,
  LogIn,
  Search,
  Download,
  Filter,
  RefreshCw,
  Sliders,
  Users,
  CheckCircle,
  AlertTriangle,
  Layers,
  Monitor,
  Smartphone,
  Tag,
  DollarSign,
  ArrowLeft,
  X,
  Lock,
} from 'lucide-react';

interface AdminPortalProps {
  onBackToSite: () => void;
  settings: AppSettings;
  onSettingsUpdate: (newSettings: AppSettings) => void;
}

const AUTHORIZED_ADMIN_EMAIL = 'bloodbath319@gmail.com';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onBackToSite,
  settings,
  onSettingsUpdate,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs: 'preorders' | 'settings'
  const [activeTab, setActiveTab] = useState<'preorders' | 'settings'>('preorders');

  // Preorders state
  const [preorders, setPreorders] = useState<Preorder[]>([]);
  const [loadingPreorders, setLoadingPreorders] = useState(false);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | PlatformType>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | PaymentStatus>('all');
  const [promoOnlyFilter, setPromoOnlyFilter] = useState(false);

  // Settings form state
  const [windowsPriceInput, setWindowsPriceInput] = useState<string>(
    settings.windowsPrice !== null ? String(settings.windowsPrice) : ''
  );
  const [androidPriceInput, setAndroidPriceInput] = useState<string>(
    settings.androidPrice !== null ? String(settings.androidPrice) : ''
  );
  const [completePriceInput, setCompletePriceInput] = useState<string>(
    settings.completePrice !== null ? String(settings.completePrice) : ''
  );
  const [currencyInput, setCurrencyInput] = useState<string>(settings.currency || 'NGN');
  const [paymentEnabledInput, setPaymentEnabledInput] = useState<boolean>(settings.paymentEnabled);
  const [reservationOnlyInput, setReservationOnlyInput] = useState<boolean>(
    settings.reservationOnly
  );
  const [preorderEnabledInput, setPreorderEnabledInput] = useState<boolean>(
    settings.preorderEnabled
  );
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // 1. Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);

      if (user) {
        // Check if bootstrapped admin email or exists in admins collection
        const isEmailMatch = user.email?.toLowerCase() === AUTHORIZED_ADMIN_EMAIL.toLowerCase();

        if (isEmailMatch) {
          setIsAuthorizedAdmin(true);
          setAuthError(null);
          // Ensure admin doc exists
          try {
            await setDoc(
              doc(db, 'admins', user.uid),
              {
                email: user.email,
                role: 'admin',
                createdAt: new Date().toISOString(),
              },
              { merge: true }
            );
          } catch (e) {
            console.warn('Admin doc creation notice:', e);
          }
        } else {
          // Check database collection for custom admin grant
          try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
              setIsAuthorizedAdmin(true);
              setAuthError(null);
            } else {
              setIsAuthorizedAdmin(false);
              setAuthError(
                `Access Denied: ${user.email} is not authorized as a StudyLock administrator.`
              );
            }
          } catch (err) {
            setIsAuthorizedAdmin(false);
            setAuthError('Unauthorized: Administrator clearance required.');
          }
        }
      } else {
        setIsAuthorizedAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Fetch Preorders realtime when authorized
  useEffect(() => {
    if (!isAuthorizedAdmin) return;

    setLoadingPreorders(true);
    const preordersQuery = query(collection(db, 'preorders'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      preordersQuery,
      (snapshot) => {
        const records: Preorder[] = [];
        snapshot.forEach((docSnap) => {
          records.push(docSnap.data() as Preorder);
        });
        setPreorders(records);
        setLoadingPreorders(false);
      },
      (error) => {
        setLoadingPreorders(false);
        handleFirestoreError(error, OperationType.LIST, 'preorders');
      }
    );

    return () => unsubscribe();
  }, [isAuthorizedAdmin]);

  // Keep settings form synced when parent settings change
  useEffect(() => {
    setWindowsPriceInput(settings.windowsPrice !== null ? String(settings.windowsPrice) : '');
    setAndroidPriceInput(settings.androidPrice !== null ? String(settings.androidPrice) : '');
    setCompletePriceInput(settings.completePrice !== null ? String(settings.completePrice) : '');
    setCurrencyInput(settings.currency || 'NGN');
    setPaymentEnabledInput(settings.paymentEnabled);
    setReservationOnlyInput(settings.reservationOnly);
    setPreorderEnabledInput(settings.preorderEnabled);
  }, [settings]);

  const handleSignIn = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setIsAuthorizedAdmin(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  // Save Pricing & Launch Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaving(true);
    setSettingsSuccess(false);

    const parsedWindows = windowsPriceInput.trim() !== '' ? Number(windowsPriceInput) : null;
    const parsedAndroid = androidPriceInput.trim() !== '' ? Number(androidPriceInput) : null;
    const parsedComplete = completePriceInput.trim() !== '' ? Number(completePriceInput) : null;

    const newSettings: AppSettings = {
      windowsPrice: parsedWindows,
      androidPrice: parsedAndroid,
      completePrice: parsedComplete,
      currency: currencyInput.trim().toUpperCase() || 'NGN',
      currencySymbol: currencyInput.trim().toUpperCase() === 'NGN' ? '₦' : '$',
      paymentEnabled: paymentEnabledInput,
      reservationOnly: reservationOnlyInput,
      preorderEnabled: preorderEnabledInput,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'appSettings', 'general'), newSettings, { merge: true });
      onSettingsUpdate(newSettings);
      setSettingsSuccess(true);
      setTimeout(() => setSettingsSuccess(false), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'appSettings/general');
    } finally {
      setSettingsSaving(false);
    }
  };

  // CSV Export
  const handleExportCsv = () => {
    if (preorders.length === 0) return;

    const headers = [
      'Preorder ID',
      'Customer Name',
      'Email',
      'WhatsApp',
      'Platform',
      'Base Price',
      'Currency',
      'Discount %',
      'Discount Applied',
      'Discount Type',
      'Final Amount',
      'Payment Status',
      'Preorder Status',
      'Marketing Consent',
      'Created At',
    ];

    const rows = preorders.map((p) => [
      `"${p.preorderId}"`,
      `"${p.fullName.replace(/"/g, '""')}"`,
      `"${p.email}"`,
      `"${p.whatsapp || ''}"`,
      `"${p.platform}"`,
      p.basePrice,
      `"${p.currency}"`,
      p.discountPercent,
      p.discountApplied,
      `"${p.discountType || ''}"`,
      p.finalAmount,
      `"${p.paymentStatus}"`,
      `"${p.preorderStatus}"`,
      p.consentMarketing,
      `"${p.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `studylock_preorders_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered preorders
  const filteredPreorders = preorders.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.preorderId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    const matchesPayment = paymentFilter === 'all' || p.paymentStatus === paymentFilter;
    const matchesPromo = !promoOnlyFilter || p.discountApplied || p.paymentStatus === 'free_promo';

    return matchesSearch && matchesPlatform && matchesPayment && matchesPromo;
  });

  // Calculate Metrics
  const totalPreorders = preorders.length;
  const windowsCount = preorders.filter((p) => p.platform === 'windows').length;
  const androidCount = preorders.filter((p) => p.platform === 'android').length;
  const completeCount = preorders.filter((p) => p.platform === 'complete_pack').length;
  const freePromoCount = preorders.filter(
    (p) => p.paymentStatus === 'free_promo' || p.discountPercent === 100
  ).length;
  const paidCount = preorders.filter((p) => p.paymentStatus === 'paid').length;
  const pendingCount = preorders.filter((p) => p.paymentStatus === 'pending').length;

  // Unauthenticated / Unauthorized Login Screen
  if (authLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center text-slate-300">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-[#1677FF]" />
          <span>Verifying administrator credentials...</span>
        </div>
      </div>
    );
  }

  if (!currentUser || !isAuthorizedAdmin) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-[#101620] rounded-3xl p-8 border border-[#1E293B] shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#1677FF]/15 border border-[#1677FF]/30 text-[#37A0FF] mx-auto flex items-center justify-center">
            <Shield className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              StudyLock Admin Console
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Restricted management area for StudyLock preorders and launch parameters.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 text-left">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}

          {currentUser ? (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-slate-400">
                Signed in as: <strong className="text-white">{currentUser.email}</strong>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-[#05070A] hover:bg-slate-900 border border-[#1E293B] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign in with different account</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleSignIn}
              className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-[#1677FF] hover:bg-[#1366DB] shadow-lg shadow-[#1677FF]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          )}

          <div className="pt-2 border-t border-[#1E293B]">
            <button
              onClick={onBackToSite}
              className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authorized Admin View
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Admin Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#1E293B]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-0.5 rounded bg-[#1677FF]/20 text-[#37A0FF] border border-[#1677FF]/40">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">
              v1.0 • Connected to Cloud Firestore
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            StudyLock Operations Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-white">{currentUser.displayName || 'Admin'}</div>
            <div className="text-[11px] text-slate-400 font-mono">{currentUser.email}</div>
          </div>
          <button
            onClick={onBackToSite}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#101620] hover:bg-[#162030] border border-[#1E293B] transition-all cursor-pointer"
          >
            Public Site
          </button>
          <button
            onClick={handleSignOut}
            className="p-2 rounded-xl text-slate-400 hover:text-red-400 bg-[#101620] hover:bg-[#162030] border border-[#1E293B] transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Total Preorders */}
        <div className="bg-[#101620] p-4 rounded-2xl border border-[#1E293B]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Total Preorders
          </span>
          <div className="text-2xl font-black text-white mt-1">{totalPreorders}</div>
        </div>

        {/* Windows */}
        <div className="bg-[#101620] p-4 rounded-2xl border border-[#1E293B]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Monitor className="w-3 h-3 text-[#37A0FF]" />
            <span>Windows</span>
          </span>
          <div className="text-2xl font-black text-white mt-1">{windowsCount}</div>
        </div>

        {/* Android */}
        <div className="bg-[#101620] p-4 rounded-2xl border border-[#1E293B]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Smartphone className="w-3 h-3 text-[#37A0FF]" />
            <span>Android</span>
          </span>
          <div className="text-2xl font-black text-white mt-1">{androidCount}</div>
        </div>

        {/* Complete Pack */}
        <div className="bg-[#101620] p-4 rounded-2xl border border-[#1E293B]">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
            <Layers className="w-3 h-3 text-[#37A0FF]" />
            <span>Complete</span>
          </span>
          <div className="text-2xl font-black text-white mt-1">{completeCount}</div>
        </div>

        {/* Free Promo */}
        <div className="bg-[#101620] p-4 rounded-2xl border border-[#1E293B]">
          <span className="text-[10px] uppercase font-bold text-[#37A0FF] tracking-wider flex items-center gap-1">
            <Tag className="w-3 h-3" />
            <span>Free Promo</span>
          </span>
          <div className="text-2xl font-black text-[#37A0FF] mt-1">{freePromoCount}</div>
        </div>

        {/* Paid */}
        <div className="bg-[#101620] p-4 rounded-2xl border border-[#1E293B]">
          <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
            Paid Orders
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{paidCount}</div>
        </div>

        {/* Pending */}
        <div className="bg-[#101620] p-4 rounded-2xl border border-[#1E293B]">
          <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
            Pending / Res.
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {pendingCount + (totalPreorders - freePromoCount - paidCount - pendingCount)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E293B]">
        <button
          onClick={() => setActiveTab('preorders')}
          className={`py-3 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'preorders'
              ? 'border-[#1677FF] text-[#37A0FF]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Preorder Records ({preorders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-6 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-[#1677FF] text-[#37A0FF]'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Pricing & Launch Settings</span>
        </button>
      </div>

      {/* TAB 1: PREORDERS TABLE & TOOLS */}
      {activeTab === 'preorders' && (
        <div className="space-y-4">
          {/* Controls: Search, Filters, Export */}
          <div className="bg-[#101620] p-4 rounded-2xl border border-[#1E293B] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email, or preorder ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1677FF]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter by Platform */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-slate-200 focus:outline-none focus:border-[#1677FF] cursor-pointer"
              >
                <option value="all">All Platforms</option>
                <option value="windows">Windows</option>
                <option value="android">Android</option>
                <option value="complete_pack">Complete Pack</option>
              </select>

              {/* Filter by Payment Status */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-slate-200 focus:outline-none focus:border-[#1677FF] cursor-pointer"
              >
                <option value="all">All Payment Statuses</option>
                <option value="free_promo">Free Promo</option>
                <option value="reservation">Reservation</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>

              {/* Toggle Promo Only */}
              <button
                type="button"
                onClick={() => setPromoOnlyFilter(!promoOnlyFilter)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                  promoOnlyFilter
                    ? 'bg-[#1677FF]/20 border-[#1677FF] text-[#37A0FF]'
                    : 'bg-[#0B0F17] border-[#1E293B] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Promo/Free Only</span>
              </button>

              {/* Export CSV */}
              <button
                onClick={handleExportCsv}
                disabled={preorders.length === 0}
                className="px-3.5 py-2 rounded-xl bg-[#0B0F17] hover:bg-[#162030] text-xs font-semibold text-slate-200 border border-[#1E293B] transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-[#37A0FF]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-[#101620] rounded-2xl border border-[#1E293B] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0B0F17] border-b border-[#1E293B] text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Preorder ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">WhatsApp</th>
                    <th className="py-3 px-4">Platform</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E293B] text-slate-300">
                  {loadingPreorders ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#1677FF] mb-2" />
                        <span>Loading preorders from Firestore...</span>
                      </td>
                    </tr>
                  ) : filteredPreorders.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        No preorder records match your query.
                      </td>
                    </tr>
                  ) : (
                    filteredPreorders.map((record) => (
                      <tr key={record.preorderId} className="hover:bg-[#141C29] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-white">
                          {record.preorderId}
                        </td>
                        <td className="py-3 px-4 font-semibold text-white">
                          {record.fullName}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-300">
                          {record.email}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-400">
                          {record.whatsapp || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="capitalize px-2 py-0.5 rounded text-[11px] bg-[#05070A] border border-[#1E293B]">
                            {record.platform.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-semibold">
                          {record.discountApplied && (
                            <span className="line-through text-slate-500 mr-1.5 text-[10px]">
                              ₦{record.basePrice.toLocaleString()}
                            </span>
                          )}
                          <span className="text-white">₦{record.finalAmount.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4">
                          {record.paymentStatus === 'free_promo' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1677FF]/15 text-[#37A0FF] border border-[#1677FF]/30">
                              Free Promo (100%)
                            </span>
                          ) : record.paymentStatus === 'paid' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              Paid
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              {record.paymentStatus}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400">
                            {record.preorderStatus}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {record.createdAt
                            ? new Date(record.createdAt).toLocaleDateString()
                            : '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICING & LAUNCH SETTINGS */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-[#101620] rounded-3xl p-6 sm:p-8 border border-[#1E293B] shadow-xl space-y-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Pricing & Launch Settings
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Configure product prices, payment switches, and launch availability. Public website
              syncs automatically.
            </p>
          </div>

          {settingsSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Launch settings saved and synced across all clients!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Windows Price */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Windows Price (₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 15000"
                  value={windowsPriceInput}
                  onChange={(e) => setWindowsPriceInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1677FF]"
                />
                <p className="text-[10px] text-slate-400">Leave blank for "Coming Soon"</p>
              </div>

              {/* Android Price */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Android Price (₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 10000"
                  value={androidPriceInput}
                  onChange={(e) => setAndroidPriceInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1677FF]"
                />
                <p className="text-[10px] text-slate-400">Leave blank for "Coming Soon"</p>
              </div>

              {/* Complete Pack Price */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Complete Pack Price (₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 20000"
                  value={completePriceInput}
                  onChange={(e) => setCompletePriceInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1677FF]"
                />
                <p className="text-[10px] text-slate-400">Leave blank for "Coming Soon"</p>
              </div>
            </div>

            {/* Currency Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Currency</label>
              <input
                type="text"
                value={currencyInput}
                onChange={(e) => setCurrencyInput(e.target.value)}
                className="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-[#0B0F17] border border-[#1E293B] text-xs text-white focus:outline-none focus:border-[#1677FF] uppercase"
              />
              <p className="text-[10px] text-slate-400">
                Default: NGN (₦ Nigerian Naira).
              </p>
            </div>

            {/* Switches */}
            <div className="space-y-4 pt-4 border-t border-[#1E293B]">
              {/* Preorders Enabled toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                <div>
                  <div className="text-xs font-semibold text-white">Preorder Reception Open</div>
                  <div className="text-[11px] text-slate-400">
                    If toggled off, preorder buttons disable and display: "StudyLock preorders are
                    temporarily closed."
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preorderEnabledInput}
                    onChange={(e) => setPreorderEnabledInput(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1677FF]"></div>
                </label>
              </div>

              {/* Payment Enabled toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                <div>
                  <div className="text-xs font-semibold text-white">Enable Real-Time Payment</div>
                  <div className="text-[11px] text-slate-400">
                    When enabled, requires Paystack gateway checkout for paid amounts.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentEnabledInput}
                    onChange={(e) => setPaymentEnabledInput(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1677FF]"></div>
                </label>
              </div>

              {/* Reservation-only mode toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0B0F17] border border-[#1E293B]">
                <div>
                  <div className="text-xs font-semibold text-white">Reservation-Only Mode</div>
                  <div className="text-[11px] text-slate-400">
                    Saves early access queue positions without charging immediately.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reservationOnlyInput}
                    onChange={(e) => setReservationOnlyInput(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1677FF]"></div>
                </label>
              </div>
            </div>

            {/* Save Button */}
            <div>
              <button
                type="submit"
                disabled={settingsSaving}
                className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[#1677FF] hover:bg-[#1366DB] shadow-md shadow-[#1677FF]/25 transition-all cursor-pointer disabled:opacity-50"
              >
                {settingsSaving ? 'Updating Launch Settings...' : 'Save & Publish Settings'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
