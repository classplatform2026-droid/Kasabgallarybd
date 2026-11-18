import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ override: true });
import { INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_HERO_SLIDES, INITIAL_ORDERS, INITIAL_SCROLLING_NOTICE, INITIAL_TESTIMONIALS, INITIAL_HERO_HIGHLIGHTS } from '../src/data/mockData';
import { BLOG_POSTS } from '../src/data/blogData';
import { Product, Category, BlogPost, HeroSlide, Order, OrderStatus, ScrollingNotice, Testimonial, User, HeroHighlightedProduct } from '../src/types';
import bcrypt from 'bcryptjs';
import { serverCache } from './cache';

export interface DbUser extends User {
  passwordHash: string;
}

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnecting = false;
let connectionError: string | null = null;

// Initial seeded accounts (admin & demo customer)
const INITIAL_USERS: DbUser[] = [
  {
    _id: 'user-admin',
    name: 'Kasab Gallery Admin',
    email: 'admin@kasab.com',
    phone: '01700000000',
    role: 'admin',
    passwordHash: bcrypt.hashSync('admin123', 10),
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'user-customer-1',
    name: 'রাফি হাসান',
    email: 'customer@kasab.com',
    phone: '01800000000',
    role: 'user',
    address: 'বাড়ি ১২, রোড ৪, ধানমন্ডি',
    city: 'Dhaka',
    passwordHash: bcrypt.hashSync('user123', 10),
    createdAt: new Date().toISOString(),
  },
];

// In-memory local stores as fallback if MongoDB URI is not set or while offline
let localProducts: Product[] = [...INITIAL_PRODUCTS];
let localCategories: Category[] = [...INITIAL_CATEGORIES];
let localBlogs: BlogPost[] = [...BLOG_POSTS];
let localBanners: HeroSlide[] = [...INITIAL_HERO_SLIDES];
let localOrders: Order[] = [...INITIAL_ORDERS];
let localScrollingNotice: ScrollingNotice = { ...INITIAL_SCROLLING_NOTICE };
let localTestimonials: Testimonial[] = [...INITIAL_TESTIMONIALS];
let localHeroHighlights: HeroHighlightedProduct[] = [...INITIAL_HERO_HIGHLIGHTS];
let localUsers: DbUser[] = [...INITIAL_USERS];

export async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return null;
  }

  if (db) return db;

  if (isConnecting) {
    return null;
  }

  try {
    isConnecting = true;
    console.log('[MongoDB] Connecting to database...');
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 2500,
      maxPoolSize: 20,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
    });
    await client.connect();

    // Extract database name from URI or default to 'kasab_gallery'
    db = client.db('kasab_gallery');
    console.log('[MongoDB] Successfully connected to kasab_gallery on Atlas!');

    // Initialize collections and seed initial data if empty
    await seedInitialData(db);
    connectionError = null;
    return db;
  } catch (err: any) {
    console.error('[MongoDB] Connection error:', err?.message || err);
    connectionError = err?.message || 'Failed to connect to MongoDB';
    if (client) {
      try {
        await client.close();
      } catch {}
      client = null;
    }
    db = null;
    return null;
  } finally {
    isConnecting = false;
  }
}

