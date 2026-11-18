import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Mail, 
  Lock, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { KasabLogo } from './KasabLogo';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalTab, 
    openAuthModal, 
    loginUser, 
    signupUser, 
    language 
  } = useShop();

  // Login Form States
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupCity, setSignupCity] = useState<'Dhaka' | 'Outside Dhaka'>('Dhaka');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!loginIdentifier.trim() || !loginPassword) {
      setLoginError(
        language === 'bn' 
          ? 'অনুগ্রহ করে ইমেইল/ফোন এবং পাসওয়ার্ড দিন।' 
          : 'Please enter your email/phone and password.'
      );
      return;
    }

    setLoginLoading(true);
    const res = await loginUser(loginIdentifier.trim(), loginPassword);
    setLoginLoading(false);
    if (!res.success) {
      setLoginError(res.error || (language === 'bn' ? 'লগইন ব্যর্থ হয়েছে।' : 'Login failed.'));
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);

    if (!signupName.trim()) {
      setSignupError(language === 'bn' ? 'আপনার নাম প্রদান করুন।' : 'Please enter your name.');
      return;
    }
    if (!signupPhone.trim()) {
      setSignupError(language === 'bn' ? 'মোবাইল নম্বর প্রদান করুন।' : 'Please enter your phone number.');
      return;
    }
    if (signupPassword.length < 6) {
      setSignupError(
        language === 'bn' 
          ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।' 
          : 'Password must be at least 6 characters.'
      );
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError(
        language === 'bn' 
          ? 'উভয় পাসওয়ার্ড একই হতে হবে।' 
          : 'Passwords do not match.'
      );
      return;
    }

    setSignupLoading(true);
    const res = await signupUser({
      name: signupName.trim(),
      email: signupEmail.trim(),
      phone: signupPhone.trim(),
      address: signupAddress.trim(),
      city: signupCity,
      password: signupPassword,
    });
    setSignupLoading(false);

    if (!res.success) {
      setSignupError(res.error || (language === 'bn' ? 'অ্যাকাউন্ট তৈরি করা যায়নি।' : 'Signup failed.'));
    }
  };

  const fillDemoAccount = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setLoginIdentifier('admin@kasab.com');
      setLoginPassword('admin123');
      setLoginError(null);
    } else {
      setLoginIdentifier('customer@kasab.com');
      setLoginPassword('user123');
      setLoginError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-b from-[#f3f7f0] to-white border-b border-neutral-100 flex flex-col items-center text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 w-9 h-9 rounded-full bg-white/90 border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors shadow-xs"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-neutral-200/80 flex items-center justify-center p-2 mb-2">
            <KasabLogo className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-neutral-900 font-serif-brand">
            Kasab Gallery
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {language === 'bn' 
              ? 'প্রাকৃতিক বিশুদ্ধতা ও প্রিমিয়াম লাইফস্টাইল অ্যাকাউন্ট' 
              : 'Pure Natural & Premium Lifestyle Account'}
          </p>

          {/* Tab Switcher */}
          <div className="w-full mt-4 p-1 bg-neutral-100/90 rounded-2xl flex gap-1">
            <button
              type="button"
              onClick={() => openAuthModal('login')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                authModalTab === 'login'
                  ? 'bg-white text-[#2d5016] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {language === 'bn' ? 'লগইন' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => openAuthModal('signup')}
              className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all ${
                authModalTab === 'signup'
                  ? 'bg-white text-[#2d5016] shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {language === 'bn' ? 'নতুন অ্যাকাউন্ট' : 'Sign Up'}
            </button>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-4">
          {authModalTab === 'login' ? (
            /* ================= LOGIN FORM ================= */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {loginError}
                </div>
              )}

              {/* Identifier (Email / Phone) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  {language === 'bn' ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Phone Number'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder={language === 'bn' ? '017XXXXXXXX অথবা email@example.com' : '017XXXXXXXX or email@example.com'}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] transition-all bg-neutral-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-neutral-700">
                    {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] transition-all bg-neutral-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white font-semibold text-sm shadow-md shadow-[#2d5016]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loginLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'bn' ? 'লগইন হচ্ছে...' : 'Signing in...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* One-click Demo Logins */}
              <div className="pt-2 border-t border-neutral-100">
                <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2 text-center">
                  {language === 'bn' ? '⚡ দ্রুত পরীক্ষার জন্য ডেমো অ্যাকাউন্ট' : '⚡ Quick Demo Logins'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('customer')}
                    className="py-2 px-2.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#2d5016]" />
                    <span>{language === 'bn' ? 'কাস্টমার ডেমো' : 'Customer'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillDemoAccount('admin')}
                    className="py-2 px-2.5 rounded-xl border border-[#2d5016]/20 bg-[#2d5016]/5 hover:bg-[#2d5016]/10 text-[#2d5016] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2d5016]" />
                    <span>{language === 'bn' ? 'অ্যাডমিন ডেমো' : 'Admin'}</span>
                  </button>
                </div>
              </div>

              {/* Switch to Signup */}
              <div className="text-center text-xs text-neutral-500 pt-1">
                {language === 'bn' ? 'এখনো কোনো অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="font-bold text-[#2d5016] hover:underline"
                >
                  {language === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create an Account'}
                </button>
              </div>
            </form>
          ) : (
            /* ================= SIGNUP FORM ================= */
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {signupError && (
                <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl">
                  {signupError}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {language === 'bn' ? 'আপনার পুরো নাম *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <UserIcon className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder={language === 'bn' ? 'উদা: মো: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] bg-neutral-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর *' : 'Mobile Number *'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] bg-neutral-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {language === 'bn' ? 'ইমেইল অ্যাড্রেস (ঐচ্ছিক)' : 'Email Address (Optional)'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] bg-neutral-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* City Selection */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {language === 'bn' ? 'শহর / এরিয়া' : 'Delivery Area'}
                  </label>
                  <select
                    value={signupCity}
                    onChange={(e) => setSignupCity(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#2d5016] bg-neutral-50/50 focus:bg-white"
                  >
                    <option value="Dhaka">{language === 'bn' ? 'ঢাকা সিটি' : 'Dhaka City'}</option>
                    <option value="Outside Dhaka">{language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</option>
                  </select>
                </div>

                {/* Delivery Address */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {language === 'bn' ? 'বাসা/রোড/ঠিকানা' : 'Address'}
                  </label>
                  <input
                    type="text"
                    value={signupAddress}
                    onChange={(e) => setSignupAddress(e.target.value)}
                    placeholder={language === 'bn' ? 'উদা: মিরপুর-১০, ঢাকা' : 'Area address'}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#2d5016] bg-neutral-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর) *' : 'Password (min 6 characters) *'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] bg-neutral-50/50 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                  >
                    {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {language === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন *' : 'Confirm Password *'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] bg-neutral-50/50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-2.5 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white font-semibold text-xs sm:text-sm shadow-md shadow-[#2d5016]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {signupLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'bn' ? 'অ্যাকাউন্ট তৈরি হচ্ছে...' : 'Creating Account...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-300" />
                    <span>{language === 'bn' ? 'সাইন আপ সম্পন্ন করুন' : 'Complete Sign Up'}</span>
                  </>
                )}
              </button>

              {/* Switch to Login */}
              <div className="text-center text-xs text-neutral-500 pt-1">
                {language === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-bold text-[#2d5016] hover:underline"
                >
                  {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
