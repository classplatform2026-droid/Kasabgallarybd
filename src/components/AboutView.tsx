import React, { useState } from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../data/mockData';
import { KasabLogo } from './KasabLogo';
import lifestyleImage from '../assets/images/hero_kasab_lifestyle_1791733349882.jpg';

export const AboutView: React.FC = () => {
  const { setCurrentPage, setSelectedCategoryId, language } = useShop();
  const [imageError, setImageError] = useState(false);

  const isBn = language === 'bn';

  const commitments = [
    {
      index: isBn ? '০১' : '01',
      title: isBn ? 'খাঁটি ও নির্ভেজাল উৎস' : 'Authentic Origin',
      description: isBn
        ? 'সরাসরি সুন্দরবনের মৌয়াল ও বিশ্বস্ত উৎস থেকে সংগৃহীত প্রাকৃতিক খাদ্য, আতর ও ভেষজ পণ্য—কোনো কৃত্রিম প্রিজারভেটিভ ছাড়া।'
        : 'Collected directly from traditional harvesters and verified producers with zero artificial preservatives.',
    },
    {
      index: isBn ? '০২' : '02',
      title: isBn ? 'একক ডেলিভারি চার্জ' : 'Single Delivery Fee',
      description: isBn
        ? `যত পণ্যই অর্ডার করুন না কেন, সারা দেশে একটি নির্দিষ্ট ডেলিভারি ফি—ঢাকায় ৳${BRAND_CONFIG.fixedDeliveryDhaka} ও ঢাকার বাইরে ৳${BRAND_CONFIG.fixedDeliveryOutside}।`
        : `Order as many items as you wish under one flat fee—Dhaka ৳${BRAND_CONFIG.fixedDeliveryDhaka} and Nationwide ৳${BRAND_CONFIG.fixedDeliveryOutside}.`,
    },
    {
      index: isBn ? '০৩' : '03',
      title: isBn ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery',
      description: isBn
        ? 'ডেলিভারির সময় পণ্য হাতে পেয়ে যাচাই করার পর নিশ্চিন্তে মূল্য পরিশোধের সুবিধা এবং দ্রুত সহায়তা।'
        : 'Inspect your parcel upon doorstep arrival and pay comfortably nationwide with responsive support.',
    },
  ];

  const handleExploreCatalog = () => {
    setSelectedCategoryId('all');
    setCurrentPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenContact = () => {
    setCurrentPage('contact');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10 sm:space-y-14">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500">
        <button
          type="button"
          onClick={() => setCurrentPage('home')}
          className="hover:text-[#2d5016] transition-colors cursor-pointer whitespace-nowrap shrink-0"
        >
          {isBn ? 'হোম' : 'Home'}
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
        <span className="text-neutral-900 font-medium">
          {isBn ? 'আমাদের সম্পর্কে' : 'About Us'}
        </span>
      </nav>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        <div className="lg:col-span-7 space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2d5016]">
            {BRAND_CONFIG.name}
          </p>

          <h1 className="font-serif-brand text-2xl sm:text-4xl font-bold text-neutral-900 leading-[1.2] tracking-tight">
            {isBn
              ? 'বিশুদ্ধতা ও আস্থার আরেক নাম Kasab Gallery'
              : 'Pure Living, Rooted in Honest Craft.'}
          </h1>

          <div className="space-y-4 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-xl">
            <p>
              {isBn
                ? 'বাজারের ভেজালের ভিড়ে প্রতিটি পরিবারে ১০০% খাঁটি প্রাকৃতিক খাবার, সুগন্ধি আতর এবং কেমিক্যালমুক্ত দৈনন্দিন পণ্য পৌঁছে দেওয়ার লক্ষ্য নিয়ে Kasab Gallery-র যাত্রা শুরু।'
                : 'Kasab Gallery was founded to bring uncompromised, lab-verified natural foods, non-alcoholic attars, and chemical-free essentials to everyday households.'}
            </p>
            <p>
              {isBn
                ? 'সুন্দরবনের বুনো মধু ও কাঠের ঘানিভাঙা তেল থেকে শুরু করে মদিনার আজওয়া খেজুর ও হালাল স্কিনকেয়ার—প্রতিটি পণ্যের উৎস যাচাই করে আমরা মানের বিষয়ে শতভাগ স্বচ্ছতা বজায় রাখি।'
                : 'From raw Sundarban honey and wooden-ghani oils to Madinah Ajwa dates and botanical skincare, every batch is sourced directly and checked for uncompromising purity.'}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleExploreCatalog}
              className="px-5 py-2.5 rounded-lg bg-[#2d5016] hover:bg-[#234010] text-white text-sm font-medium transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isBn ? 'পণ্যসমূহ দেখুন' : 'Explore Catalog'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleOpenContact}
              className="text-sm font-medium text-neutral-700 hover:text-[#2d5016] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {isBn ? 'যোগাযোগ করুন' : 'Contact Us'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center">
            {!imageError ? (
              <img
                src={lifestyleImage}
                alt={BRAND_CONFIG.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-2">
                <KasabLogo className="w-16 h-16" />
                <span className="font-serif-brand text-sm font-semibold text-neutral-800">
                  {BRAND_CONFIG.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-8 sm:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {commitments.map((item) => (
            <div key={item.index} className="space-y-2">
              <span className="text-xs font-medium text-neutral-400 tabular-nums">
                {item.index}
              </span>
              <h2 className="font-serif-brand text-base font-bold text-neutral-900">
                {item.title}
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200 pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-neutral-600">
        <div className="space-y-1">
          <p className="font-medium text-neutral-900">
            {isBn ? BRAND_CONFIG.banglaAddress : BRAND_CONFIG.address}
          </p>
          <p className="text-xs text-neutral-500">
            {isBn ? BRAND_CONFIG.hours : BRAND_CONFIG.hoursEn}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={`tel:${BRAND_CONFIG.phone}`}
            className="font-medium text-neutral-900 hover:text-[#2d5016] transition-colors tabular-nums whitespace-nowrap shrink-0"
          >
            {BRAND_CONFIG.displayPhone}
          </a>
          <a
            href={BRAND_CONFIG.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#2d5016] hover:underline whitespace-nowrap shrink-0"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:${BRAND_CONFIG.email}`}
            className="text-neutral-600 hover:text-neutral-900 transition-colors whitespace-nowrap shrink-0"
          >
            {BRAND_CONFIG.email}
          </a>
        </div>
      </section>
    </div>
  );
};