async function seedInitialData(database: Db) {
  try {
    // 1. Categories
    const categoriesCount = await database.collection('categories').countDocuments();
    if (categoriesCount === 0) {
      console.log('[MongoDB Seed] Seeding categories...');
      await database.collection<any>('categories').insertMany(INITIAL_CATEGORIES as any);
    }

    // 2. Products
    const productsCount = await database.collection('products').countDocuments();
    if (productsCount === 0) {
      console.log('[MongoDB Seed] Seeding products...');
      await database.collection<any>('products').insertMany(INITIAL_PRODUCTS as any);
    }

    // 3. Blogs
    const blogsCount = await database.collection('blogs').countDocuments();
    if (blogsCount === 0) {
      console.log('[MongoDB Seed] Seeding blogs...');
      await database.collection<any>('blogs').insertMany(BLOG_POSTS as any);
    }

    // 4. Hero Slides / Banners
    const bannersCount = await database.collection('banners').countDocuments();
    if (bannersCount === 0) {
      console.log('[MongoDB Seed] Seeding hero banners...');
      await database.collection<any>('banners').insertMany(INITIAL_HERO_SLIDES as any);
    }

    // 5. Orders
    const ordersCount = await database.collection('orders').countDocuments();
    if (ordersCount === 0) {
      console.log('[MongoDB Seed] Seeding initial demo orders...');
      await database.collection<any>('orders').insertMany(INITIAL_ORDERS as any);
    }

    // 6. Testimonials (Customer satisfaction reviews)
    const testimonialsCount = await database.collection('testimonials').countDocuments();
    if (testimonialsCount === 0) {
      console.log('[MongoDB Seed] Seeding customer testimonials...');
      await database.collection<any>('testimonials').insertMany(INITIAL_TESTIMONIALS as any);
    }

    // 7. Users (Authentication & Accounts)
    const usersCount = await database.collection('users').countDocuments();
    if (usersCount === 0) {
      console.log('[MongoDB Seed] Seeding default users (admin & customer)...');
      await database.collection<any>('users').insertMany(INITIAL_USERS as any);
    }

    // 8. Performance Indexes (Slash query latency & CPU load)
    await Promise.allSettled([
      database.collection('users').createIndex({ email: 1 }, { unique: true, sparse: true }),
      database.collection('users').createIndex({ phone: 1 }, { sparse: true }),
      database.collection('products').createIndex({ category: 1 }),
      database.collection('products').createIndex({ isFeatured: 1 }),
      database.collection('products').createIndex({ createdAt: -1 }),
      database.collection('orders').createIndex({ createdAt: -1 }),
      database.collection('orders').createIndex({ 'customer.phone': 1 }),
      database.collection('blogs').createIndex({ slug: 1 }),
      database.collection('categories').createIndex({ id: 1 }),
    ]);
  } catch (e: any) {
    console.warn('[MongoDB Seed] Note during seeding:', e?.message || e);
  }
}

// ==========================================
// DB REPOSITORY APIS WITH MONGODB & FALLBACK
// ==========================================

export async function getDbStatus() {
  const cached = serverCache.get('db_status');
  if (cached) return cached;

  const database = await getDb();
  let result;
  if (database) {
    const productsCount = await database.collection('products').countDocuments();
    const categoriesCount = await database.collection('categories').countDocuments();
    const blogsCount = await database.collection('blogs').countDocuments();
    const bannersCount = await database.collection('banners').countDocuments();
    const ordersCount = await database.collection('orders').countDocuments();
    const testimonialsCount = await database.collection('testimonials').countDocuments();
    result = {
      connected: true,
      database: 'MongoDB (Cloud/Atlas)',
      counts: {
        products: productsCount,
        categories: categoriesCount,
        blogs: blogsCount,
        banners: bannersCount,
        orders: ordersCount,
        testimonials: testimonialsCount,
      },
    };
  } else {
    result = {
      connected: false,
      database: 'Local In-Memory DB (Ready for MongoDB URI)',
      note: process.env.MONGODB_URI
        ? `Connection error: ${connectionError || 'Connecting...'}`
        : 'MONGODB_URI is not set. Using initialized persistent data store. Configure MONGODB_URI in Settings / Secrets to bind directly to MongoDB.',
      counts: {
        products: localProducts.length,
        categories: localCategories.length,
        blogs: localBlogs.length,
        banners: localBanners.length,
        orders: localOrders.length,
        testimonials: localTestimonials.length,
      },
    };
  }

  serverCache.set('db_status', result, 45);
  return result;
}

// ---------------- PRODUCTS ----------------
export async function getProducts(): Promise<Product[]> {
  const cached = serverCache.get<Product[]>('products_list');
  if (cached) return cached;

  let result: Product[] = localProducts;
  try {
    const database = await getDb();
    if (database) {
      const docs = await database.collection('products').find({}).toArray();
      result = docs.map((d: any) => ({
        ...d,
        _id: d._id?.toString() || d._id,
      })) as Product[];
    }
  } catch (err: any) {
    console.warn('[MongoDB] getProducts failed, using in-memory store:', err?.message || err);
  }
  serverCache.set('products_list', result, 60);
  return result;
}

