import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import crypto from "crypto";
import compression from "compression";
import {
  getDbStatus,
  getBootstrapData,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  updateCategory,
  createCategory,
  deleteCategory,
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getScrollingNotice,
  updateScrollingNotice,
  getHeroHighlights,
  updateHeroHighlights,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
  findUserByEmailOrPhone,
  findUserById,
  registerUser,
  updateUserProfile,
  getAllUsers,
} from "./server/db";
import {
  getCloudinaryStatus,
  uploadToCloudinary,
  deleteFromCloudinary,
} from "./server/cloudinary";
import bcrypt from "bcryptjs";

dotenv.config({ override: true });

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "kasab-gallery-auth-secret-key-prod-v1";

// =====================================
// SECURITY HEADERS & BODY PARSING
// =====================================
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// Compress JSON/HTML responses over 1KB to reduce network payload by up to 80%
app.use(compression({ threshold: 1024 }) as any);

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// Static uploads storage directory
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use("/uploads", express.static(UPLOADS_DIR));

// =====================================
// RATE LIMITING (IN-MEMORY TOKEN BUCKET)
// =====================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function createRateLimiter(maxRequests: number, windowMs: number) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (typeof forwarded === "string" ? forwarded.split(",")[0] : req.socket.remoteAddress) || "unknown";
    const now = Date.now();
    const key = `${req.path}:${ip}`;
    const record = rateLimitMap.get(key);

    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: "অতিরিক্ত অনুরোধ করা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।",
      });
    }

    record.count++;
    next();
  };
}

const authLimiter = createRateLimiter(20, 15 * 60 * 1000); // 20 requests / 15 mins
const orderLimiter = createRateLimiter(15, 10 * 60 * 1000); // 15 requests / 10 mins

// Clean up stale rate limits every 10 mins
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitMap.entries()) {
    if (now > val.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

// =====================================
// TOKEN SIGNING & AUTHENTICATION
// =====================================
export function generateAuthToken(user: { _id: string; role: string }): string {
  const timestamp = Date.now();
  const payload = `${user._id}:${user.role}:${timestamp}`;
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(payload).digest("hex");
  return `${payload}:${sig}`;
}

export function verifyAuthToken(token?: string): { id: string; role: string } | null {
  if (!token) return null;
  const parts = token.split(":");
  if (parts.length !== 4) return null;
  const [id, role, timestampStr, sig] = parts;
  const payload = `${id}:${role}:${timestampStr}`;
  const expectedSig = crypto.createHmac("sha256", JWT_SECRET).update(payload).digest("hex");
  if (sig !== expectedSig) return null;

  const timestamp = parseInt(timestampStr, 10);
  // Token validity: 30 days
  if (isNaN(timestamp) || Date.now() - timestamp > 30 * 24 * 60 * 60 * 1000) {
    return null;
  }
  return { id, role };
}

// Global authentication extractor middleware
app.use((req: any, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : (req.headers["x-auth-token"] as string | undefined);

  if (token) {
    const verified = verifyAuthToken(token);
    if (verified) {
      req.user = verified;
    }
  }
  next();
});

// Admin guard middleware
function requireAdmin(req: any, res: express.Response, next: express.NextFunction) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      error: "অনুমোদিত অ্যাডমিন ছাড়া এই সুবিধাটি ব্যবহার করা যাবে না। (Admin access required)",
    });
  }
  next();
}

