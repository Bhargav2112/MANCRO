import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import User from './models/User.js';
import Watch from './models/Watch.js';
import Inquiry from './models/Inquiry.js';
import StoreSettings from './models/StoreSettings.js';
import Post from './models/Post.js';
import Slide from './models/Slide.js';
import { requireAdmin } from './middleware/auth.js';
import { uploadStream } from './config/cloudinary.js';

dotenv.config();

// --- 1. ENVIRONMENT VARIABLE STARTUP VALIDATION ---
const requiredEnv = [
  'MONGODB_URI',
  'JWT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD'
];

const missingEnv = requiredEnv.filter(env => !process.env[env]);
if (missingEnv.length > 0) {
  console.error(`[STARTUP FATAL] Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}
console.log('[STARTUP SUCCESS] Environment variables validated successfully.');

const app = express();
const PORT = process.env.PORT || 5000;

// Strict CORS setup
const allowedOrigins = [
  'https://mancro-admin.vercel.app',
  'https://mancro-watch.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL
].filter(Boolean);

console.log('[CORS] Configured Allowed Origins:', allowedOrigins);

// Middleware to log all incoming origins for debugging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    console.log(`[CORS] Incoming request from origin: ${origin} | Method: ${req.method} | Path: ${req.path}`);
  }
  next();
});

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      console.log(`[CORS] Allowed origin: ${origin}`);
      return callback(null, true);
    } else {
      console.warn(`[CORS] Blocked origin: ${origin}`);
      // Returning false prevents the error handler from firing a 500,
      // instead it just omits the CORS headers, resulting in a clean browser CORS error
      return callback(new Error('CORS Policy: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
};

app.use(cors(corsOptions));
// Handle preflight requests for all routes using the exact same CORS options
app.options('*', cors(corsOptions));
// --- 2. SECURITY HARDENING & RATE LIMITING ---
app.set('trust proxy', 1); // Enable trust proxy support for Render load balancers
app.use(helmet({ contentSecurityPolicy: false })); // helmet for secure HTTP headers (CSP disabled for API server)

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
app.use('/api/', limiter); // rate limiter on all API routes

app.use(express.json());

// Database connection
connectDB().then(async () => {
  await seedAdmin();
  await seedWatches();
  await seedStoreSettings();
  await seedSlides();
});

// Root path API status
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'MANCRO Shared Backend API' });
});

// --- 3. MULTER IMAGE VERIFICATION & CONSTRAINTS ---
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type. Only JPG, JPEG, PNG, WEBP, and GIF are allowed.');
      error.status = 400;
      return cb(error, false);
    }
    cb(null, true);
  }
});


// --- AUTH ENDPOINTS ---

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.email.split('@')[0],
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/auth/me', requireAdmin, (req, res) => {
  res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.email.split('@')[0],
    role: req.user.role
  });
});


// --- ADMIN API ENDPOINTS (PROTECTED) ---

app.get('/admin/watches', requireAdmin, async (req, res, next) => {
  try {
    const watches = await Watch.find().sort({ createdAt: -1 });
    res.json(watches);
  } catch (error) {
    next(error);
  }
});

app.get('/admin/watches/:id', requireAdmin, async (req, res, next) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    res.json(watch);
  } catch (error) {
    next(error);
  }
});

app.post('/admin/watches', requireAdmin, async (req, res, next) => {
  try {
    // Basic Request Validation
    const { name, category, price, sku, status } = req.body;
    if (!name || !category || price === undefined || !sku || !status) {
      return res.status(400).json({ message: 'Validation failed. Required fields: name, category, price, sku, status' });
    }

    const watch = new Watch(req.body);
    const saved = await watch.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

app.put('/admin/watches/:id', requireAdmin, async (req, res, next) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    
    // Explicitly update all fields
    Object.assign(watch, req.body);
    const updated = await watch.save();
    res.json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

app.delete('/admin/watches/:id', requireAdmin, async (req, res, next) => {
  try {
    const watch = await Watch.findById(req.params.id);
    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    await watch.deleteOne();
    res.json({ success: true, message: 'Watch deleted' });
  } catch (error) {
    next(error);
  }
});

app.post('/admin/upload', requireAdmin, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const result = await uploadStream(req.file.buffer);
    if (!result || !result.secure_url) {
      return res.status(500).json({ message: 'Failed to upload image to Cloudinary' });
    }
    res.json({ file_url: result.secure_url });
  } catch (error) {
    next(error);
  }
});

app.get('/admin/inquiries', requireAdmin, async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = {};
    if (status && status !== 'All') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
        { customerPhone: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }
    const inquiries = await Inquiry.find(query).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    next(error);
  }
});

app.put('/admin/inquiries/:id', requireAdmin, async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    if (req.body.status) {
      inquiry.status = req.body.status;
    }
    const updated = await inquiry.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete('/admin/inquiries/:id', requireAdmin, async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: 'Inquiry not found' });
    }
    await inquiry.deleteOne();
    res.json({ success: true, message: 'Inquiry deleted' });
  } catch (error) {
    next(error);
  }
});

app.get('/admin/store-settings', requireAdmin, async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({ store_name: 'MANCRO' });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

app.put('/admin/store-settings', requireAdmin, async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = new StoreSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    const saved = await settings.save();
    res.json(saved);
  } catch (error) {
    next(error);
  }
});

// --- ADMIN POSTS CRUD ---
app.get('/admin/posts', requireAdmin, async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

app.post('/admin/posts', requireAdmin, async (req, res, next) => {
  try {
    const { title, slug, content } = req.body;
    if (!title || !slug || !content) {
      return res.status(400).json({ message: 'Title, slug, and content are required' });
    }
    const post = new Post(req.body);
    const saved = await post.save();
    res.status(201).json(saved);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug already exists. Please use a unique title.' });
    }
    next(error);
  }
});

app.put('/admin/posts/:id', requireAdmin, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    Object.assign(post, req.body);
    const updated = await post.save();
    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slug already exists. Please use a unique title.' });
    }
    next(error);
  }
});

app.delete('/admin/posts/:id', requireAdmin, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// --- ADMIN SLIDES CRUD ---
app.get('/admin/slides', requireAdmin, async (req, res, next) => {
  try {
    const slides = await Slide.find().sort({ order: 1, createdAt: 1 });
    res.json(slides);
  } catch (error) {
    next(error);
  }
});

app.post('/admin/slides', requireAdmin, async (req, res, next) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Title and imageUrl are required' });
    }
    const slide = new Slide(req.body);
    const saved = await slide.save();
    res.status(201).json(saved);
  } catch (error) {
    next(error);
  }
});

app.put('/admin/slides/:id', requireAdmin, async (req, res, next) => {
  try {
    const slide = await Slide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    Object.assign(slide, req.body);
    const updated = await slide.save();
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete('/admin/slides/:id', requireAdmin, async (req, res, next) => {
  try {
    const slide = await Slide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    await slide.deleteOne();
    res.json({ success: true, message: 'Slide deleted successfully' });
  } catch (error) {
    next(error);
  }
});


// --- PUBLIC API ENDPOINTS ---

app.get('/api/watches', async (req, res, next) => {
  try {
    const { category, search, caliber_id, slug } = req.query;
    const query = { status: 'Active' };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (slug) {
      query.slug = slug;
    }

    const watches = await Watch.find(query).sort({ createdAt: -1 });

    if (caliber_id) {
      const filtered = watches.filter(w => {
        const slugifiedModel = w.modelNumber ? w.modelNumber.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') : w._id.toString();
        return slugifiedModel === caliber_id;
      });
      return res.json(filtered);
    }

    res.json(watches);
  } catch (error) {
    next(error);
  }
});

app.get('/api/watches/featured', async (req, res, next) => {
  try {
    const watches = await Watch.find({ status: 'Active', featured: true }).sort({ createdAt: -1 });
    res.json(watches);
  } catch (error) {
    next(error);
  }
});

app.get('/api/watches/new-arrivals', async (req, res, next) => {
  try {
    const watches = await Watch.find({ status: 'Active', newArrival: true }).sort({ createdAt: -1 });
    res.json(watches);
  } catch (error) {
    next(error);
  }
});

app.get('/api/watches/best-sellers', async (req, res, next) => {
  try {
    const watches = await Watch.find({ status: 'Active', bestSeller: true }).sort({ createdAt: -1 });
    res.json(watches);
  } catch (error) {
    next(error);
  }
});

app.get('/api/watch/:slug', async (req, res, next) => {
  try {
    const watch = await Watch.findOne({ slug: req.params.slug, status: 'Active' });
    if (!watch) {
      return res.status(404).json({ message: 'Watch not found' });
    }
    res.json(watch);
  } catch (error) {
    next(error);
  }
});

app.get('/api/store-settings', async (req, res, next) => {
  try {
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({ store_name: 'MANCRO' });
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

app.post('/api/inquiries', async (req, res, next) => {
  try {
    const { customerName, customerEmail, customerPhone, message, watchId, watchName } = req.body;
    if (!customerName || !customerEmail || !customerPhone || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const inquiry = await Inquiry.create({
      customerName,
      customerEmail,
      customerPhone,
      message,
      watchId: watchId || undefined,
      watchName: watchName || undefined,
      status: 'Pending'
    });
    res.status(201).json(inquiry);
  } catch (error) {
    next(error);
  }
});

// --- PUBLIC POSTS API ---
app.get('/api/posts', async (req, res, next) => {
  try {
    const posts = await Post.find({ status: 'Published' }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

app.get('/api/posts/:slug', async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug, status: 'Published' });
    if (!post) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// --- PUBLIC SLIDES API ---
app.get('/api/slides', async (req, res, next) => {
  try {
    const slides = await Slide.find().sort({ order: 1, createdAt: 1 });
    res.json(slides);
  } catch (error) {
    next(error);
  }
});


// --- 4. CENTRALIZED ERROR HANDLING MIDDLEWARE ---
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.message);
  
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(status).json({
    message,
    status
  });
});


// --- 5. SEEDING FUNCTIONS (NO HARDCODED SECRETS) ---

async function seedAdmin() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;
      
      await User.create({ email, password, role: 'admin' });
      console.log(`[SEED] Admin account created successfully for: ${email}`);
    } else {
      console.log('[SEED] Admin account already exists. Seeding skipped.');
    }
  } catch (error) {
    console.error('[SEED ERROR] Failed to seed admin user:', error);
  }
}

async function seedWatches() {
  try {
    const defaultWatches = [
      {
        name: "Mancro Caliber I",
        modelNumber: "MANCRO-I",
        category: "Heritage",
        price: 12500,
        discountPrice: 0,
        stock: 5,
        sku: "MNCR-001",
        description: "A tribute to classical mechanical simplicity. Featuring a hand-wound movement with a minimalist black sandblasted dial and elegant gold hands.",
        features: "Hand-finished beveling\nSapphire crystal back\nAlligator strap",
        specifications: "Case size: 39mm\nPower Reserve: 48 hours\nWater Resistance: 50m",
        movementType: "Manual Caliber M1",
        caseMaterial: "Brushed 18k Gold",
        strapMaterial: "Leather",
        waterResistance: "50m",
        warranty: "2 Years",
        featured: true,
        bestSeller: true,
        newArrival: false,
        status: "Active",
        images: ["https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Mancro Caliber II",
        modelNumber: "MANCRO-II",
        category: "Sport",
        price: 9800,
        discountPrice: 0,
        stock: 8,
        sku: "MNCR-002",
        description: "An elegant sports chronometer designed to withstand the elements without losing horizontal clarity. Titanium brushed bezel with high-visibility markers.",
        features: "Screw-down crown\nSuper-LumiNova markers\nIntegrated rubber strap",
        specifications: "Case size: 41mm\nPower Reserve: 60 hours\nWater Resistance: 100m",
        movementType: "Automatic Caliber M2",
        caseMaterial: "Titanium Grade 5",
        strapMaterial: "Rubber",
        waterResistance: "100m",
        warranty: "2 Years",
        featured: true,
        bestSeller: false,
        newArrival: true,
        status: "Active",
        images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Mancro Caliber III",
        modelNumber: "MANCRO-III",
        category: "Dress",
        price: 15400,
        discountPrice: 0,
        stock: 2,
        sku: "MNCR-003",
        description: "Ultra-thin luxury dress watch. Obsidional black dial with indices carved directly into the solid gold dial plate. The peak of mechanical restraint.",
        features: "Solid gold dial plate\nMicro-rotor movement\nHand-stitched leather strap",
        specifications: "Case size: 38mm\nPower Reserve: 40 hours\nWater Resistance: 30m",
        movementType: "Manual Caliber M3 Ultra-Thin",
        caseMaterial: "Platinum 950",
        strapMaterial: "Leather",
        waterResistance: "30m",
        warranty: "2 Years",
        featured: true,
        bestSeller: true,
        newArrival: false,
        status: "Active",
        images: ["https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Mancro Caliber IV (Skeleton)",
        modelNumber: "MANCRO-IV",
        category: "Skeleton",
        price: 24500,
        discountPrice: 0,
        stock: 0,
        sku: "MNCR-004",
        description: "A mechanical openwork marvel. Watch movement elements are architectural, suspended inside the case to maximize light and transparency.",
        features: "Fully skeletonized mainplate\nTourbillon regulator\nCustom engraved bridge",
        specifications: "Case size: 42mm\nPower Reserve: 72 hours\nWater Resistance: 50m",
        movementType: "Skeleton Manual M4",
        caseMaterial: "18k Rose Gold",
        strapMaterial: "Leather",
        waterResistance: "50m",
        warranty: "2 Years",
        featured: false,
        bestSeller: false,
        newArrival: true,
        status: "Active",
        images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600"]
      },
      {
        name: "Mancro Sport-Elite",
        modelNumber: "DUMMY-I",
        category: "Sport",
        price: 8500,
        discountPrice: 0,
        stock: 12,
        sku: "DUMMY-001",
        description: "A high-performance luxury sports timepiece engineered for everyday reliability and timeless style.",
        features: "Super-LumiNova indexes\nScratchproof sapphire\nWaterproof crown",
        specifications: "Case size: 42mm\nPower Reserve: 48 hours\nWater Resistance: 100m",
        movementType: "Automatic Caliber M2",
        caseMaterial: "Stainless Steel",
        strapMaterial: "Rubber",
        waterResistance: "100m",
        warranty: "2 Years",
        featured: true,
        bestSeller: true,
        newArrival: true,
        status: "Active",
        images: ["/shopping.webp"]
      },
      {
        name: "Mancro Black-Gold Chrono",
        modelNumber: "DUMMY-II",
        category: "Chronograph",
        price: 11200,
        discountPrice: 1000,
        stock: 6,
        sku: "DUMMY-002",
        description: "Precision chronograph featuring a triple sub-dial layout and elegant gold-toned accents over a black sandblasted case.",
        features: "Chronograph functions\n18k Gold plating\nExhibition caseback",
        specifications: "Case size: 41mm\nPower Reserve: 50 hours\nWater Resistance: 50m",
        movementType: "Automatic",
        caseMaterial: "Gold",
        strapMaterial: "Leather",
        waterResistance: "50m",
        warranty: "2 Years",
        featured: true,
        bestSeller: false,
        newArrival: true,
        status: "Active",
        images: ["/shopping (1).webp"]
      },
      {
        name: "Mancro Skeleton-Steel",
        modelNumber: "DUMMY-III",
        category: "Skeleton",
        price: 19500,
        discountPrice: 0,
        stock: 3,
        sku: "DUMMY-003",
        description: "Showcasing the inner architectural beauty of mechanical watchmaking with a completely openwork dial and hand-polished bridges.",
        features: "Fully skeletonized dial\nMaster engraving\nMicro-rotor movement",
        specifications: "Case size: 40mm\nPower Reserve: 72 hours\nWater Resistance: 30m",
        movementType: "Skeleton Manual M4",
        caseMaterial: "Stainless Steel",
        strapMaterial: "Leather",
        waterResistance: "30m",
        warranty: "2 Years",
        featured: false,
        bestSeller: true,
        newArrival: true,
        status: "Active",
        images: ["/shopping (2).webp"]
      },
      {
        name: "Mancro Heritage Rose",
        modelNumber: "DUMMY-IV",
        category: "Heritage",
        price: 14300,
        discountPrice: 0,
        stock: 8,
        sku: "DUMMY-004",
        description: "A tribute to classical proportions. Brushed rose gold casing, warm indexes, and a hand-stitched alligator strap.",
        features: "Hand-finished rose gold\nClassic dome crystal\nFoliate hands",
        specifications: "Case size: 39mm\nPower Reserve: 40 hours\nWater Resistance: 50m",
        movementType: "Manual Caliber M1",
        caseMaterial: "Rose Gold",
        strapMaterial: "Leather",
        waterResistance: "50m",
        warranty: "2 Years",
        featured: true,
        bestSeller: true,
        newArrival: false,
        status: "Active",
        images: ["/shopping (3).webp"]
      },
      {
        name: "Mancro Classic Executive",
        modelNumber: "DUMMY-V",
        category: "Classic",
        price: 9500,
        discountPrice: 0,
        stock: 15,
        sku: "DUMMY-005",
        description: "The quintessential dress watch. Clean aesthetics, slim case profile, and highly polished bezel details.",
        features: "Ultra-thin design\nPolished indices\nDeployant clasp",
        specifications: "Case size: 38mm\nPower Reserve: 42 hours\nWater Resistance: 30m",
        movementType: "Manual Caliber M3 Ultra-Thin",
        caseMaterial: "Stainless Steel",
        strapMaterial: "Leather",
        waterResistance: "30m",
        warranty: "2 Years",
        featured: false,
        bestSeller: false,
        newArrival: true,
        status: "Active",
        images: ["/shopping (4).webp"]
      },
      {
        name: "Mancro Diver Pro",
        modelNumber: "DUMMY-VI",
        category: "Sport",
        price: 12800,
        discountPrice: 1500,
        stock: 10,
        sku: "DUMMY-006",
        description: "Professional grade divers watch with a unidirectional rotating ceramic bezel and helium escape valve.",
        features: "Unidirectional bezel\nHelium escape valve\nLuminescent hands",
        specifications: "Case size: 43mm\nPower Reserve: 60 hours\nWater Resistance: 300m",
        movementType: "Automatic Caliber M2",
        caseMaterial: "Titanium Grade 5",
        strapMaterial: "Rubber",
        waterResistance: "300m",
        warranty: "2 Years",
        featured: true,
        bestSeller: true,
        newArrival: true,
        status: "Active",
        images: ["/shopping (5).webp"]
      },
      {
        name: "Mancro Obsidian Minimalist",
        modelNumber: "DUMMY-VII",
        category: "Dress",
        price: 16500,
        discountPrice: 0,
        stock: 4,
        sku: "DUMMY-007",
        description: "Stunning minimalist dial carved from deep obsidian stone, paired with a modern brushed black steel finish.",
        features: "Obsidian dial plate\nScratchproof sapphire\nHidden clasp",
        specifications: "Case size: 40mm\nPower Reserve: 48 hours\nWater Resistance: 50m",
        movementType: "Manual Caliber M3 Ultra-Thin",
        caseMaterial: "Titanium",
        strapMaterial: "Leather",
        waterResistance: "50m",
        warranty: "2 Years",
        featured: true,
        bestSeller: false,
        newArrival: true,
        status: "Active",
        images: ["/download.webp"]
      }
    ];

    for (const w of defaultWatches) {
      const exists = await Watch.findOne({ sku: w.sku });
      if (!exists) {
        await Watch.create(w);
        console.log(`[SEED] Seeded watch: ${w.name}`);
      }
    }
    console.log('[SEED] Watches checked and updated.');
  } catch (error) {
    console.error('[SEED ERROR] Failed to seed watches:', error);
  }
}

async function seedStoreSettings() {
  try {
    const existing = await StoreSettings.findOne();
    const defaults = {
      store_name: "MANCRO",
      topbar_text: "Get a Flat 10% Off on All Watches - Limited Time Only",
      store_email: "atelier@mancro.com",
      store_phone: "+1 (800) 555-0190",
      whatsapp_number: "+18005550190",
      store_address: "Rue du Rhône 42, 1204 Geneva",
      about_text: "MANCRO was created for clients who understand that luxury is not volume—it is restraint, proportion, silence, and precision. Every reference is designed to feel inevitable on the wrist.",
      logo_url: "https://media.base44.com/images/public/user_6943e9bbf2f0c149cfad4c09/0cf447929_MANCROlogo.jpg",
      about_title: "Creating watches that blend innovation",
      about_description: "We are committed to creating watches that seamlessly blend modern innovation with timeless craftsmanship. By combining advanced technology, premium materials, and thoughtful design, each timepiece is built to deliver precision, durability, and a refined aesthetic.",
      counter1_val: "150+",
      counter1_title: "Limited Edition Releases",
      counter1_desc: "Our limited edition releases are crafted in small quantities to ensure uniqueness.",
      counter2_val: "500+",
      counter2_title: "Premium Watch Designs",
      counter2_desc: "Our premium watch designs are crafted to deliver a perfect balance of elegance.",
      counter3_val: "4.9/5",
      counter3_title: "Average Customer Score",
      counter3_desc: "Our high average customer rating reflects the trust and satisfaction of our clients.",
      for_him_title: "For Him",
      for_him_desc: "Discover Our New Watch Collection and Elevate Your Everyday Look.",
      for_him_link: "/collection?category=Sport",
      for_her_title: "For Her",
      for_her_desc: "Discover Our New Watch Collection and Elevate Your Everyday Look.",
      for_her_link: "/collection?category=Dress",
      col1_title: "Sports Watches",
      col1_tag: "Sport",
      col1_image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&q=80&w=600",
      col1_desc: "Discover Our New Watch Collection and Elevate Your Everyday Look.",
      col2_title: "Luxury Watches",
      col2_tag: "Heritage",
      col2_image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600",
      col2_desc: "Discover Our New Watch Collection and Elevate Your Everyday Look.",
      col3_title: "Chronograph Watches",
      col3_tag: "Skeleton",
      col3_image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600",
      col3_desc: "Discover Our New Watch Collection and Elevate Your Everyday Look.",
      intro_video_url: "https://demo.awaikenthemes.com/assets/videos/lemora-intro-video.mp4",
      intro_video_title: "witness the sanctuary of mechanical devotion",
      intro_video_subtitle: "A Legacy of Precision",
      why_choose_image: "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=800",
      why_choose_title: "Designed for quality built for everyday confidence",
      why_acc1_title: "High-Quality Materials",
      why_acc1_text: "We use premium materials like scratchproof sapphire crystals, surgical-grade stainless steel, and hand-stitched alligator leather straps.",
      why_acc2_title: "Precision Chronometers",
      why_acc2_text: "Our timepieces are powered by highly precise automatic and hand-wound movements adjusted for ultimate accuracy.",
      why_acc3_title: "2-Year International Warranty",
      why_acc3_text: "Every reference acquired from the vault is covered under a 2-year warranty and backed by our master watchmaking services.",
      why_acc4_title: "Bespoke Atelier Consultation",
      why_acc4_text: "Direct access to horology specialists to assist you with bespoke commissions and secure delivery logistics.",
      social_video1_url: "https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-1.mp4",
      social_video2_url: "https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-2.mp4",
      social_video3_url: "https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-3.mp4",
      social_video4_url: "https://demo.awaikenthemes.com/assets/videos/lemora-latest-update-video-4.mp4",
      testimonial1_author: "Darlene Robertson",
      testimonial1_review: "“Absolutely premium watches! The level of hand-finishing, custom obsidional dials, and weight on the wrist exceeded all my expectations. Exceptional service!”",
      testimonial2_author: "Dianne Russell",
      testimonial2_review: "“I love how elegant and minimalist the collection is. Standard micro-rotor calibers are thin, clean, and fit under a cuff perfectly. Customer support was incredibly responsive.”"
    };

    if (!existing) {
      await StoreSettings.create(defaults);
      console.log('[SEED] Store settings seeded.');
    } else {
      // Check if new fields are missing (e.g. about_title) and perform migration/update
      let needsUpdate = false;
      for (const key of Object.keys(defaults)) {
        if (existing[key] === undefined || existing[key] === null || existing[key] === '') {
          existing[key] = defaults[key];
          needsUpdate = true;
        }
      }
      if (needsUpdate) {
        await existing.save();
        console.log('[SEED] Store settings migrated with new default fields.');
      } else {
        console.log('[SEED] Store settings already fully configured.');
      }
    }
  } catch (error) {
    console.error('[SEED ERROR] Failed to seed store settings:', error);
  }
}

async function seedSlides() {
  try {
    const defaultSlides = [
      {
        title: "Mancro Precision Horology",
        subtitle: "The New Heritage Collection",
        imageUrl: "/media__1781777494551.jpg",
        linkUrl: "/collection",
        order: 1
      },
      {
        title: "Craftsmanship of Geneva",
        subtitle: "Mastery of Mechanical Restraint",
        imageUrl: "/media__1781777494620.jpg",
        linkUrl: "/collection",
        order: 2
      },
      {
        title: "Modern Restraint & Silence",
        subtitle: "Atelier Design and Proportions",
        imageUrl: "/media__1781777494528.jpg",
        linkUrl: "/collection",
        order: 3
      }
    ];

    for (const slide of defaultSlides) {
      const exists = await Slide.findOne({ imageUrl: slide.imageUrl });
      if (!exists) {
        await Slide.create(slide);
        console.log(`[SEED] Seeded slide banner: ${slide.title}`);
      }
    }
    console.log('[SEED] Slides checked and updated.');
  } catch (error) {
    console.error('[SEED ERROR] Failed to seed slides:', error);
  }
}

// --- 6. GRACEFUL SHUTDOWN HANDLERS ---
const server = app.listen(PORT, () => {
  console.log(`[SERVER] Running on port ${PORT}`);
});

const gracefulShutdown = () => {
  console.log('[SERVER] SIGTERM/SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('[SERVER] Active HTTP connections closed.');
    mongoose.connection.close(false).then(() => {
      console.log('[DATABASE] Connection closed.');
      process.exit(0);
    });
  });

  // Force exit if shutdown hangs
  setTimeout(() => {
    console.error('[SERVER ERROR] Graceful shutdown timed out, forcing exit.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
export default app;
