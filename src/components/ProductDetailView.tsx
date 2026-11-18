import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../data/mockData';
import { formatBDT } from '../utils/formatters';
import { ProductCard } from './ProductCard';
import { 
  ShoppingBag, 
  MessageCircle, 
  Phone, 
  Star, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Share2, 
  Check, 
  Sparkles,
  RotateCcw,
  Maximize2,
  X,
  Plus,
  Minus,
  CheckCircle2,
  ChevronRight,
  Clock,
  Zap,
  Tag
} from 'lucide-react';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProduct,
    products,
    categories,
    addToCart,
    openCheckoutDrawer,
    setCurrentPage,
    setSelectedCategoryId,
    language,
    generateWhatsAppOrderUrl,
    showToast,
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'benefits' | 'delivery'>('details');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-neutral-100 text-neutral-400 flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="font-serif-brand text-xl font-bold text-neutral-900 mb-2">
          {language === 'bn' ? 'কোনো পণ্য নির্বাচিত করা হয়নি' : 'No Product Selected'}
        </h2>
        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          {language === 'bn' 
            ? 'Kasab Gallery-র সকল খাঁটি ও প্রাকৃতিক পণ্যের সম্ভার দেখতে ক্যাটালগে প্রবেশ করুন।' 
            : 'Explore all our pure organic and modest lifestyle products in the catalog.'}
        </p>
        <button
          onClick={() => {
            setCurrentPage('catalog');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-6 py-3 rounded-2xl bg-[#2d5016] text-[#d4af37] text-xs font-bold shadow-md hover:bg-[#234011] transition-all cursor-pointer"
        >
          {language === 'bn' ? 'সকল পণ্য দেখুন' : 'Browse Catalog'}
        </button>
      </div>
    );
  }

  const galleryImages = selectedProduct.images && selectedProduct.images.length > 0
    ? selectedProduct.images
    : [selectedProduct.image];

  const currentImage = galleryImages[selectedImageIndex] || selectedProduct.image;
  const currentCategory = categories.find((c) => c._id === selectedProduct.category);
  const isInStock = selectedProduct.available !== false && (selectedProduct.stock === undefined || selectedProduct.stock > 0);
  const discountAmount = selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price
    ? selectedProduct.originalPrice - selectedProduct.price
    : 0;
  const discountPercent = selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price
    ? Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)
    : 0;

  // Actions
  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
  };

  const handleInstantBuy = () => {
    addToCart(selectedProduct, quantity);
    if (typeof openCheckoutDrawer === 'function') {
      openCheckoutDrawer(selectedProduct);
    } else {
      setCurrentPage('checkout');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleWhatsAppOrder = () => {
    const url = generateWhatsAppOrderUrl([], undefined, selectedProduct);
    window.open(url, '_blank');
  };

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        showToast(language === 'bn' ? 'প্রোডাক্ট লিংক কপি হয়েছে' : 'Product link copied');
        setTimeout(() => setCopiedLink(false), 2500);
      }
    } catch {
      showToast(language === 'bn' ? 'লিংক কপি করা যায়নি' : 'Failed to copy link');
    }
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === selectedProduct.category && p._id !== selectedProduct._id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf9f5] pb-24 sm:pb-16 selection:bg-[#2d5016] selection:text-white">
      
      {/* 1. Sleek Minimal Breadcrumb & Back Bar */}
      <div className="border-b border-neutral-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-neutral-500 overflow-hidden text-ellipsis whitespace-nowrap">
            <button
              onClick={() => {
                setCurrentPage('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:text-[#2d5016] flex items-center gap-1 font-semibold transition-colors cursor-pointer shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ক্যাটালগ' : 'Catalog'}</span>
            </button>
            <span className="text-neutral-300">/</span>
            {currentCategory && (
              <>
                <button
                  onClick={() => {
                    setSelectedCategoryId(currentCategory._id);
                    setCurrentPage('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[#2d5016] font-medium transition-colors cursor-pointer truncate max-w-[120px] sm:max-w-none"
                >
                  {language === 'bn' ? currentCategory.banglaName : currentCategory.name}
                </button>
                <span className="text-neutral-300">/</span>
              </>
            )}
            <span className="text-neutral-800 font-bold truncate max-w-[140px] sm:max-w-[240px]">
              {language === 'bn' ? selectedProduct.banglaName : selectedProduct.name}
            </span>
          </div>

          {/* Quick Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700 text-xs font-semibold shadow-2xs hover:bg-neutral-50 transition-all cursor-pointer shrink-0"
            title="লিংক কপি করুন"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">{language === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-neutral-500" />
                <span>{language === 'bn' ? 'শেয়ার' : 'Share'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-12 sm:space-y-16">
        
        {/* 2. Main Product Showcase (Clean 2-Column Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
          
          {/* ================= LEFT: Minimalist Gallery ================= */}
          <div className="lg:col-span-6 space-y-3.5 lg:sticky lg:top-20">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] sm:aspect-square w-full rounded-3xl overflow-hidden bg-white border border-neutral-200/80 shadow-xs group">
              <img
                src={currentImage}
                alt={selectedProduct.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 ease-out"
              />

              {/* Badges on Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                {selectedProduct.sunnah_certified && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d5016]/90 backdrop-blur-md text-white text-[11px] font-bold shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{language === 'bn' ? '১০০% খাঁটি ও নির্ভেজাল' : '100% Pure Certified'}</span>
                  </span>
                )}
                {selectedProduct.badge && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#d4af37] text-neutral-900 text-[11px] font-extrabold shadow-xs">
                    <Tag className="w-3 h-3 text-neutral-900" />
                    <span>{selectedProduct.badge}</span>
                  </span>
                )}
              </div>

              {/* Stock Status Pill */}
              <div className="absolute top-4 right-4 z-10">
                {isInStock ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{language === 'bn' ? 'ইন স্টক' : 'In Stock'}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold shadow-2xs">
                    <span>{language === 'bn' ? 'স্টক শেষ' : 'Out of Stock'}</span>
                  </span>
                )}
              </div>

              {/* Zoom Lightbox Trigger */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="absolute bottom-4 right-4 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md hover:bg-white text-neutral-700 hover:text-neutral-900 shadow-md transition-all active:scale-95 cursor-pointer opacity-90 hover:opacity-100"
                title="বড় করে দেখুন"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Row (Only if multiple images) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 bg-white ${
                      selectedImageIndex === idx
                        ? 'border-[#2d5016] ring-2 ring-[#2d5016]/20 shadow-xs'
                        : 'border-neutral-200/80 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT: Minimalist Purchase Hub ================= */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-7">
            
            {/* Header & Title Section */}
            <div className="space-y-2 pb-5 border-b border-neutral-200/70">
              {/* Category & Star Rating in 1 Minimal Line */}
              <div className="flex items-center justify-between text-xs">
                {currentCategory ? (
                  <button
                    onClick={() => {
                      setSelectedCategoryId(currentCategory._id);
                      setCurrentPage('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="font-bold text-[#2d5016] hover:underline uppercase tracking-wider text-[11px]"
                  >
                    {language === 'bn' ? currentCategory.banglaName : currentCategory.name}
                  </button>
                ) : (
                  <span className="text-neutral-400 font-medium">Kasab Gallery Collection</span>
                )}

                <div className="flex items-center gap-1.5 text-neutral-500">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-bold text-neutral-900">{selectedProduct.rating || 4.9}</span>
                  <span className="text-neutral-400">({selectedProduct.reviews_count || 120} {language === 'bn' ? 'রিভিউ' : 'reviews'})</span>
                </div>
              </div>

              {/* Prominent Bangla Title */}
              <h1 className="font-serif-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 leading-tight tracking-tight">
                {language === 'bn' ? selectedProduct.banglaName : selectedProduct.name}
              </h1>

              {/* Subtitle in English (clean and quiet) */}
              <p className="text-xs sm:text-sm text-neutral-400 font-medium font-sans">
                {language === 'bn' ? selectedProduct.name : selectedProduct.banglaName}
              </p>
            </div>

            {/* Price Presentation */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-black text-[#2d5016] tracking-tight">
                  {formatBDT(selectedProduct.price)}
                </span>
                
                {selectedProduct.originalPrice && selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-base sm:text-lg text-neutral-400 line-through font-normal">
                    {formatBDT(selectedProduct.originalPrice)}
                  </span>
                )}

                {discountAmount > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-bold">
                    {language === 'bn' ? `৳${discountAmount} ছাড় (${discountPercent}% সাশ্রয়)` : `Save ৳${discountAmount} (${discountPercent}% OFF)`}
                  </span>
                )}
              </div>

              {/* Delivery charge micro notice */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                <Truck className="w-3.5 h-3.5 text-[#2d5016]" />
                <span>
                  {language === 'bn' 
                    ? `সারা দেশে ক্যাশ অন ডেলিভারি (ঢাকা ৳${BRAND_CONFIG.fixedDeliveryDhaka}, বাইরে ৳${BRAND_CONFIG.fixedDeliveryOutside})` 
                    : `Cash on Delivery available nationwide`}
                </span>
              </div>
            </div>

            {/* Short Excerpt / Summary */}
            <div className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-sans">
              <p>
                {selectedProduct.shortDescription || (language === 'bn' ? selectedProduct.banglaDescription : selectedProduct.description)}
              </p>
            </div>

            {/* Purity & Sourcing Bullet Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700 pt-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2d5016] shrink-0" />
                <span>১০০% প্রাকৃতিক ও খাঁটি উৎস</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2d5016] shrink-0" />
                <span>ল্যাব-টেস্টেড গুণগত মান</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2d5016] shrink-0" />
                <span>পণ্য হাতে পেয়ে মূল্য পরিশোধ</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2d5016] shrink-0" />
                <span>১ অর্ডারে একাধিক পণ্যে সিঙ্গেল চার্জ</span>
              </div>
            </div>

            {/* Quantity Stepper & Instant Purchase Actions */}
            <div className="space-y-3 pt-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-700">
                    {language === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
                  </span>
                  
                  {/* Stepper */}
                  <div className="inline-flex items-center border border-neutral-300 rounded-2xl bg-white p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed font-bold cursor-pointer transition-colors"
                      title="পরিমাণ কমান"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-9 text-center font-bold text-xs sm:text-sm text-neutral-900 select-none">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-neutral-600 hover:bg-neutral-100 font-bold cursor-pointer transition-colors"
                      title="পরিমাণ বাড়ান"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal Display */}
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 block">{language === 'bn' ? 'সাবটোটাল' : 'Subtotal'}</span>
                  <span className="text-sm font-bold text-neutral-900">
                    {formatBDT(selectedProduct.price * quantity)}
                  </span>
                </div>
              </div>

              {/* Main Action Buttons Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* 1. Instant Buy / Order Now (Primary) */}
                <button
                  type="button"
                  id="detail-instant-buy-btn"
                  onClick={handleInstantBuy}
                  disabled={!isInStock}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#2d5016] hover:bg-[#234011] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-98 group"
                >
                  <Zap className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                  <span>{language === 'bn' ? 'অর্ডার করুন (Cash on Delivery)' : 'Buy Now (Cash on Delivery)'}</span>
                </button>

                {/* 2. Add to Cart (Secondary) */}
                <button
                  type="button"
                  id="detail-add-to-cart-btn"
                  onClick={handleAddToCart}
                  disabled={!isInStock}
                  className="w-full py-3.5 px-5 rounded-2xl border-2 border-[#2d5016] text-[#2d5016] hover:bg-[#2d5016] hover:text-white disabled:border-neutral-300 disabled:text-neutral-400 disabled:cursor-not-allowed font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Quick WhatsApp & Call Direct Contacts */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার' : 'WhatsApp Order'}</span>
                </button>

                <a
                  href={`tel:${BRAND_CONFIG.phone}`}
                  className="py-2.5 px-3 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#2d5016]" />
                  <span>{BRAND_CONFIG.displayPhone}</span>
                </a>
              </div>
            </div>

            {/* 3-Pillar Minimal Trust Strip */}
            <div className="pt-4 border-t border-neutral-200/70 grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-2xl bg-white border border-neutral-200/60">
                <Truck className="w-4 h-4 text-[#2d5016] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-neutral-800 block">ক্যাশ অন ডেলিভারি</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">পণ্য পেয়ে মূল্য দিন</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-neutral-200/60">
                <ShieldCheck className="w-4 h-4 text-[#2d5016] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-neutral-800 block">১০০% খাঁটি পণ্য</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">ন্যাচারাল গ্যারান্টি</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-neutral-200/60">
                <RotateCcw className="w-4 h-4 text-[#2d5016] mx-auto mb-1" />
                <span className="text-[11px] font-bold text-neutral-800 block">সহজ রিটার্ন</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">নির্ভেজাল সেবা</span>
              </div>
            </div>

          </div>
        </div>

        {/* 3. Minimalist Product Details Tabs Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-xs space-y-6">
          {/* Underline Tabs Header */}
          <div className="flex items-center gap-6 sm:gap-8 border-b border-neutral-200 text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'details'
                  ? 'border-[#2d5016] text-[#2d5016]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Product Details'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('benefits')}
              className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'benefits'
                  ? 'border-[#2d5016] text-[#2d5016]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'বিশুদ্ধতা ও উপকারিতা' : 'Purity & Benefits'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('delivery')}
              className={`pb-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'delivery'
                  ? 'border-[#2d5016] text-[#2d5016]'
                  : 'border-transparent text-neutral-400 hover:text-neutral-700'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ডেলিভারি ও পলিসি' : 'Shipping & Returns'}</span>
            </button>
          </div>

          {/* Tab 1: Detailed Overview */}
          {activeTab === 'details' && (
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4 max-w-3xl whitespace-pre-line animate-in fade-in duration-200">
              <p>
                {selectedProduct.longDescription || selectedProduct.banglaDescription || selectedProduct.description}
              </p>
              
              {selectedProduct.description && selectedProduct.description !== selectedProduct.banglaDescription && (
                <div className="pt-4 border-t border-neutral-100 text-neutral-500 font-sans text-xs">
                  <span className="block font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    English Overview
                  </span>
                  <p>{selectedProduct.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Benefits & Usage */}
          {activeTab === 'benefits' && (
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4 max-w-3xl animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-[#faf9f5] border border-neutral-200/80 space-y-2">
                <h4 className="font-bold text-sm text-[#2d5016] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                  <span>কেন Kasab Gallery-র পণ্য অনন্য?</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-neutral-600 list-disc list-inside">
                  <li>সরাসরি প্রকৃতি ও আদি উৎস থেকে সংগৃহীত, কোনো কৃত্রিম কেমিক্যাল নেই।</li>
                  <li>প্রতিটি ব্যাচ সর্বোচ্চ স্বাস্থ্যবিধি মেনে হাইজিনিক পরিবেশে প্যাকেজিং করা হয়।</li>
                  <li>সুন্নাহ সম্মত ও হালাল প্রাকৃতিক জীবনযাত্রার উপযোগী।</li>
                </ul>
              </div>

              <p className="text-xs text-neutral-600">
                Kasab Gallery প্রতিটি পণ্যের বিশুদ্ধতার নিশ্চয়তা দেয়। ব্যবহারের নিয়মাবলী বা যেকোনো স্বাস্থ্য ও পুষ্টি পরামর্শের জন্য আমাদের অফিসিয়াল সাপোর্ট নম্বরে যোগাযোগ করতে পারেন।
              </p>
            </div>
          )}

          {/* Tab 3: Delivery & Returns */}
          {activeTab === 'delivery' && (
            <div className="text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4 max-w-3xl animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#faf9f5] border border-neutral-200/80 space-y-1">
                  <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#2d5016]" />
                    <span>ডেলিভারি চার্জ ও সময়</span>
                  </h4>
                  <p className="text-xs text-neutral-600">
                    • ঢাকা সিটির ভেতরে: ৳{BRAND_CONFIG.fixedDeliveryDhaka} (২৪ থেকে ৪৮ ঘণ্টা)<br />
                    • ঢাকা সিটির বাইরে সারা বাংলাদেশ: ৳{BRAND_CONFIG.fixedDeliveryOutside} (২ থেকে ৩ কর্মদিবস)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#faf9f5] border border-neutral-200/80 space-y-1">
                  <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-[#2d5016]" />
                    <span>রিটার্ন ও রিপ্লেসমেন্ট পলিসি</span>
                  </h4>
                  <p className="text-xs text-neutral-600">
                    ডেলিভারি ম্যানের উপস্থিতিতে পণ্য দেখে রিসিভ করুন। পণ্য ক্ষতিগ্রস্ত বা অসম্পূর্ণ হলে সঙ্গে সঙ্গে ফেরত দেওয়ার সুবিধা রয়েছে।
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 4. Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200/70">
              <div>
                <h3 className="font-serif-brand text-xl sm:text-2xl font-bold text-neutral-900">
                  {language === 'bn' ? 'একই ক্যাটাগরির অন্যান্য পণ্য' : 'Related Products in Category'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {currentCategory ? (language === 'bn' ? currentCategory.banglaName : currentCategory.name) : 'Kasab Gallery Special'}
                </p>
              </div>

              {currentCategory && (
                <button
                  onClick={() => {
                    setSelectedCategoryId(currentCategory._id);
                    setCurrentPage('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-xs font-bold text-[#2d5016] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{language === 'bn' ? 'সবগুলো দেখুন' : 'View All'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 5. Mobile Fixed Bottom Buy Bar (Frictionless Mobile Checkout) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-neutral-200/90 px-4 py-3 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <span className="text-[11px] text-neutral-500 block truncate font-medium">
              {selectedProduct.banglaName}
            </span>
            <span className="text-base font-black text-[#2d5016]">
              {formatBDT(selectedProduct.price * quantity)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock}
              className="p-3 rounded-xl border border-[#2d5016] text-[#2d5016] hover:bg-[#2d5016]/10 cursor-pointer active:scale-95"
              title="কার্টে যোগ করুন"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleInstantBuy}
              disabled={!isInStock}
              className="px-4 py-3 rounded-xl bg-[#2d5016] hover:bg-[#234011] disabled:bg-neutral-300 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
              <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6. Image Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-3xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={currentImage}
              alt={selectedProduct.name}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
