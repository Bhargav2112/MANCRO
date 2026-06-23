const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:5000';

const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(errorData.message || 'API request failed');
    error.status = response.status;
    throw error;
  }

  return response.json();
};

function mapToCustomerWatch(w) {
  const images = w.images || [];
  const featuresList = w.features ? w.features.split('\n').map(f => f.trim()).filter(Boolean) : [];

  let stockStatus = 'In Stock';
  if (w.stock === 0) {
    stockStatus = 'Sold Out';
  } else if (w.stock <= 5) {
    stockStatus = 'Limited';
  }

  return {
    id: w._id,
    name: w.name,
    slug: w.slug,
    caliber_id: w.modelNumber ? w.modelNumber.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') : w._id,
    category: w.category,
    price: w.price,
    discount_price: w.discountPrice || 0,
    currency: 'INR',
    description: w.description || '',
    image_urls: images,
    movement: w.movementType || 'Automatic',
    case_size: '40mm',
    case_material: w.caseMaterial || 'Stainless Steel',
    water_resistance: w.waterResistance || '50m',
    power_reserve: '48 hours',
    features: featuresList,
    stock_status: stockStatus,
    stock_quantity: w.stock || 0,
    is_featured: w.featured || false,
    is_new_arrival: w.newArrival || false,
    is_best_seller: w.bestSeller || false,
    created_date: w.createdAt,
  };
}

export const base44 = {
  entities: {
    Watch: {
      async list() {
        const dbWatches = await apiCall('/api/watches', {
          method: 'GET'
        });
        return dbWatches.map(mapToCustomerWatch);
      },
      async filter({ caliber_id, slug } = {}) {
        const params = new URLSearchParams();
        if (caliber_id) params.append('caliber_id', caliber_id);
        if (slug) params.append('slug', slug);
        
        const dbWatches = await apiCall(`/api/watches?${params.toString()}`, {
          method: 'GET'
        });
        return dbWatches.map(mapToCustomerWatch);
      },
      async getBySlug(slug) {
        const w = await apiCall(`/api/watch/${slug}`, {
          method: 'GET'
        });
        return mapToCustomerWatch(w);
      }
    },
    Inquiry: {
      async create(data) {
        return await apiCall('/api/inquiries', {
          method: 'POST',
          body: JSON.stringify(data)
        });
      }
    },
    StoreSettings: {
      async list() {
        const settings = await apiCall('/api/store-settings', {
          method: 'GET'
        });
        return [settings];
      }
    },
    Post: {
      async list() {
        return await apiCall('/api/posts', {
          method: 'GET'
        });
      },
      async getBySlug(slug) {
        return await apiCall(`/api/posts/${slug}`, {
          method: 'GET'
        });
      }
    },
    Slide: {
      async list() {
        return await apiCall('/api/slides', {
          method: 'GET'
        });
      }
    }
  },
  auth: {
    async isAuthenticated() {
      return false; // Remove customer auth requirement
    },
    async me() {
      return null;
    },
    async logout() {},
    async loginViaEmailPassword() {
      throw new Error("Customer login is disabled.");
    },
    async register() {
      throw new Error("Customer registration is disabled.");
    }
  }
};
