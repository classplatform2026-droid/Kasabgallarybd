import React, { useState, useEffect, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order, HeroSlide, CategoryId, OrderStatus, Category, HeroHighlightedProduct } from '../types';
import { INITIAL_HERO_HIGHLIGHTS } from '../data/mockData';
import { formatBDT } from '../utils/formatters';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  CheckCircle, 
  Clock, 
  Truck, 
  XCircle, 
  Sparkles,
  Search, 
  Check, 
  Save, 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  Cloud, 
  Phone, 
  MessageCircle, 
  Printer, 
  ExternalLink, 
  X, 
  AlertTriangle, 
  Star, 
  Utensils, 
  Moon, 
  Snowflake, 
  Folder, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft, 
  Boxes, 
  BookOpen, 
  PenTool, 
  Megaphone, 
  MessageSquareQuote, 
  Download,
  Menu,
  ChevronRight,
  ChevronLeft,
  Filter,
  Activity,
  DollarSign,
  Store,
  LogOut,
  HelpCircle,
  Tag,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Layers,
  Leaf,
  PauseCircle,
  RotateCcw,
  Send
} from 'lucide-react';
import { ImageUploadDropzone } from './ImageUploadDropzone';
import { AdminBlogManager } from './AdminBlogManager';
import { AdminTestimonialsManager } from './AdminTestimonialsManager';
import { KasabLogo } from './KasabLogo';
import { printInvoice, downloadInvoice } from '../utils/invoiceGenerator';

const BD_COURIERS = [
  'Steadfast Courier',
  'Pathao Courier',
  'RedX',
  'Sundarban Courier',
  'SA Paribahan',
  'Paperfly',
  'Kasab Own Rider (ঢাকা)',
];

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; shortLabel: string; badgeClass: string; activeBtnClass: string }
> = {
  pending: {
    label: 'পেন্ডিং',
    shortLabel: 'পেন্ডিং',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    activeBtnClass: 'bg-amber-500 text-white font-bold',
  },
  confirmed: {
    label: 'কনফার্মড',
    shortLabel: 'কনফার্মড',
    badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
    activeBtnClass: 'bg-blue-600 text-white font-bold',
  },
  processing: {
    label: 'প্রসেসিং',
    shortLabel: 'প্রসেসিং',
    badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
    activeBtnClass: 'bg-purple-600 text-white font-bold',
  },
  courier_assigned: {
    label: 'কুরিয়ার অ্যাসাইনড',
    shortLabel: 'কুরিয়ার',
    badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    activeBtnClass: 'bg-cyan-600 text-white font-bold',
  },
  shipped: {
    label: 'শিপড / পথে',
    shortLabel: 'শিপড',
    badgeClass: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    activeBtnClass: 'bg-indigo-600 text-white font-bold',
  },
  delivered: {
    label: 'ডেলিভারড',
    shortLabel: 'ডেলিভারড',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    activeBtnClass: 'bg-emerald-600 text-white font-bold',
  },
  hold: {
    label: 'হোল্ড',
    shortLabel: 'হোল্ড',
    badgeClass: 'bg-orange-50 text-orange-800 border-orange-200',
    activeBtnClass: 'bg-orange-600 text-white font-bold',
  },
  returned: {
    label: 'রিটার্নড',
    shortLabel: 'রিটার্নড',
    badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    activeBtnClass: 'bg-slate-700 text-white font-bold',
  },
  cancelled: {
    label: 'বাতিল',
    shortLabel: 'বাতিল',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    activeBtnClass: 'bg-rose-600 text-white font-bold',
  },
};

const ALL_ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed',
  'processing',
  'courier_assigned',
  'shipped',
  'delivered',
  'hold',
  'returned',
  'cancelled',
];

// Curated Category Presets for instant minimal category creation
const CATEGORY_IMAGE_PRESETS = [
  {
    name: 'মধু ও প্রাকৃতিক খাদ্য',
    icon: 'Utensils',
    url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=600',
  },
  {
    name: 'খাঁটি তেল ও ঘি',
    icon: 'ShieldCheck',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600',
  },
  {
    name: 'প্রাকৃতিক মসলাপাতি',
    icon: 'Utensils',
    url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=600',
  },
  {
    name: 'স্কিনকেয়ার ও সৌন্দর্য',
    icon: 'Sparkles',
    url: 'https://images.unsplash.com/photo-1608248597359-0095efb56bb5?q=80&w=600',
  },
  {
    name: 'খেজুর ও সুন্নাহ খাদ্য',
    icon: 'Moon',
    url: 'https://images.unsplash.com/photo-1584281722573-f932e6fbdbfc?q=80&w=600',
  },
  {
    name: 'শীতকালীন সমগ্রী',
    icon: 'Snowflake',
    url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?q=80&w=600',
  },
];