export async function getProductById(id: string): Promise<Product | null> {
  const cacheKey = `product_${id}`;
  const cached = serverCache.get<Product>(cacheKey);
  if (cached) return cached;

  try {
    const database = await getDb();
    if (database) {
      const doc = await database.collection('products').findOne({ _id: id as any });
      if (doc) {
        const item = { ...doc, _id: doc._id?.toString() || doc._id } as Product;
        serverCache.set(cacheKey, item, 60);
        return item;
      }
    }
  } catch (err: any) {
    console.warn('[MongoDB] getProductById failed, using in-memory store:', err?.message || err);
  }
  const fallback = localProducts.find((p) => p._id === id) || null;
  if (fallback) {
    serverCache.set(cacheKey, fallback, 60);
  }
  return fallback;
}

export async function createProduct(productData: Omit<Product, '_id' | 'createdAt'>): Promise<Product> {
  const newProduct: Product = {
    ...productData,
    _id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  try {
    const database = await getDb();
    if (database) {
      await database.collection('products').insertOne(newProduct as any);
    }
  } catch (err: any) {
    console.warn('[MongoDB] createProduct write to DB failed, saved in-memory:', err?.message || err);
  }
  localProducts = [newProduct, ...localProducts];
  serverCache.invalidate('products');
  serverCache.invalidate('bootstrap');
  serverCache.invalidate('db_status');
  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  try {
    const database = await getDb();
    if (database) {
      await database.collection('products').updateOne({ _id: id as any }, { $set: updates });
      const updated = await getProductById(id);
      if (updated) {
        localProducts = localProducts.map((p) => (p._id === id ? updated : p));
        serverCache.invalidate('products');
        serverCache.invalidate('bootstrap');
        return updated;
      }
    }
  } catch (err: any) {
    console.warn('[MongoDB] updateProduct in DB failed, updated in-memory:', err?.message || err);
  }

  localProducts = localProducts.map((p) => (p._id === id ? { ...p, ...updates } : p));
  serverCache.invalidate('products');
  serverCache.invalidate('bootstrap');
  return localProducts.find((p) => p._id === id) || null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const database = await getDb();
  if (database) {
    try {
      const { ObjectId } = await import('mongodb');
      if (ObjectId.isValid(id)) {
        await database.collection('products').deleteOne({
          $or: [{ _id: id as any }, { _id: new ObjectId(id) as any }]
        });
      } else {
        await database.collection('products').deleteOne({ _id: id as any });
      }
    } catch {
      await database.collection('products').deleteOne({ _id: id as any });
    }
  }
  localProducts = localProducts.filter((p) => p._id !== id && (p as any).id !== id);
  serverCache.invalidate('products');
  serverCache.invalidate('bootstrap');
  serverCache.invalidate('db_status');
  return true;
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  const cached = serverCache.get<Category[]>('categories_list');
  if (cached) return cached;

  let result = localCategories;
  try {
    const database = await getDb();
    if (database) {
      const docs = await database.collection('categories').find({}).toArray();
      result = docs.map((d: any) => ({
        ...d,
        _id: d._id?.toString() || d._id,
      })) as Category[];
    }
  } catch (err: any) {
    console.warn('[MongoDB] getCategories failed, using in-memory store:', err?.message || err);
  }
  serverCache.set('categories_list', result, 120);
  return result;
}

export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
  const database = await getDb();
  if (database) {
    try {
      const { ObjectId } = await import('mongodb');
      const filter = ObjectId.isValid(id)
        ? { $or: [{ _id: id as any }, { _id: new ObjectId(id) as any }] }
        : { _id: id as any };
      await database.collection('categories').updateOne(filter, { $set: updates });
    } catch {
      try {
        await database.collection('categories').updateOne({ _id: id as any }, { $set: updates });
      } catch (err) {
        console.warn('[MongoDB] updateCategory error:', err);
      }
    }
  }
  localCategories = localCategories.map((c) =>
    (c._id === id || (c as any).id === id) ? { ...c, ...updates } : c
  );
  serverCache.invalidate('categories');
  serverCache.invalidate('bootstrap');
  return localCategories.find((c) => c._id === id || (c as any).id === id) || null;
}

