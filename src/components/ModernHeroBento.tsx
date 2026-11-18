import React from 'react';
import { useShop } from '../context/ShopContext';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { formatBDT } from '../utils/formatters';

// High-fidelity image assets generated for Kasab Gallery
const HERO_HONEY_IMG = '/src/assets/images/bento_organic_honey_1791733378035.jpg';
const HERO_OIL_IMG = '/src/assets/images/bento_mustard_oil_1791733364482.jpg';
const HERO_SKINCARE_IMG = '/src/assets/images/bento_natural_skincare_1791733388679.jpg';

export const ModernHeroBento: React.FC = () => {
  const {
    products,
    heroHighlights,
    setCurrentPage,
    setSelectedCategoryId,
    setQuickViewProduct,
    openCheckoutDrawer,
    language,
  } = useShop();

  const primarySlot = heroHighlights?.find((h) => h.slotId === 'primary');
  const secondary1Slot = heroHighlights?.find((h) => h.slotId === 'secondary_1');
  const secondary2Slot = heroHighlights?.find((h) => h.slotId === 'secondary_2');

  const primaryProduct = (primarySlot?.productId ? products.find((p) => p._id === primarySlot.productId) : null) 
    || products.find((p) => p.category === 'food') 
    || products[0];

  const secondary1Product = (secondary1Slot?.productId ? products.find((p) => p._id === secondary1Slot.productId) : null) 
    || products.find((p) => p.name.toLowerCase().includes('oil') || p.banglaName.includes('তেল')) 
    || products[1];

  const secondary2Product = (secondary2Slot?.productId ? products.find((p) => p._id === secondary2Slot.productId) : null) 
    || products.find((p) => p.category === 'skincare') 
    || products[2];

  const handleExploreClick = () => {
    setSelectedCategoryId('all');
    setCurrentPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTileAction = (prod: any) => {
    if (prod) {
      setQuickViewProduct(prod);
    } else {
      handleExploreClick();
    }
  };

  // Resolved dynamic values
  const tile1Image = primarySlot?.customImage || primaryProduct?.image || HERO_HONEY_IMG;
  const tile1Badge = language === 'bn' 
    ? (primarySlot?.badgeBn || primarySlot?.badge || 'বিশেষ সিগনেচার আইটেম') 
    : (primarySlot?.badge || primarySlot?.badgeBn || 'SIGNATURE HARVEST');
  const tile1Title = language === 'bn'
    ? (primarySlot?.customTitleBn || primaryProduct?.banglaName || 'সুন্দরবনের খাঁটি চাকভাঙা মধু')
    : (primarySlot?.customTitle || primaryProduct?.name || 'Sundarban Raw Wild Honey');

  const tile2Image = secondary1Slot?.customImage || secondary1Product?.image || HERO_OIL_IMG;
  const tile2Badge = language === 'bn'
    ? (secondary1Slot?.badgeBn || secondary1Slot?.badge || 'ঘানিভাঙা খাঁটি')
    : (secondary1Slot?.badge || secondary1Slot?.badgeBn || 'COLD PRESSED');
  const tile2Title = language === 'bn'
    ? (secondary1Slot?.customTitleBn || secondary1Product?.banglaName || 'ঘানিভাঙা সরিষার তেল')
    : (secondary1Slot?.customTitle || secondary1Product?.name || 'Cold Pressed Mustard Oil');

  const tile3Image = secondary2Slot?.customImage || secondary2Product?.image || HERO_SKINCARE_IMG;
  const tile3Badge = language === 'bn'
    ? (secondary2Slot?.badgeBn || secondary2Slot?.badge || 'প্রাকৃতিক যত্ন')
    : (secondary2Slot?.badge || secondary2Slot?.badgeBn || 'BOTANICAL CARE');
  const tile3Title = language === 'bn'
    ? (secondary2Slot?.customTitleBn || secondary2Product?.banglaName || 'ভেষজ স্কিনকেয়ার ও সোপ')
    : (secondary2Slot?.customTitle || secondary2Product?.name || 'Organic Skincare & Soaps');

  return (
    <div className="relative overflow-hidden bg-[#faf8f5] border-b border-neutral-200/70 py-5 sm:py-7 lg:py-9">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">

          {/* ======================================================== */}
          {/* LEFT COLUMN: COMPACT EDITORIAL HEADLINE & PRIMARY CTA */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            {/* Clean Unboxed Kicker */}
            <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-[#1e3a15]">
              <span>Kasab Gallery</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span className="text-neutral-600 font-medium">
                {language === 'bn' ? '১০০% প্রাকৃতিক ও খাঁটি' : '100% Natural & Pure'}
              </span>
            </div>

            {/* Balanced Headline */}
            <h1 className="font-serif-brand text-2xl sm:text-3xl lg:text-[2.5rem] font-bold text-neutral-900 leading-[1.18] tracking-tight text-balance">
              {language === 'bn' ? (
                <>
                  প্রকৃতির নিখাদ বিশুদ্ধতা,{' '}
                  <span className="text-[#1e3a15] italic font-normal">সুস্থতায়</span> আপনার বিশ্বস্ত সঙ্গী।
                </>
              ) : (
                <>
                  Pure Organic Living,{' '}
                  <span className="text-[#1e3a15] italic font-normal">Curated</span> for Wellness.
                </>
              )}
            </h1>

            {/* Concise 1-line supporting caption */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-md">
              {language === 'bn'
                ? 'খাঁটি মধু, ঘানিভাঙা সরিষার তেল ও প্রাকৃতিক স্কিনকেয়ার—সারা দেশে ক্যাশ অন ডেলিভারি।'
                : 'Wild forest honey, cold-pressed oils, and natural skincare delivered nationwide.'}
            </p>

            {/* Focused Actions */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleExploreClick}
                className="px-5 py-2.5 rounded-full bg-[#1e3a15] hover:bg-[#152a0f] text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer inline-flex items-center gap-2 group active:scale-95"
              >
                <span>{language === 'bn' ? 'কালেকশন দেখুন' : 'Explore Catalog'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => openCheckoutDrawer(primaryProduct)}
                className="px-4 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 hover:border-[#1e3a15] font-semibold text-xs sm:text-sm transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#1e3a15]" />
                <span>{language === 'bn' ? 'কার্ট দেখুন' : 'View Cart'}</span>
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT COLUMN: COMPACT BENTO SHOWCASE */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-12 gap-2.5 sm:gap-3.5">

            {/* Bento Tile 1: Main Featured Spotlight */}
            <div
              onClick={() => handleTileAction(primaryProduct)}
              className="col-span-2 sm:col-span-7 group relative rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-end p-3.5 sm:p-4 h-[165px] sm:h-[290px]"
            >
              <img
                src={tile1Image}
                alt={tile1Title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              <div className="relative z-10 space-y-1 text-white">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#d4af37] block">
                  {tile1Badge}
                </span>
                <h3 className="font-serif-brand text-base sm:text-xl font-bold leading-snug line-clamp-1">
                  {tile1Title}
                </h3>
                <div className="pt-1 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm sm:text-base font-bold text-[#d4af37] tabular-nums">
                    {formatBDT(primaryProduct?.price || 1250)}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCheckoutDrawer(primaryProduct);
                    }}
                    className="px-3 py-1 rounded-full bg-white/95 text-neutral-900 text-[11px] font-bold hover:bg-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Stack on Tablet/Desktop, Side-by-side on Mobile */}
            <div className="col-span-2 sm:col-span-5 grid grid-cols-2 sm:grid-cols-1 gap-2.5 sm:gap-3.5">
              {/* Bento Tile 2 */}
              <div
                onClick={() => handleTileAction(secondary1Product)}
                className="group relative rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-end p-3 sm:p-3.5 h-[118px] sm:h-[138px]"
              >
                <img
                  src={tile2Image}
                  alt={tile2Title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-0.5 text-white">
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-[#d4af37] block truncate">
                    {tile2Badge}
                  </span>
                  <h4 className="font-serif-brand text-xs sm:text-sm font-bold leading-snug line-clamp-1">
                    {tile2Title}
                  </h4>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-mono text-xs font-bold text-[#d4af37] tabular-nums">
                      {formatBDT(secondary1Product?.price || 320)}
                    </span>
                    <span className="hidden sm:inline text-[11px] font-medium text-neutral-300 underline underline-offset-4 group-hover:text-white transition-colors">
                      {language === 'bn' ? 'বিস্তারিত' : 'View'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bento Tile 3 */}
              <div
                onClick={() => handleTileAction(secondary2Product)}
                className="group relative rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-end p-3 sm:p-3.5 h-[118px] sm:h-[138px]"
              >
                <img
                  src={tile3Image}
                  alt={tile3Title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                <div className="relative z-10 space-y-0.5 text-white">
                  <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-[#d4af37] block truncate">
                    {tile3Badge}
                  </span>
                  <h4 className="font-serif-brand text-xs sm:text-sm font-bold leading-snug line-clamp-1">
                    {tile3Title}
                  </h4>
                  <div className="flex items-center justify-between pt-0.5">
                    <span className="font-mono text-xs font-bold text-[#d4af37] tabular-nums">
                      {formatBDT(secondary2Product?.price || 750)}
                    </span>
                    <span className="hidden sm:inline text-[11px] font-medium text-neutral-300 underline underline-offset-4 group-hover:text-white transition-colors">
                      {language === 'bn' ? 'বিস্তারিত' : 'View'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

