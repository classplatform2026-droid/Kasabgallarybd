import React from 'react';
import { useShop } from '../context/ShopContext';
import { formatBDT } from '../utils/formatters';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Truck,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const ExpressCheckoutDrawer: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    isCheckoutDrawerOpen,
    closeCheckoutDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    language,
    setCurrentPage,
    currentUser,
    openAuthModal,
  } = useShop();

  if (!isCheckoutDrawerOpen) return null;

  const handleProceedToCheckout = () => {
    closeCheckoutDrawer();
    setCurrentPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToCartPage = () => {
    closeCheckoutDrawer();
    setCurrentPage('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={closeCheckoutDrawer}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      {/* Slide-over Drawer Panel */}
      <div className="absolute inset-y-0 right-0 w-full flex justify-end pl-4 sm:pl-10 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-md h-full bg-[#faf8f5] text-neutral-900 shadow-2xl flex flex-col border-l border-neutral-200 animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-neutral-200/90 bg-white flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1e3a15]/10 flex items-center justify-center text-[#1e3a15]">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h2 className="font-serif-brand font-bold text-base sm:text-lg text-neutral-900 leading-tight">
                  {language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
                </h2>
                <p className="text-xs text-neutral-500">
                  {language === 'bn' 
                    ? `${cartCount} টি পণ্য যোগ করা হয়েছে` 
                    : `${cartCount} ${cartCount === 1 ? 'item' : 'items'} in cart`}
                </p>
              </div>
            </div>
            
            <button
              onClick={closeCheckoutDrawer}
              className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body: Added Items or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              /* EMPTY CART VIEW */
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif-brand font-bold text-base text-neutral-800">
                    {language === 'bn' ? 'আপনার কার্ট খালি' : 'Your Cart is Empty'}
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                    {language === 'bn'
                      ? 'পছন্দের পণ্য কার্টে যোগ করে সহজে অর্ডার সম্পন্ন করুন।'
                      : 'Add your favorite pure and organic products to get started.'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCheckoutDrawer();
                    setCurrentPage('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#1e3a15] hover:bg-[#152a0f] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <span>{language === 'bn' ? 'পণ্যসমূহ দেখতে যান' : 'Browse Catalog'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              /* ACTIVE CART ITEMS (Add kora totto) */
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 pb-1">
                  <span>{language === 'bn' ? 'যুক্ত করা পণ্যসমূহ' : 'Added Products'}</span>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-neutral-400 hover:text-red-600 transition-colors text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{language === 'bn' ? 'সব মুছুন' : 'Clear All'}</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-2.5">
                  {cart.map(({ product, quantity }) => (
                    <div
                      key={product._id}
                      className="bg-white p-3 rounded-2xl border border-neutral-200/90 flex items-center gap-3 shadow-2xs hover:border-[#1e3a15]/30 transition-all"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-[#f6f4ee] overflow-hidden shrink-0 border border-neutral-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-xs text-neutral-900 truncate">
                          {language === 'bn' ? product.banglaName : product.name}
                        </h4>
                        <div className="flex items-baseline gap-1 mt-0.5">
                          <span className="text-xs font-bold text-[#1e3a15] font-mono tabular-nums">
                            {formatBDT(product.price)}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            × {quantity}
                          </span>
                        </div>

                        {/* Quantity Controls & Item Total */}
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-neutral-100">
                          <div className="flex items-center gap-1 bg-neutral-50 rounded-lg p-0.5 border border-neutral-200">
                            <button
                              type="button"
                              onClick={() => updateQuantity(product._id, quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-black rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                              title="Decrease"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-5 text-center text-xs font-bold tabular-nums">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(product._id, quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-neutral-600 hover:text-black rounded hover:bg-neutral-200 transition-colors cursor-pointer"
                              title="Increase"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900 font-mono tabular-nums">
                              {formatBDT(product.price * quantity)}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeFromCart(product._id)}
                              className="text-neutral-400 hover:text-red-500 p-1 rounded-md transition-colors cursor-pointer"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Single Delivery Guarantee Banner */}
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-2.5 text-xs text-emerald-900 mt-3">
                  <Truck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong className="font-bold">
                      {language === 'bn' ? 'সিঙ্গেল ডেলিভারি সুবিধা:' : 'Single Delivery Benefit:'}
                    </strong>{' '}
                    {language === 'bn'
                      ? 'সকল পণ্য একটি পার্সেল হিসেবে পৌঁছে দেওয়া হবে।'
                      : 'All items will be delivered together in a single package.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer: Subtotal and Checkout Action ONLY (NO order inputs!) */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-neutral-200/90 bg-white space-y-3.5 shadow-lg">
              {/* Subtotal Display */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between text-neutral-700">
                  <span className="text-sm font-semibold text-neutral-800">
                    {language === 'bn' ? 'সাবটোটাল (মোট মূল্য)' : 'Subtotal'}
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#1e3a15] font-mono tabular-nums">
                    {formatBDT(cartSubtotal)}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  {language === 'bn'
                    ? '* ডেলিভারি চার্জ ও গ্রাহকের ঠিকানা পরবর্তী চেকআউট পেজে নেওয়া হবে।'
                    : '* Delivery fee & address information will be entered on checkout.'}
                </p>
              </div>

              {/* Primary Action: Proceed to Checkout */}
              <button
                type="button"
                id="drawer-proceed-checkout-btn"
                onClick={() => {
                  if (!currentUser) {
                    closeCheckoutDrawer();
                    openAuthModal('login');
                    return;
                  }
                  handleProceedToCheckout();
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-[#1e3a15] hover:bg-[#152a0f] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>
                  {language === 'bn' ? 'অর্ডার করতে এগিয়ে যান' : 'Proceed to Checkout'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary Actions */}
              <div className="flex items-center justify-between gap-2 text-[11px] sm:text-xs pt-1">
                <button
                  type="button"
                  onClick={handleGoToCartPage}
                  className="text-neutral-600 hover:text-[#1e3a15] font-medium flex items-center gap-0.5 cursor-pointer transition-colors"
                >
                  <span>{language === 'bn' ? 'কার্ট পেজে দেখুন' : 'View Full Cart Page'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={closeCheckoutDrawer}
                  className="text-neutral-500 hover:text-neutral-800 font-medium cursor-pointer transition-colors"
                >
                  {language === 'bn' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
                </button>
              </div>

              {/* Trust Tag */}
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1 border-t border-neutral-100">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'bn' ? 'ক্যাশ অন ডেলিভারি সুবিধা রয়েছে' : 'Cash on delivery available'}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