export async function createCategory(categoryData: Omit<Category, '_id'> & { _id?: string }): Promise<Category> {
  const newCat: Category = {
    ...categoryData,
    _id: (categoryData._id || `cat-${Date.now()}`) as any,
  };
  try {
    const database = await getDb();
    if (database) {
      await database.collection('categories').insertOne({ ...newCat } as any);
    }
  } catch (err: any) {
    console.warn('[MongoDB] createCategory write error:', err?.message || err);
  }
  localCategories.push(newCat);
  serverCache.invalidate('categories');
  serverCache.invalidate('bootstrap');
  return newCat;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const database = await getDb();
  if (database) {
    try {
      const { ObjectId } = await import('mongodb');
      const filter = ObjectId.isValid(id)
        ? { $or: [{ _id: id as any }, { _id: new ObjectId(id) as any }] }
        : { _id: id as any };
      await database.collection('categories').deleteOne(filter);
    } catch {
      try {
        await database.collection('categories').deleteOne({ _id: id as any });
      } catch (err) {
        console.warn('[MongoDB] deleteCategory error:', err);
      }
    }
  }
  localCategories = localCategories.filter((c) => c._id !== id && (c as any).id !== id);
  serverCache.invalidate('categories');
  serverCache.invalidate('bootstrap');
  return true;
}

// ---------------- BLOGS ----------------
export async function getBlogs(): Promise<BlogPost[]> {
  const cached = serverCache.get<BlogPost[]>('blogs_list');
  if (cached) return cached;

  let result = localBlogs;
  try {
    const database = await getDb();
    if (database) {
      const docs = await database.collection('blogs').find({}).toArray();
      result = docs.map((d: any) => ({
        ...d,
        _id: d._id?.toString() || d._id,
      })) as BlogPost[];
    }
  } catch (err: any) {
    console.warn('[MongoDB] getBlogs error, using in-memory store:', err?.message || err);
  }
  serverCache.set('blogs_list', result, 120);
  return result;
}

export async function createBlog(blogData: Omit<BlogPost, '_id'>): Promise<BlogPost> {
  const newBlog: BlogPost = {
    ...blogData,
    _id: `blog-${Date.now()}`,
  };
  try {
    const database = await getDb();
    if (database) {
      await database.collection('blogs').insertOne(newBlog as any);
    }
  } catch (err: any) {
    console.warn('[MongoDB] createBlog error:', err?.message || err);
  }
  localBlogs = [newBlog, ...localBlogs];
  serverCache.invalidate('blogs');
  serverCache.invalidate('bootstrap');
  return newBlog;
}

export async function updateBlog(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const database = await getDb();
    if (database) {
      await database.collection('blogs').updateOne({ _id: id as any }, { $set: updates });
      const updated = await database.collection('blogs').findOne({ _id: id as any });
      if (updated) {
        const blogObj = { ...updated, _id: updated._id?.toString() || updated._id } as BlogPost;
        localBlogs = localBlogs.map((b) => (b._id === id ? blogObj : b));
        serverCache.invalidate('blogs');
        serverCache.invalidate('bootstrap');
        return blogObj;
      }
    }
  } catch (err: any) {
    console.warn('[MongoDB] updateBlog error:', err?.message || err);
  }
  localBlogs = localBlogs.map((b) => (b._id === id ? { ...b, ...updates } : b));
  serverCache.invalidate('blogs');
  serverCache.invalidate('bootstrap');
  return localBlogs.find((b) => b._id === id) || null;
}