// =====================================
// API ROUTES
// =====================================

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 0. Authentication API
app.post("/api/auth/signup", authLimiter, async (req, res) => {
  try {
    const { name, email, phone, password, address, city, district, thana } = req.body;
    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ error: "নাম, পাসওয়ার্ড এবং ইমেইল অথবা ফোন নম্বর আবশ্যক।" });
    }

    if (email) {
      const existingEmail = await findUserByEmailOrPhone(email);
      if (existingEmail) {
        return res.status(400).json({ error: "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে।" });
      }
    }

    if (phone) {
      const existingPhone = await findUserByEmailOrPhone(phone);
      if (existingPhone) {
        return res.status(400).json({ error: "এই ফোন নম্বর দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে।" });
      }
    }

    const user = await registerUser({
      name,
      email: email || `${phone}@kasab.com`,
      phone: phone || "",
      password,
      address,
      city,
      district,
      thana,
      role: "user", // Registration always sets role to user
    });

    const token = generateAuthToken({ _id: user._id, role: user.role });
    res.status(201).json({ user, token, message: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!" });
  } catch (err: any) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে।" });
  }
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: "ইমেইল/ফোন এবং পাসওয়ার্ড প্রদান করুন।" });
    }

    const userWithHash = await findUserByEmailOrPhone(identifier);
    if (!userWithHash) {
      return res.status(401).json({ error: "এই ইমেইল বা ফোন নম্বরে কোনো অ্যাকাউন্ট পাওয়া যায়নি।" });
    }

    const isMatch = await bcrypt.compare(password, userWithHash.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "ভুল পাসওয়ার্ড। আবার চেষ্টা করুন।" });
    }

    const { passwordHash: _, ...safeUser } = userWithHash;
    const token = generateAuthToken({ _id: safeUser._id, role: safeUser.role });
    res.json({ user: safeUser, token, message: "লগইন সফল হয়েছে!" });
  } catch (err: any) {
    console.error("Login error:", err);
    res.status(500).json({ error: err.message || "লগইন করতে সমস্যা হয়েছে।" });
  }
});

