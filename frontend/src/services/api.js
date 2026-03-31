import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
// api.js - replace your current response interceptor with this

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refresh = localStorage.getItem('refresh_token');

      if (!refresh) {
        // No refresh token — clear everything and redirect to login
        localStorage.removeItem('access_token');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/token/refresh/`,
          { refresh }
        );
        localStorage.setItem('access_token', data.access);
        // If backend rotates refresh tokens, save the new one too
        if (data.refresh) localStorage.setItem('refresh_token', data.refresh);

        api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        processQueue(null, data.access);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // All other errors
    const message = error.response?.data?.detail ||
                    error.response?.data?.message ||
                    (error.request ? 'Cannot connect to server. Make sure the backend is running on port 8000.' : error.message);
    return Promise.reject(new Error(message));
  }
);

// Authentication APIs
export const authAPI = {
  // Login
  login: async (username, password) => {
    const response = await api.post('/token/', { username, password });
    return response.data;
  },

  // Register
  register: async (userData) => {
    const response = await api.post('/users/register/', userData);
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile/');
    return response.data;
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/users/profile/', userData);
    return response.data;
  },

  // Change password
  changePassword: async (passwords) => {
    const response = await api.put('/users/change-password/', passwords);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refresh) => {
    const response = await api.post('/token/refresh/', { refresh });
    return response.data;
  }
};

// Articles APIs
export const articlesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/articles/', { params });
    return response.data;
  },

  getBySlug: async (slug) => {
    const response = await api.get(`/articles/${slug}/`);
    return response.data;
  },

  search: async (query) => {
    const response = await api.get('/articles/', { 
      params: { search: query } 
    });
    return response.data;
  },

  trackDownload: async (slug) => {
    const response = await api.post(`/articles/${slug}/download/`);
    return response.data;
  },

  getLatest: async (count = 4) => {
    const response = await api.get('/articles/', {
      params: { 
        ordering: '-published_date',
        page_size: count 
      }
    });
    return response.data;
  }
};

// Submissions APIs
export const submissionsAPI = {
  getAll: async () => {
    const response = await api.get('/submissions/');
    return response.data;
  },

  create: async (formData) => {
    // For file uploads, use different headers
    const response = await api.post('/submissions/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  withdraw: async (id) => {
    const response = await api.post(`/submissions/${id}/withdraw/`);
    return response.data;
  }
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories/');
    return response.data;
  }
};

// Volumes API
export const volumesAPI = {
  getAll: async () => {
    const response = await api.get('/volumes/');
    return response.data;
  },

  getIssues: async (volumeId) => {
    const response = await api.get(`/volumes/${volumeId}/issues/`);
    return response.data;
  }
};

// Issues API
export const issuesAPI = {
  getAll: async () => {
    const response = await api.get('/issues/');
    return response.data;
  },

  getArticles: async (issueId) => {
    const response = await api.get(`/issues/${issueId}/articles/`);
    return response.data;
  }
};

export default api;
