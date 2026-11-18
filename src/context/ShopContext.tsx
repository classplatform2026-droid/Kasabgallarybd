import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  Category, 
  CartItem, 
  Order, 
  Testimonial, 
  ActivePage, 
  Language, 
  CategoryId, 
  OrderCustomer, 
  BlogPost, 
  HeroSlide,
  DbStatusInfo,
  ScrollingNotice,
  User,
  HeroHighlightedProduct
} from '../types';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS, 
  INITIAL_TESTIMONIALS, 
  INITIAL_HERO_SLIDES, 
  INITIAL_SCROLLING_NOTICE,
  INITIAL_HERO_HIGHLIGHTS,
  BRAND_CONFIG 
} from '../data/mockData';
import { BLOG_POSTS } from '../data/blogData';

interface ShopContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  orders: Order[];
  testimonials: Testimonial[];
  blogs: BlogPost[];
  heroSlides: HeroSlide[];
  dbStatus: DbStatusInfo | null;
  isLoadingDb: boolean;
  refreshDbData: () => Promise<void>;
  
  currentPage: ActivePage;
  setCurrentPage: (page: ActivePage) => void;
  selectedCategoryId: CategoryId | 'all';
  setSelectedCategoryId: (id: CategoryId | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  selectedBlog: BlogPost | null;
  setSelectedBlog: (blog: BlogPost | null) => void;
  selectedBlogCategory: string | 'all';
  setSelectedBlogCategory: (cat: string | 'all') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isCheckoutDrawerOpen: boolean;
  setIsCheckoutDrawerOpen: (open: boolean) => void;
  openCheckoutDrawer: (product?: Product) => void;
  closeCheckoutDrawer: () => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  deliveryCharge: number;
  cartTotal: number;

  // Order Actions
  createOrder: (
    customer: OrderCustomer,
    channel: 'website_cod' | 'whatsapp' | 'email',
    extra?: {
      discount?: number;
      couponCode?: string;
      paymentMethod?: 'cod' | 'bkash' | 'nagad' | 'rocket';
      paymentTrxId?: string;
      paymentSenderNumber?: string;
      deliveryCharge?: number;
    }
  ) => Promise<Order>;
  updateOrderStatus: (
    orderId: string,
    status?: Order['status'],
    courierData?: { courierName?: string; trackingNumber?: string }
  ) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  trackOrders: (query: string) => Promise<Order[]>;
  generateWhatsAppOrderUrl: (
    items: CartItem[],
    customer?: Partial<OrderCustomer>,
    customProduct?: Product,
    orderMetadata?: { orderId?: string; discount?: number; couponCode?: string; paymentMethod?: string; finalTotal?: number }
  ) => string;

  // Category Actions
  updateCategory: (id: string, updated: Partial<Category>) => Promise<void>;
  addCategory: (category: Omit<Category, '_id'> & { _id?: string }) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  // Admin Actions
  addProduct: (product: Omit<Product, '_id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, updated: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBlogPost: (post: Omit<BlogPost, '_id'>) => Promise<void>;
  updateBlogPost: (id: string, updated: Partial<BlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  addHeroSlide: (slide: Omit<HeroSlide, '_id'>) => Promise<void>;
  updateHeroSlide: (id: string, updated: Partial<HeroSlide>) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;
  reorderHeroSlides: (slides: HeroSlide[]) => void;
  heroHighlights: HeroHighlightedProduct[];
  updateHeroHighlights: (highlights: HeroHighlightedProduct[]) => Promise<void>;
  setHeroHighlightSlot: (slotId: string, updates: Partial<HeroHighlightedProduct>) => Promise<void>;
  scrollingNotice: ScrollingNotice;
  updateScrollingNotice: (updates: Partial<ScrollingNotice>) => Promise<void>;
  addTestimonial: (item: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, updated: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  resetToInitialData: () => void;

  // Auth State & Actions
  currentUser: User | null;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup';
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  loginUser: (identifier: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signupUser: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    city?: 'Dhaka' | 'Outside Dhaka';
  }) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products loaded from Database
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>(BLOG_POSTS);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(INITIAL_HERO_SLIDES);
  const [scrollingNotice, setScrollingNotice] = useState<ScrollingNotice>(INITIAL_SCROLLING_NOTICE);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [heroHighlights, setHeroHighlights] = useState<HeroHighlightedProduct[]>(() => {
    try {
      const saved = localStorage.getItem('kg_hero_highlights_v1');
      return saved ? JSON.parse(saved) : INITIAL_HERO_HIGHLIGHTS;
    } catch {
      return INITIAL_HERO_HIGHLIGHTS;
    }
  });

  // DB Connection and Loading Status
  const [dbStatus, setDbStatus] = useState<DbStatusInfo | null>(null);
  const [isLoadingDb, setIsLoadingDb] = useState(true);

  // Cart local state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('kg_cart_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    return [];
  });

  // Navigation & UI state
  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('kg_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('kg_auth_token_v1');
    } catch {
      return null;
    }
  });

  const getAuthHeaders = useCallback(() => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return headers;
  }, [authToken]);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [selectedBlogCategory, setSelectedBlogCategory] = useState<string | 'all'>('all');
  const [language, setLanguage] = useState<Language>('bn');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCheckoutDrawerOpen, setIsCheckoutDrawerOpen] = useState(false);

  const openCheckoutDrawer = (product?: Product) => {
    if (product) {
      setCart((prev) => {
        const existing = prev.find((item) => item.product._id === product._id);
        if (existing) {
          return prev.map((item) =>
            item.product._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        return [...prev, { product, quantity: 1 }];
      });
    }
    setIsCheckoutDrawerOpen(true);
  };

  const closeCheckoutDrawer = () => {
    setIsCheckoutDrawerOpen(false);
  };

  // Save cart in localStorage
  useEffect(() => {
    localStorage.setItem('kg_cart_v1', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // ----------------------------------------------------
  // FETCH ALL DATA FROM SERVER / DATABASE
  // ----------------------------------------------------
  const refreshDbData = useCallback(async () => {
    try {
      setIsLoadingDb(true);

      // Fast single-roundtrip bootstrap attempt
      try {
        const bootRes = await fetch('/api/bootstrap');
        if (bootRes.ok) {
          const bootData = await bootRes.json();
          if (bootData && typeof bootData === 'object') {
            if (Array.isArray(bootData.products) && bootData.products.length > 0) {
              setProducts(bootData.products);
            }
            if (Array.isArray(bootData.categories) && bootData.categories.length > 0) {
              setCategories(bootData.categories);
            }
            if (Array.isArray(bootData.blogs) && bootData.blogs.length > 0) {
              setBlogs(bootData.blogs);
            }
            if (Array.isArray(bootData.banners) && bootData.banners.length > 0) {
              setHeroSlides(bootData.banners);
            }
            if (bootData.scrollingNotice && typeof bootData.scrollingNotice.enabled === 'boolean') {
              setScrollingNotice(bootData.scrollingNotice);
            }
            if (Array.isArray(bootData.testimonials) && bootData.testimonials.length > 0) {
              setTestimonials(bootData.testimonials);
            }
            if (Array.isArray(bootData.heroHighlights) && bootData.heroHighlights.length > 0) {
              setHeroHighlights(bootData.heroHighlights);
            }
            if (bootData.dbStatus) {
              setDbStatus(bootData.dbStatus);
            }

            // Sync user orders concurrently if authenticated or guest with recent orders
            const storedToken = localStorage.getItem('kg_auth_token_v1');
            const storedUser = localStorage.getItem('kg_user_v1');
            const parsedUser = storedUser ? JSON.parse(storedUser) : null;
            let orderUrl = '';
            if (parsedUser && storedToken) {
              orderUrl = '/api/orders';
            } else if (parsedUser?.phone) {
              orderUrl = `/api/orders?phone=${encodeURIComponent(parsedUser.phone)}`;
            } else {
              const recentRaw = localStorage.getItem('kg_recent_order_ids_v1');
              const recentIds: string[] = recentRaw ? JSON.parse(recentRaw) : [];
              if (Array.isArray(recentIds) && recentIds.length > 0) {
                orderUrl = `/api/orders/track?orderIds=${encodeURIComponent(recentIds.join(','))}`;
              }
            }
            if (orderUrl) {
              fetch(orderUrl, {
                headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
              })
                .then((r) => (r.ok ? r.json() : []))
                .then((ordersData) => {
                  if (Array.isArray(ordersData)) setOrders(ordersData);
                })
                .catch(() => {});
            }

            setIsLoadingDb(false);
            return;
          }
        }
      } catch (bootErr) {
        console.warn('[ShopContext] Bootstrap API fallback to parallel requests:', bootErr);
      }

      // Parallel Fallback if bootstrap is unavailable
      const [statusRes, prodRes, catRes, blogRes, bannerRes, noticeRes, testRes, heroRes] = await Promise.allSettled([
        fetch('/api/db-status'),
        fetch('/api/products'),
        fetch('/api/categories'),
        fetch('/api/blogs'),
        fetch('/api/banners'),
        fetch('/api/scrolling-notice'),
        fetch('/api/testimonials'),
        fetch('/api/hero-highlights'),
      ]);

      if (statusRes.status === 'fulfilled' && statusRes.value.ok) {
        const statusJson = await statusRes.value.json();
        setDbStatus(statusJson);
      }
      if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
        const prodData = await prodRes.value.json();
        if (Array.isArray(prodData) && prodData.length > 0) setProducts(prodData);
      }
      if (catRes.status === 'fulfilled' && catRes.value.ok) {
        const catData = await catRes.value.json();
        if (Array.isArray(catData) && catData.length > 0) setCategories(catData);
      }
      if (blogRes.status === 'fulfilled' && blogRes.value.ok) {
        const blogData = await blogRes.value.json();
        if (Array.isArray(blogData) && blogData.length > 0) setBlogs(blogData);
      }
      if (bannerRes.status === 'fulfilled' && bannerRes.value.ok) {
        const bannerData = await bannerRes.value.json();
        if (Array.isArray(bannerData) && bannerData.length > 0) setHeroSlides(bannerData);
      }
      if (noticeRes.status === 'fulfilled' && noticeRes.value.ok) {
        const noticeData = await noticeRes.value.json();
        if (noticeData && typeof noticeData.enabled === 'boolean') setScrollingNotice(noticeData);
      }
      if (testRes.status === 'fulfilled' && testRes.value.ok) {
        const testData = await testRes.value.json();
        if (Array.isArray(testData) && testData.length > 0) setTestimonials(testData);
      }
      if (heroRes.status === 'fulfilled' && heroRes.value.ok) {
        const heroData = await heroRes.value.json();
        if (Array.isArray(heroData) && heroData.length > 0) setHeroHighlights(heroData);
      }
    } catch (err) {
      console.warn('[ShopContext] API call notice:', err);
    } finally {
      setIsLoadingDb(false);
    }
  }, []);

  // Fetch on initial mount
  useEffect(() => {
    refreshDbData();
  }, [refreshDbData]);

  const refreshOrders = useCallback(async () => {
    try {
      const token = authToken || localStorage.getItem('kg_auth_token_v1');
      if (currentUser && token) {
        const res = await fetch('/api/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setOrders(data);
        }
        return;
      }

      if (currentUser?.phone) {
        const res = await fetch(`/api/orders?phone=${encodeURIComponent(currentUser.phone)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setOrders(data);
        }
        return;
      }

      const recentRaw = localStorage.getItem('kg_recent_order_ids_v1');
      const recentIds: string[] = recentRaw ? JSON.parse(recentRaw) : [];
      if (Array.isArray(recentIds) && recentIds.length > 0) {
        const res = await fetch(`/api/orders/track?orderIds=${encodeURIComponent(recentIds.join(','))}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setOrders(data);
        }
      } else {
        setOrders([]);
      }
    } catch {
      // keep existing state on transient error
    }
  }, [currentUser, authToken]);

  const trackOrders = useCallback(async (query: string): Promise<Order[]> => {
    const clean = query.trim();
    if (!clean) return [];
    const token = authToken || localStorage.getItem('kg_auth_token_v1');
    const res = await fetch(`/api/orders/track?query=${encodeURIComponent(clean)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'অর্ডার খুঁজে পাওয়া যায়নি');
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }, [authToken]);

  // Synchronize orders when authentication changes
  useEffect(() => {
    refreshOrders();
  }, [refreshOrders]);

  // Refresh live order statuses when opening customer orders, account, or admin view
  useEffect(() => {
    if (currentPage === 'orders' || currentPage === 'account' || currentPage === 'admin') {
      refreshOrders();
    }
  }, [currentPage, refreshOrders]);

  // ----------------------------------------------------
  // CART ACTIONS
  // ----------------------------------------------------
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      if (existing) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(
      language === 'bn'
        ? `"${product.banglaName}" কার্টে যোগ করা হয়েছে`
        : `"${product.name}" added to cart`
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  // Fixed single delivery charge
  const deliveryCharge = cart.length > 0 ? BRAND_CONFIG.fixedDeliveryDhaka : 0;
  const cartTotal = cartSubtotal + deliveryCharge;

  // ----------------------------------------------------
  // ORDER ACTIONS (SAVED TO DATABASE)
  // ----------------------------------------------------
  const createOrder = async (
    customer: OrderCustomer,
    channel: 'website_cod' | 'whatsapp' | 'email',
    extra?: {
      discount?: number;
      couponCode?: string;
      paymentMethod?: 'cod' | 'bkash' | 'nagad' | 'rocket';
      paymentTrxId?: string;
      paymentSenderNumber?: string;
      deliveryCharge?: number;
    }
  ): Promise<Order> => {
    const delivery =
      extra?.deliveryCharge !== undefined
        ? extra.deliveryCharge
        : customer.city === 'Outside Dhaka'
        ? BRAND_CONFIG.fixedDeliveryOutside
        : BRAND_CONFIG.fixedDeliveryDhaka;

    const discount = Math.max(0, extra?.discount || 0);
    const calculatedTotal = Math.max(0, cartSubtotal - discount + delivery);

    const orderPayload = {
      items: cart.map((i) => ({
        productId: i.product._id,
        name: i.product.name,
        banglaName: i.product.banglaName,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.image,
      })),
      customer,
      subtotal: cartSubtotal,
      delivery_charge: delivery,
      discount: discount > 0 ? discount : undefined,
      couponCode: extra?.couponCode,
      paymentMethod: extra?.paymentMethod || 'cod',
      paymentTrxId: extra?.paymentTrxId,
      paymentSenderNumber: extra?.paymentSenderNumber,
      total: calculatedTotal,
      status: 'pending' as const,
      channel,
      notes: customer.notes || 'Website placed order',
    };

    let createdOrder: Order;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      if (res.ok) {
        createdOrder = await res.json();
      } else {
        throw new Error('Server order creation failed');
      }
    } catch (e) {
      // Fallback
      createdOrder = {
        ...orderPayload,
        _id: `KG-${Math.floor(100000 + Math.random() * 900000)}`,
        orderDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
    }

    setOrders((prev) => [createdOrder, ...prev.filter((o) => o._id !== createdOrder._id)]);
    try {
      const recentRaw = localStorage.getItem('kg_recent_order_ids_v1');
      const prevIds: string[] = recentRaw ? JSON.parse(recentRaw) : [];
      const nextIds = [createdOrder._id, ...prevIds.filter((id) => id !== createdOrder._id)].slice(0, 15);
      localStorage.setItem('kg_recent_order_ids_v1', JSON.stringify(nextIds));
    } catch {
      // ignore storage quota errors
    }
    clearCart();
    return createdOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status?: Order['status'],
    courierData?: { courierName?: string; trackingNumber?: string }
  ) => {
    const courierAssignedAt = courierData?.courierName ? new Date().toISOString() : undefined;
    const payload: Record<string, unknown> = {};
    if (status) payload.status = status;
    if (courierData) {
      if (courierData.courierName !== undefined) payload.courierName = courierData.courierName;
      if (courierData.trackingNumber !== undefined) payload.trackingNumber = courierData.trackingNumber;
      if (courierAssignedAt) payload.courierAssignedAt = courierAssignedAt;
    }

    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId
          ? {
              ...o,
              ...(status ? { status } : {}),
              ...(courierData
                ? {
                    courierName: courierData.courierName !== undefined ? courierData.courierName : o.courierName,
                    trackingNumber: courierData.trackingNumber !== undefined ? courierData.trackingNumber : o.trackingNumber,
                    ...(courierAssignedAt ? { courierAssignedAt } : {}),
                  }
                : {}),
            }
          : o
      )
    );

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        showToast(err.error || (language === 'bn' ? 'অর্ডার আপডেট সংরক্ষণ করা যায়নি' : 'Failed to update order'));
        refreshOrders();
        return;
      }
      const updatedOrder = await res.json().catch(() => null);
      if (updatedOrder && updatedOrder._id) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
      }
    } catch (e) {
      console.warn('Could not sync status with server:', e);
      showToast(language === 'bn' ? 'সার্ভারের সাথে সংযোগ ব্যর্থ হয়েছে' : 'Failed to sync with server');
      return;
    }

    if (courierData?.courierName) {
      showToast(
        language === 'bn'
          ? `অর্ডার #${orderId} এ কুরিয়ার (${courierData.courierName}) যুক্ত হয়েছে`
          : `Courier (${courierData.courierName}) assigned to order #${orderId}`
      );
    } else if (status) {
      showToast(
        language === 'bn'
          ? `অর্ডার #${orderId} স্ট্যাটাস পরিবর্তন হয়েছে (${status})`
          : `Order #${orderId} status updated to ${status}`
      );
    }
  };

  const deleteOrder = async (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o._id !== orderId));
    try {
      await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      console.warn('Could not delete order from server:', e);
    }
    showToast(
      language === 'bn' ? `অর্ডার #${orderId} মুছে ফেলা হয়েছে` : `Order #${orderId} deleted`
    );
  };

  const generateWhatsAppOrderUrl = (
    items: CartItem[],
    customer?: Partial<OrderCustomer>,
    customProduct?: Product,
    orderMetadata?: { orderId?: string; discount?: number; couponCode?: string; paymentMethod?: string; finalTotal?: number }
  ) => {
    let text = '';
    const phoneClean = BRAND_CONFIG.phone.replace(/[^0-9]/g, '');

    if (customProduct) {
      text = `আসসালামু আলাইকুম Kasab Gallery! 🌿\n\nআমি সরাসরি এই পণ্যটি অর্ডার করতে আগ্রহী:\n` +
        `📦 পণ্য: ${customProduct.banglaName} (${customProduct.name})\n` +
        `💰 মূল্য: ৳${customProduct.price}\n\n` +
        `অনুগ্রহ করে ডেলিভারি ও কনফার্মেশন বিস্তারিত জানান। জাযাকাল্লাহু খাইরান!`;
    } else {
      const itemsList = items
        .map(
          (i, idx) =>
            `${idx + 1}. ${i.product.banglaName} (পরিমাণ: ${i.quantity}টি) - ৳${i.product.price * i.quantity}`
        )
        .join('\n');

      const sub = items.reduce(
        (acc, curr) => acc + curr.product.price * curr.quantity,
        0
      );
      const delivery =
        customer?.city === 'Outside Dhaka'
          ? BRAND_CONFIG.fixedDeliveryOutside
          : BRAND_CONFIG.fixedDeliveryDhaka;
      const discount = orderMetadata?.discount || 0;
      const grandTotal = orderMetadata?.finalTotal ?? Math.max(0, sub - discount + delivery);

      const orderHeader = orderMetadata?.orderId
        ? `আসসালামু আলাইকুম Kasab Gallery! 🌿\nআমার অর্ডার আইডি: #${orderMetadata.orderId}\n\n`
        : `আসসালামু আলাইকুম Kasab Gallery! 🌿\nআমি একটি নতুন অর্ডার কনফার্ম করতে চাই:\n\n`;

      text =
        orderHeader +
        `🛒 **অর্ডারকৃত পণ্যসমূহ:**\n${itemsList}\n\n` +
        `💵 পণ্যের মূল্য: ৳${sub}\n` +
        (discount > 0 ? `🎟️ ডিসকাউন্ট (${orderMetadata?.couponCode || 'কুপন'}): -৳${discount}\n` : '') +
        `🚚 সিঙ্গেল ডেলিভারি চার্জ: ৳${delivery}\n` +
        `🏷️ **সর্বমোট প্রদেয়: ৳${grandTotal}**\n\n` +
        `👤 গ্রাহকের নাম: ${customer?.name || 'Customer'}\n` +
        `📞 ফোন নম্বর: ${customer?.phone || ''}\n` +
        `📍 ঠিকানা: ${customer?.address || ''}\n` +
        `🏙️ জেলা/শহর: ${customer?.district ? `${customer.district}, ` : ''}${customer?.city || 'Dhaka'}\n` +
        (orderMetadata?.paymentMethod ? `💳 পেমেন্ট মাধ্যম: ${orderMetadata.paymentMethod.toUpperCase()}\n` : '') +
        (customer?.notes ? `📝 বিশেষ নির্দেশনা: ${customer.notes}\n` : '') +
        `\nঅনুগ্রহ করে অর্ডারটি দ্রুত প্রসেসিং করুন। জাযাকাল্লাহু খাইরান!`;
    }

    return `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;
  };

  // ----------------------------------------------------
  // ADMIN ACTIONS (SYNCED WITH DATABASE)
  // ----------------------------------------------------
  const addProduct = async (newP: Omit<Product, '_id' | 'createdAt'>) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newP),
      });
      if (res.ok) {
        const created: Product = await res.json();
        setProducts((prev) => [created, ...prev]);
      } else {
        throw new Error('API failed');
      }
    } catch (e) {
      const fallback: Product = {
        ...newP,
        _id: `prod-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setProducts((prev) => [fallback, ...prev]);
    }
    showToast(
      language === 'bn'
        ? 'নতুন পণ্য ডেটাবেজে সফলভাবে যুক্ত হয়েছে'
        : 'Product added successfully to database'
    );
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === id ? { ...p, ...updated } : p))
    );
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn('Error syncing product update to database:', e);
    }
    showToast(
      language === 'bn' ? 'পণ্য ডেটাবেজে আপডেট সম্পন্ন হয়েছে' : 'Product updated in database'
    );
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p._id !== id && (p as any).id !== id));
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      console.warn('Error syncing product delete to database:', e);
    }
    showToast(
      language === 'bn' ? 'পণ্যটি ডেটাবেজ থেকে মুছে ফেলা হয়েছে' : 'Product removed from database'
    );
  };

  const addBlogPost = async (post: Omit<BlogPost, '_id'>) => {
    try {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(post),
      });
      if (res.ok) {
        const created = await res.json();
        setBlogs((prev) => [created, ...prev]);
      } else {
        throw new Error('Failed to create blog on server');
      }
    } catch (e) {
      const fallback: BlogPost = {
        ...post,
        _id: `blog-${Date.now()}`,
      };
      setBlogs((prev) => [fallback, ...prev]);
    }
    showToast(
      language === 'bn' ? 'নতুন ব্লগ আর্টিকেল প্রকাশিত হয়েছে' : 'Blog post published'
    );
  };

  const updateBlogPost = async (id: string, updated: Partial<BlogPost>) => {
    setBlogs((prev) =>
      prev.map((b) => (b._id === id ? { ...b, ...updated } : b))
    );
    try {
      await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn('Error updating blog on server:', e);
    }
    showToast(
      language === 'bn' ? 'ব্লগ আর্টিকেল আপডেট করা হয়েছে' : 'Blog post updated'
    );
  };

  const deleteBlogPost = async (id: string) => {
    setBlogs((prev) => prev.filter((b) => b._id !== id));
    try {
      await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      console.warn('Error deleting blog on server:', e);
    }
    showToast(
      language === 'bn' ? 'ব্লগটি মুছে ফেলা হয়েছে' : 'Blog post deleted'
    );
  };

  const addHeroSlide = async (slide: Omit<HeroSlide, '_id'>) => {
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(slide),
      });
      if (res.ok) {
        const created = await res.json();
        setHeroSlides((prev) => [...prev, created]);
      } else {
        throw new Error('Banner API failed');
      }
    } catch (e) {
      const fallback: HeroSlide = {
        ...slide,
        _id: `slide-${Date.now()}`,
      };
      setHeroSlides((prev) => [...prev, fallback]);
    }
    showToast(
      language === 'bn' ? 'নতুন স্লাইডার ব্যানার ডেটাবেজে যোগ হয়েছে' : 'Hero slide added to database'
    );
  };

  const updateHeroSlide = async (id: string, updated: Partial<HeroSlide>) => {
    setHeroSlides((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...updated } : s))
    );
    try {
      await fetch(`/api/banners/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });
    } catch (e) {
      console.warn('Error updating banner on server:', e);
    }
    showToast(
      language === 'bn' ? 'স্লাইডার ব্যানার আপডেট করা হয়েছে' : 'Hero slide updated'
    );
  };

  const deleteHeroSlide = async (id: string) => {
    setHeroSlides((prev) => prev.filter((s) => s._id !== id));
    try {
      await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      console.warn('Error deleting banner from server:', e);
    }
    showToast(
      language === 'bn' ? 'স্লাইডার ব্যানার মুছে ফেলা হয়েছে' : 'Hero slide deleted'
    );
  };

  const reorderHeroSlides = (newSlides: HeroSlide[]) => {
    setHeroSlides(newSlides);
    showToast(
      language === 'bn' ? 'স্লাইডারের ক্রম আপডেট করা হয়েছে' : 'Slide order updated'
    );
  };

  const updateHeroHighlights = async (highlights: HeroHighlightedProduct[]) => {
    setHeroHighlights(highlights);
    localStorage.setItem('kg_hero_highlights_v1', JSON.stringify(highlights));
    try {
      const res = await fetch('/api/hero-highlights', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(highlights),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setHeroHighlights(data);
          localStorage.setItem('kg_hero_highlights_v1', JSON.stringify(data));
        }
      }
    } catch (e) {
      console.warn('Error saving hero highlights on server:', e);
    }
    showToast(
      language === 'bn' ? 'হোমপেজ হাইলাইটেড পণ্য সফলভাবে আপডেট হয়েছে' : 'Hero highlights updated successfully'
    );
  };

  const setHeroHighlightSlot = async (slotId: string, updates: Partial<HeroHighlightedProduct>) => {
    const next = heroHighlights.map((h) => (h.slotId === slotId ? { ...h, ...updates } : h));
    await updateHeroHighlights(next);
  };

  const updateScrollingNotice = async (updates: Partial<ScrollingNotice>) => {
    setScrollingNotice((prev) => ({ ...prev, ...updates }));
    try {
      const res = await fetch('/api/scrolling-notice', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setScrollingNotice(data);
      }
    } catch (e) {
      console.warn('Error updating scrolling notice on server:', e);
    }
    showToast(
      language === 'bn' ? 'স্ক্রোলিং নোটিশ সফলভাবে আপডেট হয়েছে' : 'Scrolling notice updated successfully'
    );
  };

  const addTestimonial = async (item: Omit<Testimonial, 'id'>) => {
    const tempId = `rev-${Date.now()}`;
    const newTestimonial: Testimonial = { ...item, id: tempId };
    setTestimonials((prev) => [newTestimonial, ...prev]);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
      if (res.ok) {
        const created = await res.json();
        setTestimonials((prev) => prev.map((t) => (t.id === tempId ? created : t)));
      }
    } catch (e) {
      console.warn('Error adding testimonial to server:', e);
    }
    showToast(
      language === 'bn' ? 'নতুন গ্রাহক সন্তুষ্টির রিভিউ যুক্ত হয়েছে' : 'New customer review added'
    );
  };

  const updateTestimonial = async (id: string, updated: Partial<Testimonial>) => {
    setTestimonials((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...data } : t))
        );
      }
    } catch (e) {
      console.warn('Error updating testimonial on server:', e);
    }
    showToast(
      language === 'bn' ? 'গ্রাহক রিভিউ সফলভাবে আপডেট হয়েছে' : 'Customer review updated successfully'
    );
  };

  const deleteTestimonial = async (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
    } catch (e) {
      console.warn('Error deleting testimonial on server:', e);
    }
    showToast(
      language === 'bn' ? 'গ্রাহক রিভিউ সফলভাবে মুছে ফেলা হয়েছে' : 'Customer review deleted'
    );
  };

  const updateCategory = async (id: string, updated: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c._id === id || (c as any).id === id ? { ...c, ...updated } : c))
    );
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories((prev) =>
          prev.map((c) => (c._id === id || (c as any).id === id ? { ...c, ...data } : c))
        );
      }
    } catch (e) {
      console.warn('Error syncing category update to server:', e);
    }
    showToast(
      language === 'bn' ? 'ক্যাটাগরি তথ্য সফলভাবে আপডেট হয়েছে' : 'Category updated successfully'
    );
  };

  const addCategory = async (categoryData: Omit<Category, '_id'> & { _id?: string }) => {
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(categoryData),
      });
      if (res.ok) {
        const created = await res.json();
        setCategories((prev) => [...prev, created]);
      } else {
        throw new Error('Category create API failed');
      }
    } catch (e) {
      const fallback: Category = {
        ...categoryData,
        _id: (categoryData._id || `cat-${Date.now()}`) as any,
      };
      setCategories((prev) => [...prev, fallback]);
    }
    showToast(
      language === 'bn' ? 'নতুন ক্যাটাগরি তৈরি করা হয়েছে' : 'New category created'
    );
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c._id !== id && (c as any).id !== id));
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
    } catch (e) {
      console.warn('Error deleting category on server:', e);
    }
    showToast(
      language === 'bn' ? 'ক্যাটাগরিটি সফলভাবে মুছে ফেলা হয়েছে' : 'Category deleted successfully'
    );
  };

  const resetToInitialData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setBlogs(BLOG_POSTS);
    setHeroSlides(INITIAL_HERO_SLIDES);
    refreshDbData();
    showToast(
      language === 'bn'
        ? 'ডিফল্ট ডেটায় রিসেট করা হয়েছে'
        : 'Reset to default data'
    );
  };

  const openAuthModal = useCallback((tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const loginUser = useCallback(async (identifier: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'লগইন করতে ব্যর্থ হয়েছে' };
      }
      setCurrentUser(data.user);
      if (data.token) {
        setAuthToken(data.token);
        localStorage.setItem('kg_auth_token_v1', data.token);
      }
      localStorage.setItem('kg_user_v1', JSON.stringify(data.user));
      showToast(language === 'bn' ? `স্বাগতম, ${data.user.name}!` : `Welcome back, ${data.user.name}!`);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'সার্ভার ত্রুটি' };
    }
  }, [language, showToast]);

  const signupUser = useCallback(async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
    city?: 'Dhaka' | 'Outside Dhaka';
  }) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) {
        return { success: false, error: resData.error || 'অ্যাকাউন্ট তৈরিতে ব্যর্থ হয়েছে' };
      }
      setCurrentUser(resData.user);
      if (resData.token) {
        setAuthToken(resData.token);
        localStorage.setItem('kg_auth_token_v1', resData.token);
      }
      localStorage.setItem('kg_user_v1', JSON.stringify(resData.user));
      showToast(language === 'bn' ? `আপনার অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম ${resData.user.name}` : `Account created! Welcome ${resData.user.name}`);
      setIsAuthModalOpen(false);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'সার্ভার ত্রুটি' };
    }
  }, [language, showToast]);

  const logoutUser = useCallback(() => {
    setCurrentUser(null);
    setAuthToken(null);
    setOrders([]);
    localStorage.removeItem('kg_user_v1');
    localStorage.removeItem('kg_auth_token_v1');
    showToast(language === 'bn' ? 'লগআউট সফল হয়েছে।' : 'Logged out successfully.');
    if (currentPage === 'admin' || currentPage === 'account') {
      setCurrentPage('home');
    }
  }, [language, showToast, currentPage]);

  const updateUser = useCallback(async (updates: Partial<User>) => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ id: currentUser._id, ...updates }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
        localStorage.setItem('kg_user_v1', JSON.stringify(updated));
        showToast(language === 'bn' ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated!');
      }
    } catch (e) {
      console.error('Failed to update user profile', e);
    }
  }, [currentUser, language, showToast]);

  return (
    <ShopContext.Provider
      value={{
        products,
        categories,
        cart,
        orders,
        testimonials,
        blogs,
        heroSlides,
        dbStatus,
        isLoadingDb,
        refreshDbData,
        currentPage,
        setCurrentPage,
        selectedCategoryId,
        setSelectedCategoryId,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        quickViewProduct,
        setQuickViewProduct,
        selectedBlog,
        setSelectedBlog,
        selectedBlogCategory,
        setSelectedBlogCategory,
        language,
        setLanguage,
        toastMessage,
        showToast,
        isSidebarOpen,
        setIsSidebarOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        deliveryCharge,
        cartTotal,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        refreshOrders,
        trackOrders,
        generateWhatsAppOrderUrl,
        updateCategory,
        addCategory,
        deleteCategory,
        addProduct,
        updateProduct,
        deleteProduct,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        reorderHeroSlides,
        heroHighlights,
        updateHeroHighlights,
        setHeroHighlightSlot,
        scrollingNotice,
        updateScrollingNotice,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        resetToInitialData,
        currentUser,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        loginUser,
        signupUser,
        logoutUser,
        updateUser,
        isCheckoutDrawerOpen,
        setIsCheckoutDrawerOpen,
        openCheckoutDrawer,
        closeCheckoutDrawer,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