app.get("/api/auth/me", async (req: any, res) => {
  try {
    const id = (req.query.id as string) || req.user?.id;
    if (!id) {
      return res.status(400).json({ error: "User ID required" });
    }
    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/auth/profile", async (req: any, res) => {
  try {
    const { id, role, ...allowedUpdates } = req.body;
    const targetId = id || req.user?.id;
    if (!targetId) {
      return res.status(400).json({ error: "User ID required" });
    }

    // Role cannot be updated unless caller is already a verified admin
    const finalUpdates: any = { ...allowedUpdates };
    if (role && req.user?.role === "admin") {
      finalUpdates.role = role;
    }

    const updated = await updateUserProfile(targetId, finalUpdates);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// User list is strictly restricted to admin
app.get("/api/auth/users", requireAdmin, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 1. High-Performance Storefront Bootstrap Endpoint
// Delivers products, categories, banners, blogs, notice, testimonials & DB status in 1 single compressed response
app.get("/api/bootstrap", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    const data = await getBootstrapData();
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Database Connection Status
app.get("/api/db-status", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=60");
    const status = await getDbStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Products API (Public Read, Admin Write)
app.get("/api/products", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    const products = await getProducts();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", requireAdmin, async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/products/:id", requireAdmin, async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ success: true, message: "Product deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Categories API (Public Read, Admin Write)
app.get("/api/categories", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    const categories = await getCategories();
    res.json(categories);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/categories", requireAdmin, async (req, res) => {
  try {
    const created = await createCategory(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/categories/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/categories/:id", requireAdmin, async (req, res) => {
  try {
    await deleteCategory(req.params.id);
    res.json({ success: true, message: "Category deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Blogs API (Public Read, Admin Write)
app.get("/api/blogs", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    const blogs = await getBlogs();
    res.json(blogs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/blogs", requireAdmin, async (req, res) => {
  try {
    const blog = await createBlog(req.body);
    res.status(201).json(blog);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/blogs/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await updateBlog(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/blogs/:id", requireAdmin, async (req, res) => {
  try {
    await deleteBlog(req.params.id);
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Hero Banners API (Public Read, Admin Write)
app.get("/api/banners", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    const banners = await getBanners();
    res.json(banners);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/banners", requireAdmin, async (req, res) => {
  try {
    const banner = await createBanner(req.body);
    res.status(201).json(banner);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/banners/:id", requireAdmin, async (req, res) => {
  try {
    const banner = await updateBanner(req.params.id, req.body);
    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }
    res.json(banner);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/banners/:id", requireAdmin, async (req, res) => {
  try {
    await deleteBanner(req.params.id);
    res.json({ success: true, message: "Banner deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6.1. Hero Spotlight Highlighted Products API (Public Read, Admin Write)
app.get("/api/hero-highlights", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    const highlights = await getHeroHighlights();
    res.json(highlights);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/hero-highlights", requireAdmin, async (req, res) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ error: "Highlights array payload expected" });
    }
    const updated = await updateHeroHighlights(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Normalize Bangladeshi phone numbers (+88017..., 88017..., 01712-449821 -> 01712449821)
function normalizeBDPhone(raw?: string): string {
  const digits = (raw || "").replace(/[^0-9]/g, "");
  if (!digits) return "";
  if (digits.startsWith("880") && digits.length >= 13) {
    return "0" + digits.slice(3);
  }
  if (digits.length === 10 && digits.startsWith("1")) {
    return "0" + digits;
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

function maskOrderForPublicTracking(order: any) {
  const rawName = (order.customer?.name || "").trim();
  const firstWord = rawName.split(/\s+/)[0] || "গ্রাহক";
  const maskedName = firstWord.length > 2 ? `${firstWord.slice(0, 2)}***` : `${firstWord}***`;
  const digits = normalizeBDPhone(order.customer?.phone);
  const maskedPhone =
    digits.length >= 6 ? `${digits.slice(0, 3)}*****${digits.slice(-3)}` : "***";

  return {
    ...order,
    customer: {
      name: maskedName,
      phone: maskedPhone,
      city: order.customer?.city || "Dhaka",
      district: order.customer?.district,
      address: order.customer?.district
        ? `${order.customer.district} (${order.customer?.city === "Dhaka" ? "ঢাকা" : "ঢাকার বাইরে"})`
        : order.customer?.city === "Dhaka"
        ? "ঢাকা সিটি"
        : "ঢাকার বাইরে",
    },
  };
}

// Public & Authenticated Order Tracking API (supports Order ID or Phone)
app.get("/api/orders/track", async (req: any, res) => {
  try {
    const rawQuery = ((req.query.query || req.query.orderId || req.query.phone || "") as string).trim();
    const rawOrderIds = ((req.query.orderIds || "") as string).trim();
    const all = await getOrders();
    const user = req.user;
    let dbUser: any = null;
    if (user?.id) {
      dbUser = await findUserById(user.id);
    }

    const isAuthorizedForOrder = (o: any) => {
      if (user?.role === "admin") return true;
      if (!dbUser) return false;
      const emailMatch =
        dbUser.email &&
        o.customer?.email &&
        dbUser.email.toLowerCase() === o.customer.email.toLowerCase();
      return Boolean(emailMatch || phonesMatch(dbUser.phone, o.customer?.phone));
    };

    if (rawOrderIds) {
      const idSet = new Set(
        rawOrderIds
          .split(",")
          .map((s) => s.trim().replace(/^#/, "").toUpperCase())
          .filter(Boolean)
      );
      const matched = all
        .filter((o) => idSet.has((o._id || "").toUpperCase()))
        .map((o) => (isAuthorizedForOrder(o) ? o : maskOrderForPublicTracking(o)));
      return res.json(matched);
    }

    if (!rawQuery) {
      return res.status(400).json({
        error: "অর্ডার আইডি (যেমন: KG-10492) অথবা মোবাইল নম্বর লিখুন।",
      });
    }

    const cleanId = rawQuery.replace(/^#/, "").trim().toUpperCase();
    const normalizedPhone = normalizeBDPhone(rawQuery);
    const looksLikeOrderId =
      cleanId.startsWith("KG-") || /^[A-Z]+-\d+$/.test(cleanId);

    // Phone lookup when digits >= 10 and not explicitly KG-XXX format
    if (!looksLikeOrderId && normalizedPhone.length >= 10) {
      const matchedByPhone = all.filter((o) => phonesMatch(normalizedPhone, o.customer?.phone));
      return res.json(matchedByPhone);
    }

    // Order ID lookup (exact or KG-<digits>)
    const matchedById = all.filter((o) => {
      const oid = (o._id || "").toUpperCase();
      return oid === cleanId || (!cleanId.startsWith("KG-") && oid === `KG-${cleanId}`);
    });

    const result = matchedById.map((o) =>
      isAuthorizedForOrder(o) ? o : maskOrderForPublicTracking(o)
    );
    return res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Orders API (PII Protected)
app.get("/api/orders", async (req: any, res) => {
  try {
    const user = req.user;
    const phoneQuery = req.query.phone as string | undefined;

    // 1. If admin, return all orders
    if (user && user.role === "admin") {
      const orders = await getOrders();
      return res.json(orders);
    }

    // 2. If phone is provided, return only orders belonging to that phone
    if (phoneQuery) {
      const cleanPhone = normalizeBDPhone(phoneQuery);
      if (cleanPhone.length >= 10) {
        const all = await getOrders();
        const customerOrders = all.filter((o) =>
          phonesMatch(cleanPhone, o.customer?.phone)
        );
        return res.json(customerOrders);
      }
    }

    // 3. If authenticated user, return their orders
    if (user && user.id) {
      const dbUser = await findUserById(user.id);
      if (dbUser) {
        const all = await getOrders();
        const customerOrders = all.filter((o) => {
          const emailMatch =
            dbUser.email &&
            o.customer?.email &&
            dbUser.email.toLowerCase() === o.customer.email.toLowerCase();
          const phoneMatch = phonesMatch(dbUser.phone, o.customer?.phone);
          return phoneMatch || emailMatch;
        });
        return res.json(customerOrders);
      }
    }

    // 4. Anonymous scrape attempt without query: Return 401
    return res.status(401).json({
      error: "অর্ডার দেখতে অনুগ্রহ করে লগইন করুন অথবা আপনার ফোন নম্বর দিয়ে ট্র্যাক করুন।",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Order Creation is open to both Guests & Users (Rate Limited)
app.post("/api/orders", orderLimiter, async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Order Status & Courier Mutation (Admin Only)
app.patch("/api/orders/:id", requireAdmin, async (req, res) => {
  try {
    const { status, courierName, trackingNumber, courierAssignedAt } = req.body;
    const courierData =
      courierName !== undefined || trackingNumber !== undefined || courierAssignedAt !== undefined
        ? {
            courierName,
            trackingNumber,
            courierAssignedAt: courierAssignedAt || (courierName ? new Date().toISOString() : undefined),
          }
        : undefined;
    const order = await updateOrderStatus(req.params.id, status, courierData);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Order Deletion (Admin Only)
app.delete("/api/orders/:id", requireAdmin, async (req, res) => {
  try {
    await deleteOrder(req.params.id);
    res.json({ success: true, message: "Order deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Cloudinary Upload & Status API (Upload restricted to Admin)
app.get("/api/cloudinary/status", (req, res) => {
  try {
    const status = getCloudinaryStatus();
    res.json(status);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/upload", requireAdmin, async (req, res) => {
  try {
    const { image, folder } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image payload provided" });
    }

    const uploadResult = await uploadToCloudinary(image, folder || "products");
    res.json({
      url: uploadResult.url,
      public_id: uploadResult.public_id,
      source: uploadResult.source || "local",
    });
  } catch (err: any) {
    console.error("[Upload Route] Error:", err);
    res.status(500).json({
      error: err.message || "Failed to upload image",
    });
  }
});

app.delete("/api/upload/:public_id", requireAdmin, async (req, res) => {
  try {
    const success = await deleteFromCloudinary(req.params.public_id);
    res.json({ success });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Scrolling Notice & Testimonials API
app.get("/api/scrolling-notice", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    const notice = await getScrollingNotice();
    res.json(notice);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/scrolling-notice", requireAdmin, async (req, res) => {
  try {
    const updated = await updateScrollingNotice(req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/testimonials", async (req, res) => {
  try {
    res.setHeader("Cache-Control", "public, max-age=30, stale-while-revalidate=120");
    const list = await getTestimonials();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/testimonials", requireAdmin, async (req, res) => {
  try {
    const item = await createTestimonial(req.body);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    const updated = await updateTestimonial(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Testimonial not found" });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/testimonials/:id", requireAdmin, async (req, res) => {
  try {
    await deleteTestimonial(req.params.id);
    res.json({ success: true, message: "Testimonial deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Global error handling middleware for database resilience
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoNetworkError' ||
    err.name === 'MongoServerSelectionError' ||
    (err.message && (err.message.includes('buffering timed out') || err.message.includes('Server selection timed out')))
  ) {
    console.warn('[AI Studio] Database offline — returning mock response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
  }
  next(err);
});

// =====================================
// FRONTEND MIDDLEWARE (VITE OR STATIC)
// =====================================
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    // Cache static assets (CSS, JS, images) with 1-year maxAge; index.html no-cache
    app.use(
      express.static(distPath, {
        maxAge: "1y",
        immutable: true,
        setHeaders: (res, filePath) => {
          if (filePath.endsWith(".html")) {
            res.setHeader("Cache-Control", "no-cache, must-revalidate");
          }
        },
      })
    );
    app.get("*", (req, res) => {
      res.setHeader("Cache-Control", "no-cache, must-revalidate");
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Kasab Gallery Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
