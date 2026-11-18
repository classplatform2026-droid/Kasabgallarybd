import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../data/mockData';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  MessageCircle, 
  LayoutDashboard,
  ChevronRight,
  Phone,
  Truck,
  ShieldCheck,
  Home,
  BookOpen,
  Info,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Package
} from 'lucide-react';
import { formatBDT } from '../utils/formatters';
import { KasabLogo } from './KasabLogo';

export const Navbar: React.FC = () => {
  const {
    products,
    categories,
    cartCount,
    cartSubtotal,
    currentPage,
    setCurrentPage,
    language,
    searchQuery,
    setSearchQuery,
    selectedCategoryId,
    setSelectedCategoryId,
    isSidebarOpen,
    setIsSidebarOpen,
    openCheckoutDrawer,
    currentUser,
    openAuthModal,
    logoutUser,
    showToast,
  } = useShop();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPage !== 'catalog') {
      setCurrentPage('catalog');
    }
  };

  const handleNavClick = (page: typeof currentPage, catId?: any) => {
    if (catId !== undefined) {
      setSelectedCategoryId(catId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#e8e6df]">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Identity */}
          <button
            id="brand-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-1.5 sm:gap-3 text-left group cursor-pointer focus:outline-none min-w-0 shrink"
          >
            <KasabLogo className="w-8 h-8 sm:w-11 sm:h-11 shadow-xs group-hover:scale-105 transition-transform duration-300 shrink-0" />
            <span className="font-serif-brand text-[15px] sm:text-xl lg:text-2xl font-bold text-[#1a1a1a] tracking-tight truncate">
              Kasab Gallery
            </span>
          </button>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-md mx-4 relative"
          >
            <div className="relative w-full">
              <input
                id="desktop-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'মধু, কালোজিরা, জায়নামাজ বা আতর খুঁজুন...'
                    : 'Search honey, black seed, prayer mat, attar...'
                }
                className="w-full pl-10 pr-10 py-2.5 bg-[#f5f5f2] border border-[#e2e0d8] rounded-full text-sm focus:outline-none focus:border-[#2d5016] focus:bg-white transition-all text-[#1a1a1a]"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-neutral-700">
            {/* Desktop Sidebar / Category Drawer Trigger */}
            <button
              id="desktop-sidebar-toggle-btn"
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-[#2d5016]/10 hover:text-[#2d5016] text-neutral-800 text-xs font-bold border border-neutral-200 cursor-pointer transition-all active:scale-95 shadow-2xs"
            >
              <Menu className="w-3.5 h-3.5 text-[#2d5016]" />
              <span>{language === 'bn' ? 'সকল ক্যাটাগরি ও মেনু' : 'All Categories & Menu'}</span>
            </button>

            <button
              id="nav-home-btn"
              onClick={() => handleNavClick('home')}
              className={`transition-colors hover:text-[#2d5016] cursor-pointer ${
                currentPage === 'home' ? 'text-[#2d5016] font-bold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              {language === 'bn' ? 'হোম' : 'Home'}
            </button>
            <button
              id="nav-catalog-btn"
              onClick={() => handleNavClick('catalog', 'all')}
              className={`transition-colors hover:text-[#2d5016] cursor-pointer ${
                currentPage === 'catalog' ? 'text-[#2d5016] font-bold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              {language === 'bn' ? 'সব পণ্য' : 'All Products'}
            </button>
            <button
              id="nav-blog-btn"
              onClick={() => handleNavClick('blog')}
              className={`transition-colors hover:text-[#2d5016] cursor-pointer ${
                currentPage === 'blog' || currentPage === 'blog_detail' ? 'text-[#2d5016] font-bold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              {language === 'bn' ? 'ব্লগ ও টিপস' : 'Blog'}
            </button>
            <button
              id="nav-about-btn"
              onClick={() => handleNavClick('about')}
              className={`transition-colors hover:text-[#2d5016] cursor-pointer ${
                currentPage === 'about' ? 'text-[#2d5016] font-bold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              {language === 'bn' ? 'আমাদের কথা' : 'About Us'}
            </button>
            <button
              id="nav-contact-btn"
              onClick={() => handleNavClick('contact')}
              className={`transition-colors hover:text-[#2d5016] cursor-pointer ${
                currentPage === 'contact' ? 'text-[#2d5016] font-bold underline underline-offset-8 decoration-2' : ''
              }`}
            >
              {language === 'bn' ? 'যোগাযোগ' : 'Contact'}
            </button>
            {currentUser?.role === 'admin' && (
              <button
                id="nav-admin-btn"
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === 'admin'
                    ? 'bg-[#1a1a1a] text-[#d4af37] border-neutral-900 shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200 hover:bg-neutral-200'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>{language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin'}</span>
              </button>
            )}
          </nav>

          {/* Right Action Icons: Search, WhatsApp, Account & Cart */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            {/* Mobile search toggle */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-full hover:bg-neutral-100 text-neutral-700 active:scale-95 transition-all shrink-0"
              aria-label="Search"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Direct WhatsApp Action Button */}
            <a
              href={BRAND_CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="header-whatsapp-btn"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
              <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ' : 'WhatsApp'}</span>
            </a>

            {/* User Account / Login Button */}
            {currentUser ? (
              <div className="relative shrink-0">
                <button
                  type="button"
                  id="nav-account-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1.5 rounded-full border border-neutral-200 hover:border-[#2d5016]/40 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition-all cursor-pointer shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-[#2d5016] text-white flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden md:inline max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400 hidden sm:inline" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-neutral-200/80 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-2 border-b border-neutral-100">
                        <p className="font-bold text-neutral-900 truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-neutral-500 truncate">{currentUser.email || currentUser.phone}</p>
                        {currentUser.role === 'admin' && (
                          <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#2d5016] text-white">
                            ADMIN
                          </span>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleNavClick('account');
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left hover:bg-neutral-100 text-neutral-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <UserIcon className="w-4 h-4 text-neutral-500" />
                          <span>{language === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            handleNavClick('orders');
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left hover:bg-neutral-100 text-neutral-700 flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          <Package className="w-4 h-4 text-neutral-500" />
                          <span>{language === 'bn' ? 'আমার অর্ডারসমূহ' : 'My Orders'}</span>
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              handleNavClick('admin');
                            }}
                            className="w-full px-3 py-2 rounded-xl text-left hover:bg-neutral-100 text-[#2d5016] font-semibold flex items-center gap-2 transition-colors cursor-pointer"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#2d5016]" />
                            <span>{language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard'}</span>
                          </button>
                        )}
                      </div>

                      <div className="pt-1 border-t border-neutral-100">
                        <button
                          type="button"
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logoutUser();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-left hover:bg-red-50 text-red-600 flex items-center gap-2 transition-colors cursor-pointer font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{language === 'bn' ? 'লগআউট' : 'Sign Out'}</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                type="button"
                id="nav-login-btn"
                onClick={() => openAuthModal('login')}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-full border border-neutral-200 hover:border-[#2d5016]/40 bg-white hover:bg-neutral-50 text-neutral-800 text-[11px] sm:text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#2d5016]" />
                <span>{language === 'bn' ? 'লগইন' : 'Sign In'}</span>
              </button>
            )}

            {/* Cart Button (Opens Cart Box Drawer with added items & subtotal) */}
            <button
              id="nav-cart-btn"
              type="button"
              onClick={() => {
                openCheckoutDrawer();
              }}
              className="relative flex items-center gap-1.5 sm:gap-2 p-2 sm:px-3.5 sm:py-2 rounded-full bg-[#1e3a15] text-white hover:bg-[#152a0f] transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
              aria-label={language === 'bn' ? 'কার্ট' : 'Cart'}
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline text-xs font-semibold">
                {language === 'bn' ? 'কার্ট' : 'Cart'}
              </span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 sm:static flex items-center justify-center min-w-[16px] sm:min-w-[20px] h-4 sm:h-5 px-1 rounded-full bg-[#d4af37] text-neutral-950 text-[9px] sm:text-xs font-black shadow">
                  {cartCount}
                </span>
              )}
              {cartCount > 0 && (
                <span className="hidden md:inline text-xs opacity-90 pl-1 border-l border-white/20 font-bold">
                  {formatBDT(cartSubtotal)}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 sm:p-2 rounded-xl text-neutral-800 hover:bg-neutral-100 cursor-pointer active:scale-95 border border-neutral-200 bg-neutral-50 shadow-2xs shrink-0"
              aria-label="Toggle Navigation"
            >
              {isSidebarOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable with Instant Quick Filter Tags */}
        {isSearchOpen && (
          <div className="md:hidden pb-3 pt-1 border-t border-neutral-100 animate-in fade-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'মধু, কালোজিরা, জায়নামাজ বা আতর খুঁজুন...'
                    : 'Search honey, prayer mat, attar...'
                }
                autoFocus
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-100 border border-neutral-300 rounded-xl text-sm focus:outline-none focus:border-[#2d5016] focus:bg-white text-[#1a1a1a]"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-neutral-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Mobile quick-search pills */}
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar pb-0.5 text-[11px]">
              <span className="text-neutral-400 font-medium shrink-0">
                {language === 'bn' ? 'জনপ্রিয়:' : 'Popular:'}
              </span>
              {[
                { label: 'মধু', query: 'মধু' },
                { label: 'কালোজিরা', query: 'কালোজিরা' },
                { label: 'জায়নামাজ', query: 'জায়নামাজ' },
                { label: 'আতর', query: 'আতর' },
                { label: 'খেজুর', query: 'খেজুর' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    setSearchQuery(item.query);
                    if (currentPage !== 'catalog') setCurrentPage('catalog');
                  }}
                  className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-[#2d5016] hover:text-white text-neutral-700 font-medium whitespace-nowrap transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