export async function deleteBlog(id: string): Promise<boolean> {
  const database = await getDb();
  if (database) {
    try {
      const { ObjectId } = await import('mongodb');
      if (ObjectId.isValid(id)) {
        await database.collection('blogs').deleteOne({
          $or: [{ _id: id as any }, { _id: new ObjectId(id) as any }]
        });
      } else {
        await database.collection('blogs').deleteOne({ _id: id as any });
      }
    } catch {
      try {
        await database.collection('blogs').deleteOne({ _id: id as any });
      } catch (err) {
        console.warn('[MongoDB] deleteBlog error:', err);
      }
    }
  }
  localBlogs = localBlogs.filter((b) => b._id !== id);
  serverCache.invalidate('blogs');
  serverCache.invalidate('bootstrap');
  return true;
}

// ---------------- BANNERS ----------------
export async function getBanners(): Promise<HeroSlide[]> {
  const cached = serverCache.get<HeroSlide[]>('banners_list');
  if (cached) return cached;

  let result = localBanners;
  try {
    const database = await getDb();
    if (database) {
      const docs = await database.collection('banners').find({}).toArray();
      result = docs.map((d: any) => ({
        ...d,
        _id: d._id?.toString() || d._id,
      })) as HeroSlide[];
    }
  } catch (err: any) {
    console.warn('[MongoDB] getBanners error, using in-memory store:', err?.message || err);
  }
  serverCache.set('banners_list', result, 120);
  return result;
}

export async function createBanner(bannerData: Omit<HeroSlide, '_id'>): Promise<HeroSlide> {
  const newBanner: HeroSlide = {
    ...bannerData,
    _id: `slide-${Date.now()}`,
  };

  try {
    const database = await getDb();
    if (database) {
      await database.collection('banners').insertOne(newBanner as any);
    }
  } catch (err: any) {
    console.warn('[MongoDB] createBanner error:', err?.message || err);
  }
  localBanners = [...localBanners, newBanner];
  serverCache.invalidate('banners');
  serverCache.invalidate('bootstrap');
  return newBanner;
}

export async function updateBanner(id: string, updates: Partial<HeroSlide>): Promise<HeroSlide | null> {
  try {
    const database = await getDb();
    if (database) {
      await database.collection('banners').updateOne({ _id: id as any }, { $set: updates });
      const doc = await database.collection('banners').findOne({ _id: id as any });
      if (doc) {
        const updated = { ...doc, _id: doc._id?.toString() || doc._id } as HeroSlide;
        localBanners = localBanners.map((b) => (b._id === id ? updated : b));
        serverCache.invalidate('banners');
        serverCache.invalidate('bootstrap');
        return updated;
      }
    }
  } catch (err: any) {
    console.warn('[MongoDB] updateBanner error:', err?.message || err);
  }
  localBanners = localBanners.map((b) => (b._id === id ? { ...b, ...updates } : b));
  serverCache.invalidate('banners');
  serverCache.invalidate('bootstrap');
  return localBanners.find((b) => b._id === id) || null;
}

export async function deleteBanner(id: string): Promise<boolean> {
  try {
    const database = await getDb();
    if (database) {
      await database.collection('banners').deleteOne({ _id: id as any });
    }
  } catch (err: any) {
    console.warn('[MongoDB] deleteBanner error:', err?.message || err);
  }
  localBanners = localBanners.filter((b) => b._id !== id);
  serverCache.invalidate('banners');
  serverCache.invalidate('bootstrap');
  return true;
}

// ---------------- SCROLLING NOTICE ----------------
export async function getScrollingNotice(): Promise<ScrollingNotice> {
  const cached = serverCache.get<ScrollingNotice>('scrolling_notice');
  if (cached) return cached;

  let result = localScrollingNotice;
  const database = await getDb();
  if (database) {
    try {
      const doc = await database.collection('settings').findOne({ key: 'scrolling_notice' });
      if (doc) {
        result = {
          enabled: doc.enabled ?? true,
          text: doc.text || localScrollingNotice.text,
          textEn: doc.textEn || localScrollingNotice.textEn,
          speed: doc.speed || 'normal',
          badge: doc.badge || '📢 বিশেষ ঘোষণা',
          badgeEn: doc.badgeEn || '📢 Announcement',
          link: doc.link || '',
        };
      }
    } catch (err) {
      console.warn('Error reading scrolling notice from db:', err);
    }
  }
  serverCache.set('scrolling_notice', result, 120);
  return result;
}

