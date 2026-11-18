import React from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollingNoticeBar } from './components/ScrollingNoticeBar';
import { NavigationSidebar } from './components/NavigationSidebar';
import { QuickViewModal } from './components/QuickViewModal';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { ExpressCheckoutDrawer } from './components/ExpressCheckoutDrawer';

// View Components (Eager loaded for immediate customer checkout & navigation)
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { CheckoutView } from './components/CheckoutView';

// Code-split views (Loaded on-demand to maintain lightning-fast mobile Core Web Vitals)
const BlogView = React.lazy(() => import('./components/BlogView').then((m) => ({ default: m.BlogView })));
const BlogDetailView = React.lazy(() => import('./components/BlogDetailView').then((m) => ({ default: m.BlogDetailView })));
const AboutView = React.lazy(() => import('./components/AboutView').then((m) => ({ default: m.AboutView })));
const ContactView = React.lazy(() => import('./components/ContactView').then((m) => ({ default: m.ContactView })));
const AdminDashboardView = React.lazy(() => import('./components/AdminDashboardView').then((m) => ({ default: m.AdminDashboardView })));
const AccountView = React.lazy(() => import('./components/AccountView').then((m) => ({ default: m.AccountView })));

import { AuthModal } from './components/AuthModal';
import { CheckCircle, AlertCircle, Info, Sparkles, ShieldCheck } from 'lucide-react';

const ViewLoader = () => (
  <div className="min-h-[400px] flex items-center justify-center p-8">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#2d5016] border-t-transparent animate-spin" />
      <span className="text-xs font-serif-brand text-neutral-500 font-medium">Kasab Gallery...</span>
    </div>
  </div>
);

const AppLayout: React.FC = () => {
  const { currentPage, toastMessage, currentUser, openAuthModal, setCurrentPage, language } = useShop();

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return <HomeView />;
      case 'catalog':
        return <CatalogView />;
      case 'product_detail':
        return <ProductDetailView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'blog':
        return <BlogView />;
      case 'blog_detail':
        return <BlogDetailView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'admin':
        if (currentUser?.role !== 'admin') {
          return (
            <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-neutral-200 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto border border-amber-200">
                <ShieldCheck className="w-8 h-8 text-[#2d5016]" />
              </div>
              <h2 className="text-xl font-bold font-serif-brand text-neutral-900">
                {language === 'bn' ? 'অ্যাডমিন প্রবেশাধিকার সংরক্ষিত' : 'Admin Access Required'}
              </h2>
              <p className="text-xs text-neutral-600 leading-relaxed">
                {language === 'bn'
                  ? 'এই পৃষ্ঠাটি শুধুমাত্র Kasab Gallery-র অনুমোদিত অ্যাডমিনের জন্য সংরক্ষিত। প্রবেশ করতে অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন।'
                  : 'This page is restricted to authorized Kasab Gallery administrators only. Please log in with admin credentials.'}
              </p>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="w-full py-2.5 rounded-xl bg-[#2d5016] text-[#d4af37] font-bold text-xs hover:bg-[#234011] transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'অ্যাডমিন লগইন করুন' : 'Log in as Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentPage('home')}
                  className="w-full py-2.5 rounded-xl bg-neutral-100 text-neutral-700 font-semibold text-xs hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}
                </button>
              </div>
            </div>
          );
        }
        return <AdminDashboardView />;
      case 'account':
      case 'orders':
        return <AccountView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip flex flex-col bg-[#faf9f5] text-[#1a1a1a] font-sans antialiased selection:bg-[#2d5016] selection:text-white">
      {/* 1. Global Announcement / Scrolling Text Notice Bar */}
      <ScrollingNoticeBar />

      {/* 2. Global Sticky Navbar */}
      <Navbar />

      {/* 3. Global Navigation Drawer / Sidebar */}
      <NavigationSidebar />

      {/* 4. Main Body Content View */}
      <main className="flex-1 w-full">
        <React.Suspense fallback={<ViewLoader />}>
          {renderCurrentView()}
        </React.Suspense>
      </main>

      {/* 5. Global Footer */}
      <Footer />

      {/* 6. Quick View Modal if triggered */}
      <QuickViewModal />

      {/* 7. Authentication Modal (Login / Signup) */}
      <AuthModal />

      {/* 8. Scroll to Top Floating Button */}
      <ScrollToTopButton />

      {/* 9. Express 1-Step Checkout Drawer */}
      <ExpressCheckoutDrawer />

      {/* 8. Global Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#1a1a1a] text-white shadow-2xl border border-[#d4af37]/40 text-xs font-semibold backdrop-blur-md">
            <CheckCircle className="w-4 h-4 text-[#d4af37] shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ShopProvider>
      <AppLayout />
    </ShopProvider>
  );
}
