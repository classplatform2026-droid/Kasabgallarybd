import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../data/mockData';
import { KasabLogo } from './KasabLogo';
import { 
  X, 
  Search, 
  Home, 
  ShoppingBag, 
  BookOpen, 
  Info, 
  Phone, 
  LayoutDashboard, 
  Globe, 
  ChevronRight, 
  User as UserIcon,
  LogOut,
  Package,
  Sparkles,
  ShoppingBag as CartIcon
} from 'lucide-react';

export const NavigationSidebar: React.FC = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    products,
    currentPage,
    setCurrentPage,
    setSelectedCategoryId,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    currentUser,
    openAuthModal,
    logoutUser,
    cart,
    openCheckoutDrawer,
  } = useShop();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close on Escape key press & prevent background body scrolling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSidebarOpen, setIsSidebarOpen]);

  const handleNav = (page: typeof currentPage, categoryId?: any) => {
    if (categoryId !== undefined) {
      setSelectedCategoryId(categoryId);
    }
    setCurrentPage(page);
    setIsSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (currentPage !== 'catalog') {
        setCurrentPage('catalog');
      }
      setIsSidebarOpen(false);
    }
  };

  const navMenuItems = [
    { page: 'home' as const, labelBn: 'হোম পেজ', labelEn: 'Home', icon: Home },
    { page: 'catalog' as const, labelBn: 'সকল পণ্য কালেকশন', labelEn: 'All Products', icon: ShoppingBag, badge: products.length },
    { page: 'orders' as const, labelBn: 'আমার অর্ডার ও ট্র্যাকিং', labelEn: 'Orders & Tracking', icon: Package },
    { page: 'cart' as const, labelBn: 'শপিং কার্ট', labelEn: 'Shopping Cart', icon: CartIcon, badge: totalCartCount > 0 ? totalCartCount : undefined },
    { page: 'blog' as const, labelBn: 'স্বাস্থ্য ও পুষ্টি ব্লগ', labelEn: 'Health & Nutrition Blog', icon: BookOpen },
    { page: 'about' as const, labelBn: 'আমাদের সম্পর্কে', labelEn: 'About Kasab Gallery', icon: Info },
    { page: 'contact' as const, labelBn: 'যোগাযোগ ও সহায়তা', labelEn: 'Contact & Support', icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <div 
          id="global-navigation-sidebar-container" 
          className="fixed inset-0 z-[9998] flex justify-end select-none"
        >
          {/* 1. Backdrop Overlay */}
          <motion.div
            id="sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* 2. Slide-Over Drawer */}
          <motion.div 
            id="sidebar-drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative z-[9999] w-[88vw] max-w-[360px] sm:max-w-[390px] h-full max-h-[100dvh] bg-[#faf8f5] shadow-2xl flex flex-col border-l border-neutral-200"
          >
            {/* Top Brand Accent Line */}
            <div className="h-1 w-full bg-[#1e3a15]" />

            {/* Sidebar Header */}
            <div className="p-4 sm:p-5 border-b border-neutral-200/80 flex items-center justify-between gap-3 bg-white shrink-0">
              <button
                onClick={() => handleNav('home')}
                className="flex items-center gap-3 text-left min-w-0 cursor-pointer group"
              >
                <KasabLogo className="w-10 h-10 rounded-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif-brand text-lg font-bold text-neutral-900 tracking-tight truncate">
                      Kasab Gallery
                    </span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-[#1e3a15]/10 text-[#1e3a15] shrink-0">
                      Pure
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 font-medium truncate">
                    {language === 'bn' ? BRAND_CONFIG.tagline : BRAND_CONFIG.taglineEn}
                  </p>
                </div>
              </button>

              {/* Close Button */}
              <button
                id="sidebar-close-action-btn"
                onClick={() => setIsSidebarOpen(false)}
                className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-950 flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 overscroll-contain">
              
              {/* In-sidebar Search */}
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  id="sidebar-search-box"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bn' ? 'পণ্য বা মধু খুঁজুন...' : 'Search products...'}
                  className="w-full pl-9 pr-9 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#1e3a15] focus:ring-1 focus:ring-[#1e3a15]/30 transition-all shadow-2xs"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </form>

              {/* User Account / Profile Card */}
              {currentUser ? (
                <div className="p-3.5 rounded-2xl bg-white border border-neutral-200/90 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#1e3a15] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-neutral-500 truncate">{currentUser.email || currentUser.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleNav('account')}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-semibold transition-colors cursor-pointer"
                    >
                      {language === 'bn' ? 'প্রোফাইল' : 'Profile'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setIsSidebarOpen(false);
                      }}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Logout"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    openAuthModal('login');
                  }}
                  className="w-full p-3 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#1e3a15]/40 shadow-2xs flex items-center justify-between transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#1e3a15]/10 text-[#1e3a15] flex items-center justify-center font-bold shrink-0">
                      <UserIcon className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <span className="text-xs font-bold text-neutral-900 group-hover:text-[#1e3a15] transition-colors block">
                        {language === 'bn' ? 'লগইন বা রেজিস্টার' : 'Sign In or Register'}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {language === 'bn' ? 'অর্ডার ট্র্যাক ও প্রোফাইল' : 'Track orders & saved items'}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#1e3a15] group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Navigation Links */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 block pb-1">
                  {language === 'bn' ? 'মেনু' : 'Menu'}
                </span>

                <div className="space-y-1 bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-2xs">
                  {navMenuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.page || (item.page === 'blog' && currentPage === 'blog_detail');
                    return (
                      <button
                        key={item.page}
                        id={`sidebar-link-${item.page}`}
                        onClick={() => handleNav(item.page)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#1e3a15] text-white shadow-xs'
                            : 'text-neutral-700 hover:bg-[#faf8f5] hover:text-neutral-950'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#1e3a15]'}`} />
                          <span>{language === 'bn' ? item.labelBn : item.labelEn}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge !== undefined && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-700'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white/70' : 'text-neutral-300'}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Sticky Drawer Footer */}
            <div className="p-3.5 sm:p-4 border-t border-neutral-200 bg-white flex items-center justify-between gap-2 shrink-0">
              <button
                id="sidebar-language-toggle"
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200 text-xs font-bold cursor-pointer active:scale-95 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-600" />
                <span>{language === 'bn' ? 'English (EN)' : 'বাংলা (BN)'}</span>
              </button>

              {currentUser?.role === 'admin' ? (
                <button
                  id="sidebar-admin-portal-btn"
                  onClick={() => handleNav('admin')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 text-[#d4af37] text-xs font-bold hover:bg-black cursor-pointer active:scale-95 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'অ্যাডমিন' : 'Admin'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  id="sidebar-cart-btn"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    openCheckoutDrawer();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e3a15] text-white text-xs font-bold hover:bg-[#152a0f] cursor-pointer active:scale-95 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                  <span>{language === 'bn' ? 'কার্ট বক্স' : 'Cart'}</span>
                </button>
              )}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
