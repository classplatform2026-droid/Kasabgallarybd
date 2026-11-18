import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../data/mockData';
import { ProductCard } from './ProductCard';
import { ModernHeroBento } from './ModernHeroBento';
import { CategoryId } from '../types';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Star, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight,
  Quote
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const {
    products,
    categories,
    testimonials,
    setCurrentPage,
    setSelectedCategoryId,
    language,
  } = useShop();

  // Featured & Popular Products
  const featuredProducts = products.length > 0 ? products.slice(0, 8) : [];

  // Testimonials Carousel State & Auto-Slide Logic
  const testimonialScrollRef = useRef<HTMLDivElement>(null);
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [isTestimonialsPaused, setIsTestimonialsPaused] = useState(false);

  const scrollToIndex = useCallback((index: number) => {
    if (testimonialScrollRef.current && testimonials.length > 0) {
      const container = testimonialScrollRef.current;
      const cardWidth = container.clientWidth >= 768 ? 400 : container.clientWidth * 0.85;
      const targetScroll = index * (cardWidth + 16);
      container.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
      setActiveReviewIndex(index);
    }
  }, [testimonials.length]);

  const handleNextReview = useCallback(() => {
    const nextIdx = (activeReviewIndex + 1) % (testimonials.length || 1);
    scrollToIndex(nextIdx);
  }, [activeReviewIndex, testimonials.length, scrollToIndex]);

  const handlePrevReview = useCallback(() => {
    const prevIdx = (activeReviewIndex - 1 + (testimonials.length || 1)) % (testimonials.length || 1);
    scrollToIndex(prevIdx);
  }, [activeReviewIndex, testimonials.length, scrollToIndex]);

  // Auto-slide testimonials every 4.5 seconds when not hovered
  useEffect(() => {
    if (isTestimonialsPaused || testimonials.length <= 1) return;
    const interval = setInterval(() => {
      handleNextReview();
    }, 4500);
    return () => clearInterval(interval);
  }, [isTestimonialsPaused, handleNextReview, testimonials.length]);

  return (
    <div className="space-y-8 sm:space-y-14 pb-12">
      
      {/* 1. DYNAMIC SPLIT HERO WITH BENTO GRID */}
      <section className="relative">
        <ModernHeroBento />
      </section>

      {/* 2. CATEGORY QUICK-NAV WITH IMAGES (Embedded below hero per user request) */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar sm:grid sm:grid-cols-5 sm:gap-4">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat._id).length;
            return (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategoryId(cat._id);
                  setCurrentPage('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group shrink-0 flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white border border-neutral-200/80 hover:border-[#1e3a15] hover:bg-[#faf8f5] shadow-2xs hover:shadow-sm transition-all duration-200 cursor-pointer text-left min-w-[210px] sm:min-w-0"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200/60 group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-neutral-900 text-xs sm:text-sm group-hover:text-[#1e3a15] transition-colors truncate">
                    {language === 'bn' ? cat.banglaName : cat.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    {count} {language === 'bn' ? 'টি পণ্য' : 'Items'}
                  </p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#1e3a15] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS: জনপ্রিয় ও নির্বাচিত পণ্যসমূহ */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3.5 border-b border-neutral-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1e3a15]">
              <span>FEATURED COLLECTION</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'bn' ? '১০০% খাঁটি ও সেরা কালেকশন' : '100% Pure & Curated'}</span>
            </div>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              {language === 'bn' ? 'জনপ্রিয় ও নির্বাচিত পণ্যসমূহ' : 'Popular & Featured Products'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl">
              {language === 'bn'
                ? 'সুন্দরবনের খাঁটি মধু, ঘানিভাঙা খাঁটি তেল, ভেষজ স্কিনকেয়ার ও আমাদের সর্বাধিক সমাদৃত অর্গানিক পণ্য।'
                : 'Raw forest honey, virgin cold-pressed oils, organic skincare, and curated artisanal essentials.'}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategoryId('all');
              setCurrentPage('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs sm:text-sm font-bold text-[#1e3a15] hover:text-neutral-900 flex items-center gap-1.5 group cursor-pointer shrink-0 pb-1"
          >
            <span>{language === 'bn' ? 'সকল পণ্য দেখুন' : 'View All Products'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* View full catalog button */}
        <div className="pt-4 text-center">
          <button
            id="view-all-products-btn"
            onClick={() => {
              setSelectedCategoryId('all');
              setCurrentPage('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-neutral-900 hover:bg-[#1e3a15] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <span>{language === 'bn' ? 'সম্পূর্ণ ক্যাটালগ ব্রাউজ করুন' : 'Browse Full Catalog'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 5. WHY CHOOSE KASAB GALLERY (FLEX CARDS LAYOUT, NO 'সরাসরি সহায়তা ও অর্ডার' CARD) */}
      <section className="bg-white py-12 sm:py-16 border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-[#1e3a15] uppercase">
              <span>PROMISE OF PURITY</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'bn' ? 'আমাদের অঙ্গীকার' : 'Our Guarantee'}</span>
            </div>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-neutral-900 mt-2">
              {language === 'bn' ? 'কেন Kasab Gallery বিশ্বস্ত?' : 'Why Kasab Gallery Stands Apart'}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              {language === 'bn'
                ? 'শতভাগ খাঁটি, পরীক্ষিত ও প্রাকৃতিক উপাদান প্রতিটি ঘরে পৌঁছে দিতে আমরা দায়বদ্ধ।'
                : 'Uncompromised provenance, honest extraction, and direct personal customer service across Bangladesh.'}
            </p>
          </div>

          {/* Cards using FLEX layout */}
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 sm:gap-6">
            
            {/* Card 1: Flat Single Delivery Charge */}
            <div className="flex-1 flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-[#faf8f5] border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#1e3a15]/10 text-[#1e3a15] flex items-center justify-center font-bold shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                  {language === 'bn' ? 'সিঙ্গেল ডেলিভারি চার্জ' : 'Single Delivery Charge'}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === 'bn'
                    ? 'কার্টে যত খুশি পণ্য যোগ করুন, ডেলিভারি চার্জ ১টিই। কোনো বাড়তি হিডেন খরচ নেই।'
                    : 'Add any number of items across any category. Flat single delivery fee nationwide.'}
                </p>
              </div>
            </div>

            {/* Card 2: 100% Pure & Lab-Tested */}
            <div className="flex-1 flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-[#faf8f5] border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#1e3a15]/10 text-[#1e3a15] flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                  {language === 'bn' ? '১০০% খাঁটি ও নির্ভেজাল' : '100% Pure & Unadulterated'}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === 'bn'
                    ? 'কোনো ক্ষতিকর কেমিক্যাল, কৃত্রিম রঙ বা প্রিজারভেটিভ নেই। প্রাকৃতিক ও ল্যাব-পরীক্ষিত।'
                    : 'Pure, chemical-free, lab-tested natural ingredients direct from ethical farms.'}
                </p>
              </div>
            </div>

            {/* Card 3: 10,000+ Happy Customers */}
            <div className="flex-1 flex items-start gap-4 p-5 sm:p-6 rounded-2xl bg-[#faf8f5] border border-neutral-200/80 shadow-2xs hover:shadow-xs transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-[#1e3a15]/10 text-[#1e3a15] flex items-center justify-center font-bold shrink-0">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <h3 className="font-bold text-neutral-900 text-sm sm:text-base">
                  {language === 'bn' ? '১০,০০০+ সন্তুষ্ট গ্রাহক' : '10,000+ Happy Customers'}
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {language === 'bn'
                    ? 'সারা দেশজুড়ে বিশ্বস্ত গ্রাহক ও শতভাগ পজিটিভ ৫-স্টার রিভিউ রেটিং।'
                    : 'Consistently rated 5 stars for freshness, authentic taste, and reliable packaging.'}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. VERIFIED CUSTOMER TESTIMONIALS (AUTO-SLIDEABLE & INTERACTIVE CAROUSEL) */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        
        {/* Section Header with Slider Navigation */}
        <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8 pb-3 border-b border-neutral-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#1e3a15]">
              <span>VERIFIED REVIEWS</span>
              <span aria-hidden="true">·</span>
              <span>{language === 'bn' ? 'গ্রাহকদের রিভিউ' : 'Customer Experiences'}</span>
            </div>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-neutral-900 mt-1">
              {language === 'bn' ? 'গ্রাহকদের সন্তুষ্টির অভিজ্ঞতা' : 'Real Customer Feedback'}
            </h2>
          </div>

          {/* Slider Prev & Next Controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrevReview}
              className="p-2.5 rounded-full border border-neutral-200 hover:border-[#1e3a15] bg-white hover:bg-[#faf8f5] text-neutral-700 hover:text-[#1e3a15] transition-colors shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Previous customer testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNextReview}
              className="p-2.5 rounded-full border border-neutral-200 hover:border-[#1e3a15] bg-white hover:bg-[#faf8f5] text-neutral-700 hover:text-[#1e3a15] transition-colors shadow-2xs active:scale-95 cursor-pointer"
              aria-label="Next customer testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slideable Testimonials Track */}
        <div 
          ref={testimonialScrollRef}
          onMouseEnter={() => setIsTestimonialsPaused(true)}
          onMouseLeave={() => setIsTestimonialsPaused(false)}
          onTouchStart={() => setIsTestimonialsPaused(true)}
          onTouchEnd={() => setIsTestimonialsPaused(false)}
          className="flex gap-4 sm:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 pt-1 no-scrollbar -mx-3.5 px-3.5 sm:mx-0 sm:px-0"
        >
          {testimonials.map((t, idx) => (
            <div
              key={t.id}
              className={`w-[85vw] sm:w-[360px] md:w-[400px] shrink-0 snap-start bg-white p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                activeReviewIndex === idx 
                  ? 'border-[#1e3a15]/40 shadow-md ring-1 ring-[#1e3a15]/20' 
                  : 'border-neutral-200/80 shadow-2xs hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {[...Array(Math.max(1, Math.min(5, t.rating || 5)))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">{t.date}</span>
                </div>

                <div className="relative mb-4">
                  <Quote className="w-6 h-6 text-[#1e3a15]/15 absolute -top-2 -left-1 pointer-events-none" />
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed italic pl-5">
                    "{language === 'bn' ? (t.banglaComment || t.comment) : (t.comment || t.banglaComment)}"
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-neutral-900">{t.author}</h4>
                  <p className="text-[11px] text-neutral-400">{t.city}</p>
                </div>
                {t.verifiedBuyer !== false && (
                  <span className="text-[10px] font-bold text-[#1e3a15] bg-[#1e3a15]/10 px-2.5 py-1 rounded-md">
                    {language === 'bn' ? '✓ ভেরিফাইড ক্রেতা' : '✓ Verified Buyer'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Pagination Dots */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToIndex(idx)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                activeReviewIndex === idx
                  ? 'w-6 bg-[#1e3a15]'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </section>

    </div>
  );
};
