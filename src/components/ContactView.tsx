import React, { useState } from 'react';
import { BRAND_CONFIG } from '../data/mockData';
import { useShop } from '../context/ShopContext';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Truck
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const { language, showToast, setCurrentPage } = useShop();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState<'general' | 'product' | 'order' | 'wholesale'>('general');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) {
      showToast(language === 'bn' ? 'অনুগ্রহ করে সকল আবশ্যকীয় তথ্য দিন' : 'Please fill all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      showToast(language === 'bn' ? 'আপনার বার্তা সফলভাবে গৃহীত হয়েছে!' : 'Your message has been received!');
    }, 400);
  };

  const subjectOptions = [
    { id: 'general', labelBn: 'সাধারণ অনুসন্ধান', labelEn: 'General Inquiry' },
    { id: 'product', labelBn: 'পণ্য সম্পর্কিত তথ্য', labelEn: 'Product Details' },
    { id: 'order', labelBn: 'অর্ডার ও ডেলিভারি', labelEn: 'Order & Delivery' },
    { id: 'wholesale', labelBn: 'পাইকারি বা করপোরেট', labelEn: 'Wholesale / Corporate' },
  ] as const;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500">
        <button 
          onClick={() => setCurrentPage('home')}
          className="hover:text-[#2d5016] transition-colors cursor-pointer font-medium"
        >
          {language === 'bn' ? 'হোম' : 'Home'}
        </button>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
        <span className="text-neutral-900 font-semibold">
          {language === 'bn' ? 'যোগাযোগ' : 'Contact Us'}
        </span>
      </nav>

      {/* Minimal Header */}
      <div className="border-b border-neutral-200/80 pb-6 space-y-1.5">
        <h1 className="font-serif-brand text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-900 tracking-tight">
          {language === 'bn' ? 'যোগাযোগ ও সহায়তা' : 'Get in Touch'}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
          {language === 'bn'
            ? 'পণ্য যাচাই, ডেলিভারি স্ট্যাটাস বা যেকোনো বিশেষ প্রয়োজনে আমাদের সাথে সরাসরি যোগাযোগ করুন।'
            : 'For product inquiries, order updates, or custom requests, our team is always ready to assist.'}
        </p>
      </div>

      {/* Main 2-Column Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Minimal Contact Channels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-50/70 rounded-2xl border border-neutral-200/80 p-5 sm:p-6 space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2d5016]">
                {language === 'bn' ? 'সরাসরি যোগাযোগ' : 'Direct Channels'}
              </span>
              <h2 className="font-serif-brand text-lg font-bold text-neutral-900 mt-0.5">
                Kasab Gallery
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                {language === 'bn' ? BRAND_CONFIG.banglaAddress : BRAND_CONFIG.address}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-neutral-200/60 text-xs">
              {/* Phone */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0 text-[#2d5016]">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-neutral-400 block">{language === 'bn' ? 'হটলাইন কল' : 'Customer Hotline'}</span>
                  <a 
                    href={`tel:${BRAND_CONFIG.phone}`} 
                    className="font-bold text-sm text-neutral-900 hover:text-[#2d5016] transition-colors"
                  >
                    {BRAND_CONFIG.displayPhone}
                  </a>
                  <span className="text-[10px] text-neutral-500 block">{language === 'bn' ? 'সরাসরি কথা বলুন' : 'Available 24/7'}</span>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0 text-emerald-600">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-neutral-400 block">{language === 'bn' ? 'হোয়াটসঅ্যাপ চ্যাট' : 'WhatsApp Support'}</span>
                  <a
                    href={BRAND_CONFIG.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-sm text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    <span>{language === 'bn' ? 'চ্যাট শুরু করুন' : 'Chat on WhatsApp'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-[10px] text-neutral-500 block">{language === 'bn' ? 'তাৎক্ষণিক অর্ডার ও তথ্য' : 'Instant responses'}</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0 text-neutral-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-neutral-400 block">{language === 'bn' ? 'ইমেইল' : 'Email Us'}</span>
                  <a 
                    href={`mailto:${BRAND_CONFIG.email}`} 
                    className="font-semibold text-neutral-800 hover:text-[#2d5016] transition-colors"
                  >
                    {BRAND_CONFIG.email}
                  </a>
                </div>
              </div>

              {/* Support Hours */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0 text-amber-700">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <span className="text-[11px] text-neutral-400 block">{language === 'bn' ? 'কার্যকাল' : 'Operating Hours'}</span>
                  <span className="font-medium text-neutral-800">
                    {language === 'bn' ? BRAND_CONFIG.hours : BRAND_CONFIG.hoursEn}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Link */}
            <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between">
              <span className="text-xs text-neutral-500 font-medium">
                {language === 'bn' ? 'সোশ্যাল মিডিয়া:' : 'Follow Us:'}
              </span>
              <a
                href={BRAND_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>{language === 'bn' ? 'অফিসিয়াল ফেসবুক পেজ' : 'Official Facebook'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Minimal Quick Order via WhatsApp Box */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-4 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-emerald-900 block">
                {language === 'bn' ? 'দ্রুত হোয়াটসঅ্যাপে অর্ডার' : 'Instant WhatsApp Order'}
              </span>
              <span className="text-[11px] text-emerald-700 block">
                {language === 'bn' ? 'মেসেজ পাঠিয়ে সরাসরি অর্ডার সম্পন্ন করুন' : 'Send product details for instant booking'}
              </span>
            </div>
            <a
              href={`${BRAND_CONFIG.whatsappUrl}?text=${encodeURIComponent('Hello Kasab Gallery, I want to inquire about your products.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shrink-0 transition-colors"
            >
              {language === 'bn' ? 'মেসেজ দিন' : 'Order Now'}
            </a>
          </div>
        </div>

        {/* Right Column: Minimal Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-7 shadow-2xs">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif-brand text-lg font-bold text-neutral-900">
                {language === 'bn' ? 'বার্তা সফলভাবে পাঠানো হয়েছে!' : 'Message Sent Successfully!'}
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                {language === 'bn'
                  ? 'আপনার বার্তার জন্য ধন্যবাদ। আমাদের প্রতিনিধি দ্রুততম সময়ে আপনার ফোন বা হোয়াটসঅ্যাপে যোগাযোগ করবেন।'
                  : 'Thank you for reaching out. Our customer representative will get back to you shortly.'}
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold cursor-pointer transition-colors"
                >
                  {language === 'bn' ? 'আরেকটি বার্তা পাঠান' : 'Send Another Message'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif-brand text-base sm:text-lg font-bold text-neutral-900">
                  {language === 'bn' ? 'আমাদের বার্তা পাঠান' : 'Send a Message'}
                </h3>
                <p className="text-xs text-neutral-500">
                  {language === 'bn' ? 'নিচের তথ্যগুলো পূরণ করে পাঠান, আমরা দ্রুত যোগাযোগ করব।' : 'Please leave your details below.'}
                </p>
              </div>

              {/* Inquiry Topic Chips */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-[11px] font-semibold text-neutral-700">
                  {language === 'bn' ? 'অনুসন্ধানের বিষয়' : 'Topic of Inquiry'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {subjectOptions.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSubject(opt.id)}
                      className={`px-3 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                        subject === opt.id
                          ? 'bg-[#2d5016] text-white'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {language === 'bn' ? opt.labelBn : opt.labelEn}
                    </button>
                  ))}
                </div>
              </div>

              {/* Two Column Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-700">
                    {language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={language === 'bn' ? 'উদা: সাদিয়া ইসলাম' : 'e.g. Sadia Islam'}
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#2d5016] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-700">
                    {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#2d5016] transition-colors"
                  />
                </div>
              </div>

              {/* Optional Email */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-700">
                  {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#2d5016] transition-colors"
                />
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-700">
                  {language === 'bn' ? 'আপনার বার্তা *' : 'Your Message *'}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    language === 'bn'
                      ? 'আপনি কোন পণ্যটি সম্পর্কে জানতে চান বা আপনার অনুসন্ধান বিস্তারিত লিখুন...'
                      : 'Please specify the product or question you have in mind...'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-neutral-200 text-xs sm:text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#2d5016] transition-colors resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-98 disabled:opacity-70"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isSubmitting 
                      ? (language === 'bn' ? 'পাঠানো হচ্ছে...' : 'Sending...') 
                      : (language === 'bn' ? 'বার্তা পাঠান' : 'Send Message')}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Minimal Assurance Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-xl border border-neutral-200/70 bg-neutral-50/50 flex items-center gap-2.5 text-xs text-neutral-700">
          <Zap className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{language === 'bn' ? 'দ্রুত রেসপন্স ও পরামর্শ' : 'Fast 30-min response'}</span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200/70 bg-neutral-50/50 flex items-center gap-2.5 text-xs text-neutral-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{language === 'bn' ? '১০০% বিশ্বস্ত ও নিরাপদ সেবা' : 'Safe & confidential service'}</span>
        </div>

        <div className="p-3.5 rounded-xl border border-neutral-200/70 bg-neutral-50/50 flex items-center gap-2.5 text-xs text-neutral-700">
          <Truck className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{language === 'bn' ? 'সারা দেশে ক্যাশ অন ডেলিভারি' : 'Nationwide doorstep COD'}</span>
        </div>
      </div>
    </div>
  );
};