export async function updateScrollingNotice(updates: Partial<ScrollingNotice>): Promise<ScrollingNotice> {
  localScrollingNotice = { ...localScrollingNotice, ...updates };
  const database = await getDb();
  if (database) {
    try {
      await database.collection('settings').updateOne(
        { key: 'scrolling_notice' },
        { $set: { key: 'scrolling_notice', ...localScrollingNotice } },
        { upsert: true }
      );
    } catch (err) {
      console.warn('Error saving scrolling notice to db:', err);
    }
  }
  serverCache.invalidate('scrolling_notice');
  serverCache.invalidate('bootstrap');
  return localScrollingNotice;
}

// ---------------- HERO HIGHLIGHTED PRODUCTS ----------------
export async function getHeroHighlights(): Promise<HeroHighlightedProduct[]> {
  const cached = serverCache.get<HeroHighlightedProduct[]>('hero_highlights');
  if (cached) return cached;

  let result = localHeroHighlights;
  const database = await getDb();
  if (database) {
    try {
      const doc = await database.collection('settings').findOne({ key: 'hero_highlights' });
      if (doc && Array.isArray(doc.highlights) && doc.highlights.length > 0) {
        result = doc.highlights;
      }
    } catch (err) {
      console.warn('Error reading hero highlights from db:', err);
    }
  }
  serverCache.set('hero_highlights', result, 120);
  return result;
}

