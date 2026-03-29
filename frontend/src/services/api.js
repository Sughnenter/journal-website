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
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.detail || 
                     error.response.data?.message || 
                     `Error: ${error.response.status}`;
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request made but no response
      return Promise.reject(new Error('Cannot connect to server. Make sure the backend is running on port 8000.'));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
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
