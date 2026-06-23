import mongoose from 'mongoose';

const watchSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  modelNumber: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ["Luxury", "Sport", "Classic", "Dress", "Dive", "Chronograph", "Smart", "Limited Edition", "Divers", "Luxury Sport", "Heritage", "Skeleton"]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    min: 0,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  features: {
    type: String, // Stored as a raw string (e.g. newline separated features)
    trim: true
  },
  specifications: {
    type: String, // Stored as a raw string
    trim: true
  },
  movementType: {
    type: String,
    enum: ["Automatic", "Quartz", "Mechanical", "Solar", "Kinetic", "Manual Caliber M1", "Automatic Caliber M2", "Manual Caliber M3 Ultra-Thin", "Skeleton Manual M4"],
    default: "Automatic"
  },
  caseMaterial: {
    type: String,
    enum: ["Stainless Steel", "Titanium", "Gold", "Rose Gold", "Ceramic", "Carbon Fiber", "Platinum", "Brushed 18k Gold", "Titanium Grade 5", "Platinum 950", "18k Rose Gold"],
    default: "Stainless Steel"
  },
  strapMaterial: {
    type: String,
    enum: ["Leather", "Stainless Steel", "Rubber", "NATO", "Mesh", "Ceramic", "Titanium"],
    default: "Leather"
  },
  waterResistance: {
    type: String,
    trim: true
  },
  warranty: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  newArrival: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    required: true,
    enum: ["Active", "Hidden"],
    default: "Active"
  },
  images: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')          // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-');        // Replace multiple - with single -
};

// Generate slug on save/validation
watchSchema.pre('validate', async function(next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    let baseSlug = slugify(this.name);
    let uniqueSlug = baseSlug;
    let counter = 1;
    try {
      while (true) {
        const existing = await mongoose.models.Watch.findOne({ slug: uniqueSlug, _id: { $ne: this._id } });
        if (!existing) {
          break;
        }
        uniqueSlug = `${baseSlug}-${counter++}`;
      }
      this.slug = uniqueSlug;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

const Watch = mongoose.model('Watch', watchSchema);
export default Watch;