export async function updateHeroHighlights(highlights: HeroHighlightedProduct[]): Promise<HeroHighlightedProduct[]> {
  localHeroHighlights = highlights;
  const database = await getDb();
  if (database) {
    try {
      await database.collection('settings').updateOne(
        { key: 'hero_highlights' },
        { $set: { key: 'hero_highlights', highlights, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (err) {
      console.warn('Error saving hero highlights to db:', err);
    }
  }
  serverCache.invalidate('hero_highlights');
  serverCache.invalidate('bootstrap');
  return localHeroHighlights;
}


// ---------------- ORDERS ----------------
export async function getOrders(): Promise<Order[]> {
  try {
    const database = await getDb();
    if (database) {
      const docs = await database.collection('orders').find({}).sort({ orderDate: -1 }).toArray();
      return docs.map((d: any) => ({
        ...d,
        _id: d._id?.toString() || d._id,
      })) as Order[];
    }
  } catch (err: any) {
    console.warn('[MongoDB] getOrders error, using in-memory store:', err?.message || err);
  }
  return localOrders;
}

export async function createOrder(orderData: Omit<Order, '_id' | 'orderDate'>): Promise<Order> {
  const newOrder: Order = {
    ...orderData,
    _id: `KG-${Math.floor(100000 + Math.random() * 900000)}`,
    orderDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  try {
    const database = await getDb();
    if (database) {
      await database.collection('orders').insertOne(newOrder as any);
    }
  } catch (err: any) {
    console.warn('[MongoDB] createOrder error:', err?.message || err);
  }
  localOrders = [newOrder, ...localOrders];
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status?: OrderStatus,
  courierData?: { courierName?: string; trackingNumber?: string; courierAssignedAt?: string }
): Promise<Order | null> {
  const updates: Partial<Order> = {};
  if (status) updates.status = status;
  if (courierData) {
    if (courierData.courierName !== undefined) updates.courierName = courierData.courierName;
    if (courierData.trackingNumber !== undefined) updates.trackingNumber = courierData.trackingNumber;
    if (courierData.courierAssignedAt !== undefined) updates.courierAssignedAt = courierData.courierAssignedAt;
  }

  try {
    const database = await getDb();
    if (database && Object.keys(updates).length > 0) {
      await database.collection('orders').updateOne({ _id: id as any }, { $set: updates });
      const doc = await database.collection('orders').findOne({ _id: id as any });
      if (doc) {
        const updated = { ...doc, _id: doc._id?.toString() || doc._id } as Order;
        localOrders = localOrders.map((o) => (o._id === id ? updated : o));
        return updated;
      }
    }
  } catch (err: any) {
    console.warn('[MongoDB] updateOrderStatus error:', err?.message || err);
  }

  localOrders = localOrders.map((o) => (o._id === id ? { ...o, ...updates } : o));
  return localOrders.find((o) => o._id === id) || null;
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    const database = await getDb();
    if (database) {
      await database.collection('orders').deleteOne({ _id: id as any });
    }
  } catch (err: any) {
    console.warn('[MongoDB] deleteOrder error:', err?.message || err);
  }
  localOrders = localOrders.filter((o) => o._id !== id);
  return true;
}

// ---------------- TESTIMONIALS (Customer Satisfaction Experience) ----------------
export async function getTestimonials(): Promise<Testimonial[]> {
  const cached = serverCache.get<Testimonial[]>('testimonials_list');
  if (cached) return cached;

  let result = localTestimonials;
  const database = await getDb();
  if (database) {
    try {
      const docs = await database.collection('testimonials').find({}).toArray();
      if (docs && docs.length > 0) {
        result = docs.map((d: any) => ({
          ...d,
          id: d.id || d._id?.toString() || d._id,
        })) as Testimonial[];
      }
    } catch (err) {
      console.warn('Error fetching testimonials from db:', err);
    }
  }
  serverCache.set('testimonials_list', result, 120);
  return result;
}

export async function createTestimonial(testimonialData: Omit<Testimonial, 'id'>): Promise<Testimonial> {
  const newTestimonial: Testimonial = {
    ...testimonialData,
    id: `rev-${Date.now()}`,
    rating: Number(testimonialData.rating) || 5,
    verifiedBuyer: testimonialData.verifiedBuyer ?? true,
    date: testimonialData.date || 'সম্প্রতি',
  };

  const database = await getDb();
  if (database) {
    try {
      await database.collection('testimonials').insertOne(newTestimonial as any);
    } catch (err) {
      console.warn('Error inserting testimonial in db:', err);
    }
  }
  localTestimonials = [newTestimonial, ...localTestimonials];
  serverCache.invalidate('testimonials');
  serverCache.invalidate('bootstrap');
  return newTestimonial;
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<Testimonial | null> {
  const database = await getDb();
  if (database) {
    try {
      await database.collection('testimonials').updateOne(
        { $or: [{ id }, { _id: id as any }] },
        { $set: updates }
      );
      const updated = await database.collection('testimonials').findOne({
        $or: [{ id }, { _id: id as any }],
      });
      if (updated) {
        const item = {
          ...updated,
          id: (updated as any).id || (updated as any)._id?.toString() || (updated as any)._id,
        } as unknown as Testimonial;
        localTestimonials = localTestimonials.map((t) => (t.id === id ? item : t));
        serverCache.invalidate('testimonials');
        serverCache.invalidate('bootstrap');
        return item;
      }
    } catch (err) {
      console.warn('Error updating testimonial in db:', err);
    }
  }

  localTestimonials = localTestimonials.map((t) => (t.id === id ? { ...t, ...updates } : t));
  serverCache.invalidate('testimonials');
  serverCache.invalidate('bootstrap');
  return localTestimonials.find((t) => t.id === id) || null;
}

export async function deleteTestimonial(id: string): Promise<boolean> {
  const database = await getDb();
  if (database) {
    try {
      const { ObjectId } = await import('mongodb');
      if (ObjectId.isValid(id)) {
        await database.collection('testimonials').deleteOne({
          $or: [{ id }, { _id: id as any }, { _id: new ObjectId(id) as any }],
        });
      } else {
        await database.collection('testimonials').deleteOne({
          $or: [{ id }, { _id: id as any }],
        });
      }
    } catch {
      await database.collection('testimonials').deleteOne({
        $or: [{ id }, { _id: id as any }],
      });
    }
  }
  localTestimonials = localTestimonials.filter((t) => t.id !== id);
  serverCache.invalidate('testimonials');
  serverCache.invalidate('bootstrap');
  return true;
}

// ---------------- HIGH-PERFORMANCE BOOTSTRAP AGGREGATOR ----------------
// Bundles all critical storefront resources in 1 single compressed request.
export async function getBootstrapData() {
  const cached = serverCache.get('bootstrap_data');
  if (cached) return cached;

  const [products, categories, banners, blogs, scrollingNotice, testimonials, dbStatus, heroHighlights] = await Promise.all([
    getProducts(),
    getCategories(),
    getBanners(),
    getBlogs(),
    getScrollingNotice(),
    getTestimonials(),
    getDbStatus(),
    getHeroHighlights(),
  ]);

  const payload = {
    products,
    categories,
    banners,
    blogs,
    scrollingNotice,
    testimonials,
    dbStatus,
    heroHighlights,
    timestamp: Date.now(),
  };

  serverCache.set('bootstrap_data', payload, 60);
  return payload;
}

// ---------------- USERS & AUTHENTICATION ----------------

export async function findUserByEmailOrPhone(identifier: string): Promise<DbUser | null> {
  const clean = identifier.trim().toLowerCase();
  const database = await getDb();
  if (database) {
    try {
      const doc = await database.collection('users').findOne({
        $or: [
          { email: clean },
          { phone: clean },
          { phone: identifier.trim() },
        ],
      });
      if (doc) {
        return {
          ...doc,
          _id: doc._id?.toString() || doc._id,
        } as DbUser;
      }
    } catch (e) {
      console.warn('Error querying user from MongoDB:', e);
    }
  }
  return (
    localUsers.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.phone.toLowerCase() === clean ||
        u.phone === identifier.trim()
    ) || null
  );
}

export async function findUserById(id: string): Promise<User | null> {
  const database = await getDb();
  if (database) {
    try {
      const doc = await database.collection('users').findOne({ _id: id as any });
      if (doc) {
        const { passwordHash, ...safeUser } = doc as any;
        return { ...safeUser, _id: doc._id?.toString() || doc._id } as User;
      }
    } catch (e) {
      console.warn('Error finding user by id:', e);
    }
  }
  const u = localUsers.find((x) => x._id === id);
  if (u) {
    const { passwordHash, ...safe } = u;
    return safe;
  }
  return null;
}

export async function registerUser(userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: 'user' | 'admin';
  address?: string;
  city?: 'Dhaka' | 'Outside Dhaka';
  district?: string;
  thana?: string;
}): Promise<User> {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(userData.password, salt);

  const newUser: DbUser = {
    _id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: userData.name.trim(),
    email: userData.email.trim().toLowerCase(),
    phone: userData.phone.trim(),
    role: userData.role || 'user',
    address: userData.address?.trim() || '',
    city: userData.city || 'Dhaka',
    district: userData.district || '',
    thana: userData.thana || '',
    createdAt: new Date().toISOString(),
    passwordHash,
  };

  const database = await getDb();
  if (database) {
    try {
      await database.collection('users').insertOne(newUser as any);
    } catch (err) {
      console.warn('Error inserting user to MongoDB:', err);
    }
  }

  localUsers = [newUser, ...localUsers];

  const { passwordHash: _, ...safeUser } = newUser;
  return safeUser;
}

export async function updateUserProfile(id: string, updates: Partial<User>): Promise<User | null> {
  const database = await getDb();
  if (database) {
    try {
      await database.collection('users').updateOne({ _id: id as any }, { $set: updates });
    } catch (err) {
      console.warn('Error updating user in MongoDB:', err);
    }
  }

  localUsers = localUsers.map((u) => (u._id === id ? { ...u, ...updates } : u));
  return findUserById(id);
}

export async function getAllUsers(): Promise<User[]> {
  const database = await getDb();
  if (database) {
    try {
      const docs = await database.collection('users').find({}).toArray();
      return docs.map((doc: any) => {
        const { passwordHash, ...safe } = doc;
        return { ...safe, _id: doc._id?.toString() || doc._id } as User;
      });
    } catch (e) {
      console.warn('Error fetching all users from MongoDB:', e);
    }
  }
  return localUsers.map(({ passwordHash, ...safe }) => safe);
}
