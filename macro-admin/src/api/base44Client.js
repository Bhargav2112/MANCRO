const API_URL = import.meta.env.VITE_ADMIN_API_URL || 'http://localhost:5000';

const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('base44_access_token');
  const headers = {
    ...options.headers,
  };
  
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

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

export const base44 = {
  setToken(token) {
    if (token) {
      localStorage.setItem('base44_access_token', token);
    } else {
      localStorage.removeItem('base44_access_token');
    }
  },
  auth: {
    setToken(token) {
      base44.setToken(token);
    },
    async loginViaEmailPassword(email, password) {
      const data = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (data.access_token) {
        base44.setToken(data.access_token);
        localStorage.setItem('base44_auth_user', JSON.stringify(data.user));
      }
      return data;
    },
    async loginWithProvider(provider, fromUrl) {
      // Direct redirect to base or auth page
      window.location.href = fromUrl || '/';
    },
    async register(data) {
      // Single admin configuration, so public registration is disabled
      throw new Error("Registration is disabled. Admin accounts must be configured in environment variables.");
    },
    async resetPasswordRequest(email) {
      return { success: true };
    },
    async resetPassword(data) {
      return { success: true };
    },
    async me() {
      const data = await apiCall('/api/auth/me', {
        method: 'GET'
      });
      return data;
    },
    async logout(redirectUrl) {
      localStorage.removeItem('base44_access_token');
      localStorage.removeItem('base44_auth_user');
      window.location.href = redirectUrl || '/login';
    },
    async redirectToLogin(redirectUrl) {
      window.location.href = '/login';
    },
    async isAuthenticated() {
      return !!localStorage.getItem('base44_access_token');
    }
  },
  entities: {
    Watch: {
      async list(orderBy) {
        const dbWatches = await apiCall('/admin/watches', {
          method: 'GET'
        });
        return dbWatches.map(w => ({
          id: w._id,
          name: w.name,
          model_number: w.modelNumber || '',
          brand: 'MANCRO',
          category: w.category,
          price: w.price,
          discount_price: w.discountPrice || 0,
          stock_quantity: w.stock || 0,
          sku: w.sku,
          description: w.description || '',
          features: w.features || '',
          specifications: w.specifications || '',
          movement_type: w.movementType || 'Automatic',
          case_material: w.caseMaterial || 'Stainless Steel',
          strap_material: w.strapMaterial || 'Leather',
          water_resistance: w.waterResistance || '',
          warranty: w.warranty || '',
          is_featured: w.featured || false,
          is_new_arrival: w.newArrival || false,
          is_best_seller: w.bestSeller || false,
          status: w.status || 'Active',
          images: w.images || [],
          created_date: w.createdAt,
          updated_date: w.updatedAt
        }));
      },
      async create(data) {
        const body = {
          name: data.name,
          modelNumber: data.model_number,
          category: data.category,
          price: Number(data.price) || 0,
          discountPrice: Number(data.discount_price) || 0,
          stock: Number(data.stock_quantity) || 0,
          sku: data.sku,
          description: data.description,
          features: data.features,
          specifications: data.specifications,
          movementType: data.movement_type,
          caseMaterial: data.case_material,
          strapMaterial: data.strap_material,
          waterResistance: data.water_resistance,
          warranty: data.warranty,
          featured: data.is_featured,
          newArrival: data.is_new_arrival,
          bestSeller: data.is_best_seller,
          status: data.status,
          images: data.images || []
        };
        const saved = await apiCall('/admin/watches', {
          method: 'POST',
          body: JSON.stringify(body)
        });
        return {
          ...saved,
          id: saved._id,
          model_number: saved.modelNumber,
          stock_quantity: saved.stock,
          is_featured: saved.featured,
          is_new_arrival: saved.newArrival,
          is_best_seller: saved.bestSeller
        };
      },
      async update(id, data) {
        const body = {
          name: data.name,
          modelNumber: data.model_number,
          category: data.category,
          price: Number(data.price) || 0,
          discountPrice: Number(data.discount_price) || 0,
          stock: Number(data.stock_quantity) || 0,
          sku: data.sku,
          description: data.description,
          features: data.features,
          specifications: data.specifications,
          movementType: data.movement_type,
          caseMaterial: data.case_material,
          strapMaterial: data.strap_material,
          waterResistance: data.water_resistance,
          warranty: data.warranty,
          featured: data.is_featured,
          newArrival: data.is_new_arrival,
          bestSeller: data.is_best_seller,
          status: data.status,
          images: data.images || []
        };
        const saved = await apiCall(`/admin/watches/${id}`, {
          method: 'PUT',
          body: JSON.stringify(body)
        });
        return {
          ...saved,
          id: saved._id,
          model_number: saved.modelNumber,
          stock_quantity: saved.stock,
          is_featured: saved.featured,
          is_new_arrival: saved.newArrival,
          is_best_seller: saved.bestSeller
        };
      },
      async delete(id) {
        return await apiCall(`/admin/watches/${id}`, {
          method: 'DELETE'
        });
      }
    },
    StoreSettings: {
      async list() {
        const settings = await apiCall('/admin/store-settings', {
          method: 'GET'
        });
        return [settings];
      },
      async create(data) {
        return await apiCall('/admin/store-settings', {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      },
      async update(id, data) {
        return await apiCall('/admin/store-settings', {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      }
    },
    Post: {
      async list() {
        const posts = await apiCall('/admin/posts', {
          method: 'GET'
        });
        return posts.map(p => ({
          id: p._id,
          title: p.title,
          slug: p.slug,
          content: p.content,
          image: p.image || '',
          status: p.status || 'Published',
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }));
      },
      async create(data) {
        const saved = await apiCall('/admin/posts', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        return {
          ...saved,
          id: saved._id
        };
      },
      async update(id, data) {
        const saved = await apiCall(`/admin/posts/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
        return {
          ...saved,
          id: saved._id
        };
      },
      async delete(id) {
        return await apiCall(`/admin/posts/${id}`, {
          method: 'DELETE'
        });
      }
    },
    Slide: {
      async list() {
        const slides = await apiCall('/admin/slides', {
          method: 'GET'
        });
        return slides.map(s => ({
          id: s._id,
          title: s.title,
          subtitle: s.subtitle || '',
          imageUrl: s.imageUrl,
          linkUrl: s.linkUrl || '',
          order: s.order || 0,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt
        }));
      },
      async create(data) {
        const saved = await apiCall('/admin/slides', {
          method: 'POST',
          body: JSON.stringify(data)
        });
        return {
          ...saved,
          id: saved._id
        };
      },
      async update(id, data) {
        const saved = await apiCall(`/admin/slides/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
        return {
          ...saved,
          id: saved._id
        };
      },
      async delete(id) {
        return await apiCall(`/admin/slides/${id}`, {
          method: 'DELETE'
        });
      }
    },
    Inquiry: {
      async list(params = {}) {
        const query = new URLSearchParams(params).toString();
        return await apiCall(`/admin/inquiries?${query}`, {
          method: 'GET'
        });
      },
      async update(id, data) {
        return await apiCall(`/admin/inquiries/${id}`, {
          method: 'PUT',
          body: JSON.stringify(data)
        });
      },
      async delete(id) {
        return await apiCall(`/admin/inquiries/${id}`, {
          method: 'DELETE'
        });
      }
    }
  },
  integrations: {
    Core: {
      async UploadFile({ file }) {
        const formData = new FormData();
        formData.append('image', file);
        return await apiCall('/admin/upload', {
          method: 'POST',
          body: formData
        });
      }
    }
  }
};
