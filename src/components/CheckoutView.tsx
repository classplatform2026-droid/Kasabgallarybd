import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { formatBDT } from '../utils/formatters';
import { BRAND_CONFIG } from '../data/mockData';
import { OrderCustomer, Order } from '../types';
import { KasabLogo } from './KasabLogo';
import {
  ALL_BD_DISTRICTS,
  PAYMENT_METHODS,
  ACTIVE_COUPONS,
  detectOperator,
} from '../data/checkoutData';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Truck,
  MessageCircle,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Phone,
  ShieldCheck,
  MapPin,
  User,
  Mail,
  FileText,
  Clock,
  Sparkles,
  Tag,
  X,
  Plus,
  Minus,
  Trash2,
  Printer,
  Download,
  Copy,
  Check,
  AlertCircle,
  Banknote,
  Smartphone,
  Edit3,
} from 'lucide-react';
import { printInvoice, downloadInvoice } from '../utils/invoiceGenerator';
import { BangladeshGeoAddressCollector } from './BangladeshGeoAddressCollector';

const SAVED_CUSTOMER_KEY = 'kg_saved_customer_v1';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    createOrder,
    setCurrentPage,
    language,
    generateWhatsAppOrderUrl,
    updateQuantity,
    removeFromCart,
    showToast,
    currentUser,
    openAuthModal,
  } = useShop();

  // Wizard Step State: 1 = Form fill up (Customer & Address), 2 = Payment details & Confirm
  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  // Customer details state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('ঢাকা সিটি কর্পোরেশন');
  const [thana, setThana] = useState('ধানমন্ডি');
  const [division, setDivision] = useState('ঢাকা');
  const [city, setCity] = useState<'Dhaka' | 'Outside Dhaka'>('Dhaka');
  const [notes, setNotes] = useState('');
  const [saveInfo, setSaveInfo] = useState(true);

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad' | 'rocket'>('cod');
  const [trxId, setTrxId] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Validation errors & submitting state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Load saved customer info from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_CUSTOMER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setName(parsed.name);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.address) setAddress(parsed.address);
        if (parsed.district) setDistrict(parsed.district);
        if (parsed.thana) setThana(parsed.thana);
        if (parsed.division) setDivision(parsed.division);
        if (parsed.city) setCity(parsed.city);
      }
    } catch {
      // ignore
    }

    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.phone) setPhone(currentUser.phone);
      if (currentUser.email) setEmail(currentUser.email);
      if (currentUser.address) setAddress(currentUser.address);
      if (currentUser.city) setCity(currentUser.city);
    }
  }, [currentUser]);

  // Delivery charge calculation
  let deliveryCharge =
    city === 'Outside Dhaka'
      ? BRAND_CONFIG.fixedDeliveryOutside
      : BRAND_CONFIG.fixedDeliveryDhaka;

  // Free shipping coupon check
  if (appliedCoupon && appliedCoupon.code.toUpperCase().includes('FREE')) {
    deliveryCharge = 0;
  }

  // Calculate discount
  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartSubtotal - discountAmount + deliveryCharge);

  // Mobile operator detection
  const detectedOperator = detectOperator(phone);

  // Apply Coupon
  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    setCouponError(null);

    if (!code) {
      setCouponError(language === 'bn' ? 'কুপন কোড লিখুন' : 'Enter coupon code');
      return;
    }

    const couponDef = ACTIVE_COUPONS[code];
    if (!couponDef) {
      setCouponError(
        language === 'bn'
          ? 'কুপন কোডটি সঠিক নয়। দয়া করে KASAB50 অথবা KASAB10 চেষ্টা করুন।'
          : 'Invalid coupon code. Try KASAB50 or KASAB10.'
      );
      return;
    }

    if (couponDef.minSubtotal && cartSubtotal < couponDef.minSubtotal) {
      setCouponError(
        language === 'bn'
          ? `এই কুপনটি ব্যবহার করতে ন্যূনতম ৳${couponDef.minSubtotal} টাকার পণ্য থাকতে হবে।`
          : `Minimum cart subtotal of ৳${couponDef.minSubtotal} required for this coupon.`
      );
      return;
    }

    let calculatedDiscount = 0;
    if (couponDef.type === 'flat') {
      calculatedDiscount = couponDef.value;
    } else if (couponDef.type === 'percentage') {
      calculatedDiscount = Math.min(200, Math.round((cartSubtotal * couponDef.value) / 100));
    } else if (couponDef.type === 'free_shipping') {
      calculatedDiscount = 0; // Handled in deliveryCharge
    }

    setAppliedCoupon({
      code: couponDef.code,
      discount: calculatedDiscount,
      description: language === 'bn' ? couponDef.descriptionBn : couponDef.descriptionEn,
    });
    setCouponInput('');
    showToast(
      language === 'bn'
        ? `কুপন কোড '${couponDef.code}' সফলভাবে প্রয়োগ হয়েছে!`
        : `Coupon '${couponDef.code}' applied successfully!`
    );
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
    showToast(language === 'bn' ? 'কুপন বাতিল করা হয়েছে' : 'Coupon removed');
  };

  // Step 1 Validation (Form Fill Up)
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = language === 'bn' ? 'আপনার সম্পূর্ণ নাম লিখুন' : 'Full Name is required';
    }
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 11) {
      newErrors.phone =
        language === 'bn'
          ? 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)'
          : 'Valid 11-digit phone number is required';
    }
    if (!address.trim()) {
      newErrors.address =
        language === 'bn'
          ? 'ডেলিভারির বিস্তারিত ঠিকানা লিখুন (বাড়ি নং, রোড নং, এলাকা)'
          : 'Detailed delivery address is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 2 Validation (Payment Details)
  const validateStep2 = () => {
    if (paymentMethod === 'bkash' || paymentMethod === 'nagad' || paymentMethod === 'rocket') {
      if (senderPhone && senderPhone.replace(/[^0-9]/g, '').length < 11) {
        showToast(language === 'bn' ? 'সঠিক ১১ ডিজিটের প্রেরক নম্বর দিন' : 'Valid 11-digit sender phone required');
        return false;
      }
    }
    return true;
  };

  // Save info to local storage
  const saveCustomerPreferences = () => {
    if (saveInfo) {
      try {
        localStorage.setItem(
          SAVED_CUSTOMER_KEY,
          JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: address.trim(),
            district,
            thana,
            division,
            city,
          })
        );
      } catch {
        // ignore
      }
    }
  };

  // Handle Next button click in Step 1
  const handleProceedToPayment = () => {
    if (validateStep1()) {
      saveCustomerPreferences();
      setCheckoutStep(2);
      const step2Element = document.getElementById('checkout-wizard-section');
      step2Element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast(language === 'bn' ? 'পেমেন্ট পদ্ধতি নির্বাচন করুন' : 'Select payment method');
    } else {
      const firstError = document.querySelector('.border-red-400');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast(language === 'bn' ? 'অনুগ্রহ করে লাল চিহ্নিত ঘরগুলো সঠিকভাবে পূরণ করুন' : 'Please fix required fields');
    }
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#2d5016', '#d4af37', '#10b981', '#1a1a1a', '#e2136e'],
      });
    } catch {
      // ignore
    }
  };

  // Final Order Placement (Confirm in Step 2)
  const handlePlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateStep1()) {
      setCheckoutStep(1);
      return;
    }
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);
    saveCustomerPreferences();

    const customer: OrderCustomer = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim(),
      district,
      thana,
      city,
      notes: notes.trim() || undefined,
    };

    try {
      const order = await createOrder(customer, 'website_cod', {
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        paymentTrxId: trxId.trim() || undefined,
        paymentSenderNumber: senderPhone.trim() || undefined,
        deliveryCharge,
      });

      setCompletedOrder(order);
      triggerConfetti();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      showToast(err.message || 'অর্ডার করতে সমস্যা হয়েছে, আবার চেষ্টা করুন');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Direct WhatsApp Order
  const handleWhatsAppOrder = () => {
    if (!validateStep1()) {
      setCheckoutStep(1);
      return;
    }

    saveCustomerPreferences();

    const customer: OrderCustomer = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim(),
      district,
      thana,
      city,
      notes: notes.trim() || undefined,
    };

    createOrder(customer, 'whatsapp', {
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      paymentMethod,
      deliveryCharge,
    }).then((order) => {
      setCompletedOrder(order);
      triggerConfetti();
      const url = generateWhatsAppOrderUrl(cart, customer, undefined, {
        orderId: order._id,
        discount: discountAmount,
        couponCode: appliedCoupon?.code,
        paymentMethod,
        finalTotal: grandTotal,
      });
      window.open(url, '_blank');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // Copy number to clipboard
  const handleCopyNumber = (num: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(num.replace(/[^0-9]/g, ''));
      setCopiedNumber(true);
      showToast(language === 'bn' ? 'নম্বরটি কপি করা হয়েছে!' : 'Number copied!');
      setTimeout(() => setCopiedNumber(false), 2500);
    }
  };

  // If order was successfully placed, show Confirmation / Invoice Receipt
  if (completedOrder) {
    const isCOD = completedOrder.paymentMethod === 'cod' || !completedOrder.paymentMethod;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-8 print:p-0 print:m-0 animate-fadeIn">
        {/* Confirmed Banner */}
        <div className="text-center space-y-3 print:hidden">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#d4af37]/20 text-[#2d5016] text-xs font-bold uppercase tracking-wider">
            {language === 'bn' ? 'অর্ডার সফল হয়েছে' : 'Order Placed Successfully'}
          </span>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-neutral-900">
            {language === 'bn' ? 'ধন্যবাদ! আপনার অর্ডারটি নিশ্চিত করা হয়েছে' : 'Thank You! Your Order has been Placed.'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto">
            {language === 'bn'
              ? 'আমাদের কাস্টমার কেয়ার টিম দ্রুত আপনার সাথে ফোনে বা হোয়াটসঅ্যাপে যোগাযোগ করে পার্সেলটি ডিসপ্যাচ নিশ্চিত করবে।'
              : 'Our Kasab Gallery support team will contact you shortly to confirm dispatch.'}
          </p>
        </div>

        {/* Printable Invoice Receipt Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-sm text-left space-y-6 print:border-none print:shadow-none print:p-2">
          {/* Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
            <div className="flex items-center gap-3">
              <KasabLogo className="w-12 h-12 shadow-xs shrink-0" />
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-neutral-900">Kasab Gallery</h3>
                <p className="text-[11px] text-neutral-500">খাঁটি ও প্রাকৃতিক প্রিমিয়াম পণ্য সম্ভার</p>
                <p className="text-[10px] text-neutral-400">হটলাইন: {BRAND_CONFIG.phone}</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
                {completedOrder.status === 'pending' ? 'অপেক্ষমান (Pending)' : completedOrder.status}
              </div>
              <div>
                <span className="text-[11px] text-neutral-400 block">অর্ডার আইডি:</span>
                <span className="text-sm sm:text-base font-bold text-neutral-900 font-mono">
                  #{completedOrder._id}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 block">
                তারিখ: {new Date(completedOrder.orderDate).toLocaleDateString('bn-BD', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>

          {/* Delivery & Customer Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#faf9f5] border border-[#ebe8dd] text-xs">
            <div className="space-y-1.5">
              <span className="font-bold text-[#2d5016] text-[11px] uppercase tracking-wider block">
                গ্রাহকের তথ্য (Customer Details):
              </span>
              <p className="font-bold text-neutral-900 text-sm">{completedOrder.customer.name}</p>
              <p className="text-neutral-700 flex items-center gap-1.5 font-medium">
                <Phone className="w-3.5 h-3.5 text-[#2d5016]" /> {completedOrder.customer.phone}
              </p>
              {completedOrder.customer.email && (
                <p className="text-neutral-500 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> {completedOrder.customer.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <span className="font-bold text-[#2d5016] text-[11px] uppercase tracking-wider block">
                ডেলিভারি ঠিকানা ও এলাকা:
              </span>
              <p className="text-neutral-800 font-medium">
                {completedOrder.customer.address}
              </p>
              <p className="text-neutral-600">
                জেলা: <span className="font-bold text-neutral-900">{completedOrder.customer.district || 'ঢাকা'}</span>{' '}
                ({completedOrder.customer.city === 'Dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'})
              </p>
              <div className="pt-1 text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  প্রত্যাশিত ডেলিভারি:{' '}
                  {completedOrder.customer.city === 'Dhaka' ? '২৪-৪৮ ঘণ্টার মধ্যে' : '৪৮-৭২ ঘণ্টার মধ্যে'}
                </span>
              </div>
            </div>

            {completedOrder.customer.notes && (
              <div className="sm:col-span-2 pt-2 border-t border-[#ebe8dd] text-[11px] text-amber-900">
                <strong>বিশেষ নির্দেশনা:</strong> {completedOrder.customer.notes}
              </div>
            )}
          </div>

          {/* Payment Method Notice */}
          <div className="p-3.5 rounded-xl border border-neutral-200 bg-white text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2d5016]/10 text-[#2d5016] flex items-center justify-center shrink-0">
                {isCOD ? <Banknote className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-bold text-neutral-900 block">
                  পেমেন্ট পদ্ধতি:{' '}
                  {isCOD
                    ? 'ক্যাশ অন ডেলিভারি (পণ্য পেয়ে মূল্য পরিশোধ)'
                    : completedOrder.paymentMethod?.toUpperCase()}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {isCOD
                    ? 'ডেলিভারিম্যানের কাছে পণ্য বুঝে পেয়ে ক্যাশ টাকা পরিশোধ করবেন।'
                    : 'মোবাইল ব্যাংকিংয়ের মাধ্যমে পরিশোধকৃত।'}
                </span>
              </div>
            </div>

            {completedOrder.paymentTrxId && (
              <div className="bg-neutral-50 px-3 py-1.5 rounded-lg border border-neutral-200 text-right">
                <span className="text-neutral-400 block text-[9px]">TrxID:</span>
                <span className="font-bold text-neutral-800">{completedOrder.paymentTrxId}</span>
              </div>
            )}
          </div>

          {/* Ordered Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              অর্ডারকৃত পণ্যের বিবরণ (Ordered Items)
            </h4>
            <div className="border border-neutral-200 rounded-2xl overflow-x-auto text-xs">
              <table className="w-full text-left min-w-[380px]">
                <thead className="bg-[#f7f6f2] font-bold text-neutral-700 border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-3">পণ্য</th>
                    <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                    <th className="py-2.5 px-3 text-right">দর</th>
                    <th className="py-2.5 px-3 text-right">মোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {completedOrder.items.map((i, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/50">
                      <td className="py-2.5 px-3 flex items-center gap-2.5">
                        {i.image && (
                          <img
                            src={i.image}
                            alt={i.name}
                            className="w-9 h-9 object-cover rounded-lg border border-neutral-200 shrink-0"
                          />
                        )}
                        <div>
                          <span className="font-bold text-neutral-900 block">{i.banglaName}</span>
                          <span className="text-[10px] text-neutral-400 block">{i.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-neutral-700">
                        {i.quantity} টি
                      </td>
                      <td className="py-2.5 px-3 text-right text-neutral-600">
                        {formatBDT(i.price)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-neutral-900">
                        {formatBDT(i.price * i.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border-t border-neutral-200 pt-3 space-y-1.5 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>পণ্যের উপমোট (Subtotal):</span>
              <span className="font-bold text-neutral-900">{formatBDT(completedOrder.subtotal)}</span>
            </div>
            {completedOrder.discount && completedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  কুপন ডিসকাউন্ট {completedOrder.couponCode ? `(${completedOrder.couponCode})` : ''}:
                </span>
                <span className="font-bold">- {formatBDT(completedOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-neutral-400" />
                ডেলিভারি চার্জ ({completedOrder.customer.city === 'Dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'}):
              </span>
              <span className="font-bold text-neutral-900">{formatBDT(completedOrder.delivery_charge)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-dashed border-neutral-200">
              <span className="text-neutral-900">সর্বমোট প্রদেয় মূল্য (Grand Total):</span>
              <span className="text-xl font-black text-[#2d5016]">{formatBDT(completedOrder.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1 print:hidden">
          <button
            type="button"
            onClick={() => {
              printInvoice(completedOrder);
              showToast('ইনভয়েস প্রিন্ট উইন্ডো খোলা হয়েছে');
            }}
            className="px-5 py-3 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 text-xs sm:text-sm font-bold border border-neutral-300 flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            title="ইনভয়েস প্রিন্ট করুন"
          >
            <Printer className="w-4 h-4 text-[#2d5016]" />
            <span>ইনভয়েস প্রিন্ট</span>
          </button>

          <button
            type="button"
            onClick={() => {
              downloadInvoice(completedOrder);
              showToast('ইনভয়েস PDF ডাউনলোড শুরু হয়েছে');
            }}
            className="px-5 py-3 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 text-xs sm:text-sm font-bold border border-neutral-300 flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
            title="ইনভয়েস PDF ডাউনলোড করুন"
          >
            <Download className="w-4 h-4 text-[#2d5016]" />
            <span>PDF ডাউনলোড</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('orders')}
            className="px-5 py-3 rounded-full bg-cyan-700 hover:bg-cyan-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Truck className="w-4 h-4" />
            <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('catalog')}
            className="px-6 py-3 rounded-full bg-[#2d5016] hover:bg-[#234011] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer active:scale-95"
          >
            আরও কেনাকাটা করুন
          </button>
        </div>
      </div>
    );
  }

  // If user is not logged in, enforce login before checkout
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#2d5016]/10 text-[#2d5016] flex items-center justify-center mx-auto ring-8 ring-[#2d5016]/5">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif-brand text-2xl font-bold text-neutral-900">
            {language === 'bn' ? 'অর্ডার করার জন্য লগইন আবশ্যক' : 'Login Required to Order'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
            {language === 'bn'
              ? 'আপনার অর্ডার ট্র্যাকিং, ডেলিভারি আপডেট ও সুরক্ষিত সেবার জন্য অনুগ্রহ করে লগইন বা সাইন আপ করুন।'
              : 'Please log in or sign up to your account to place your order and track deliveries.'}
          </p>
        </div>

        <div className="space-y-2.5 pt-2 max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="w-full py-3 px-4 rounded-full bg-[#2d5016] hover:bg-[#234011] text-[#d4af37] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <User className="w-4 h-4" />
            <span>{language === 'bn' ? 'লগইন বা সাইন আপ করুন' : 'Log In or Sign Up'}</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('cart')}
            className="w-full py-2.5 px-4 rounded-full border border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 text-xs font-semibold transition-colors cursor-pointer"
          >
            {language === 'bn' ? 'কার্ট পেজে ফিরে যান' : 'Back to Cart'}
          </button>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-900 text-left flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            {language === 'bn'
              ? 'অ্যাকাউন্ট থাকলে আপনার ঠিকানা স্বয়ংক্রিয়ভাবে সংরক্ষিত থাকবে এবং পরবর্তীতে দ্রুত অর্ডার করতে পারবেন।'
              : 'Having an account automatically saves your address for instant future checkouts.'}
          </p>
        </div>
      </div>
    );
  }

  // If cart is empty and no completed order
  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-serif-brand text-xl font-bold text-neutral-800">
            {language === 'bn' ? 'আপনার শপিং কার্ট খালি' : 'Your cart is currently empty'}
          </h2>
          <p className="text-xs text-neutral-500">
            {language === 'bn'
              ? 'চেকআউট করতে প্রথমে আপনার পছন্দের পণ্য কার্টে যোগ করুন।'
              : 'Add some pure & authentic items to your cart before proceeding.'}
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('catalog')}
          className="px-6 py-3 rounded-full bg-[#2d5016] hover:bg-[#234011] text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
        >
          {language === 'bn' ? 'পণ্যসমূহ দেখতে যান' : 'Explore Pure Products'}
        </button>
      </div>
    );
  }


  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <button
            onClick={() => {
              if (checkoutStep === 2) {
                setCheckoutStep(1);
              } else {
                setCurrentPage('cart');
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#2d5016] font-medium mb-1.5 cursor-pointer group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>
              {checkoutStep === 2
                ? language === 'bn'
                  ? 'পূর্ববর্তী ধাপ: ঠিকানা পরিবর্তন করুন'
                  : 'Back to Address Form'
                : language === 'bn'
                ? 'কার্টে ফিরে যান'
                : 'Back to Cart'}
            </span>
          </button>
          <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-neutral-900">
            {language === 'bn' ? 'চেকআউট ও অর্ডার কনফার্ম' : 'Checkout & Order Confirmation'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            {language === 'bn'
              ? 'নিচে প্রথমে আপনার নির্বাচিত পণ্যের তালিকা দেখে নিয়ে ঠিকানা পূরণ করুন'
              : 'Review your order summary first, then complete address and payment details'}
          </p>
        </div>

        {/* Step Progress Tracker Badges */}
        <div className="flex items-center gap-2">
          {/* Step 1 Pill */}
          <button
            type="button"
            onClick={() => setCheckoutStep(1)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              checkoutStep === 1
                ? 'bg-[#2d5016] text-white shadow-xs ring-2 ring-[#d4af37]/40'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              checkoutStep === 1 ? 'bg-[#d4af37] text-neutral-900' : 'bg-emerald-600 text-white'
            }`}>
              {checkoutStep === 2 ? '✓' : '১'}
            </span>
            <span>১. তথ্য ও ঠিকানা</span>
          </button>

          <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />

          {/* Step 2 Pill */}
          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setCheckoutStep(2);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
              checkoutStep === 2
                ? 'bg-[#2d5016] text-white shadow-xs ring-2 ring-[#d4af37]/40 cursor-pointer'
                : 'bg-neutral-100 text-neutral-500 border border-neutral-200 cursor-not-allowed'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
              checkoutStep === 2 ? 'bg-[#d4af37] text-neutral-900' : 'bg-neutral-300 text-neutral-700'
            }`}>
              ২
            </span>
            <span>২. পেমেন্ট ও কনফার্ম</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          1. FIRST SECTION: অর্ডার সারাংশ (ORDER SUMMARY) FIRST
         ======================================================== */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2d5016]/10 text-[#2d5016] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#2d5016]" />
            </div>
            <div>
              <h2 className="font-serif-brand text-base sm:text-lg font-bold text-neutral-900">
                {language === 'bn' ? 'অর্ডার সারাংশ (Order Summary)' : 'Order Summary'}
              </h2>
              <p className="text-[11px] text-neutral-500">
                আপনার কার্টে যুক্ত পণ্যসমূহ ও মোট হিসাব
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
            মোট {cart.reduce((acc, curr) => acc + curr.quantity, 0)}টি পণ্য
          </span>
        </div>

        {/* Cart Items List */}
        <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto pr-1">
          {cart.map(({ product, quantity }) => (
            <div key={product._id} className="py-3.5 flex items-center gap-3.5 group">
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-neutral-200 shrink-0 shadow-2xs"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                  {language === 'bn' ? product.banglaName : product.name}
                </h4>
                <p className="text-[11px] text-neutral-500 font-mono mt-0.5">
                  দর: {formatBDT(product.price)} / একক
                </p>

                {/* Quantity Stepper */}
                <div className="flex items-center gap-2.5 mt-2">
                  <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-900 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-neutral-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-neutral-900 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(product._id)}
                    className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                    title="কার্ট থেকে পণ্য মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm sm:text-base font-black text-[#2d5016] font-mono block">
                  {formatBDT(product.price * quantity)}
                </span>
                <span className="text-[10px] text-neutral-400 block">উপমোট</span>
              </div>
            </div>
          ))}
        </div>

        {/* Coupon Code Section */}
        <div className="pt-3 border-t border-neutral-100 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#2d5016]" />
              <span>ডিসকাউন্ট কুপন কোড (যদি থাকে):</span>
            </label>
            {appliedCoupon && (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                কুপন সক্রিয়: {appliedCoupon.code} (-{formatBDT(appliedCoupon.discount)})
              </span>
            )}
          </div>

          {appliedCoupon ? (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <Tag className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold block">{appliedCoupon.code}</span>
                  <span className="text-[10px] text-emerald-700">{appliedCoupon.description}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="p-1.5 text-emerald-800 hover:text-red-600 cursor-pointer rounded-lg hover:bg-emerald-100"
                title="কুপন বাতিল করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2 max-w-md">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="উদা: KASAB50"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 text-xs uppercase focus:outline-none focus:border-[#2d5016] font-mono"
                  />
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon()}
                  className="px-4 py-2 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  প্রয়োগ
                </button>
              </div>

              {couponError && <p className="text-[11px] text-red-500 mt-1">{couponError}</p>}

              {/* Quick Clickable Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[10px] text-neutral-400">অফার কুপন:</span>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon('KASAB50')}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 cursor-pointer"
                >
                  KASAB50
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon('KASAB10')}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                >
                  KASAB10
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyCoupon('FREEBD')}
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 cursor-pointer"
                >
                  FREEBD
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Breakdown Grid */}
        <div className="pt-3 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 text-neutral-600 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-100">
            <div className="flex justify-between">
              <span>{language === 'bn' ? 'পণ্যের মোট মূল্য' : 'Subtotal'}:</span>
              <span className="font-bold text-neutral-900 font-mono">{formatBDT(cartSubtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span className="flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {language === 'bn' ? 'কুপন ডিসকাউন্ট' : 'Discount'}:
                </span>
                <span className="font-mono">- {formatBDT(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-neutral-600">
              <span className="flex items-center gap-1 text-neutral-700 font-medium">
                <Truck className="w-3.5 h-3.5 text-neutral-500" />
                {language === 'bn' ? 'ডেলিভারি চার্জ' : 'Delivery Charge'}:
              </span>
              <span className="font-bold text-neutral-900">
                {deliveryCharge === 0 ? (
                  <span className="text-emerald-600 font-bold uppercase">ফ্রি (Free)</span>
                ) : (
                  formatBDT(deliveryCharge)
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-between p-3.5 rounded-2xl bg-[#2d5016]/5 border border-[#2d5016]/20">
            <div className="flex justify-between items-baseline">
              <span className="text-xs sm:text-sm font-bold text-neutral-900">
                {language === 'bn' ? 'সর্বমোট প্রদেয় বিল' : 'Total Payable'}:
              </span>
              <span className="text-xl sm:text-2xl font-black text-[#2d5016] font-mono">
                {formatBDT(grandTotal)}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 mt-2">
              💡 Kasab Gallery-তে একটি মাত্র ডেলিভারি চার্জে যত খুশি পণ্য একসাথে অর্ডার করতে পারবেন!
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. CHECKOUT WIZARD: STEP 1 (FORM) & STEP 2 (PAYMENT)
         ======================================================== */}
      <div id="checkout-wizard-section" className="space-y-6">

        {/* STEP 1: CHECKOUT FORM FILL UP & STEP-BY-STEP ADDRESS */}
        {checkoutStep === 1 && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#2d5016] text-[#d4af37] font-bold text-sm flex items-center justify-center shadow-xs">
                  ১
                </span>
                <div>
                  <h2 className="font-serif-brand text-base sm:text-lg font-bold text-neutral-900">
                    {language === 'bn' ? 'গ্রাহকের তথ্য ও ডেলিভারি ঠিকানা পূরণ করুন' : 'Customer & Delivery Information'}
                  </h2>
                  <p className="text-[11px] text-neutral-500">
                    সঠিক মোবাইল নম্বর এবং ধাপে ধাপে আপনার বিভাগ, জেলা ও থানা নির্বাচন করুন
                  </p>
                </div>
              </div>

              {localStorage.getItem(SAVED_CUSTOMER_KEY) && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      const saved = localStorage.getItem(SAVED_CUSTOMER_KEY);
                      if (saved) {
                        const parsed = JSON.parse(saved);
                        if (parsed.name) setName(parsed.name);
                        if (parsed.phone) setPhone(parsed.phone);
                        if (parsed.email) setEmail(parsed.email);
                        if (parsed.address) setAddress(parsed.address);
                        if (parsed.district) setDistrict(parsed.district);
                        if (parsed.thana) setThana(parsed.thana);
                        if (parsed.division) setDivision(parsed.division);
                        if (parsed.city) setCity(parsed.city);
                        showToast(language === 'bn' ? 'সংরক্ষিত তথ্য লোড হয়েছে' : 'Saved details loaded');
                      }
                    } catch {}
                  }}
                  className="text-[11px] font-bold text-[#2d5016] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>সংরক্ষিত তথ্য পূরণ করুন</span>
                </button>
              )}
            </div>

            {/* Guest or Logged in Banner */}
            {currentUser ? (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === 'bn' ? 'লগইন আছেন:' : 'Logged in as:'}{' '}
                    <strong>{currentUser.name}</strong> ({currentUser.phone || currentUser.email})
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-white/80 px-2 py-0.5 rounded-full border border-emerald-200">
                  অটো-ফিল সক্রিয়
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-[#fafaf6] border border-[#2d5016]/20 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2d5016] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>গেস্ট চেকআউট: লগইন ছাড়াই যেকোনো গ্রাহক সরাসরি অর্ডার করতে পারবেন</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="font-bold text-[#2d5016] hover:underline cursor-pointer text-[11px] shrink-0 ml-2 bg-white px-2 py-0.5 rounded-md border border-neutral-300"
                  >
                    লগইন করুন →
                  </button>
                </div>
                <p className="text-[11px] text-neutral-600">
                  নিচে নাম ও ফোন নম্বর দিয়ে পরবর্তী ধাপে গিয়ে পেমেন্ট মেথড নির্বাচন করুন।
                </p>
              </div>
            )}

            {/* Form Inputs */}
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  {language === 'bn' ? 'আপনার সম্পূর্ণ নাম *' : 'Full Name *'}
                </label>
                <div className="relative">
                  <input
                    id="checkout-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="উদা: মো: তানভীর হাসান"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-[#2d5016] ${
                      errors.name ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                    }`}
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
                {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Phone Number with Operator Detector */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-800">
                    {language === 'bn' ? 'সচল মোবাইল নম্বর (১১ ডিজিট) *' : 'Mobile Number (11 digits) *'}
                  </label>
                  {detectedOperator && (
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: detectedOperator.color }}
                    >
                      {detectedOperator.name}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="checkout-phone-input"
                    type="tel"
                    value={phone}
                    maxLength={14}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    placeholder="017XXXXXXXX / 019XXXXXXXX"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none focus:border-[#2d5016] ${
                      errors.phone ? 'border-red-400 bg-red-50/20' : 'border-neutral-300'
                    }`}
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                </div>
                {errors.phone ? (
                  <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>
                ) : (
                  <p className="text-[10px] text-neutral-400 mt-1">
                    অর্ডার কনফার্মেশন ও কুরিয়ার ট্র্যাকিংয়ের জন্য আপনার ব্যক্তিগত সচল ফোন নম্বর দিন।
                  </p>
                )}
              </div>

              {/* PURE STEP-BY-STEP BANGLADESH GEO ENGINE ADDRESS COLLECTOR */}
              <div className="pt-1">
                <BangladeshGeoAddressCollector
                  initialStreetAddress={address}
                  initialDistrict={district}
                  initialThana={thana}
                  initialCity={city}
                  language={language}
                  error={errors.address}
                  onAddressChange={(geo) => {
                    setAddress(geo.fullAddress);
                    setDistrict(geo.district);
                    setThana(geo.thana);
                    setDivision(geo.division);
                    setCity(geo.city);
                    if (errors.address && geo.streetAddress.trim()) {
                      setErrors((prev) => ({ ...prev, address: '' }));
                    }
                  }}
                />
              </div>

              {/* Optional Email & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    {language === 'bn' ? 'ইমেইল (ঐচ্ছিক)' : 'Email (Optional)'}
                  </label>
                  <div className="relative">
                    <input
                      id="checkout-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#2d5016]"
                    />
                    <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-600 mb-1">
                    {language === 'bn' ? 'ডেলিভারি নোট (ঐচ্ছিক)' : 'Delivery Note (Optional)'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="উদা: বিকেলে ডেলিভারি দিন..."
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#2d5016]"
                    />
                    <FileText className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              </div>

              {/* Save info checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={saveInfo}
                  onChange={(e) => setSaveInfo(e.target.checked)}
                  className="rounded border-neutral-300 text-[#2d5016] focus:ring-[#2d5016] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-neutral-600 select-none">
                  পরবর্তী অর্ডারের জন্য আমার তথ্য ও ডেলিভারি ঠিকানা সংরক্ষণ করুন
                </span>
              </label>
            </div>

            {/* NEXT BUTTON TO ADVANCE TO STEP 2 (Payment Details) */}
            <div className="pt-3 border-t border-neutral-100">
              <button
                type="button"
                id="checkout-proceed-to-payment-btn"
                onClick={handleProceedToPayment}
                className="w-full py-4 px-6 rounded-2xl bg-[#2d5016] hover:bg-[#234011] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-between cursor-pointer active:scale-98"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
                  <span>পরবর্তী ধাপ: পেমেন্টের বিবরণ ➔</span>
                </div>
                <span className="text-xs bg-white/20 px-3 py-1 rounded-xl font-mono font-black">
                  মোট: {formatBDT(grandTotal)}
                </span>
              </button>
              <p className="text-center text-[11px] text-neutral-400 mt-2">
                পরবর্তী ধাপে ক্যাশ অন ডেলিভারি বা মোবাইল ব্যাংকিং নির্বাচন করে অর্ডার নিশ্চিত করতে পারবেন।
              </p>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT DETAILS & CONFIRM */}
        {checkoutStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            {/* Back to Step 1 Bar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-neutral-200">
              <button
                type="button"
                onClick={() => {
                  setCheckoutStep(1);
                  const step1Element = document.getElementById('checkout-wizard-section');
                  step1Element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="text-xs font-bold text-[#2d5016] hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← পূর্বে ফিরে যান (ঠিকানা ও তথ্য পরিবর্তন করুন)</span>
              </button>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                ধাপ ২ / ২
              </span>
            </div>

            {/* Customer & Address Summary Card */}
            <div className="bg-white rounded-3xl p-5 border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2d5016]" />
                  <h3 className="font-serif-brand text-sm font-bold text-neutral-900">
                    ডেলিভারি তথ্য নিশ্চিতকরণ
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutStep(1);
                    const step1Element = document.getElementById('checkout-wizard-section');
                    step1Element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-[11px] font-bold text-[#2d5016] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>পরিবর্তন করুন</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">গ্রাহক:</span>
                  <p className="font-bold text-neutral-900 text-sm">{name}</p>
                  <p className="text-neutral-600 font-mono">{phone}</p>
                  {email && <p className="text-neutral-500">{email}</p>}
                </div>

                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">ডেলিভারি ঠিকানা:</span>
                  <p className="font-bold text-neutral-800 leading-snug">{address}</p>
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      city === 'Dhaka' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {city === 'Dhaka' ? 'ঢাকা সিটি (৳৭০)' : 'ঢাকার বাইরে (৳১৩০)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#2d5016] text-[#d4af37] font-bold text-sm flex items-center justify-center shadow-xs">
                    ২
                  </span>
                  <div>
                    <h2 className="font-serif-brand text-base sm:text-lg font-bold text-neutral-900">
                      {language === 'bn' ? 'পেমেন্ট মেথড নির্বাচন করুন' : 'Select Payment Method'}
                    </h2>
                    <p className="text-[11px] text-neutral-500">
                      ক্যাশ অন ডেলিভারি অথবা যেকোনো মোবাইল ব্যাংকিং এর মাধ্যমে পরিশোধ করতে পারেন
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Options Grid */}
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const isSelected = paymentMethod === method.id;
                  return (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#2d5016] bg-[#2d5016]/5 ring-1.5 ring-[#2d5016]'
                          : 'border-neutral-200 hover:border-neutral-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                            style={{
                              borderColor: isSelected ? method.color : '#d1d5db',
                            }}
                          >
                            {isSelected && (
                              <div
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: method.color }}
                              />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs sm:text-sm text-neutral-900">
                                {language === 'bn' ? method.titleBn : method.titleEn}
                              </span>
                              {method.badgeBn && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  {method.badgeBn}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              {language === 'bn' ? method.subtitleBn : method.subtitleEn}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Extended bKash / Nagad / Rocket Instructions */}
                      {isSelected && method.number && (
                        <div className="mt-3.5 pt-3 border-t border-neutral-200/80 space-y-3 text-xs">
                          <div className="p-3 rounded-xl bg-white border border-neutral-200 flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                                Kasab Gallery অফিসিয়াল {method.titleBn} নম্বর:
                              </span>
                              <span className="font-mono font-bold text-sm sm:text-base text-neutral-900">
                                {method.number}
                              </span>
                              <span className="text-[10px] text-neutral-500 block">({method.accountType})</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyNumber(method.number!);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              {copiedNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              <span>{copiedNumber ? 'কপি হয়েছে' : 'নম্বর কপি করুন'}</span>
                            </button>
                          </div>

                          <p className="text-[11px] text-neutral-600 leading-relaxed">
                            {method.instructionsBn}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                            <div>
                              <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                                যে নম্বর থেকে টাকা পাঠিয়েছেন (Sender Number):
                              </label>
                              <input
                                type="tel"
                                value={senderPhone}
                                onChange={(e) => setSenderPhone(e.target.value)}
                                placeholder="01XXXXXXXXX"
                                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#2d5016]"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-medium text-neutral-700 mb-1">
                                ট্রানজেকশন আইডি (TrxID) (যদি থাকে):
                              </label>
                              <input
                                type="text"
                                value={trxId}
                                onChange={(e) => setTrxId(e.target.value)}
                                placeholder="যেমন: 9J7X4K21"
                                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#2d5016]"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ORDER CONFIRMATION ACTION BUTTONS */}
              <div className="space-y-3 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  id="submit-cod-order-btn"
                  disabled={isSubmitting}
                  onClick={() => handlePlaceOrder()}
                  className="w-full py-4 px-6 rounded-2xl bg-[#2d5016] hover:bg-[#234011] text-white font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-between cursor-pointer active:scale-98 disabled:opacity-60"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#d4af37]" />
                    <span>
                      {isSubmitting
                        ? 'অর্ডার নিশ্চিত হচ্ছে...'
                        : paymentMethod === 'cod'
                        ? 'ক্যাশ অন ডেলিভারিতে অর্ডার নিশ্চিত করুন'
                        : 'অর্ডার নিশ্চিত করুন'}
                    </span>
                  </div>
                  <span className="font-mono text-base font-black bg-white/20 px-3 py-1 rounded-xl">
                    {formatBDT(grandTotal)}
                  </span>
                </button>

                <button
                  type="button"
                  id="submit-whatsapp-order-btn"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপের মাধ্যমে সরাসরি অর্ডার কনফার্ম করুন</span>
                </button>
              </div>

              {/* Trust Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#faf9f5] border border-[#ebe8dd] text-xs text-neutral-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>১০০% প্রাকৃতিক ও নির্ভেজাল</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#2d5016] shrink-0" />
                  <span>দেখে নেওয়ার পূর্ণ নিশ্চয়তা</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#d4af37] shrink-0" />
                  <span>২৪-৭২ ঘণ্টায় দ্রুত ডেলিভারি</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
