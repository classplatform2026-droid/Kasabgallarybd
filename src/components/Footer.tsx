import React from 'react';
import { useShop } from '../context/ShopContext';
import { BRAND_CONFIG } from '../data/mockData';
import { KasabLogo } from './KasabLogo';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentPage, setSelectedCategoryId, language, currentUser } = useShop();

  const handleNav = (page: any, catId?: string) => {
    if (catId) setSelectedCategoryId(catId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111611] text-neutral-400 border-t border-neutral-800/60 pt-12 pb-8 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Main Clean Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-3.5">
            <div 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-2.5 cursor-pointer inline-flex group"
            >
              <KasabLogo className="w-8 h-8 shrink-0 rounded-lg group-hover:opacity-90 transition-opacity" />
              <div>
                <span className="font-serif-brand text-lg font-bold text-white tracking-tight">
                  Kasab Gallery
                </span>
                <span className="block text-[10px] text-[#d4af37] font-medium tracking-wide">
                  {language === 'bn' ? BRAND_CONFIG.tagline : BRAND_CONFIG.taglineEn}
                </span>
              </div>
            </div>

            <p className="text-neutral-400 text-[11px] leading-relaxed max-w-sm">
              {language === 'bn'
                ? 'খাঁটি সুন্দরবনের মধু, পুষ্টিকর আজওয়া খেজুর ও প্রাকৃতিক বিশুদ্ধ লাইফস্টাইল পণ্য পৌঁছে দিচ্ছি এক সিঙ্গেল ডেলিভারি সুবিধায়।'
                : 'Pure wild honey, premium dates, and natural lifestyle essentials delivered across Bangladesh with unified single shipping.'}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={BRAND_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 text-[11px] font-medium hover:bg-emerald-900/60 transition-colors"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp</span>
              </a>
              <a
                href={BRAND_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 text-blue-400 border border-blue-800/40 text-[11px] font-medium hover:bg-blue-900/60 transition-colors"
              >
                <span>Facebook</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {/* Minimal Quick Links (7 cols) */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Column 1: Explore */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest block">
                {language === 'bn' ? 'এক্সপ্লোর' : 'Explore'}
              </span>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button
                    onClick={() => handleNav('home')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'হোম' : 'Home'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('catalog', 'all')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'সকল পণ্য' : 'All Products'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('blog')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'জার্নাল ও ব্লগ' : 'Journal'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('about')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'আমাদের গল্প' : 'About Us'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Categories */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest block">
                {language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}
              </span>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <button
                    onClick={() => handleNav('catalog', 'food')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'খাদ্য ও পুষ্টি' : 'Food & Honey'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('catalog', 'skincare')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'প্রাকৃতিক স্কিনকেয়ার' : 'Skincare'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('catalog', 'islamic')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'ইসলামিক আইটেমস' : 'Islamic Items'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('catalog', 'winter')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'উইন্টার কালেকশন' : 'Winter'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Help */}
            <div className="space-y-2.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest block">
                {language === 'bn' ? 'সহায়তা' : 'Support'}
              </span>
              <ul className="space-y-2 text-[11px]">
                <li>
                  <a href={`tel:${BRAND_CONFIG.phone}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#d4af37]" />
                    <span>{BRAND_CONFIG.phone}</span>
                  </a>
                </li>
                <li>
                  <a href={`mailto:${BRAND_CONFIG.email}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-neutral-400" />
                    <span className="truncate">{BRAND_CONFIG.email}</span>
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('orders')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNav('contact')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'যোগাযোগ পেইজ' : 'Contact Support'}
                  </button>
                </li>
                {currentUser?.role === 'admin' && (
                  <li>
                    <button
                      onClick={() => handleNav('admin')}
                      className="text-[#d4af37] hover:underline font-semibold cursor-pointer"
                    >
                      {language === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Panel'}
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="pt-6 border-t border-neutral-800/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span>ক্যাশ অন ডেলিভারি</span>
            <span>•</span>
            <span>বিকাশ</span>
            <span>•</span>
            <span>নগদ</span>
          </div>

          <p className="text-center sm:text-right">
            © {new Date().getFullYear()} Kasab Gallery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