type AdminTab = 'dashboard' | 'orders' | 'products' | 'categories' | 'banners' | 'notice' | 'blogs' | 'testimonials' | 'system';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    categories,
    orders,
    blogs,
    heroSlides,
    testimonials,
    scrollingNotice,
    updateScrollingNotice,
    dbStatus,
    isLoadingDb,
    refreshDbData,
    addProduct,
    updateProduct,
    deleteProduct,
    updateCategory,
    addCategory,
    deleteCategory,
    updateOrderStatus,
    deleteOrder,
    addHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
    heroHighlights,
    updateHeroHighlights,
    setHeroHighlightSlot,
    language,
    showToast,
    setCurrentPage,
    currentUser,
    logoutUser
  } = useShop();

  // Active Tab & Mobile Sidebar
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Global Quick Search in Header
  const [globalSearch, setGlobalSearch] = useState('');
  const [isGlobalSearchFocused, setIsGlobalSearchFocused] = useState(false);

  // Order Details Modal state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Product modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [pName, setPName] = useState('');
  const [pBanglaName, setPBanglaName] = useState('');
  const [pCategory, setPCategory] = useState<CategoryId>('food');
  const [pPrice, setPPrice] = useState<number>(500);
  const [pOriginalPrice, setPOriginalPrice] = useState<number>(600);
  const [pImage, setPImage] = useState('');
  const [pImages, setPImages] = useState<string[]>([]);
  const [newImgInput, setNewImgInput] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pBanglaDesc, setPBanglaDesc] = useState('');
  const [pShortDesc, setPShortDesc] = useState('');
  const [pLongDesc, setPLongDesc] = useState('');
  const [pSunnah, setPSunnah] = useState(true);
  const [pBadge, setPBadge] = useState('');
  const [pStock, setPStock] = useState<number>(20);

  // Category modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [cName, setCName] = useState('');
  const [cBanglaName, setCBanglaName] = useState('');
  const [cDesc, setCDesc] = useState('');
  const [cBanglaDesc, setCBanglaDesc] = useState('');
  const [cImage, setCImage] = useState('');
  const [cIconName, setCIconName] = useState('Utensils');

  // Minimal Category Quick-Add & Modal controls
  const [quickCatBangla, setQuickCatBangla] = useState('');
  const [quickCatIcon, setQuickCatIcon] = useState('Utensils');
  const [isQuickAddingCat, setIsQuickAddingCat] = useState(false);
  const [showCatAdvancedInModal, setShowCatAdvancedInModal] = useState(false);
  const [showCatCustomImage, setShowCatCustomImage] = useState(false);

  // Banner modal state
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bTitle, setBTitle] = useState('');
  const [bBanglaTitle, setBBanglaTitle] = useState('');
  const [bSubtitle, setBSubtitle] = useState('');
  const [bBanglaSubtitle, setBBanglaSubtitle] = useState('');
  const [bImage, setBImage] = useState('');
  const [bBadge, setBBadge] = useState('');
  const [bCta, setBCta] = useState('এখনই কিনুন');

  // Filters & Pagination for Products
  const [searchProduct, setSearchProduct] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productStockFilter, setProductStockFilter] = useState<'all' | 'low' | 'out'>('all');
  const [productPage, setProductPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  
  // Filters & Pagination for Orders (POS)
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderChannelFilter, setOrderChannelFilter] = useState<string>('all');
  const [orderPage, setOrderPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  const [cloudinaryStatus, setCloudinaryStatus] = useState<{ configured: boolean; cloudName?: string; message?: string } | null>(null);

  // In-app deletion confirmation states
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [bannerToDelete, setBannerToDelete] = useState<HeroSlide | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Assign Courier modal & inline editor states
  const [courierModalOrder, setCourierModalOrder] = useState<Order | null>(null);
  const [courierNameInput, setCourierNameInput] = useState(BD_COURIERS[0]);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [autoSetCourierStatus, setAutoSetCourierStatus] = useState(true);
  const [modalCourierName, setModalCourierName] = useState('');
  const [modalTrackingNumber, setModalTrackingNumber] = useState('');

  // Top Scrolling Notice state
  const [noticeEnabled, setNoticeEnabled] = useState(scrollingNotice?.enabled ?? true);
  const [noticeText, setNoticeText] = useState(scrollingNotice?.text || '');
  const [noticeTextEn, setNoticeTextEn] = useState(scrollingNotice?.textEn || '');
  const [noticeBadge, setNoticeBadge] = useState(scrollingNotice?.badge || '📢 বিশেষ ঘোষণা');
  const [noticeBadgeEn, setNoticeBadgeEn] = useState(scrollingNotice?.badgeEn || '📢 Announcement');
  const [noticeSpeed, setNoticeSpeed] = useState<'slow' | 'normal' | 'fast'>(scrollingNotice?.speed || 'normal');
  const [noticeLink, setNoticeLink] = useState(scrollingNotice?.link || '');
  const [isSavingNotice, setIsSavingNotice] = useState(false);

  useEffect(() => {
    if (scrollingNotice) {
      setNoticeEnabled(scrollingNotice.enabled);
      setNoticeText(scrollingNotice.text);
      setNoticeTextEn(scrollingNotice.textEn || '');
      setNoticeBadge(scrollingNotice.badge || '📢 বিশেষ ঘোষণা');
      setNoticeBadgeEn(scrollingNotice.badgeEn || '📢 Announcement');
      setNoticeSpeed(scrollingNotice.speed || 'normal');
      setNoticeLink(scrollingNotice.link || '');
    }
  }, [scrollingNotice]);

  const handleSaveNotice = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingNotice(true);
    try {
      await updateScrollingNotice({
        enabled: noticeEnabled,
        text: noticeText,
        textEn: noticeTextEn,
        badge: noticeBadge,
        badgeEn: noticeBadgeEn,
        speed: noticeSpeed,
        link: noticeLink,
      });
      showToast('স্ক্রোলিং নোটিশ সফলভাবে সংরক্ষিত হয়েছে');
    } finally {
      setIsSavingNotice(false);
    }
  };

  const handleToggleNoticeLive = async () => {
    const nextState = !noticeEnabled;
    setNoticeEnabled(nextState);
    try {
      await updateScrollingNotice({
        enabled: nextState,
        text: noticeText,
        textEn: noticeTextEn,
        badge: noticeBadge,
        badgeEn: noticeBadgeEn,
        speed: noticeSpeed,
        link: noticeLink,
      });
      showToast(nextState ? 'ঘোষণা বার সক্রিয় করা হয়েছে' : 'ঘোষণা বার বন্ধ করা হয়েছে');
    } catch {
      setNoticeEnabled(!nextState);
      showToast('ঘোষণা বার আপডেট ব্যর্থ হয়েছে');
    }
  };

  useEffect(() => {
    fetch('/api/cloudinary/status')
      .then((res) => res.json())
      .then((data) => setCloudinaryStatus(data))
      .catch(() => setCloudinaryStatus({ configured: false }));
  }, []);

  // =========================================================
  // HERO SPOTLIGHT HIGHLIGHTED PRODUCTS STATE & HANDLERS
  // =========================================================
  const [localHighlights, setLocalHighlights] = useState<HeroHighlightedProduct[]>(() => {
    return heroHighlights && heroHighlights.length > 0 ? heroHighlights : INITIAL_HERO_HIGHLIGHTS;
  });
  const [isSavingHighlights, setIsSavingHighlights] = useState(false);
  const [expandedHighlightSlot, setExpandedHighlightSlot] = useState<string | null>(null);

  useEffect(() => {
    if (heroHighlights && heroHighlights.length > 0) {
      setLocalHighlights(heroHighlights);
    }
  }, [heroHighlights]);

  const handleSlotProductSelect = (slotId: string, productId: string) => {
    const selectedProd = products.find((p) => p._id === productId);
    setLocalHighlights((prev) =>
      prev.map((slot) => {
        if (slot.slotId !== slotId) return slot;
        return {
          ...slot,
          productId,
          customTitle: selectedProd ? selectedProd.name : slot.customTitle,
          customTitleBn: selectedProd ? selectedProd.banglaName : slot.customTitleBn,
          customSubtitleBn: selectedProd ? (selectedProd.banglaDescription || selectedProd.description) : slot.customSubtitleBn,
          customImage: selectedProd ? selectedProd.image : slot.customImage,
        };
      })
    );
  };

  const handleSlotBadgeChange = (slotId: string, badgeBn: string) => {
    setLocalHighlights((prev) =>
      prev.map((slot) => (slot.slotId === slotId ? { ...slot, badgeBn, badge: badgeBn } : slot))
    );
  };

  const handleSlotImageChange = (slotId: string, imageUrl: string) => {
    setLocalHighlights((prev) =>
      prev.map((slot) => (slot.slotId === slotId ? { ...slot, customImage: imageUrl } : slot))
    );
  };

  const handleSlotTextChange = (slotId: string, field: 'customTitleBn' | 'customSubtitleBn', val: string) => {
    setLocalHighlights((prev) =>
      prev.map((slot) => (slot.slotId === slotId ? { ...slot, [field]: val } : slot))
    );
  };

  const handleSaveHighlights = async () => {
    setIsSavingHighlights(true);
    try {
      await updateHeroHighlights(localHighlights);
      showToast('হোমপেজ হাইলাইটেড পণ্যসমূহ সফলভাবে সংরক্ষিত হয়েছে');
    } finally {
      setIsSavingHighlights(false);
    }
  };

  const handleResetHighlights = async () => {
    setLocalHighlights(INITIAL_HERO_HIGHLIGHTS);
    await updateHeroHighlights(INITIAL_HERO_HIGHLIGHTS);
    showToast('হাইলাইটেড পণ্য ডিফল্ট সেটিংসে ফিরিয়ে নেওয়া হয়েছে');
  };

  // Category Icon helper
  const getCategoryIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'utensils':
      case 'food':
        return <Utensils className="w-4 h-4" />;
      case 'moon':
      case 'islamic':
        return <Moon className="w-4 h-4" />;
      case 'snowflake':
      case 'winter':
        return <Snowflake className="w-4 h-4" />;
      case 'shoppingbag':
      case 'accessories':
        return <ShoppingBag className="w-4 h-4" />;
      case 'shieldcheck':
        return <ShieldCheck className="w-4 h-4" />;
      case 'package':
        return <Package className="w-4 h-4" />;
      case 'sparkles':
      case 'skincare':
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  // Order stats & KPIs
  const totalRevenue = useMemo(() => {
    return orders.reduce(
      (sum, o) => sum + (o.status !== 'cancelled' && o.status !== 'returned' ? o.total : 0),
      0
    );
  }, [orders]);

  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending').length, [orders]);
  const confirmedOrders = useMemo(() => orders.filter((o) => o.status === 'confirmed').length, [orders]);
  const processingOrders = useMemo(() => orders.filter((o) => o.status === 'processing').length, [orders]);
  const courierAssignedOrders = useMemo(
    () => orders.filter((o) => o.status === 'courier_assigned').length,
    [orders]
  );
  const shippedOrders = useMemo(() => orders.filter((o) => o.status === 'shipped').length, [orders]);
  const deliveredOrders = useMemo(() => orders.filter((o) => o.status === 'delivered').length, [orders]);
  const holdOrders = useMemo(() => orders.filter((o) => o.status === 'hold').length, [orders]);
  const returnedOrders = useMemo(() => orders.filter((o) => o.status === 'returned').length, [orders]);
  const cancelledOrders = useMemo(() => orders.filter((o) => o.status === 'cancelled').length, [orders]);

  const lowStockProducts = useMemo(() => {
    return products.filter((p) => (p.stock ?? 25) <= 12).sort((a, b) => (a.stock ?? 25) - (b.stock ?? 25));
  }, [products]);

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.orderDate || b.createdAt || 0).getTime() - new Date(a.orderDate || a.createdAt || 0).getTime())
      .slice(0, 6);
  }, [orders]);

  // Quick In-line Stock Increment helper
  const handleQuickStockAdjust = async (product: Product, delta: number) => {
    const currentStock = product.stock ?? 25;
    const newStock = Math.max(0, currentStock + delta);
    await updateProduct(product._id, { stock: newStock });
    showToast(`"${product.banglaName}" এর স্টক আপডেট: ${newStock} টি`);
  };

  const handleOpenAssignCourier = (order: Order) => {
    setCourierModalOrder(order);
    setCourierNameInput(order.courierName || BD_COURIERS[0]);
    setTrackingNumberInput(order.trackingNumber || '');
    setAutoSetCourierStatus(true);
  };

  // Direct In-line Order Status update
  const handleDirectOrderStatusChange = async (order: Order, newStatus: OrderStatus) => {
    await updateOrderStatus(order._id, newStatus);
    if (newStatus === 'courier_assigned' && !order.courierName) {
      handleOpenAssignCourier({ ...order, status: newStatus });
    }
  };

  // Modal Open Handlers
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setPName('');
    setPBanglaName('');
    setPCategory('food');
    setPPrice(500);
    setPOriginalPrice(600);
    const defaultImg = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800';
    setPImage(defaultImg);
    setPImages([defaultImg]);
    setNewImgInput('');
    setPDesc('');
    setPBanglaDesc('');
    setPShortDesc('');
    setPLongDesc('');
    setPSunnah(true);
    setPBadge('নতুন কালেকশন');
    setPStock(25);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod._id);
    setPName(prod.name);
    setPBanglaName(prod.banglaName);
    setPCategory(prod.category);
    setPPrice(prod.price);
    setPOriginalPrice(prod.originalPrice || prod.price);
    const initialImgs = Array.isArray(prod.images) && prod.images.length > 0
      ? prod.images
      : [prod.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800'];
    setPImage(prod.image || initialImgs[0]);
    setPImages(initialImgs);
    setNewImgInput('');
    setPDesc(prod.description);
    setPBanglaDesc(prod.banglaDescription);
    setPShortDesc(prod.shortDescription || prod.banglaDescription || '');
    setPLongDesc(prod.longDescription || prod.banglaDescription || prod.description || '');
    setPSunnah(!!prod.sunnah_certified);
    setPBadge(prod.badge || '');
    setPStock(prod.stock ?? 25);
    setIsProductModalOpen(true);
  };

  const handleAddProductImage = (urlToAdd: string) => {
    const trimmed = urlToAdd.trim();
    if (!trimmed) return;
    if (pImages.includes(trimmed)) {
      showToast('এই ছবিটি ইতিমধ্যে যুক্ত রয়েছে');
      return;
    }
    const updated = [...pImages, trimmed];
    setPImages(updated);
    if (!pImage) setPImage(trimmed);
    setNewImgInput('');
    showToast('নতুন ছবি যুক্ত হয়েছে');
  };

  const handleRemoveProductImage = (indexToRemove: number) => {
    if (pImages.length <= 1) {
      showToast('পণ্যে কমপক্ষে একটি ছবি থাকা আবশ্যক');
      return;
    }
    const targetUrl = pImages[indexToRemove];
    const updated = pImages.filter((_, idx) => idx !== indexToRemove);
    setPImages(updated);
    if (targetUrl === pImage) {
      setPImage(updated[0]);
    }
    showToast('ছবি বাদ দেওয়া হয়েছে');
  };

  const handleSetPrimaryImage = (url: string) => {
    setPImage(url);
    const updated = [url, ...pImages.filter((img) => img !== url)];
    setPImages(updated);
    showToast('মূল ছবি (Primary) নির্ধারণ করা হয়েছে');
  };

  const handleMoveProductImage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= pImages.length) return;
    const updated = [...pImages];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setPImages(updated);
    if (fromIdx === 0 || toIdx === 0) {
      setPImage(updated[0]);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pName || !pBanglaName || !pPrice) {
      showToast('অনুগ্রহ করে পণ্যের নাম ও মূল্য পূরণ করুন');
      return;
    }

    const validImages = pImages.filter((img) => Boolean(img && img.trim()));
    const finalPrimary = (pImage && validImages.includes(pImage)) ? pImage : (validImages[0] || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=800');
    const finalImagesList = validImages.length > 0 ? validImages : [finalPrimary];

    const finalDesc = pDesc.trim() || pShortDesc.trim() || pBanglaDesc.trim();
    const finalBanglaDesc = pShortDesc.trim() || pBanglaDesc.trim();
    const finalShortDesc = pShortDesc.trim() || finalBanglaDesc;
    const finalLongDesc = pLongDesc.trim() || finalBanglaDesc || finalDesc;

    if (editingProductId) {
      await updateProduct(editingProductId, {
        name: pName,
        banglaName: pBanglaName,
        category: pCategory,
        price: Number(pPrice),
        originalPrice: Number(pOriginalPrice),
        image: finalPrimary,
        images: finalImagesList,
        description: finalDesc,
        banglaDescription: finalBanglaDesc,
        shortDescription: finalShortDesc,
        longDescription: finalLongDesc,
        sunnah_certified: pSunnah,
        badge: pBadge || undefined,
        stock: Number(pStock),
      });
      showToast('পণ্য সফলভাবে আপডেট করা হয়েছে');
    } else {
      await addProduct({
        name: pName,
        banglaName: pBanglaName,
        category: pCategory,
        price: Number(pPrice),
        originalPrice: Number(pOriginalPrice),
        image: finalPrimary,
        images: finalImagesList,
        description: finalDesc,
        banglaDescription: finalBanglaDesc,
        shortDescription: finalShortDesc,
        longDescription: finalLongDesc,
        sunnah_certified: pSunnah,
        badge: pBadge || undefined,
        stock: Number(pStock),
        rating: 5,
        reviews_count: 0,
        available: true,
      });
      showToast('নতুন পণ্য ক্যাটালগে সফলভাবে যোগ করা হয়েছে');
    }
    setIsProductModalOpen(false);
  };

  // Category Handlers (Minimal & Fast)
  const handleQuickAddCategory = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = quickCatBangla.trim();
    if (!trimmed) {
      showToast('অনুগ্রহ করে ক্যাটাগরির নাম লিখুন');
      return;
    }

    const matchedPreset = CATEGORY_IMAGE_PRESETS.find((p) => p.icon === quickCatIcon);
    const selectedImage = matchedPreset ? matchedPreset.url : CATEGORY_IMAGE_PRESETS[0].url;

    // Auto-generate a clean english slug/identifier
    const transliterated = trimmed
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    const autoEnName = transliterated || `category-${Date.now().toString().slice(-4)}`;

    setIsQuickAddingCat(true);
    try {
      await addCategory({
        name: autoEnName,
        banglaName: trimmed,
        iconName: quickCatIcon,
        image: selectedImage,
        description: `${trimmed} collection`,
        banglaDescription: `${trimmed} এর বিশেষ কালেকশন`,
      });
      setQuickCatBangla('');
      showToast(`'${trimmed}' ক্যাটাগরি সফলভাবে যোগ হয়েছে!`);
    } catch {
      showToast('ক্যাটাগরি যোগ করতে সমস্যা হয়েছে');
    } finally {
      setIsQuickAddingCat(false);
    }
  };

  const handleOpenNewCategory = () => {
    setEditingCategoryId(null);
    setCName('');
    setCBanglaName('');
    setCDesc('');
    setCBanglaDesc('');
    setCImage(CATEGORY_IMAGE_PRESETS[0].url);
    setCIconName('Utensils');
    setShowCatAdvancedInModal(false);
    setShowCatCustomImage(false);
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (cat: Category) => {
    setEditingCategoryId(cat._id);
    setCName(cat.name);
    setCBanglaName(cat.banglaName);
    setCDesc(cat.description || '');
    setCBanglaDesc(cat.banglaDescription || cat.descriptionBn || '');
    setCImage(cat.image || CATEGORY_IMAGE_PRESETS[0].url);
    setCIconName(cat.iconName || 'Utensils');
    const hasCustomDetails = !!(cat.description && cat.description.length > 0 && cat.description !== `${cat.banglaName} collection`);
    setShowCatAdvancedInModal(hasCustomDetails);
    setShowCatCustomImage(!CATEGORY_IMAGE_PRESETS.some((p) => p.url === cat.image));
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cBanglaName.trim()) {
      showToast('অনুগ্রহ করে ক্যাটাগরির নাম দিন');
      return;
    }
    const finalEnName = cName.trim() || cBanglaName.trim();
    const categoryData = {
      name: finalEnName,
      banglaName: cBanglaName.trim(),
      description: cDesc.trim() || `${cBanglaName.trim()} collection`,
      banglaDescription: cBanglaDesc.trim() || `${cBanglaName.trim()} এর বিশেষ কালেকশন`,
      image: cImage.trim() || CATEGORY_IMAGE_PRESETS[0].url,
      iconName: cIconName || 'Utensils',
    };

    if (editingCategoryId) {
      await updateCategory(editingCategoryId, categoryData);
      showToast('ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে');
    } else {
      await addCategory(categoryData);
      showToast('নতুন ক্যাটাগরি তৈরি করা হয়েছে');
    }
    setIsCategoryModalOpen(false);
  };

  // Banner Handlers
  const handleOpenNewBanner = () => {
    setEditingBannerId(null);
    setBTitle('');
    setBBanglaTitle('');
    setBSubtitle('');
    setBBanglaSubtitle('');
    setBImage('https://images.unsplash.com/photo-1587049352846-4a222e784d38?q=80&w=1200');
    setBBadge('প্রিমিয়াম অফার');
    setBCta('এখনই অর্ডার করুন');
    setIsBannerModalOpen(true);
  };

  const handleEditBanner = (slide: HeroSlide) => {
    setEditingBannerId(slide._id || slide.id || null);
    setBTitle(slide.title);
    setBBanglaTitle(slide.banglaTitle);
    setBSubtitle(slide.subtitle || '');
    setBBanglaSubtitle(slide.banglaSubtitle || '');
    setBImage(slide.image);
    setBBadge(slide.badge || '');
    setBCta(slide.ctaText || 'এখনই অর্ডার করুন');
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bBanglaTitle || !bImage) {
      showToast('অনুগ্রহ করে ব্যানারের বাংলা টাইটেল ও ছবি দিন');
      return;
    }
    const slideData: Omit<HeroSlide, '_id' | 'id'> = {
      title: bTitle || bBanglaTitle,
      banglaTitle: bBanglaTitle,
      subtitle: bSubtitle || bBanglaSubtitle,
      banglaSubtitle: bBanglaSubtitle,
      image: bImage,
      badge: bBadge,
      ctaText: bCta,
      linkType: 'catalog',
      active: true,
      order: heroSlides.length + 1,
    };

    if (editingBannerId) {
      await updateHeroSlide(editingBannerId, slideData);
      showToast('ব্যানার সফলভাবে আপডেট করা হয়েছে');
    } else {
      await addHeroSlide(slideData);
      showToast('নতুন ব্যানার সফলভাবে যুক্ত হয়েছে');
    }
    setIsBannerModalOpen(false);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchProduct.trim()) {
        const q = searchProduct.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q) || p.banglaName.toLowerCase().includes(q);
        if (!matchesName) return false;
      }
      if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) {
        return false;
      }
      if (productStockFilter === 'low' && (p.stock ?? 25) > 10) {
        return false;
      }
      if (productStockFilter === 'out' && (p.stock ?? 25) > 0) {
        return false;
      }
      return true;
    });
  }, [products, searchProduct, productCategoryFilter, productStockFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) {
        return false;
      }
      if (orderChannelFilter !== 'all') {
        if (orderChannelFilter === 'whatsapp' && o.channel !== 'whatsapp') return false;
        if (orderChannelFilter === 'website_cod' && o.channel === 'whatsapp') return false;
      }
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        const matchId = o._id.toLowerCase().includes(q);
        const matchName = o.customer.name.toLowerCase().includes(q);
        const matchPhone = o.customer.phone.toLowerCase().includes(q);
        const matchDistrict = o.customer.district?.toLowerCase().includes(q);
        const matchCourier = o.courierName?.toLowerCase().includes(q);
        const matchTracking = o.trackingNumber?.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchPhone && !matchDistrict && !matchCourier && !matchTracking) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderChannelFilter, orderSearch]);

  // Reset Product Page on filter change
  useEffect(() => {
    setProductPage(1);
  }, [searchProduct, productCategoryFilter, productStockFilter]);

  // Reset Order Page on filter change
  useEffect(() => {
    setOrderPage(1);
  }, [orderStatusFilter, orderChannelFilter, orderSearch]);

  // Product Pagination Slice
  const totalProductPages = Math.ceil(filteredProducts.length / productsPerPage) || 1;
  const currentProductPage = Math.min(productPage, totalProductPages);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentProductPage - 1) * productsPerPage,
      currentProductPage * productsPerPage
    );
  }, [filteredProducts, currentProductPage, productsPerPage]);

  // Order Pagination Slice
  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage) || 1;
  const currentOrderPage = Math.min(orderPage, totalOrderPages);
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(
      (currentOrderPage - 1) * ordersPerPage,
      currentOrderPage * ordersPerPage
    );
  }, [filteredOrders, currentOrderPage, ordersPerPage]);

  // Global Search Results (Instant Jump)
  const globalSearchResults = useMemo(() => {
    if (!globalSearch.trim() || globalSearch.length < 2) return null;
    const q = globalSearch.toLowerCase();
    const matchedProducts = products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.banglaName.toLowerCase().includes(q)
    ).slice(0, 4);
    const matchedOrders = orders.filter(
      (o) => o._id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || o.customer.phone.includes(q)
    ).slice(0, 4);
    const matchedCategories = categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.banglaName.toLowerCase().includes(q)
    ).slice(0, 3);
    return { products: matchedProducts, orders: matchedOrders, categories: matchedCategories };
  }, [globalSearch, products, orders, categories]);

  // Current selected order reference
  const currentSelectedOrder = selectedOrder
    ? orders.find((o) => o._id === selectedOrder._id) || selectedOrder
    : null;

  useEffect(() => {
    if (currentSelectedOrder) {
      setModalCourierName(currentSelectedOrder.courierName || BD_COURIERS[0]);
      setModalTrackingNumber(currentSelectedOrder.trackingNumber || '');
    }
  }, [currentSelectedOrder?._id, currentSelectedOrder?.courierName, currentSelectedOrder?.trackingNumber]);

  return (
    <div className="min-h-screen bg-[#f8f9f6] text-neutral-900 flex flex-col antialiased">
      {/* ========================================================= */}
      {/* TOP CONTROL APP BAR */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-2xs">
        <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left Brand & Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl text-neutral-600 hover:text-[#2d5016] hover:bg-neutral-100 transition-colors cursor-pointer"
              title="মেনু খুলুন"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-3 cursor-pointer group"
            >
              <KasabLogo className="w-9 h-9 shadow-xs shrink-0 group-hover:scale-105 transition-transform" />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-serif-brand font-bold text-base text-neutral-900 tracking-tight leading-none">
                    Kasab Gallery
                  </span>
                  <span className="px-1.5 py-0.2 rounded-md bg-[#2d5016] text-[#d4af37] text-[10px] font-black uppercase tracking-wider">
                    অ্যাডমিন
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 font-medium block mt-0.5">
                  সেন্ট্রাল বিজনেস ও কন্ট্রোল হাব
                </span>
              </div>
            </div>
          </div>

          {/* Center Global Search (Fast lookup) */}
          <div className="flex-1 max-w-md hidden md:block relative">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                onFocus={() => setIsGlobalSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsGlobalSearchFocused(false), 250)}
                placeholder="অর্ডার আইডি, গ্রাহকের নাম, ফোন বা পণ্য খুঁজুন..."
                className="w-full pl-9 pr-8 py-2 rounded-xl border border-neutral-200/90 bg-neutral-50/70 hover:bg-white focus:bg-white text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] transition-all"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Global Search Results Dropdown */}
            {isGlobalSearchFocused && globalSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-neutral-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                {/* Orders Match */}
                {globalSearchResults.orders.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      অর্ডারসমূহ ({globalSearchResults.orders.length})
                    </span>
                    <div className="space-y-1">
                      {globalSearchResults.orders.map((o) => (
                        <div
                          key={o._id}
                          onMouseDown={() => {
                            setSelectedOrder(o);
                            setActiveTab('orders');
                            setGlobalSearch('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer text-xs"
                        >
                          <div className="min-w-0">
                            <span className="font-bold text-[#2d5016]">#{o._id}</span>
                            <span className="text-neutral-600 ml-2 font-medium">{o.customer.name}</span>
                            <span className="text-neutral-400 ml-1.5 text-[11px]">({o.customer.phone})</span>
                          </div>
                          <span className="font-bold text-neutral-900 shrink-0">{formatBDT(o.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Match */}
                {globalSearchResults.products.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                      ক্যাটালগ পণ্য ({globalSearchResults.products.length})
                    </span>
                    <div className="space-y-1">
                      {globalSearchResults.products.map((p) => (
                        <div
                          key={p._id}
                          onMouseDown={() => {
                            handleEditProduct(p);
                            setActiveTab('products');
                            setGlobalSearch('');
                          }}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-50 cursor-pointer text-xs"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img src={p.image} alt="" className="w-6 h-6 rounded-md object-cover" />
                            <span className="font-bold text-neutral-900 truncate">{p.banglaName}</span>
                          </div>
                          <span className="font-bold text-[#2d5016] shrink-0">{formatBDT(p.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty check */}
                {globalSearchResults.orders.length === 0 && globalSearchResults.products.length === 0 && (
                  <div className="py-4 text-center text-xs text-neutral-400">
                    কোনো তথ্য পাওয়া যায়নি
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5">
            {/* Database Sync Refresh Button */}
            <button
              onClick={() => refreshDbData()}
              disabled={isLoadingDb}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-neutral-200 hover:border-[#2d5016]/40 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 disabled:opacity-50"
              title="ক্লাউড ডেটাবেজ সিঙ্ক রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2d5016] ${isLoadingDb ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">সিঙ্ক রিফ্রেশ</span>
            </button>

            {/* Quick Action Create Button */}
            <button
              onClick={handleOpenNewProduct}
              className="px-3.5 py-1.5 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer hover:shadow-md active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">নতুন পণ্য</span>
            </button>

            {/* View Live Storefront Button */}
            <button
              onClick={() => setCurrentPage('home')}
              className="px-3 py-1.5 rounded-xl border border-[#d4af37]/40 bg-[#fbf8ee] hover:bg-[#f6f1de] text-[#855e09] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs shrink-0"
              title="গ্রাহকের মতো লাইভ ওয়েবসাইট দেখুন"
            >
              <Store className="w-3.5 h-3.5 text-[#d4af37]" />
              <span className="hidden md:inline">লাইভ স্টোর</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </button>

            {/* Admin Profile dropdown or badge */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-neutral-200">
              <div className="w-8 h-8 rounded-full bg-[#2d5016] text-[#d4af37] flex items-center justify-center font-bold text-xs shadow-2xs">
                ক
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-neutral-900 block leading-tight">
                  {currentUser?.name || 'অ্যাডমিন'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold block leading-tight">
                  সুপার এক্সেস
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* WORKSPACE LAYOUT (SIDEBAR + MAIN CONTENT AREA) */}
      {/* ========================================================= */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto flex">
        {/* ========================================================= */}
        {/* DESKTOP & MOBILE NAVIGATION SIDEBAR */}
        {/* ========================================================= */}
        {/* Mobile Backdrop */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-2xs z-40 lg:hidden"
          />
        )}

        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200/90 p-4 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 lg:z-10 ${
            isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:shadow-none'
          }`}
        >
          {/* Top Section */}
          <div className="space-y-6">
            {/* Mobile Header Inside Drawer */}
            <div className="flex items-center justify-between lg:hidden pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <KasabLogo className="w-7 h-7" />
                <span className="font-serif-brand font-bold text-sm text-neutral-900">অ্যাডমিন মেনু</span>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav Group 1: ওভারভিউ ও সেলস */}
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 block mb-1.5">
                ওভারভিউ ও সেলস
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-[#2d5016] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <LayoutDashboard className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>ড্যাশবোর্ড ও বিশ্লেষণ</span>
                  </div>
                  {activeTab === 'dashboard' && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                </button>

                <button
                  onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-[#2d5016] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className={`w-4 h-4 ${activeTab === 'orders' ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>অর্ডারসমূহ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {pendingOrders > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse">
                        {pendingOrders}
                      </span>
                    )}
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {orders.length}
                    </span>
                  </div>
                </button>
              </nav>
            </div>

            {/* Nav Group 2: ক্যাটালগ ও স্টক */}
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 block mb-1.5">
                ক্যাটালগ ও স্টক
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'products'
                      ? 'bg-[#2d5016] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Package className={`w-4 h-4 ${activeTab === 'products' ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>পণ্য ক্যাটালগ</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {lowStockProducts.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800" title="স্টক কম">
                        {lowStockProducts.length} কম
                      </span>
                    )}
                    <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      activeTab === 'products' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                    }`}>
                      {products.length}
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => { setActiveTab('categories'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'categories'
                      ? 'bg-[#2d5016] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Folder className={`w-4 h-4 ${activeTab === 'categories' ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>ক্যাটাগরি সমূহ</span>
                  </div>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'categories' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {categories.length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Nav Group 3: মার্কেটিং ও কন্টেন্ট */}
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 block mb-1.5">
                মার্কেটিং ও কন্টেন্ট
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab('banners'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'banners'
                      ? 'bg-[#2d5016] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className={`w-4 h-4 ${activeTab === 'banners' ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>হাইলাইটেড পণ্য (Hero)</span>
                  </div>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'banners' ? 'bg-white/20 text-white' : 'bg-[#2d5016]/10 text-[#2d5016]'
                  }`}>
                    {localHighlights.length} টি
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('notice'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'notice'
                      ? 'bg-[#2d5016] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Megaphone className={`w-4 h-4 ${activeTab === 'notice' ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>স্ক্রোলিং ঘোষণা বার</span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${noticeEnabled ? 'bg-emerald-500' : 'bg-neutral-300'}`} />
                </button>

                <button
                  onClick={() => { setActiveTab('blogs'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'blogs'
                      ? 'bg-[#2d5016] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BookOpen className={`w-4 h-4 ${activeTab === 'blogs' ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>ব্লগ ও আর্টিকেল</span>
                  </div>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'blogs' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {blogs.length}
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('testimonials'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'testimonials'
                      ? 'bg-[#2d5016] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquareQuote className={`w-4 h-4 ${activeTab === 'testimonials' ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>গ্রাহক রিভিউ</span>
                  </div>
                  <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'testimonials' ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    {testimonials.length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Nav Group 4: সিস্টেম ও ক্লাউড */}
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-3 block mb-1.5">
                সিস্টেম হাব
              </span>
              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveTab('system'); setIsMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'system'
                      ? 'bg-[#2d5016] text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Database className={`w-4 h-4 ${activeTab === 'system' ? 'text-[#d4af37]' : 'text-neutral-500'}`} />
                    <span>ক্লাউড ডেটাবেজ স্ট্যাটাস</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </button>
              </nav>
            </div>
          </div>

          {/* Bottom Card in Sidebar */}
          <div className="pt-4 border-t border-neutral-100 space-y-2">
            <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 mb-1">
                <ShieldCheck className="w-4 h-4 text-[#2d5016]" />
                <span>নিরাপদ সিস্টেম</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-snug">
                Kasab Gallery পূর্ণাঙ্গ অ্যাডমিন কন্ট্রোল সক্রিয়
              </p>
            </div>

            <button
              onClick={() => {
                logoutUser();
                setCurrentPage('home');
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-neutral-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট করুন</span>
            </button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* MAIN WORKSPACE BODY */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-8">
          {/* ======================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW & ANALYTICS */}
          {/* ======================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Executive Welcome Hero Banner */}
              <div className="bg-gradient-to-r from-[#2d5016] via-[#213c0f] to-[#17250c] text-white rounded-3xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-[#d4af37] uppercase tracking-wider mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Kasab Gallery বিজনেস ওপারেশনস হাব</span>
                    </div>
                    <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold text-white">
                      স্বাগতম, অ্যাডমিন কন্ট্রোল প্যানেল
                    </h1>
                    <p className="text-xs sm:text-sm text-neutral-200 mt-1 max-w-2xl font-light">
                      এখানে রিয়েল-টাইম অর্ডার পাইপলাইন, ক্যাটালগ ইনভেন্টরি, হোম ব্যানার ও স্ক্রোলিং ঘোষণা এক ক্লিকে সহজে নিয়ন্ত্রণ করুন।
                    </p>
                  </div>

                  {/* Status Badges & Direct Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <div className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{dbStatus?.connected ? 'MongoDB Live' : 'Database Ready'}</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-sky-500/20 text-sky-200 border border-sky-400/30">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>{cloudinaryStatus?.configured ? 'Cloudinary CDN' : 'Upload Ready'}</span>
                    </div>

                    <button
                      onClick={handleOpenNewProduct}
                      className="px-3.5 py-1.5 rounded-xl bg-white text-[#2d5016] hover:bg-neutral-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>পণ্য যুক্ত</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4 Primary KPI Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:border-[#2d5016]/50 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-semibold">মোট বিক্রয় রেভিনিউ</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-[#2d5016] block">
                    {formatBDT(totalRevenue)}
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                    ক্যাশ অন ডেলিভারি ও অনলাইন
                  </span>
                </div>

                <div 
                  onClick={() => { setActiveTab('orders'); setOrderStatusFilter('all'); }}
                  className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:border-[#2d5016]/50 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-semibold">মোট অর্ডার সংখ্যা</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-neutral-900 block">
                    {orders.length} টি
                  </span>
                  <span className="text-[11px] text-amber-600 font-bold mt-1 block">
                    {pendingOrders} টি পেন্ডিং কনফার্মেশন বাকি
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('products')}
                  className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:border-[#2d5016]/50 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-semibold">সক্রিয় ক্যাটালগ পণ্য</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package className="w-4 h-4" />
                    </div>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-neutral-900 block">
                    {products.length} টি
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-1 block">
                    {categories.length} টি ক্যাটাগরিতে বিভক্ত
                  </span>
                </div>

                <div 
                  onClick={() => setActiveTab('banners')}
                  className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:border-[#2d5016]/50 hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-neutral-500 mb-2">
                    <span className="text-xs font-semibold">হাইলাইটেড হিরো পণ্য</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Sparkles className="w-4 h-4 text-[#2d5016]" />
                    </div>
                  </div>
                  <span className="text-xl sm:text-2xl font-black text-neutral-900 block">
                    ৩টি বেন্টো কার্ড
                  </span>
                  <span className="text-[11px] text-[#2d5016] font-medium mt-1 block">
                    সরাসরি নিয়ন্ত্রণযোগ্য
                  </span>
                </div>
              </div>

              {/* Order Status Pipeline Interactive Bar */}
              <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif-brand font-bold text-base text-neutral-900">
                      অর্ডার স্ট্যাটাস পাইপলাইন (Order Lifecycle Pipeline)
                    </h2>
                    <p className="text-xs text-neutral-500">
                      যেকোনো ধাপে ক্লিক করে সেই স্ট্যাটাসের অর্ডারসমূহ ফিল্টার করুন
                    </p>
                  </div>
                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('all'); }}
                    className="text-xs font-bold text-[#2d5016] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>সকল অর্ডার দেখুন</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('pending'); }}
                    className="p-3 rounded-2xl bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200 text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
                      <span>পেন্ডিং</span>
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-amber-900 mt-1 tabular-nums">{pendingOrders}</div>
                    <span className="text-[10px] text-amber-700">কনফার্মেশন অপেক্ষা</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('confirmed'); }}
                    className="p-3 rounded-2xl bg-blue-50/80 hover:bg-blue-100/90 border border-blue-200 text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-blue-800 text-xs font-bold">
                      <span>কনফার্মড</span>
                      <Check className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-black text-blue-900 mt-1 tabular-nums">{confirmedOrders}</div>
                    <span className="text-[10px] text-blue-700">প্যাকিং প্রস্তুতি</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('processing'); }}
                    className="p-3 rounded-2xl bg-purple-50/80 hover:bg-purple-100/90 border border-purple-200 text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-purple-800 text-xs font-bold">
                      <span>প্রসেসিং</span>
                      <Package className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-purple-900 mt-1 tabular-nums">{processingOrders}</div>
                    <span className="text-[10px] text-purple-700">প্যাকেজিং চলমান</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('courier_assigned'); }}
                    className="p-3 rounded-2xl bg-cyan-50/80 hover:bg-cyan-100/90 border border-cyan-200 text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-cyan-800 text-xs font-bold">
                      <span>কুরিয়ার ও শিপড</span>
                      <Truck className="w-3.5 h-3.5 text-cyan-600" />
                    </div>
                    <div className="text-2xl font-black text-cyan-900 mt-1 tabular-nums">{courierAssignedOrders + shippedOrders}</div>
                    <span className="text-[10px] text-cyan-700">কুরিয়ার হস্তান্তর / পথে</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('delivered'); }}
                    className="p-3 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200 text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
                      <span>ডেলিভারড</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-900 mt-1 tabular-nums">{deliveredOrders}</div>
                    <span className="text-[10px] text-emerald-700">সফল ডেলিভারি সম্পন্ন</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('orders'); setOrderStatusFilter('cancelled'); }}
                    className="p-3 rounded-2xl bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200 text-left transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
                      <span>বাতিল / হোল্ড</span>
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                    </div>
                    <div className="text-2xl font-black text-rose-900 mt-1 tabular-nums">{cancelledOrders + holdOrders + returnedOrders}</div>
                    <span className="text-[10px] text-rose-700">বাতিল, হোল্ড বা রিটার্ন</span>
                  </button>
                </div>
              </div>

              {/* Instant Announcement Bar Controller Widget (Easy Control right on dashboard!) */}
              <div className="bg-white rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      noticeEnabled ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-400'
                    }`}>
                      <Megaphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif-brand font-bold text-sm text-neutral-900">
                          স্ক্রোলিং নোটিশ বার নিয়ন্ত্রণ (Quick Announcement Switcher)
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          noticeEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {noticeEnabled ? 'বর্তমানে লাইভ চলছে' : 'বন্ধ রয়েছে'}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500">
                        ওয়েবসাইটের একদম উপরে স্ক্রোলিং বিজ্ঞপ্তির দ্রুত সুইচ ও পরিবর্তন
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleToggleNoticeLive}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        noticeEnabled
                          ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {noticeEnabled ? 'ঘোষণা বার বন্ধ করুন' : 'ঘোষণা বার চালু করুন'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('notice')}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer"
                    >
                      সম্পূর্ণ এডিটর
                    </button>
                  </div>
                </div>

                {/* Inline Quick Text Edit */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={noticeText}
                    onChange={(e) => setNoticeText(e.target.value)}
                    placeholder="স্ক্রোলিং নোটিশের বাংলা টেক্সট লিখুন..."
                    className="flex-1 px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20"
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveNotice()}
                    disabled={isSavingNotice}
                    className="px-4 py-2 rounded-xl bg-[#2d5016] text-white text-xs font-bold hover:bg-[#234011] cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isSavingNotice ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ'}
                  </button>
                </div>
              </div>

              {/* 2-Column Section: Recent Orders & Stock Alert Hub */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Recent Orders (7 cols) */}
                <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif-brand font-bold text-base text-neutral-900">
                        সাম্প্রতিক গ্রাহক অর্ডারসমূহ (Recent Orders)
                      </h3>
                      <p className="text-xs text-neutral-500">
                        সর্বশেষ অর্ডারের তাৎক্ষণিক ভিউ ও স্ট্যাটাস পরিবর্তন
                      </p>
                    </div>
                    <button
                      onClick={() => { setActiveTab('orders'); setOrderStatusFilter('all'); }}
                      className="text-xs font-bold text-[#2d5016] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>সকল অর্ডার</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-400">
                      এখনো কোনো অর্ডার পাওয়া যায়নি
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase text-[10px]">
                            <th className="pb-2.5 px-2">অর্ডার আইডি</th>
                            <th className="pb-2.5 px-2">গ্রাহক</th>
                            <th className="pb-2.5 px-2">মোট মূল্য</th>
                            <th className="pb-2.5 px-2">স্ট্যাটাস</th>
                            <th className="pb-2.5 px-2 text-right">অ্যাকশন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {recentOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-neutral-50/70 transition-colors">
                              <td className="py-3 px-2 font-mono font-bold whitespace-nowrap">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-[#2d5016] hover:underline cursor-pointer"
                                  title="বিস্তারিত ইনভয়েস দেখুন"
                                >
                                  #{order._id}
                                </button>
                                <span className="block text-[10px] text-neutral-400 font-sans font-normal">
                                  {order.channel === 'whatsapp' ? '📱 WhatsApp' : '🌐 Website COD'}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <span className="font-bold text-neutral-900 block truncate max-w-[130px]">
                                  {order.customer.name}
                                </span>
                                <a 
                                  href={`tel:${order.customer.phone}`}
                                  className="text-[11px] text-neutral-500 hover:text-[#2d5016] block truncate"
                                >
                                  {order.customer.phone}
                                </a>
                              </td>
                              <td className="py-3 px-2 font-black text-neutral-900 whitespace-nowrap">
                                {formatBDT(order.total)}
                              </td>
                              <td className="py-3 px-2 whitespace-nowrap">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleDirectOrderStatusChange(order, e.target.value as OrderStatus)}
                                  className={`text-[10px] font-bold px-2 py-1 rounded-lg border outline-none cursor-pointer ${
                                    ORDER_STATUS_CONFIG[order.status]?.badgeClass || 'bg-amber-50 text-amber-800 border-amber-200'
                                  }`}
                                >
                                  {ALL_ORDER_STATUSES.map((st) => (
                                    <option key={st} value={st}>
                                      {ORDER_STATUS_CONFIG[st].label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3 px-2 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-1.5">
                                  <a
                                    href={`https://wa.me/88${order.customer.phone.replace(/^0/, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${order.customer.name}, Kasab Gallery থেকে আপনার অর্ডার #${order._id} সংক্রান্ত বিষয়ে যোগাযোগ করছি।`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                    title="WhatsApp এ বার্তা দিন"
                                  >
                                    <MessageCircle className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-[#2d5016] hover:text-white text-neutral-700 text-[11px] font-bold transition-colors cursor-pointer"
                                  >
                                    ভিউ
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Right Column: Inventory & Stock Alert Hub (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Low stock alert with Instant Quick Re-stock (+5, +10) */}
                  <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <h3 className="font-serif-brand font-bold text-base text-neutral-900">
                          ইনভেন্টরি স্টক সতর্কতা
                        </h3>
                      </div>
                      <button
                        onClick={() => { setActiveTab('products'); setProductStockFilter('low'); }}
                        className="text-xs font-bold text-[#2d5016] hover:underline cursor-pointer"
                      >
                        সকল পণ্য
                      </button>
                    </div>

                    {lowStockProducts.length === 0 ? (
                      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>সব পণ্যের পর্যাপ্ত স্টক মজুদ রয়েছে!</span>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {lowStockProducts.slice(0, 5).map((p) => (
                          <div
                            key={p._id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-50/70 border border-neutral-200/80 hover:bg-neutral-100/70 transition-colors gap-2"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={p.image}
                                alt=""
                                className="w-9 h-9 rounded-lg object-cover border border-neutral-200 shrink-0"
                              />
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-neutral-900 block truncate max-w-[120px] sm:max-w-[150px]">
                                  {p.banglaName}
                                </span>
                                <span className={`text-[10px] font-bold block ${
                                  (p.stock ?? 25) <= 5 ? 'text-rose-600' : 'text-amber-600'
                                }`}>
                                  স্টক: {p.stock ?? 25} টি অবশিষ্ট
                                </span>
                              </div>
                            </div>

                            {/* Instant Restock Buttons */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleQuickStockAdjust(p, 5)}
                                className="px-2 py-1 rounded-lg bg-white hover:bg-[#2d5016] hover:text-white border border-neutral-200 text-[10px] font-bold transition-colors cursor-pointer"
                                title="+৫ টি স্টক যোগ করুন"
                              >
                                +৫
                              </button>
                              <button
                                onClick={() => handleQuickStockAdjust(p, 10)}
                                className="px-2 py-1 rounded-lg bg-white hover:bg-[#2d5016] hover:text-white border border-neutral-200 text-[10px] font-bold transition-colors cursor-pointer"
                                title="+১০ টি স্টক যোগ করুন"
                              >
                                +১০
                              </button>
                              <button
                                onClick={() => handleEditProduct(p)}
                                className="p-1 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200 cursor-pointer"
                                title="সম্পূর্ণ এডিট"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Category Quick Distribution Widget */}
                  <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Folder className="w-4 h-4 text-[#2d5016]" />
                        <h3 className="font-serif-brand font-bold text-base text-neutral-900">
                          ক্যাটাগরি ওভারভিউ ({categories.length} টি)
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('categories')}
                        className="text-xs font-bold text-[#2d5016] hover:underline cursor-pointer"
                      >
                        ম্যানেজ করুন
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {categories.map((cat) => {
                        const count = products.filter((p) => p.category === cat._id).length;
                        return (
                          <div
                            key={cat._id}
                            onClick={() => {
                              setActiveTab('products');
                              setProductCategoryFilter(cat._id);
                            }}
                            className="p-2.5 rounded-xl border border-neutral-200 hover:border-[#2d5016]/40 hover:bg-neutral-50 transition-all cursor-pointer flex items-center gap-2"
                          >
                            <img
                              src={cat.image}
                              alt=""
                              className="w-7 h-7 rounded-lg object-cover border border-neutral-200 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <span className="text-[11px] font-bold text-neutral-800 block truncate">
                                {cat.banglaName}
                              </span>
                              <span className="text-[10px] text-neutral-400 block">
                                {count} টি পণ্য
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 2: ORDERS MANAGEMENT (MOBILE-FIRST + DESKTOP TABLE) */}
          {/* ======================================================= */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-neutral-200/90 shadow-2xs space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* Header & Search / Channel Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-neutral-900">
                      অর্ডার ব্যবস্থাপনা
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2d5016]/10 text-[#2d5016] text-[11px] font-bold tabular-nums">
                      মোট {orders.length} টি
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    যেকোনো অর্ডারের উপর ক্লিক করলে সম্পূর্ণ তথ্য, কুরিয়ার ও ইনভয়েস দেখা যাবে
                  </p>
                </div>

                {/* Responsive Search & Channel Filters */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      placeholder="অর্ডার, নাম, ফোন বা কুরিয়ার..."
                      className="w-full pl-8 pr-3 py-2 sm:py-1.5 rounded-xl border border-neutral-200 text-xs bg-neutral-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#2d5016]"
                    />
                  </div>

                  <select
                    value={orderChannelFilter}
                    onChange={(e) => setOrderChannelFilter(e.target.value)}
                    className="px-3 py-2 sm:py-1.5 rounded-xl border border-neutral-200 text-xs bg-white text-neutral-700 outline-none cursor-pointer font-medium"
                  >
                    <option value="all">সকল চ্যানেল</option>
                    <option value="website_cod">ওয়েবসাইট COD / অনলাইন</option>
                    <option value="whatsapp">হোয়াটসঅ্যাপ</option>
                  </select>
                </div>
              </div>

              {/* Horizontal Scrollable Single-Line Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-neutral-100/80 p-1.5 rounded-2xl">
                {[
                  { id: 'all', label: 'সব অর্ডার', count: orders.length },
                  { id: 'pending', label: 'পেন্ডিং', count: pendingOrders },
                  { id: 'confirmed', label: 'কনফার্মড', count: confirmedOrders },
                  { id: 'processing', label: 'প্রসেসিং', count: processingOrders },
                  { id: 'courier_assigned', label: 'কুরিয়ার', count: courierAssignedOrders },
                  { id: 'shipped', label: 'শিপড', count: shippedOrders },
                  { id: 'delivered', label: 'ডেলিভারড', count: deliveredOrders },
                  { id: 'hold', label: 'হোল্ড', count: holdOrders },
                  { id: 'returned', label: 'রিটার্নড', count: returnedOrders },
                  { id: 'cancelled', label: 'বাতিল', count: cancelledOrders },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setOrderStatusFilter(st.id)}
                    className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      orderStatusFilter === st.id
                        ? 'bg-white text-neutral-900 shadow-xs'
                        : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <span>{st.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold tabular-nums ${
                        orderStatusFilter === st.id ? 'bg-neutral-900 text-white' : 'bg-neutral-200/80 text-neutral-700'
                      }`}
                    >
                      {st.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* UNIFIED RESPONSIVE TABLE (MOBILE + DESKTOP) */}
              <div className="overflow-x-auto rounded-2xl border border-neutral-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/80 text-neutral-500 font-semibold text-[11px] uppercase tracking-wider border-b border-neutral-100">
                    <tr>
                      <th className="py-2.5 px-2.5 sm:px-3">অর্ডার ও গ্রাহক</th>
                      <th className="py-2.5 px-3 hidden lg:table-cell">তারিখ ও সময়</th>
                      <th className="py-2.5 px-3 hidden md:table-cell">পণ্য সামগ্রী</th>
                      <th className="py-2.5 px-3 hidden sm:table-cell">কুরিয়ার</th>
                      <th className="py-2.5 px-2 sm:px-3">মোট</th>
                      <th className="py-2.5 px-2 sm:px-3">স্ট্যাটাস</th>
                      <th className="py-2.5 px-3 text-right hidden md:table-cell">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-neutral-400">
                          কোনো অর্ডার পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      paginatedOrders.map((order) => (
                        <tr
                          key={order._id}
                          onClick={() => setSelectedOrder(order)}
                          className="hover:bg-[#f8f9f6] active:bg-neutral-100/80 transition-colors cursor-pointer"
                          title="সম্পূর্ণ তথ্য দেখতে ক্লিক করুন"
                        >
                          {/* Order ID + Customer Info (compact on mobile, expanded on desktop) */}
                          <td className="py-2.5 px-2.5 sm:px-3 min-w-[135px] max-w-[180px] sm:max-w-none">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono font-bold text-[#2d5016] text-xs">
                                #{order._id}
                              </span>
                              <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600">
                                {order.channel === 'whatsapp'
                                  ? 'WA'
                                  : order.paymentMethod && order.paymentMethod !== 'cod'
                                  ? order.paymentMethod.toUpperCase()
                                  : 'COD'}
                              </span>
                            </div>
                            <span className="font-bold text-neutral-900 block truncate mt-0.5">
                              {order.customer.name}
                            </span>
                            <span className="text-[11px] text-neutral-500 block truncate">
                              {order.customer.phone}
                            </span>
                            {order.courierName && (
                              <span className="sm:hidden inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-800 mt-0.5">
                                <Truck className="w-2.5 h-2.5" />
                                <span className="truncate max-w-[120px]">{order.courierName}</span>
                              </span>
                            )}
                          </td>

                          {/* Date (lg+) */}
                          <td className="py-2.5 px-3 text-neutral-500 whitespace-nowrap hidden lg:table-cell">
                            {new Date(order.orderDate || order.createdAt || Date.now()).toLocaleDateString('bn-BD', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          {/* Items (md+) */}
                          <td className="py-2.5 px-3 min-w-[160px] hidden md:table-cell">
                            <div className="space-y-0.5">
                              {order.items.slice(0, 2).map((i, idx) => (
                                <div key={idx} className="text-[11px] text-neutral-700 truncate max-w-[200px]">
                                  <strong>{i.quantity}x</strong> {i.banglaName}
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <span className="text-[10px] text-[#2d5016] font-semibold">
                                  + আরও {order.items.length - 2}টি
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Courier Partner (sm+) */}
                          <td
                            className="py-2.5 px-3 whitespace-nowrap hidden sm:table-cell"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {order.courierName ? (
                              <button
                                type="button"
                                onClick={() => handleOpenAssignCourier(order)}
                                className="text-left px-2 py-1 rounded-lg bg-cyan-50/80 border border-cyan-200 hover:bg-cyan-100/80 transition-colors cursor-pointer"
                                title="কুরিয়ার তথ্য পরিবর্তন করুন"
                              >
                                <span className="text-[11px] font-bold text-cyan-900 flex items-center gap-1">
                                  <Truck className="w-3 h-3 text-cyan-700" />
                                  <span>{order.courierName}</span>
                                </span>
                                {order.trackingNumber && (
                                  <span className="block font-mono text-[10px] text-cyan-700 mt-0.5">
                                    #{order.trackingNumber}
                                  </span>
                                )}
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenAssignCourier(order)}
                                className="px-2 py-1 rounded-lg border border-dashed border-neutral-300 hover:border-cyan-400 hover:bg-cyan-50/60 text-neutral-600 hover:text-cyan-800 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Truck className="w-3 h-3" />
                                <span>অ্যাসাইন</span>
                              </button>
                            )}
                          </td>

                          {/* Total */}
                          <td className="py-2.5 px-2 sm:px-3 whitespace-nowrap tabular-nums">
                            <span className="font-bold text-[#2d5016] text-xs sm:text-sm block">
                              {formatBDT(order.total)}
                            </span>
                            <span className="text-[10px] text-neutral-400 block">
                              {order.items.length} পণ্য
                            </span>
                          </td>

                          {/* Inline Status Dropdown */}
                          <td
                            className="py-2.5 px-2 sm:px-3 whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                          >
                            <select
                              value={order.status}
                              onChange={(e) => handleDirectOrderStatusChange(order, e.target.value as OrderStatus)}
                              className={`max-w-[112px] sm:max-w-none text-[11px] sm:text-xs font-bold px-2 py-1.5 rounded-xl border outline-none cursor-pointer ${
                                ORDER_STATUS_CONFIG[order.status]?.badgeClass || 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {ALL_ORDER_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {ORDER_STATUS_CONFIG[st].shortLabel}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Desktop Quick Actions (md+) */}
                          <td
                            className="py-2.5 px-3 text-right whitespace-nowrap hidden md:table-cell"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-end gap-1">
                              <a
                                href={`https://wa.me/88${order.customer.phone.replace(/^0/, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${order.customer.name}, Kasab Gallery থেকে আপনার অর্ডার #${order._id} (মোট: ${formatBDT(order.total)}) সংক্রান্ত বিষয়ে যোগাযোগ করছি।`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                                title="WhatsApp এ বার্তা দিন"
                              >
                                <MessageCircle className="w-4 h-4" />
                              </a>

                              <button
                                type="button"
                                onClick={() => printInvoice(order)}
                                className="p-1.5 text-neutral-600 hover:text-[#2d5016] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                                title="ইনভয়েস প্রিন্ট করুন"
                              >
                                <Printer className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => downloadInvoice(order)}
                                className="p-1.5 text-neutral-600 hover:text-[#2d5016] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                                title="PDF ইনভয়েস ডাউনলোড"
                              >
                                <Download className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() => setOrderToDelete(order)}
                                className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="অর্ডার ডিলিট করুন"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Order Pagination Bar */}
              {totalOrderPages > 1 && (
                <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <div className="text-neutral-500 font-medium text-center sm:text-left">
                    মোট <strong className="text-neutral-900">{filteredOrders.length}</strong>টি অর্ডারের মধ্যে{' '}
                    <strong className="text-neutral-900 tabular-nums">
                      {(currentOrderPage - 1) * ordersPerPage + 1}-{Math.min(currentOrderPage * ordersPerPage, filteredOrders.length)}
                    </strong>{' '}
                    দেখানো হচ্ছে
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setOrderPage((p) => Math.max(1, p - 1))}
                      disabled={currentOrderPage === 1}
                      className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 transition-colors cursor-pointer"
                      title="আগের পৃষ্ঠা"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setOrderPage(num)}
                          className={`min-w-7 h-7 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer tabular-nums ${
                            currentOrderPage === num
                              ? 'bg-[#2d5016] text-[#d4af37] shadow-2xs font-black'
                              : 'text-neutral-700 hover:bg-neutral-100 border border-transparent'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setOrderPage((p) => Math.min(totalOrderPages, p + 1))}
                      disabled={currentOrderPage === totalOrderPages}
                      className="p-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 transition-colors cursor-pointer"
                      title="পরের পৃষ্ঠা"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <select
                      value={ordersPerPage}
                      onChange={(e) => {
                        setOrdersPerPage(Number(e.target.value));
                        setOrderPage(1);
                      }}
                      className="ml-1 px-2 py-1 rounded-xl border border-neutral-200 text-xs bg-neutral-50 text-neutral-700 outline-none cursor-pointer"
                    >
                      <option value={10}>১০ / পৃষ্ঠা</option>
                      <option value={20}>২০ / পৃষ্ঠা</option>
                      <option value={50}>৫০ / পৃষ্ঠা</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 3: PRODUCTS CATALOG MANAGEMENT */}
          {/* ======================================================= */}
          {activeTab === 'products' && (
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-neutral-200/70 shadow-2xs space-y-5 animate-in fade-in duration-200">
              {/* Header & Controls */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                      পণ্য ক্যাটালগ ও স্টক
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2d5016]/10 text-[#2d5016] text-[11px] font-semibold">
                      {products.length}টি পণ্য
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    মূল্য, তথ্য, ছবি এবং ইন-লাইন স্টক ম্যানেজমেন্ট
                  </p>
                </div>

                {/* Filter and Actions Bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-1 sm:w-56">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={searchProduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      placeholder="পণ্য খুঁজুন..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-full border border-neutral-200 text-xs bg-neutral-50/70 focus:bg-white focus:outline-none focus:border-[#2d5016] transition-colors"
                    />
                  </div>

                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs bg-white text-neutral-700 outline-none cursor-pointer focus:border-[#2d5016]"
                  >
                    <option value="all">সকল ক্যাটাগরি</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.banglaName}</option>
                    ))}
                  </select>

                  <select
                    value={productStockFilter}
                    onChange={(e) => setProductStockFilter(e.target.value as any)}
                    className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs bg-white text-neutral-700 outline-none cursor-pointer focus:border-[#2d5016]"
                  >
                    <option value="all">সকল স্টক</option>
                    <option value="low">স্টক কম (≤১০)</option>
                    <option value="out">স্টক শেষ (০)</option>
                  </select>

                  <button
                    onClick={handleOpenNewProduct}
                    className="px-3.5 py-1.5 rounded-full bg-[#2d5016] hover:bg-[#234011] text-[#d4af37] text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন পণ্য</span>
                  </button>
                </div>
              </div>

              {/* Minimal Products Table */}
              <div className="overflow-x-auto rounded-2xl border border-neutral-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/70 text-neutral-500 font-semibold text-[11px] uppercase tracking-wider border-b border-neutral-100">
                    <tr>
                      <th className="py-2.5 px-3">পণ্য</th>
                      <th className="py-2.5 px-3">ক্যাটাগরি</th>
                      <th className="py-2.5 px-3">মূল্য</th>
                      <th className="py-2.5 px-3">স্টক নিয়ন্ত্রণ</th>
                      <th className="py-2.5 px-3">স্ট্যাটাস</th>
                      <th className="py-2.5 px-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                          কোনো পণ্য পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-10 h-10 rounded-xl object-cover border border-neutral-200/80 shrink-0 shadow-2xs"
                              />
                              <div className="min-w-0">
                                <span className="font-bold text-neutral-900 block text-xs truncate max-w-xs">{p.banglaName}</span>
                                <span className="text-[10px] text-neutral-400 block truncate max-w-xs">{p.name}</span>
                                {p.badge && (
                                  <span className="inline-block px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 text-[9px] font-semibold mt-0.5">
                                    {p.badge}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium text-[10px]">
                              {categories.find((c) => c._id === p.category)?.banglaName || p.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-bold text-[#2d5016] font-serif-brand text-xs block">
                              {formatBDT(p.price)}
                            </span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="block text-[10px] text-neutral-400 line-through font-normal">
                                {formatBDT(p.originalPrice)}
                              </span>
                            )}
                          </td>

                          {/* Minimal Inline Stock Adjuster */}
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="inline-flex items-center rounded-full border border-neutral-200 bg-white p-0.5 text-xs shadow-2xs">
                              <button
                                onClick={() => handleQuickStockAdjust(p, -1)}
                                disabled={(p.stock ?? 25) <= 0}
                                className="w-5 h-5 rounded-full hover:bg-neutral-100 text-neutral-600 font-bold flex items-center justify-center cursor-pointer disabled:opacity-20 transition-colors"
                                title="-১ কমান"
                              >
                                -
                              </button>
                              <span className={`px-2 font-mono text-[11px] font-semibold ${
                                (p.stock ?? 25) <= 5 ? 'text-red-600 font-bold' : 'text-neutral-800'
                              }`}>
                                {p.stock ?? 25}
                              </span>
                              <button
                                onClick={() => handleQuickStockAdjust(p, 1)}
                                className="w-5 h-5 rounded-full hover:bg-neutral-100 text-neutral-600 font-bold flex items-center justify-center cursor-pointer transition-colors"
                                title="+১ বাড়ান"
                              >
                                +
                              </button>
                            </div>
                          </td>

                          <td className="py-2.5 px-3">
                            {p.sunnah_certified ? (
                              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                                <Check className="w-3 h-3" /> খাঁটি
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-400">স্ট্যান্ডার্ড</span>
                            )}
                          </td>

                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEditProduct(p)}
                                className="p-1.5 rounded-full text-neutral-500 hover:text-blue-600 hover:bg-blue-50 cursor-pointer transition-colors"
                                title="এডিট করুন"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setProductToDelete(p)}
                                className="p-1.5 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Minimal Product Pagination Bar */}
              {totalProductPages > 1 && (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
                  <div className="text-[11px]">
                    মোট {filteredProducts.length}টির মধ্যে{' '}
                    <span className="font-semibold text-neutral-800">
                      {(currentProductPage - 1) * productsPerPage + 1}-{Math.min(currentProductPage * productsPerPage, filteredProducts.length)}
                    </span> দেখানো হচ্ছে
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                      disabled={currentProductPage === 1}
                      className="w-7 h-7 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="আগের পৃষ্ঠা"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalProductPages }, (_, i) => i + 1).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setProductPage(num)}
                          className={`w-7 h-7 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                            currentProductPage === num
                              ? 'bg-[#2d5016] text-[#d4af37] font-bold shadow-xs'
                              : 'text-neutral-600 hover:bg-neutral-100 border border-transparent'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setProductPage((p) => Math.min(totalProductPages, p + 1))}
                      disabled={currentProductPage === totalProductPages}
                      className="w-7 h-7 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-600 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      title="পরের পৃষ্ঠা"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Per page selector */}
                    <select
                      value={productsPerPage}
                      onChange={(e) => {
                        setProductsPerPage(Number(e.target.value));
                        setProductPage(1);
                      }}
                      className="ml-2 px-2.5 py-1 rounded-full border border-neutral-200 text-[11px] bg-white text-neutral-700 outline-none cursor-pointer"
                    >
                      <option value={10}>১০টি / পৃষ্ঠা</option>
                      <option value={20}>২০টি / পৃষ্ঠা</option>
                      <option value={50}>৫০টি / পৃষ্ঠা</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 4: CATEGORIES MANAGEMENT */}
          {/* ======================================================= */}
          {activeTab === 'categories' && (
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif-brand text-xl font-bold text-neutral-900">
                      ক্যাটাগরি সমূহ (Category Management)
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#2d5016]/10 text-[#2d5016] text-[11px] font-bold">
                      {categories.length} টি ক্যাটাগরি
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    ক্যাটাগরি দ্রুত তৈরি করুন অথবা কভার ছবি, আইকন ও বিবরণ সম্পাদনা করুন
                  </p>
                </div>

                <button
                  onClick={handleOpenNewCategory}
                  className="px-4 py-2 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer shrink-0 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>নতুন ক্যাটাগরি যোগ</span>
                </button>
              </div>

              {/* Minimal Quick Category Creator Bar */}
              <div className="bg-gradient-to-r from-emerald-50/70 via-white to-amber-50/40 rounded-2xl p-4 border border-[#2d5016]/20 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2d5016] animate-pulse" />
                    <h3 className="font-serif-brand font-bold text-sm text-neutral-900">
                      মিনিমাল ক্যাটাগরি যোগ (Quick Add)
                    </h3>
                    <span className="text-[11px] text-neutral-500 hidden sm:inline">
                      — নাম লিখে সরাসরি ১-ক্লিকে ক্যাটাগরি তৈরি করুন
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenNewCategory}
                    className="text-xs font-bold text-[#2d5016] hover:underline flex items-center gap-1 cursor-pointer w-fit"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>বিস্তারিত অপশন</span>
                  </button>
                </div>

                <form onSubmit={handleQuickAddCategory} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2.5">
                  {/* Name Input */}
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      value={quickCatBangla}
                      onChange={(e) => setQuickCatBangla(e.target.value)}
                      placeholder="ক্যাটাগরির নাম লিখুন... (যেমন: সরিষার তেল ও ঘি, প্রাকৃতিক মসলা, চা ও মধু)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-medium focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] outline-none"
                    />
                  </div>

                  {/* Icon Fast Selector */}
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
                    {[
                      { id: 'Utensils', label: 'খাবার', icon: <Utensils className="w-3.5 h-3.5" /> },
                      { id: 'ShieldCheck', label: 'তেল/ঘি', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                      { id: 'Sparkles', label: 'সৌন্দর্য', icon: <Sparkles className="w-3.5 h-3.5" /> },
                      { id: 'Moon', label: 'ইসলামিক', icon: <Moon className="w-3.5 h-3.5" /> },
                      { id: 'ShoppingBag', label: 'এক্সেসরিজ', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setQuickCatIcon(item.id)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                          quickCatIcon === item.id
                            ? 'bg-[#2d5016] text-white shadow-2xs scale-102'
                            : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                        }`}
                        title={item.label}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isQuickAddingCat || !quickCatBangla.trim()}
                    className="px-5 py-2.5 rounded-xl bg-[#2d5016] hover:bg-[#234011] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isQuickAddingCat ? 'তৈরি হচ্ছে...' : 'ক্যাটাগরি তৈরি করুন'}</span>
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categories.map((cat) => {
                  const count = products.filter((p) => p.category === cat._id).length;
                  return (
                    <div
                      key={cat._id}
                      className="rounded-2xl border border-neutral-200 bg-white hover:border-[#2d5016]/40 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex items-start gap-3.5">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-neutral-100 shadow-xs bg-neutral-100">
                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#2d5016]">
                              {getCategoryIcon(cat.iconName)}
                              <span className="uppercase tracking-wider font-mono text-[10px] text-neutral-400">
                                ID: {cat._id}
                              </span>
                            </div>
                            <h3 className="font-serif-brand font-bold text-base text-neutral-900 truncate mt-0.5">
                              {cat.banglaName}
                            </h3>
                            <p className="text-xs text-neutral-500 font-medium truncate">
                              {cat.name}
                            </p>
                          </div>
                        </div>

                        <div className="bg-[#faf9f5] p-3 rounded-xl border border-neutral-100 space-y-1">
                          <p className="text-xs font-medium text-neutral-700 line-clamp-2">
                            {cat.banglaDescription || cat.descriptionBn || 'কোনো বাংলা বিবরণ নেই'}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs text-neutral-500 pt-1">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Package className="w-3.5 h-3.5 text-neutral-400" />
                            পণ্য সংখ্যা:
                          </span>
                          <span className="font-bold text-[#2d5016] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                            {count} টি পণ্য
                          </span>
                        </div>
                      </div>

                      <div className="p-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-[11px] text-neutral-400">
                          আইকন: <strong className="text-neutral-700">{cat.iconName || 'Sparkles'}</strong>
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditCategory(cat)}
                            className="px-3 py-1.5 rounded-xl bg-[#2d5016] text-white hover:bg-[#234011] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>এডিট</span>
                          </button>
                          <button
                            onClick={() => setCategoryToDelete(cat)}
                            className="p-1.5 rounded-xl text-neutral-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-colors"
                            title="ক্যাটাগরি মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 5: HERO SPOTLIGHT HIGHLIGHTED PRODUCTS (MINIMAL & FAST) */}
          {/* ======================================================= */}
          {activeTab === 'banners' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Header Card */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center border border-amber-200/80 shadow-2xs">
                      <Sparkles className="w-5 h-5 text-[#2d5016]" />
                    </div>
                    <div>
                      <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-neutral-900">
                        হোমপেজ হাইলাইটেড পণ্য (Hero Spotlight Control)
                      </h2>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        হোমপেজের মূল বেন্টো গ্রিডে প্রদর্শিত ৩টি পণ্য ও তাদের ব্যাজ/ছবি সরাসরি পরিচালনা করুন
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="হোমপেজে গিয়ে দেখুন"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>হোমপেজে দেখুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetHighlights}
                    className="px-3.5 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-bold transition-colors cursor-pointer"
                    title="ডিফল্ট সেটিংসে ফিরিয়ে নিন"
                  >
                    রিসেট
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveHighlights}
                    disabled={isSavingHighlights}
                    className="px-4 py-2 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingHighlights ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5 text-[#d4af37]" />
                    )}
                    <span>{isSavingHighlights ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</span>
                  </button>
                </div>
              </div>

              {/* LIVE BENTO MINI PREVIEW */}
              <div className="bg-[#faf8f5] rounded-3xl p-5 border border-neutral-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                      লাইভ স্টোরফ্রন্ট প্রিভিউ (Live Bento Preview)
                    </h3>
                  </div>
                  <span className="text-[11px] text-neutral-400">
                    নিচে পরিবর্তন করলে সাথে সাথে এখানে প্রিভিউ দেখা যাবে
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-neutral-900/95 p-4 rounded-2xl">
                  {/* Slot 1 Mini Preview */}
                  {(() => {
                    const slot1 = localHighlights.find((h) => h.slotId === 'primary') || localHighlights[0];
                    const prod1 = products.find((p) => p._id === slot1?.productId) || products[0];
                    const img1 = slot1?.customImage || prod1?.image || '';
                    return (
                      <div className="md:col-span-7 relative rounded-xl overflow-hidden aspect-[16/10] sm:aspect-[16/9] border border-white/10 flex flex-col justify-end p-4">
                        {img1 && (
                          <img
                            src={img1}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="relative z-10 space-y-1 text-white">
                          <span className="text-[9px] font-bold tracking-widest text-[#d4af37] uppercase bg-black/40 px-2 py-0.5 rounded-md inline-block">
                            {slot1?.badgeBn || slot1?.badge || '১ম সিগনেচার'}
                          </span>
                          <h4 className="font-serif-brand text-sm sm:text-base font-bold truncate">
                            {slot1?.customTitleBn || prod1?.banglaName || 'পণ্য ১'}
                          </h4>
                          <div className="flex items-center justify-between pt-0.5 text-xs">
                            <span className="font-mono font-bold text-[#d4af37]">
                              {formatBDT(prod1?.price || 0)}
                            </span>
                            <span className="text-[10px] bg-white text-neutral-900 px-2 py-0.5 rounded-full font-bold">
                              অর্ডার করুন
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Slot 2 & 3 Stacked Mini Previews */}
                  <div className="md:col-span-5 grid grid-rows-2 gap-3">
                    {/* Slot 2 */}
                    {(() => {
                      const slot2 = localHighlights.find((h) => h.slotId === 'secondary_1') || localHighlights[1];
                      const prod2 = products.find((p) => p._id === slot2?.productId) || products[1];
                      const img2 = slot2?.customImage || prod2?.image || '';
                      return (
                        <div className="relative rounded-xl overflow-hidden border border-white/10 flex flex-col justify-end p-3 min-h-[90px]">
                          {img2 && (
                            <img
                              src={img2}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="relative z-10 space-y-0.5 text-white">
                            <span className="text-[8px] font-bold tracking-wider text-[#d4af37] uppercase">
                              {slot2?.badgeBn || slot2?.badge || '২য় আইটেম'}
                            </span>
                            <h5 className="font-serif-brand text-xs font-bold truncate">
                              {slot2?.customTitleBn || prod2?.banglaName || 'পণ্য ২'}
                            </h5>
                            <span className="font-mono text-[11px] font-bold text-[#d4af37] block">
                              {formatBDT(prod2?.price || 0)}
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Slot 3 */}
                    {(() => {
                      const slot3 = localHighlights.find((h) => h.slotId === 'secondary_2') || localHighlights[2];
                      const prod3 = products.find((p) => p._id === slot3?.productId) || products[2];
                      const img3 = slot3?.customImage || prod3?.image || '';
                      return (
                        <div className="relative rounded-xl overflow-hidden border border-white/10 flex flex-col justify-end p-3 min-h-[90px]">
                          {img3 && (
                            <img
                              src={img3}
                              alt=""
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                          <div className="relative z-10 space-y-0.5 text-white">
                            <span className="text-[8px] font-bold tracking-wider text-[#d4af37] uppercase">
                              {slot3?.badgeBn || slot3?.badge || '৩য় আইটেম'}
                            </span>
                            <h5 className="font-serif-brand text-xs font-bold truncate">
                              {slot3?.customTitleBn || prod3?.banglaName || 'পণ্য ৩'}
                            </h5>
                            <span className="font-mono text-[11px] font-bold text-[#d4af37] block">
                              {formatBDT(prod3?.price || 0)}
                            </span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* 3 SLOTS CONTROLLER CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {localHighlights.map((slot, index) => {
                  const currentProd = products.find((p) => p._id === slot.productId) || products[index];
                  const isPrimary = slot.slotId === 'primary';
                  const isExpanded = expandedHighlightSlot === slot.slotId;

                  // Suggestion badge chips depending on slot
                  const badgeSuggestions = isPrimary
                    ? ['বিশেষ সিগনেচার আইটেম', '১০০% খাঁটি ও তাজা', 'সেরা অফার', 'বেস্টসেলার', 'হট ডিল']
                    : index === 1
                    ? ['ঘানিভাঙা খাঁটি', 'কোল্ড প্রেসড', '১০০% নির্ভেজাল', 'প্রাকৃতিক', 'জনপ্রিয়']
                    : ['প্রাকৃতিক যত্ন', 'ভেষজ রূপচর্চা', 'অর্গানিক কেয়ার', 'নতুন কালেকশন', 'প্রিমিয়াম'];

                  return (
                    <div
                      key={slot.slotId}
                      className={`bg-white rounded-3xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                        isPrimary
                          ? 'border-[#2d5016]/40 shadow-sm ring-1 ring-[#2d5016]/10'
                          : 'border-neutral-200/90 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Slot Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#2d5016] text-[#d4af37] font-bold text-xs flex items-center justify-center shrink-0">
                              {index + 1}
                            </span>
                            <div>
                              <h3 className="font-bold text-neutral-900 text-sm">
                                {slot.slotLabelBn}
                              </h3>
                              <span className="text-[10px] text-neutral-400 font-medium">
                                {isPrimary ? 'বড় বাম পাশের কার্ড' : index === 1 ? 'ডান পাশের উপরের কার্ড' : 'ডান পাশের নিচের কার্ড'}
                              </span>
                            </div>
                          </div>
                          {isPrimary && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                              মূল হাইলাইট
                            </span>
                          )}
                        </div>

                        {/* Product Picker Dropdown */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-700 flex items-center justify-between">
                            <span>পণ্য নির্বাচন করুন:</span>
                            {currentProd && (
                              <span className="text-[11px] font-mono text-[#2d5016] font-bold">
                                {formatBDT(currentProd.price)}
                              </span>
                            )}
                          </label>

                          <div className="relative">
                            <select
                              value={slot.productId || ''}
                              onChange={(e) => handleSlotProductSelect(slot.slotId, e.target.value)}
                              className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016] cursor-pointer appearance-none truncate"
                            >
                              {products.map((p) => (
                                <option key={p._id} value={p._id}>
                                  {p.banglaName} (৳{p.price})
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>

                        {/* Selected Product Thumbnail Preview & Reset to Prod Image */}
                        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-neutral-50 border border-neutral-200/70">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 shrink-0 border border-neutral-300/80">
                            <img
                              src={slot.customImage || currentProd?.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-neutral-900 truncate">
                              {currentProd?.banglaName || 'পণ্য পাওয়া যায়নি'}
                            </p>
                            <p className="text-[11px] text-neutral-500 font-mono truncate">
                              আইডি: {slot.productId}
                            </p>
                            {slot.customImage && currentProd?.image && slot.customImage !== currentProd.image && (
                              <button
                                type="button"
                                onClick={() => handleSlotImageChange(slot.slotId, currentProd.image)}
                                className="text-[10px] text-[#2d5016] font-bold hover:underline cursor-pointer"
                              >
                                ↺ প্রডাক্টের মূল ছবি ব্যবহার করুন
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Custom Badge Text & Preset Chips */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-700 block">
                            কার্ড ব্যাজ (Badge Text):
                          </label>
                          <input
                            type="text"
                            value={slot.badgeBn || ''}
                            onChange={(e) => handleSlotBadgeChange(slot.slotId, e.target.value)}
                            placeholder="যেমন: বিশেষ সিগনেচার আইটেম"
                            className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016]"
                          />
                          {/* Quick Badge Chips */}
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {badgeSuggestions.map((suggestion) => (
                              <button
                                key={suggestion}
                                type="button"
                                onClick={() => handleSlotBadgeChange(slot.slotId, suggestion)}
                                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                                  slot.badgeBn === suggestion
                                    ? 'bg-[#2d5016] text-[#d4af37] border-[#2d5016] font-bold'
                                    : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                                }`}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Custom Image Link Input */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-700 block">
                            কভার ছবির লিঙ্ক (ঐচ্ছিক কাস্টম ছবি):
                          </label>
                          <input
                            type="text"
                            value={slot.customImage || ''}
                            onChange={(e) => handleSlotImageChange(slot.slotId, e.target.value)}
                            placeholder={currentProd?.image || 'https://...'}
                            className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs font-mono text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#2d5016]/20 focus:border-[#2d5016]"
                          />
                        </div>

                        {/* Collapsible Advanced Text Fields (Custom Headline / Subtitle) */}
                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => setExpandedHighlightSlot(isExpanded ? null : slot.slotId)}
                            className="text-[11px] text-neutral-500 hover:text-neutral-800 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isExpanded ? 'অতিরিক্ত টেক্সট লুকান' : 'অতিরিক্ত শিরোনাম কাস্টমাইজ করুন'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {isExpanded && (
                            <div className="mt-2.5 p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2.5 text-xs animate-in fade-in duration-150">
                              <div>
                                <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                                  কাস্টম বাংলা শিরোনাম (খালি রাখলে প্রডাক্টের নাম দেখাবে):
                                </label>
                                <input
                                  type="text"
                                  value={slot.customTitleBn || ''}
                                  onChange={(e) => handleSlotTextChange(slot.slotId, 'customTitleBn', e.target.value)}
                                  placeholder={currentProd?.banglaName || ''}
                                  className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-medium"
                                />
                              </div>

                              {isPrimary && (
                                <div>
                                  <label className="text-[11px] font-bold text-neutral-600 block mb-1">
                                    কাস্টম সাবটাইটেল বিবরণ (বড় কার্ডের জন্য):
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={slot.customSubtitleBn || ''}
                                    onChange={(e) => handleSlotTextChange(slot.slotId, 'customSubtitleBn', e.target.value)}
                                    placeholder={currentProd?.banglaDescription || ''}
                                    className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-300 bg-white text-xs font-medium resize-none"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </div>

                      {/* Card Footer Quick Action */}
                      <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold">
                          ✓ হোমপেজে সক্রিয়
                        </span>
                        <button
                          type="button"
                          onClick={handleSaveHighlights}
                          disabled={isSavingHighlights}
                          className="px-3 py-1.5 rounded-xl bg-[#2d5016] text-white hover:bg-[#234011] font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Save className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>সেভ করুন</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Bottom Notification Note */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 flex items-center justify-between text-xs text-neutral-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-[#2d5016] shrink-0" />
                  <span>
                    কোনো পণ্য পরিবর্তন করলে সাথে সাথে ডেটাবেজ ও ক্লায়েন্ট লোকাল স্টোরেজে সিঙ্ক হবে। ক্রেতারা হোম পেজে প্রবেশ করলেই নির্বাচিত নতুন পণ্য ও ব্যাজ দেখতে পাবেন।
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveHighlights}
                  disabled={isSavingHighlights}
                  className="px-4 py-2 rounded-xl bg-[#2d5016] text-white hover:bg-[#234011] text-xs font-bold shrink-0 ml-3 cursor-pointer shadow-xs"
                >
                  সব পরিবর্তন সংরক্ষণ করুন
                </button>
              </div>

            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 6: SCROLLING NOTICE BAR CONTROLLER */}
          {/* ======================================================= */}
          {activeTab === 'notice' && (
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-6 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif-brand text-xl font-bold text-neutral-900">
                      স্ক্রোলিং নোটিশ ও ঘোষণা বার (Scrolling Notice Bar)
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      noticeEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                    }`}>
                      {noticeEnabled ? 'বর্তমানে লাইভ' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    ওয়েবসাইটের শীর্ষে চলমান বিশেষ অফার বা জরুরি বিজ্ঞপ্তির বার্তা কাস্টমাইজ করুন
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggleNoticeLive}
                  className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                    noticeEnabled
                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {noticeEnabled ? 'ঘোষণা বার বন্ধ করুন' : 'ঘোষণা বার চালু করুন'}
                </button>
              </div>

              {/* Live Preview Box */}
              <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  লাইভ প্রিভিউ (গ্রাহক যেমন দেখবেন):
                </span>
                <div className="bg-[#2d5016] text-[#fbf8ee] px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-medium">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="px-2 py-0.5 rounded-full bg-black/30 text-[#d4af37] font-bold text-[10px] shrink-0">
                      {noticeBadge}
                    </span>
                    <span className="truncate">
                      {noticeText || 'কোনো ঘোষণা টেক্সট দেওয়া হয়নি'}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-300 shrink-0 ml-2">
                    গতি: {noticeSpeed}
                  </span>
                </div>
              </div>

              {/* Form Settings */}
              <form onSubmit={handleSaveNotice} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      বাংলা নোটিশ বার্তা *
                    </label>
                    <input
                      type="text"
                      required
                      value={noticeText}
                      onChange={(e) => setNoticeText(e.target.value)}
                      placeholder="উদা: পবিত্র রমাদান উপলক্ষে সমগ্র বাংলাদেশে ফ্রি হোম ডেলিভারি!"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#2d5016] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      English Announcement (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={noticeTextEn}
                      onChange={(e) => setNoticeTextEn(e.target.value)}
                      placeholder="e.g. Free delivery nationwide on orders above ৳1500"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#2d5016] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      ব্যাজ টেক্সট (বাংলা)
                    </label>
                    <input
                      type="text"
                      value={noticeBadge}
                      onChange={(e) => setNoticeBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#2d5016] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      স্ক্রোলিং গতি (Speed)
                    </label>
                    <select
                      value={noticeSpeed}
                      onChange={(e) => setNoticeSpeed(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs bg-white focus:ring-2 focus:ring-[#2d5016] outline-none cursor-pointer"
                    >
                      <option value="slow">ধীরগতি (Slow - পড়া সহজ)</option>
                      <option value="normal">স্বাভাবিক (Normal)</option>
                      <option value="fast">দ্রুত (Fast)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      ক্লিক লিংক (ঐচ্ছিক)
                    </label>
                    <input
                      type="text"
                      value={noticeLink}
                      onChange={(e) => setNoticeLink(e.target.value)}
                      placeholder="catalog"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-[#2d5016] outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSavingNotice}
                    className="px-6 py-2.5 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSavingNotice ? 'সংরক্ষণ হচ্ছে...' : 'নোটিশ সেটিংস সংরক্ষণ করুন'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 7: BLOGS & ARTICLES MANAGEMENT */}
          {/* ======================================================= */}
          {activeTab === 'blogs' && (
            <AdminBlogManager onBackToDashboard={() => setActiveTab('dashboard')} />
          )}

          {/* ======================================================= */}
          {/* TAB 8: TESTIMONIALS MANAGEMENT */}
          {/* ======================================================= */}
          {activeTab === 'testimonials' && (
            <AdminTestimonialsManager onBackToDashboard={() => setActiveTab('dashboard')} />
          )}

          {/* ======================================================= */}
          {/* TAB 9: SYSTEM & CLOUD DATABASE HUB */}
          {/* ======================================================= */}
          {activeTab === 'system' && (
            <div className="bg-white rounded-3xl p-6 border border-neutral-200/90 shadow-2xs space-y-6 animate-in fade-in duration-200">
              <div className="pb-4 border-b border-neutral-100">
                <h2 className="font-serif-brand text-xl font-bold text-neutral-900">
                  ক্লাউড ডেটাবেজ ও সিডিএন সিস্টেম (System & Cloud Sync)
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  MongoDB ডাটাবেজ, Cloudinary মিডিয়া এবং সার্ভার সংযোগের বর্তমান অবস্থা
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* MongoDB Card */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">MongoDB Database</h4>
                        <span className="text-[11px] text-emerald-600 font-semibold">
                          {dbStatus?.connected ? 'সংযুক্ত ও সক্রিয় (Connected)' : 'রেডি মোড'}
                        </span>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  </div>
                  <div className="text-xs text-neutral-600 space-y-1 pt-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">হোস্ট মোড:</span>
                      <span className="font-bold">Production Cloud</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">কানেকশন টেস্ট:</span>
                      <span className="font-bold text-emerald-700">সফল (200 OK)</span>
                    </div>
                  </div>
                </div>

                {/* Cloudinary CDN Card */}
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                        <Cloud className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">Cloudinary Media CDN</h4>
                        <span className="text-[11px] text-sky-600 font-semibold">
                          {cloudinaryStatus?.configured ? 'কনফিগারেশন সক্রিয়' : 'আপলোড রেডি'}
                        </span>
                      </div>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                  </div>
                  <div className="text-xs text-neutral-600 space-y-1 pt-1">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">ইমেজ অপ্টিমাইজেশন:</span>
                      <span className="font-bold">WebP Auto Quality</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">ক্লাউডিনারি ক্লাউড:</span>
                      <span className="font-bold text-sky-800">{cloudinaryStatus?.cloudName || 'Active'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sync Actions */}
              <div className="p-5 rounded-2xl bg-[#fbf8ee] border border-[#d4af37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-serif-brand font-bold text-sm text-[#855e09]">
                    রিয়েল-টাইম ডেটাবেজ সিঙ্ক্রোনাইজেশন
                  </h4>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    যদি কোনো ব্রাউজারে পণ্য বা অর্ডার পরিবর্তন না দেখতে পান, তবে সিঙ্ক রিফ্রেশ চাপুন।
                  </p>
                </div>
                <button
                  onClick={() => refreshDbData()}
                  disabled={isLoadingDb}
                  className="px-5 py-2.5 rounded-xl bg-[#2d5016] hover:bg-[#234011] text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50 shrink-0"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoadingDb ? 'animate-spin' : ''}`} />
                  <span>এখনই সিঙ্ক রিফ্রেশ করুন</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================= */}
      {/* ADD/EDIT PRODUCT MODAL */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#2d5016] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  {editingProductId ? 'পণ্য সংশোধন' : 'নতুন কালেকশন'}
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-neutral-900">
                  {editingProductId ? 'পণ্য তথ্য এডিট করুন' : 'নতুন পণ্য যুক্ত করুন'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">বাংলা নাম *</label>
                  <input
                    type="text"
                    required
                    value={pBanglaName}
                    onChange={(e) => setPBanglaName(e.target.value)}
                    placeholder="উদা: খাঁটি সুন্দরবনের প্রাকৃতিক মধু"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-1 focus:ring-[#2d5016] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">ইংরেজি নাম *</label>
                  <input
                    type="text"
                    required
                    value={pName}
                    onChange={(e) => setPName(e.target.value)}
                    placeholder="e.g. Pure Sundarban Wild Honey"
                    className="w-full p-2.5 rounded-xl border border-neutral-300 focus:ring-1 focus:ring-[#2d5016] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">ক্যাটাগরি *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value as CategoryId)}
                    className="w-full p-2.5 rounded-xl border border-neutral-300 bg-white cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.banglaName} ({c.name})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={pPrice}
                    onChange={(e) => setPPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">আগের/রেগুলার মূল্য (৳)</label>
                  <input
                    type="number"
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              {/* Multiple Images Gallery Dropzone */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block font-bold text-neutral-900 text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#2d5016]" />
                      পণ্যের ছবিসমূহ (Cloudinary CDN গ্যালারি)
                    </label>
                    <span className="text-[11px] text-neutral-500">
                      ১ম ছবিটি মূল কভার হিসেবে প্রদর্শিত হবে।
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#2d5016]/10 text-[#2d5016]">
                    {pImages.length} টি ছবি যুক্ত
                  </span>
                </div>

                {/* Thumbnails grid */}
                {pImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    {pImages.map((imgUrl, idx) => {
                      const isPrimary = pImage ? imgUrl === pImage : idx === 0;
                      return (
                        <div
                          key={idx}
                          className={`relative rounded-xl overflow-hidden border-2 bg-white ${
                            isPrimary ? 'border-[#2d5016] ring-2 ring-[#2d5016]/20' : 'border-neutral-200'
                          }`}
                        >
                          <div className="aspect-square w-full">
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="p-1.5 bg-white/95 flex items-center justify-between gap-1 border-t border-neutral-100">
                            {isPrimary ? (
                              <span className="text-[9px] font-black text-[#2d5016] uppercase">কভার</span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(imgUrl)}
                                className="text-[9px] text-neutral-600 hover:text-[#2d5016] font-bold cursor-pointer"
                              >
                                কভার করুন
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveProductImage(idx)}
                              className="text-neutral-400 hover:text-red-600 p-0.5 cursor-pointer"
                              title="বাদ দিন"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <ImageUploadDropzone
                  value=""
                  onChange={(url) => { if (url) handleAddProductImage(url); }}
                  folder="products"
                  banglaLabel="নতুন ছবি আপলোড করুন (Cloudinary Upload)"
                  label="ড্রপ করে বা ব্রাউজ করে ছবি যোগ করুন"
                  aspectRatio="square"
                />

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={newImgInput}
                    onChange={(e) => setNewImgInput(e.target.value)}
                    placeholder="অথবা সরাসরি ইমেজ লিংক পেস্ট করুন (https://...)"
                    className="flex-1 p-2 rounded-xl border border-neutral-300 text-xs bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddProductImage(newImgInput)}
                    className="px-3.5 py-2 bg-[#2d5016] hover:bg-[#234011] text-white font-bold rounded-xl text-xs cursor-pointer shrink-0"
                  >
                    + লিংক যোগ
                  </button>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  সংক্ষিপ্ত বিবরণ (Short Description) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={pShortDesc}
                  onChange={(e) => setPShortDesc(e.target.value)}
                  placeholder="পণ্যের এক নজরে পড়ার সংক্ষিপ্ত বিবরণ..."
                  className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  বিস্তারিত আলোচনা (Long Description) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={pLongDesc}
                  onChange={(e) => setPLongDesc(e.target.value)}
                  placeholder="পণ্য সম্পর্কে বিস্তারিত গুণাগুণ, খাঁটি হওয়ার নিশ্চয়তা ও ব্যবহার বিধি..."
                  className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">হাইলাইট ব্যাজ (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={pBadge}
                    onChange={(e) => setPBadge(e.target.value)}
                    placeholder="উদা: ১০০% খাঁটি, সেরা ছাড়"
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">স্টক পরিমাণ</label>
                  <input
                    type="number"
                    value={pStock}
                    onChange={(e) => setPStock(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pSunnahCheck"
                  checked={pSunnah}
                  onChange={(e) => setPSunnah(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2d5016]"
                />
                <label htmlFor="pSunnahCheck" className="text-xs font-semibold text-neutral-800 cursor-pointer">
                  ১০০% খাঁটি / সুন্নাহ বিশুদ্ধতা সার্টিফাইড পণ্য
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#2d5016] text-white font-bold hover:bg-[#234011] cursor-pointer shadow-sm"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ORDER DETAILS & INVOICE MODAL (MOBILE-FRIENDLY) */}
      {/* ========================================================= */}
      {currentSelectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4">
          <div className="bg-white rounded-2xl sm:rounded-3xl max-w-2xl w-full p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[92dvh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-2 border-b border-neutral-100 pb-3 sm:pb-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h3 className="font-serif-brand text-lg sm:text-xl font-bold text-neutral-900">
                    অর্ডার বিবরণ ও ইনভয়েস
                  </h3>
                  <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-neutral-100 font-bold text-neutral-800">
                    #{currentSelectedOrder._id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      currentSelectedOrder.channel === 'whatsapp'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {currentSelectedOrder.channel === 'whatsapp' ? 'WhatsApp' : 'Website'}
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs text-neutral-500 mt-1">
                  তারিখ:{' '}
                  {new Date(currentSelectedOrder.orderDate || currentSelectedOrder.createdAt || Date.now()).toLocaleDateString('bn-BD', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Switcher Bar */}
            <div className="bg-[#f9f8f5] p-3 sm:p-3.5 rounded-2xl border border-neutral-200/80 space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2d5016]" />
                  <span>বর্তমান স্ট্যাটাস:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                      ORDER_STATUS_CONFIG[currentSelectedOrder.status]?.badgeClass || 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {ORDER_STATUS_CONFIG[currentSelectedOrder.status]?.label || currentSelectedOrder.status}
                  </span>
                </span>
                <span className="text-[11px] text-neutral-500">পরিবর্তনে ট্যাপ করুন:</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {ALL_ORDER_STATUSES.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => updateOrderStatus(currentSelectedOrder._id, st)}
                    className={`py-2 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-semibold border text-center cursor-pointer transition-all truncate ${
                      currentSelectedOrder.status === st
                        ? `${ORDER_STATUS_CONFIG[st].activeBtnClass} shadow-xs border-transparent`
                        : 'bg-white text-neutral-700 hover:bg-neutral-50 border-neutral-200'
                    }`}
                  >
                    {ORDER_STATUS_CONFIG[st].shortLabel}
                  </button>
                ))}
              </div>
            </div>

            {/* Assign Courier & Tracking Box */}
            <div className="bg-cyan-50/50 p-3.5 sm:p-4 rounded-2xl border border-cyan-200/80 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-xs text-cyan-950 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-cyan-700" />
                  <span>কুরিয়ার অ্যাসাইন ও ট্র্যাকিং (Assign Courier)</span>
                </h4>
                {currentSelectedOrder.courierName && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900">
                    যুক্ত: {currentSelectedOrder.courierName}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">কুরিয়ার সার্ভিস</label>
                  <select
                    value={modalCourierName}
                    onChange={(e) => setModalCourierName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-semibold text-neutral-800 outline-none focus:ring-1 focus:ring-cyan-600"
                  >
                    {BD_COURIERS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                    ট্র্যাকিং / কনসাইনমেন্ট আইডি
                  </label>
                  <input
                    type="text"
                    value={modalTrackingNumber}
                    onChange={(e) => setModalTrackingNumber(e.target.value)}
                    placeholder="যেমন: SF-9845123 (ঐচ্ছিক)"
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-white text-xs font-mono text-neutral-800 outline-none focus:ring-1 focus:ring-cyan-600"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await updateOrderStatus(currentSelectedOrder._id, 'courier_assigned', {
                      courierName: modalCourierName,
                      trackingNumber: modalTrackingNumber.trim(),
                    });
                  }}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>কুরিয়ার সেভ ও অ্যাসাইন করুন</span>
                </button>
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="bg-neutral-50 p-3.5 sm:p-4 rounded-2xl border border-neutral-200/80 space-y-3">
              <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">
                গ্রাহকের ঠিকানা ও তথ্য
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-neutral-500 block">গ্রাহকের নাম:</span>
                  <span className="font-bold text-neutral-900 text-sm">
                    {currentSelectedOrder.customer.name}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block">ফোন নম্বর ও যোগাযোগ:</span>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <a
                      href={`tel:${currentSelectedOrder.customer.phone}`}
                      className="px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-neutral-800 font-bold hover:bg-neutral-100 inline-flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#2d5016]" />
                      <span>{currentSelectedOrder.customer.phone}</span>
                    </a>
                    <a
                      href={`https://wa.me/88${currentSelectedOrder.customer.phone.replace(/^0/, '')}?text=${encodeURIComponent(`আসসালামু আলাইকুম ${currentSelectedOrder.customer.name}, Kasab Gallery থেকে আপনার অর্ডার #${currentSelectedOrder._id} সংক্রান্ত বিষয়ে যোগাযোগ করছি।`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 font-bold hover:bg-emerald-100 inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-neutral-500 block">পূর্ণাঙ্গ ডেলিভারি ঠিকানা:</span>
                  <span className="font-semibold text-neutral-900 block mt-0.5">
                    {currentSelectedOrder.customer.district && `${currentSelectedOrder.customer.district} জেলা, `}
                    {currentSelectedOrder.customer.thana && `${currentSelectedOrder.customer.thana} থানা/উপজেলা, `}
                    {currentSelectedOrder.customer.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="space-y-2">
              <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider">
                অর্ডারের পণ্যসমূহ ({currentSelectedOrder.items.length} টি আইটেম)
              </h4>
              <div className="border border-neutral-200 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[420px]">
                  <thead className="bg-[#f7f6f2] font-bold text-neutral-700 border-b border-neutral-200">
                    <tr>
                      <th className="py-2.5 px-3">পণ্য</th>
                      <th className="py-2.5 px-3 text-center">পরিমাণ</th>
                      <th className="py-2.5 px-3 text-right">একক মূল্য</th>
                      <th className="py-2.5 px-3 text-right">মোট</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {currentSelectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-2.5 px-3">
                          <span className="font-bold text-neutral-900 block">{item.banglaName}</span>
                          <span className="text-[10px] text-neutral-400">{item.name}</span>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold whitespace-nowrap">
                          {item.quantity} টি
                        </td>
                        <td className="py-2.5 px-3 text-right text-neutral-600 whitespace-nowrap tabular-nums">
                          {formatBDT(item.price)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-neutral-900 whitespace-nowrap tabular-nums">
                          {formatBDT(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary & Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-neutral-100">
              <div>
                <span className="text-xs text-neutral-500 block">সর্বমোট প্রদেয় মূল্য:</span>
                <span className="font-serif-brand font-black text-2xl text-[#2d5016] tabular-nums">
                  {formatBDT(currentSelectedOrder.total)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOrderToDelete(currentSelectedOrder)}
                  className="p-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                  title="অর্ডার ডিলিট করুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => printInvoice(currentSelectedOrder)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-50 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#2d5016]" />
                  <span>প্রিন্ট</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadInvoice(currentSelectedOrder)}
                  className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-neutral-300 bg-neutral-100 text-neutral-800 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-neutral-200 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-[#2d5016] text-white font-bold text-xs hover:bg-[#234011] cursor-pointer"
                >
                  সম্পন্ন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ASSIGN COURIER QUICK MODAL */}
      {/* ========================================================= */}
      {courierModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await updateOrderStatus(
                courierModalOrder._id,
                autoSetCourierStatus ? 'courier_assigned' : undefined,
                {
                  courierName: courierNameInput.trim(),
                  trackingNumber: trackingNumberInput.trim(),
                }
              );
              setCourierModalOrder(null);
            }}
            className="bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center shrink-0">
                  <Truck className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-serif-brand text-base font-bold text-neutral-900">
                    কুরিয়ার অ্যাসাইন করুন
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    অর্ডার <span className="font-mono font-bold text-neutral-800">#{courierModalOrder._id}</span> •{' '}
                    {courierModalOrder.customer.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCourierModalOrder(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-neutral-700 block mb-1.5">কুরিয়ার পার্টনার নির্বাচন করুন</label>
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {BD_COURIERS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCourierNameInput(c)}
                      className={`px-2.5 py-2 rounded-xl border text-left text-[11px] font-semibold transition-all cursor-pointer truncate ${
                        courierNameInput === c
                          ? 'bg-cyan-700 text-white border-cyan-700'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  required
                  value={courierNameInput}
                  onChange={(e) => setCourierNameInput(e.target.value)}
                  placeholder="অথবা কাস্টম কুরিয়ারের নাম লিখুন..."
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white outline-none focus:ring-1 focus:ring-cyan-600"
                />
              </div>

              <div>
                <label className="font-bold text-neutral-700 block mb-1">
                  ট্র্যাকিং / কনসাইনমেন্ট আইডি (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  placeholder="যেমন: SF-7741290 বা Pathao-CN123"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono bg-neutral-50 focus:bg-white outline-none focus:ring-1 focus:ring-cyan-600"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSetCourierStatus}
                  onChange={(e) => setAutoSetCourierStatus(e.target.checked)}
                  className="rounded border-neutral-300 text-cyan-700 focus:ring-cyan-600"
                />
                <span className="text-neutral-700 font-medium">
                  অর্ডারের স্ট্যাটাস স্বয়ংক্রিয়ভাবে <strong>"কুরিয়ার অ্যাসাইনড"</strong> করুন
                </span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setCourierModalOrder(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>সেভ ও অ্যাসাইন করুন</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* EDIT / CREATE CATEGORY MODAL (MINIMAL & STREAMLINED) */}
      {/* ========================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-neutral-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#2d5016] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#d4af37]" />
                  {editingCategoryId ? 'ক্যাটাগরি আপডেট' : 'নতুন ক্যাটাগরি'}
                </span>
                <h3 className="font-serif-brand text-lg font-bold text-neutral-900">
                  {editingCategoryId ? `সম্পাদনা: ${cBanglaName}` : 'নতুন ক্যাটাগরি যোগ করুন'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              {/* 1. Category Name (Required & Primary) */}
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  ক্যাটাগরির নাম (বাংলা) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={cBanglaName}
                  onChange={(e) => {
                    setCBanglaName(e.target.value);
                    if (!editingCategoryId && (!cName || cName === cBanglaName)) {
                      setCName(e.target.value);
                    }
                  }}
                  placeholder="যেমন: সরিষার তেল ও খাঁটি ঘি"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 bg-white text-xs font-semibold focus:border-[#2d5016] focus:ring-2 focus:ring-[#2d5016]/10 outline-none"
                />
              </div>

              {/* 2. Visual Icon Chips */}
              <div>
                <label className="block font-bold text-neutral-700 mb-1.5">ক্যাটাগরি আইকন</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Utensils', label: 'খাদ্যদ্রব্য', icon: <Utensils className="w-3.5 h-3.5" /> },
                    { id: 'ShieldCheck', label: 'তেল/ঘি', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                    { id: 'Sparkles', label: 'সৌন্দর্য', icon: <Sparkles className="w-3.5 h-3.5" /> },
                    { id: 'Moon', label: 'ইসলামিক', icon: <Moon className="w-3.5 h-3.5" /> },
                    { id: 'Snowflake', label: 'শীতকালীন', icon: <Snowflake className="w-3.5 h-3.5" /> },
                    { id: 'ShoppingBag', label: 'এক্সেসরিজ', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCIconName(item.id)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        cIconName === item.id
                          ? 'bg-[#2d5016] text-white border-[#2d5016] shadow-2xs scale-102'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Cover Image Selection (Fast Presets or Custom) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-neutral-700">কভার ছবি নির্বাচন</label>
                  <button
                    type="button"
                    onClick={() => setShowCatCustomImage(!showCatCustomImage)}
                    className="text-[11px] font-bold text-[#2d5016] hover:underline cursor-pointer"
                  >
                    {showCatCustomImage ? 'প্রিসেট ছবি বেছে নিন' : '+ নিজস্ব ছবি আপলোড / লিঙ্ক'}
                  </button>
                </div>

                {!showCatCustomImage ? (
                  <div className="grid grid-cols-3 gap-2">
                    {CATEGORY_IMAGE_PRESETS.map((preset, idx) => {
                      const isSelected = cImage === preset.url;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setCImage(preset.url)}
                          className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer group text-left ${
                            isSelected ? 'border-[#2d5016] ring-2 ring-[#2d5016]/20 scale-102' : 'border-neutral-200 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-end p-1.5 text-white">
                            <span className="text-[9px] font-bold truncate block">{preset.name}</span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2d5016] text-white flex items-center justify-center shadow-xs">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <ImageUploadDropzone
                      value={cImage}
                      onChange={(url) => setCImage(url)}
                      folder="categories"
                      banglaLabel="ক্যাটাগরি ছবি আপলোড (Cloudinary Upload)"
                      label="ছবি ড্রপ করুন বা ব্রাউজ করুন"
                      aspectRatio="square"
                    />
                    <input
                      type="text"
                      value={cImage}
                      onChange={(e) => setCImage(e.target.value)}
                      placeholder="অথবা ছবির সরাসরি URL পেস্ট করুন..."
                      className="w-full p-2 rounded-xl border border-neutral-200 text-[11px] outline-none"
                    />
                  </div>
                )}
              </div>

              {/* 4. Collapsible Advanced Options (English name & description) */}
              <div className="pt-1 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowCatAdvancedInModal(!showCatAdvancedInModal)}
                  className="flex items-center justify-between w-full text-neutral-600 hover:text-neutral-900 py-1 font-bold cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
                    অতিরিক্ত অপশন (ইংরেজি নাম ও বিবরণ)
                  </span>
                  {showCatAdvancedInModal ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </button>

                {showCatAdvancedInModal && (
                  <div className="space-y-3 pt-2 animate-in fade-in duration-150">
                    <div>
                      <label className="block font-bold text-neutral-600 mb-1">ইংরেজি নাম (ঐচ্ছিক)</label>
                      <input
                        type="text"
                        value={cName}
                        onChange={(e) => setCName(e.target.value)}
                        placeholder="e.g. Natural Honey & Foods"
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-600 mb-1">বাংলা বিবরণ (ঐচ্ছিক)</label>
                      <textarea
                        rows={2}
                        value={cBanglaDesc}
                        onChange={(e) => setCBanglaDesc(e.target.value)}
                        placeholder="ক্যাটাগরির সংক্ষিপ্ত বিবরণ..."
                        className="w-full p-2.5 rounded-xl border border-neutral-300 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 cursor-pointer transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={!cBanglaName.trim()}
                  className="px-5 py-2 rounded-xl bg-[#2d5016] hover:bg-[#234011] disabled:opacity-40 text-white font-bold cursor-pointer shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingCategoryId ? 'আপডেট সংরক্ষণ' : 'ক্যাটাগরি তৈরি করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD/EDIT HERO BANNER MODAL */}
      {/* ========================================================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-serif-brand text-xl font-bold text-neutral-900 border-b border-neutral-100 pb-3">
              {editingBannerId ? 'ব্যানার স্লাইডার এডিট করুন' : 'নতুন হিরো ব্যানার স্লাইড'}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">বাংলা টাইটেল *</label>
                <input
                  type="text"
                  required
                  value={bBanglaTitle}
                  onChange={(e) => setBBanglaTitle(e.target.value)}
                  placeholder="উদা: ১০০% খাঁটি প্রাকৃতিক উপাদান"
                  className="w-full p-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">বাংলা সাবটাইটেল</label>
                <input
                  type="text"
                  value={bBanglaSubtitle}
                  onChange={(e) => setBBanglaSubtitle(e.target.value)}
                  placeholder="উদা: এক ডেলিভারি চার্জে সারা বাংলাদেশে"
                  className="w-full p-2.5 rounded-xl border border-neutral-300"
                />
              </div>

              <ImageUploadDropzone
                value={bImage}
                onChange={(url) => setBImage(url)}
                folder="banners"
                banglaLabel="ব্যানার ছবি আপলোড (Cloudinary CDN)"
                label="Hero Banner Image"
                aspectRatio="wide"
              />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">টপ ব্যাজ</label>
                  <input
                    type="text"
                    value={bBadge}
                    onChange={(e) => setBBadge(e.target.value)}
                    placeholder="বিশেষ অফার"
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">বাটন টেক্সট</label>
                  <input
                    type="text"
                    value={bCta}
                    onChange={(e) => setBCta(e.target.value)}
                    placeholder="এখনই অর্ডার করুন"
                    className="w-full p-2.5 rounded-xl border border-neutral-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-neutral-300 text-neutral-700 font-bold hover:bg-neutral-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2d5016] text-white font-bold hover:bg-[#234011] cursor-pointer shadow-sm"
                >
                  {editingBannerId ? 'আপডেট সম্পন্ন' : 'যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION MODALS (PRODUCT, BANNER, ORDER, CATEGORY) */}
      {/* ========================================================= */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-neutral-900">
                  পণ্য ডিলিট নিশ্চিতকরণ
                </h3>
                <p className="text-xs text-neutral-500">এই অ্যাকশনটি স্থায়ী এবং অপরিবর্তনীয়</p>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center gap-3">
              {productToDelete.image && (
                <img
                  src={productToDelete.image}
                  alt={productToDelete.name}
                  className="w-14 h-14 object-cover rounded-xl border border-neutral-200 shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-sm text-neutral-900 truncate">
                  {productToDelete.banglaName}
                </h4>
                <p className="text-xs text-neutral-500 truncate">{productToDelete.name}</p>
                <span className="text-xs font-black text-[#2d5016] mt-1 block">
                  {formatBDT(productToDelete.price)}
                </span>
              </div>
            </div>

            <p className="text-xs text-neutral-600">
              আপনি কি নিশ্চিত যে <strong className="text-neutral-900 font-bold">"{productToDelete.banglaName}"</strong> পণ্যটি ক্যাটালগ ও ডাটাবেজ থেকে মুছে ফেলতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteProduct(productToDelete._id);
                  setProductToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Deletion Modal */}
      {bannerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-neutral-900">
                  ব্যানার ডিলিট নিশ্চিতকরণ
                </h3>
                <p className="text-xs text-neutral-500">হোমপেজ স্লাইডার থেকে ব্যানারটি মুছে যাবে</p>
              </div>
            </div>

            <p className="text-xs text-neutral-600">
              আপনি কি নিশ্চিত যে <strong className="text-neutral-900 font-bold">"{bannerToDelete.banglaTitle}"</strong> ব্যানার স্লাইডটি মুছে ফেলতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setBannerToDelete(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={async () => {
                  const targetId = bannerToDelete._id || bannerToDelete.id;
                  if (targetId) await deleteHeroSlide(targetId);
                  setBannerToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Deletion Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-neutral-900">
                  অর্ডার ডিলিট নিশ্চিতকরণ
                </h3>
                <p className="text-xs text-neutral-500">অর্ডারটি ডাটাবেজ থেকে সম্পূর্ণ মুছে যাবে</p>
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between font-mono font-bold">
                <span>অর্ডার আইডি:</span>
                <span>#{orderToDelete._id}</span>
              </div>
              <div className="flex justify-between">
                <span>গ্রাহক:</span>
                <span className="font-bold">{orderToDelete.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span>মোট:</span>
                <span className="font-black text-[#2d5016]">{formatBDT(orderToDelete.total)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteOrder(orderToDelete._id);
                  if (selectedOrder && selectedOrder._id === orderToDelete._id) {
                    setSelectedOrder(null);
                  }
                  setOrderToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Deletion Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-neutral-900">
                  ক্যাটাগরি মুছে ফেলা নিশ্চিত করুন
                </h3>
                <p className="text-xs text-neutral-500">ডাটাবেজ থেকে ক্যাটাগরিটি সম্পূর্ণ ডিলিট করা হবে</p>
              </div>
            </div>

            <p className="text-xs text-neutral-600">
              আপনি কি নিশ্চিত যে ক্যাটাগরি <strong className="text-neutral-900 font-bold">"{categoryToDelete.banglaName}"</strong> ডিলিট করতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-50 cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={async () => {
                  await deleteCategory(categoryToDelete._id);
                  setCategoryToDelete(null);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>হ্যাঁ, মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
