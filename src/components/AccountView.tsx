import React, { useState, useMemo, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import {
  User,
  Package,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  LogOut,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Save,
  ShoppingBag,
  ArrowLeft,
  Printer,
  Download,
  PauseCircle,
  RotateCcw,
  Search,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';
import { formatBDT, formatBanglaNumber } from '../utils/formatters';
import { printInvoice, downloadInvoice } from '../utils/invoiceGenerator';

function normalizeBDPhone(raw?: string): string {
  const digits = (raw || '').replace(/[^0-9]/g, '');
  if (!digits) return '';
  if (digits.startsWith('880') && digits.length >= 13) {
    return '0' + digits.slice(3);
  }
  if (digits.length === 10 && digits.startsWith('1')) {
    return '0' + digits;
  }
  return digits;
}

function phonesMatch(a?: string, b?: string): boolean {
  const na = normalizeBDPhone(a);
  const nb = normalizeBDPhone(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  return na.length >= 10 && nb.length >= 10 && na.slice(-10) === nb.slice(-10);
}

const TIMELINE_STEPS: { key: OrderStatus; labelBn: string; labelEn: string }[] = [
  { key: 'confirmed', labelBn: 'নিশ্চিত', labelEn: 'Confirmed' },
  { key: 'processing', labelBn: 'প্যাকিং', labelEn: 'Packing' },
  { key: 'courier_assigned', labelBn: 'কুরিয়ার', labelEn: 'Courier' },
  { key: 'shipped', labelBn: 'পথে', labelEn: 'Shipped' },
  { key: 'delivered', labelBn: 'ডেলিভারি', labelEn: 'Delivered' },
];

const STATUS_STEP_INDEX: Partial<Record<OrderStatus, number>> = {
  pending: -1,
  confirmed: 0,
  processing: 1,
  courier_assigned: 2,
  shipped: 3,
  delivered: 4,
};

export const AccountView: React.FC = () => {
  const {
    currentUser,
    orders,
    setCurrentPage,
    logoutUser,
    updateUser,
    language,
    openAuthModal,
    refreshOrders,
    trackOrders,
    showToast,
  } = useShop();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [city, setCity] = useState<'Dhaka' | 'Outside Dhaka'>(currentUser?.city || 'Dhaka');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'delivered'>('all');
  const [orderPage, setOrderPage] = useState(1);
  const ordersPerPage = 4;

  // Order Tracking Search State
  const [trackQuery, setTrackQuery] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trackedResults, setTrackedResults] = useState<Order[] | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setAddress(currentUser.address || '');
      setCity(currentUser.city || 'Dhaka');
    }
  }, [currentUser]);

  // Match orders belonging to user (normalized phone OR email) + guest browser orders
  const allUserOrders = useMemo(() => {
    if (!currentUser) {
      return orders;
    }
    if (currentUser.role === 'admin') {
      return orders.filter(
        (o) =>
          phonesMatch(o.customer?.phone, currentUser.phone) ||
          (o.customer?.email &&
            currentUser.email &&
            o.customer.email.toLowerCase() === currentUser.email.toLowerCase())
      );
    }
    return orders.filter(
      (o) =>
        phonesMatch(o.customer?.phone, currentUser.phone) ||
        (o.customer?.email &&
          currentUser.email &&
          o.customer.email.toLowerCase() === currentUser.email.toLowerCase())
    );
  }, [orders, currentUser]);

  const displayedBaseOrders = trackedResults !== null ? trackedResults : allUserOrders;

  const filteredOrders = useMemo(() => {
    if (orderFilter === 'pending') {
      return displayedBaseOrders.filter((o) =>
        ['pending', 'confirmed', 'processing', 'courier_assigned', 'shipped', 'hold'].includes(o.status)
      );
    }
    if (orderFilter === 'delivered') {
      return displayedBaseOrders.filter((o) => o.status === 'delivered');
    }
    return displayedBaseOrders;
  }, [displayedBaseOrders, orderFilter]);

  const totalSpent = useMemo(() => {
    return allUserOrders.reduce(
      (sum, o) => sum + (o.status !== 'cancelled' && o.status !== 'returned' ? o.total || 0 : 0),
      0
    );
  }, [allUserOrders]);

  const totalOrderPages = Math.max(1, Math.ceil(filteredOrders.length / ordersPerPage));

  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, orderPage, ordersPerPage]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser({
      name,
      phone,
      address,
      city,
    });
    setIsEditing(false);
  };

  const handleTrackSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = trackQuery.trim();
    if (!q) {
      setTrackedResults(null);
      setTrackError(null);
      return;
    }
    setIsTracking(true);
    setTrackError(null);
    try {
      const results = await trackOrders(q);
      setTrackedResults(results);
      setOrderPage(1);
      if (results.length === 0) {
        setTrackError(
          language === 'bn'
            ? `"${q}" এর জন্য কোনো অর্ডার খুঁজে পাওয়া যায়নি। সঠিক অর্ডার আইডি (যেমন: KG-10492) বা মোবাইল নম্বর দিয়ে চেষ্টা করুন।`
            : `No orders found for "${q}". Please check your Order ID or Phone number.`
        );
      }
    } catch (err: any) {
      setTrackError(err.message || (language === 'bn' ? 'অর্ডার খোঁজা যায়নি' : 'Failed to track order'));
    } finally {
      setIsTracking(false);
    }
  };

  const handleClearTrackSearch = () => {
    setTrackQuery('');
    setTrackedResults(null);
    setTrackError(null);
    setOrderPage(1);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (trackedResults !== null && trackQuery.trim()) {
        const refreshed = await trackOrders(trackQuery.trim());
        setTrackedResults(refreshed);
      } else {
        await refreshOrders();
      }
      showToast(language === 'bn' ? 'সর্বশেষ অর্ডার স্ট্যাটাস আপডেট করা হয়েছে' : 'Order statuses refreshed');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCopyTracking = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedTrackingId(code);
      showToast(language === 'bn' ? `ট্র্যাকিং কোড "${code}" কপি হয়েছে` : `Tracking code "${code}" copied`);
      setTimeout(() => setCopiedTrackingId(null), 2000);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
            <Clock className="w-3 h-3" />
            {language === 'bn' ? 'অপেক্ষমান' : 'Pending'}
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
            <CheckCircle2 className="w-3 h-3" />
            {language === 'bn' ? 'নিশ্চিত' : 'Confirmed'}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
            <Package className="w-3 h-3" />
            {language === 'bn' ? 'প্যাকিং হচ্ছে' : 'Processing'}
          </span>
        );
      case 'courier_assigned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200/80">
            <Truck className="w-3 h-3" />
            {language === 'bn' ? 'কুরিয়ার অ্যাসাইনড' : 'Courier Assigned'}
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
            <Truck className="w-3 h-3" />
            {language === 'bn' ? 'ডেলিভারিতে আছে' : 'Shipped'}
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <CheckCircle2 className="w-3 h-3" />
            {language === 'bn' ? 'ডেলিভার্ড' : 'Delivered'}
          </span>
        );
      case 'hold':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-orange-50 text-orange-800 border border-orange-200/80">
            <PauseCircle className="w-3 h-3" />
            {language === 'bn' ? 'হোল্ড' : 'On Hold'}
          </span>
        );
      case 'returned':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300/80">
            <RotateCcw className="w-3 h-3" />
            {language === 'bn' ? 'রিটার্নড' : 'Returned'}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200/80">
            <AlertCircle className="w-3 h-3" />
            {language === 'bn' ? 'বাতিল' : 'Cancelled'}
          </span>
        );
      default:
        return null;
    }
  };

  const renderOrderCard = (order: Order) => {
    const activeStepIdx = STATUS_STEP_INDEX[order.status];
    const isException = order.status === 'hold' || order.status === 'returned' || order.status === 'cancelled';

    return (
      <div
        key={order._id}
        className="p-4 sm:p-5 rounded-2xl border border-neutral-200/80 hover:border-[#2d5016]/30 transition-all bg-neutral-50/40 space-y-3"
      >
        {/* Header row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-neutral-900">
              #{order._id}
            </span>
            <span className="text-[11px] text-neutral-400">
              {new Date(order.orderDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <div>{getStatusBadge(order.status)}</div>
        </div>

        {/* Visual Progress Timeline */}
        {isException ? (
          <div
            className={`px-3 py-2 rounded-xl text-[11px] font-medium flex items-center gap-2 border ${
              order.status === 'hold'
                ? 'bg-orange-50 text-orange-800 border-orange-200/70'
                : order.status === 'returned'
                ? 'bg-slate-100 text-slate-700 border-slate-200'
                : 'bg-red-50 text-red-700 border-red-200/70'
            }`}
          >
            {order.status === 'hold' ? (
              <PauseCircle className="w-3.5 h-3.5 shrink-0" />
            ) : order.status === 'returned' ? (
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <span>
              {order.status === 'hold'
                ? language === 'bn'
                  ? 'অর্ডারটি সাময়িক হোল্ডে রয়েছে। সহায়তার জন্য হটলাইনে যোগাযোগ করুন।'
                  : 'Order is currently on hold. Please contact support for details.'
                : order.status === 'returned'
                ? language === 'bn'
                  ? 'পার্সেলটি রিটার্ন হিসেবে মার্ক করা হয়েছে।'
                  : 'This parcel has been marked as returned.'
                : language === 'bn'
                ? 'এই অর্ডারটি বাতিল করা হয়েছে।'
                : 'This order has been cancelled.'}
            </span>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-neutral-200/70 px-3 py-2.5">
            {order.status === 'pending' && (
              <p className="text-[11px] text-amber-800 font-medium mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3 shrink-0" />
                <span>
                  {language === 'bn'
                    ? 'অর্ডারটি গ্রহণ করা হয়েছে। শীঘ্রই কল করে কনফার্ম করা হবে।'
                    : 'Order received. Our team will confirm shortly.'}
                </span>
              </p>
            )}
            <div className="grid grid-cols-5 gap-1 items-start">
              {TIMELINE_STEPS.map((step, idx) => {
                const isDone = activeStepIdx !== undefined && activeStepIdx >= idx;
                const isCurrent = activeStepIdx === idx;
                return (
                  <div key={step.key} className="flex flex-col items-center text-center gap-1">
                    <div className="w-full flex items-center">
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          idx === 0 ? 'invisible' : isDone ? 'bg-[#2d5016]' : 'bg-neutral-200'
                        }`}
                      />
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold transition-colors ${
                          isDone
                            ? 'bg-[#2d5016] text-white'
                            : 'bg-neutral-200 text-neutral-500'
                        } ${isCurrent ? 'ring-2 ring-[#2d5016]/25' : ''}`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div
                        className={`h-1 flex-1 rounded-full ${
                          idx === TIMELINE_STEPS.length - 1
                            ? 'invisible'
                            : activeStepIdx !== undefined && activeStepIdx > idx
                            ? 'bg-[#2d5016]'
                            : 'bg-neutral-200'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[10px] leading-tight truncate max-w-full ${
                        isCurrent
                          ? 'font-bold text-[#2d5016]'
                          : isDone
                          ? 'font-semibold text-neutral-700'
                          : 'text-neutral-400'
                      }`}
                    >
                      {language === 'bn' ? step.labelBn : step.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Courier & Tracking Pill if assigned */}
        {(order.courierName || order.trackingNumber) && (
          <div className="p-2.5 rounded-xl bg-cyan-50/70 border border-cyan-200/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 font-bold text-cyan-900">
                <Truck className="w-3.5 h-3.5 text-cyan-700" />
                <span>{order.courierName || (language === 'bn' ? 'কুরিয়ার' : 'Courier')}</span>
              </span>
              {order.trackingNumber && (
                <span className="font-mono text-neutral-800 bg-white px-2 py-0.5 rounded-lg border border-cyan-200">
                  {language === 'bn' ? 'ট্র্যাকিং:' : 'Tracking:'} <strong>{order.trackingNumber}</strong>
                </span>
              )}
            </div>
            {order.trackingNumber && (
              <button
                type="button"
                onClick={() => handleCopyTracking(order.trackingNumber!)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white hover:bg-cyan-100/70 border border-cyan-200 text-cyan-900 font-semibold cursor-pointer transition-colors"
              >
                {copiedTrackingId === order.trackingNumber ? (
                  <Check className="w-3 h-3 text-emerald-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                <span>{copiedTrackingId === order.trackingNumber ? (language === 'bn' ? 'কপিড' : 'Copied') : (language === 'bn' ? 'কপি' : 'Copy')}</span>
              </button>
            )}
          </div>
        )}

        {/* Items preview */}
        <div className="space-y-2 border-t border-neutral-100 pt-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-neutral-700">
              <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-neutral-200 shrink-0" />
                )}
                <span className="truncate font-medium">{language === 'bn' ? item.banglaName || item.name : item.name}</span>
                <span className="text-neutral-400 text-[11px]">×{item.quantity}</span>
              </div>
              <span className="font-semibold text-neutral-900 font-serif-brand tabular-nums">
                {formatBDT(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Summary & Invoice Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100 text-xs">
          <div className="text-neutral-500 text-[11px]">
            <span>{order.customer.city === 'Dhaka' ? (language === 'bn' ? 'ঢাকা সিটি' : 'Dhaka') : (language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka')}</span>
            <span className="mx-1">•</span>
            <span>
              {order.paymentMethod === 'bkash'
                ? 'বিকাশ'
                : order.paymentMethod === 'nagad'
                ? 'নগদ'
                : order.paymentMethod === 'rocket'
                ? 'রকেট'
                : language === 'bn'
                ? 'ক্যাশ অন ডেলিভারি'
                : 'Cash on Delivery'}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3">
            <div className="flex items-center gap-1 font-bold text-[#2d5016] font-serif-brand text-sm tabular-nums">
              <span className="text-xs text-neutral-500 font-normal">{language === 'bn' ? 'সর্বমোট:' : 'Total:'}</span>
              <span>{formatBDT(order.total)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => printInvoice(order)}
                className="px-2.5 py-1 rounded-full border border-neutral-200 hover:bg-neutral-100 text-[11px] font-medium text-neutral-700 flex items-center gap-1 cursor-pointer transition-colors"
                title={language === 'bn' ? 'চালান প্রিন্ট' : 'Print Invoice'}
              >
                <Printer className="w-3 h-3 text-[#2d5016]" />
                <span>{language === 'bn' ? 'প্রিন্ট' : 'Print'}</span>
              </button>
              <button
                type="button"
                onClick={() => downloadInvoice(order)}
                className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-[11px] font-medium text-neutral-800 flex items-center gap-1 cursor-pointer transition-colors"
                title={language === 'bn' ? 'PDF ইনভয়েস ডাউনলোড' : 'Download PDF Invoice'}
              >
                <Download className="w-3 h-3 text-emerald-700" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Guest View: Live Order Tracking + Optional Login Prompt
  if (!currentUser) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
          <button
            type="button"
            onClick={() => setCurrentPage('home')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#2d5016] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
          </button>

          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#2d5016] text-[#d4af37] text-xs font-semibold hover:bg-[#234011] transition-colors cursor-pointer"
          >
            <User className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
          </button>
        </div>

        {/* Public Order Tracking Lookup Box */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200/80 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 font-serif-brand flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#2d5016]" />
                <span>{language === 'bn' ? 'অর্ডার ট্র্যাকিং (Order Tracking)' : 'Track Your Order'}</span>
              </h1>
              <p className="text-xs text-neutral-500 mt-1">
                {language === 'bn'
                  ? 'আপনার অর্ডার আইডি (যেমন: KG-10492) অথবা অর্ডার করার মোবাইল নম্বর দিয়ে লাইভ অবস্থা দেখুন'
                  : 'Enter your Order ID (e.g. KG-10492) or phone number to check live delivery status'}
              </p>
            </div>

            {displayedBaseOrders.length > 0 && (
              <button
                type="button"
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-100 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#2d5016] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
              </button>
            )}
          </div>

          <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder={language === 'bn' ? 'অর্ডার আইডি (KG-10492) বা মোবাইল নম্বর...' : 'Order ID (KG-10492) or phone...'}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 text-xs sm:text-sm bg-neutral-50 focus:bg-white focus:outline-none focus:border-[#2d5016]"
              />
            </div>
            <button
              type="submit"
              disabled={isTracking}
              className="px-5 py-2.5 rounded-xl bg-[#2d5016] text-[#d4af37] font-bold text-xs sm:text-sm hover:bg-[#234011] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              {isTracking ? (language === 'bn' ? 'খোঁজা হচ্ছে...' : 'Tracking...') : (language === 'bn' ? 'ট্র্যাক করুন' : 'Track Order')}
            </button>
            {trackedResults !== null && (
              <button
                type="button"
                onClick={handleClearTrackSearch}
                className="px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer shrink-0"
              >
                {language === 'bn' ? 'রিসেট' : 'Reset'}
              </button>
            )}
          </form>

          {trackError && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              {trackError}
            </div>
          )}

          {displayedBaseOrders.length > 0 ? (
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-semibold text-neutral-800">
                  {trackedResults !== null
                    ? language === 'bn'
                      ? `খুঁজে পাওয়া অর্ডার (${formatBanglaNumber(displayedBaseOrders.length)} টি)`
                      : `Matched Orders (${displayedBaseOrders.length})`
                    : language === 'bn'
                    ? `আপনার সাম্প্রতিক অর্ডারসমূহ (${formatBanglaNumber(displayedBaseOrders.length)} টি)`
                    : `Recent Orders on This Device (${displayedBaseOrders.length})`}
                </span>
              </div>
              {paginatedOrders.map(renderOrderCard)}

              {totalOrderPages > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                    disabled={orderPage === 1}
                    className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-semibold text-neutral-600 px-2">
                    {orderPage} / {totalOrderPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
                    disabled={orderPage === totalOrderPages}
                    className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : !trackError ? (
            <div className="text-center py-8 px-4 border border-dashed border-neutral-200 rounded-2xl space-y-3">
              <Package className="w-8 h-8 text-neutral-300 mx-auto" />
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {language === 'bn'
                  ? 'আপনার সব অর্ডার একসাথে দেখতে উপরে অর্ডার আইডি/ফোন নম্বর দিয়ে খুঁজুন অথবা অ্যাকাউন্টে লগইন করুন।'
                  : 'Search above by Order ID or phone number, or log in to see your full order history.'}
              </p>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="px-5 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'অ্যাকাউন্টে লগইন বা সাইন আপ' : 'Log In or Sign Up'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Minimal Top Navigation */}
      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-3">
        <button
          type="button"
          onClick={() => setCurrentPage('home')}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#2d5016] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'হোমে ফিরে যান' : 'Back to Home'}</span>
        </button>

        <button
          type="button"
          onClick={logoutUser}
          className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'লগআউট' : 'Log Out'}</span>
        </button>
      </div>

      {/* Header & Profile Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card (2 cols) */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-neutral-200/70 shadow-2xs space-y-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#2d5016] text-[#d4af37] flex items-center justify-center font-bold text-lg shadow-xs font-serif-brand">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-neutral-900 font-serif-brand">
                    {currentUser.name}
                  </h1>
                  {currentUser.role === 'admin' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#2d5016]/10 text-[#2d5016] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      অ্যাডমিন
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-500">
                  {currentUser.email || currentUser.phone}
                </p>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-medium text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Edit2 className="w-3 h-3" />
                <span>{language === 'bn' ? 'এডিট' : 'Edit'}</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-2 border-t border-neutral-100 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-500 font-medium mb-1 block">
                    {language === 'bn' ? 'আপনার নাম' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#2d5016]"
                  />
                </div>
                <div>
                  <label className="text-neutral-500 font-medium mb-1 block">
                    {language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#2d5016]"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-500 font-medium mb-1 block">
                  {language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === 'bn' ? 'বাসা, রোড, এলাকা...' : 'House, Road, Area...'}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-[#2d5016]"
                />
              </div>

              <div>
                <label className="text-neutral-500 font-medium mb-1 block">
                  {language === 'bn' ? 'এলাকা' : 'City Region'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCity('Dhaka')}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                      city === 'Dhaka'
                        ? 'bg-[#2d5016]/10 border-[#2d5016] text-[#2d5016] font-bold'
                        : 'border-neutral-200 text-neutral-600'
                    }`}
                  >
                    {language === 'bn' ? 'ঢাকা সিটি' : 'Inside Dhaka'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCity('Outside Dhaka')}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                      city === 'Outside Dhaka'
                        ? 'bg-[#2d5016]/10 border-[#2d5016] text-[#2d5016] font-bold'
                        : 'border-neutral-200 text-neutral-600'
                    }`}
                  >
                    {language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-1.5 rounded-full border border-neutral-200 text-neutral-600 hover:bg-neutral-50 cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-full bg-[#2d5016] text-[#d4af37] font-semibold hover:bg-[#234011] flex items-center gap-1 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'সংরক্ষণ' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100 text-xs">
              <div className="flex items-start gap-2 text-neutral-600">
                <Phone className="w-3.5 h-3.5 text-[#2d5016] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 block">{language === 'bn' ? 'ফোন নম্বর' : 'Phone'}</span>
                  <span className="font-semibold text-neutral-800">{currentUser.phone || '—'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-neutral-600">
                <Mail className="w-3.5 h-3.5 text-[#2d5016] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 block">{language === 'bn' ? 'ইমেইল' : 'Email'}</span>
                  <span className="font-semibold text-neutral-800">{currentUser.email || '—'}</span>
                </div>
              </div>
              <div className="sm:col-span-2 flex items-start gap-2 text-neutral-600">
                <MapPin className="w-3.5 h-3.5 text-[#2d5016] mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] text-neutral-400 block">{language === 'bn' ? 'ডেলিভারি ঠিকানা' : 'Delivery Address'}</span>
                  <span className="font-medium text-neutral-800">
                    {currentUser.address ? `${currentUser.address} (${currentUser.city === 'Dhaka' ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'})` : (language === 'bn' ? 'ঠিকানা যুক্ত করা হয়নি' : 'No address saved yet')}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Stats Overview */}
        <div className="bg-white rounded-3xl p-6 border border-neutral-200/70 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-3">
              {language === 'bn' ? 'কেনাকাটার সারাংশ' : 'Shopping Summary'}
            </span>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-neutral-500 block">
                  {language === 'bn' ? 'মোট অর্ডার' : 'Total Orders'}
                </span>
                <span className="text-2xl font-bold text-neutral-900 font-serif-brand tabular-nums">
                  {formatBanglaNumber(allUserOrders.length)}
                </span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block">
                  {language === 'bn' ? 'সর্বমোট খরচ' : 'Total Spent'}
                </span>
                <span className="text-2xl font-bold text-[#2d5016] font-serif-brand tabular-nums">
                  {formatBDT(totalSpent)}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage('catalog')}
            className="w-full mt-4 py-2 px-3 rounded-full bg-[#2d5016] text-[#d4af37] text-xs font-bold hover:bg-[#234011] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নতুন পণ্য কিনুন' : 'Browse Catalog'}</span>
          </button>
        </div>
      </div>

      {/* Orders History & Live Tracking Section */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-neutral-200/70 shadow-2xs space-y-4">
        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div className="flex items-center justify-between sm:justify-start gap-2.5">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#2d5016]" />
              <h2 className="text-base font-bold text-neutral-900 font-serif-brand">
                {language === 'bn' ? 'আমার অর্ডার ও ট্র্যাকিং' : 'Order History & Tracking'}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-neutral-200 text-[11px] font-medium text-neutral-600 hover:bg-neutral-100 cursor-pointer disabled:opacity-50"
              title={language === 'bn' ? 'সর্বশেষ স্ট্যাটাস দেখুন' : 'Refresh'}
            >
              <RefreshCw className={`w-3 h-3 text-[#2d5016] ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{language === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => { setOrderFilter('all'); setOrderPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                orderFilter === 'all'
                  ? 'bg-[#2d5016] text-[#d4af37] font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {language === 'bn' ? 'সব' : 'All'} ({formatBanglaNumber(displayedBaseOrders.length)})
            </button>
            <button
              type="button"
              onClick={() => { setOrderFilter('pending'); setOrderPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                orderFilter === 'pending'
                  ? 'bg-[#2d5016] text-[#d4af37] font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {language === 'bn' ? 'চলমান' : 'Ongoing'}
            </button>
            <button
              type="button"
              onClick={() => { setOrderFilter('delivered'); setOrderPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                orderFilter === 'delivered'
                  ? 'bg-[#2d5016] text-[#d4af37] font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {language === 'bn' ? 'সম্পন্ন' : 'Completed'}
            </button>
          </div>
        </div>

        {/* Inline Order ID / Phone Tracking Lookup */}
        <form onSubmit={handleTrackSearch} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'অন্য কোনো অর্ডার ট্র্যাক করতে আইডি (KG-10492) বা মোবাইল নম্বর লিখুন...'
                  : 'Track any Order ID (KG-10492) or phone number...'
              }
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:bg-white focus:outline-none focus:border-[#2d5016]"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isTracking}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-neutral-900 hover:bg-[#2d5016] text-white text-xs font-semibold cursor-pointer transition-colors disabled:opacity-50"
            >
              {isTracking ? (language === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...') : (language === 'bn' ? 'ট্র্যাক করুন' : 'Track')}
            </button>
            {trackedResults !== null && (
              <button
                type="button"
                onClick={handleClearTrackSearch}
                className="px-3 py-2 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                {language === 'bn' ? 'আমার অর্ডার' : 'My Orders'}
              </button>
            )}
          </div>
        </form>

        {trackError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            {trackError}
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 px-4 border border-dashed border-neutral-200 rounded-2xl">
            <ShoppingBag className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-neutral-700 mb-1">
              {language === 'bn' ? 'কোনো অর্ডার নেই।' : 'No orders in this category.'}
            </p>
            <p className="text-[11px] text-neutral-400 mb-3">
              {language === 'bn' ? 'খাঁটি ও প্রাকৃতিক পণ্যের অর্ডার করতে ক্যাটালগে যান।' : 'Explore pure and organic products.'}
            </p>
            <button
              type="button"
              onClick={() => setCurrentPage('catalog')}
              className="px-4 py-1.5 rounded-full bg-[#2d5016] text-[#d4af37] text-xs font-semibold hover:bg-[#234011] transition-colors cursor-pointer shadow-xs"
            >
              {language === 'bn' ? 'পণ্যসমূহ দেখুন' : 'Browse Catalog'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedOrders.map(renderOrderCard)}

            {/* Pagination Controls */}
            {totalOrderPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-4">
                <button
                  type="button"
                  onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                  disabled={orderPage === 1}
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setOrderPage(p)}
                    className={`w-8 h-8 rounded-full text-xs font-medium transition-all cursor-pointer ${
                      orderPage === p
                        ? 'bg-[#2d5016] text-[#d4af37] font-bold shadow-xs'
                        : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {language === 'bn' ? formatBanglaNumber(p) : p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
                  disabled={orderPage === totalOrderPages}
                  className="w-8 h-8 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
