const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

// Helper function to get auth headers
const getAuthHeaders = () =>{
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type':'application/json',
    ...(token && {'Authorization':`Bearer ${token}`})
  };
};

// Helper function to handle API errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || 'An error occured');
  }
  return response.json();
};

// Authentication APIs
export const authAPI = {
  // Login
  login: async (username, password) =>{
    const response = await fetch(`${API_BASE_URL}/token/`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body:JSON.stringify({username, password})
    });
    return handleResponse(response);  
  },

  // Register
  register: async (userData) =>{
    const response = await fetch(`${API_BASE_URL}/users/register/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
    
  },

  // Change Password
  changePassword: async (passwords) => {
    const response = await fetch(`${API_BASE_URL}/users/change-password/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwords)
    });
    return handleResponse(response);
  },
  
  //Refresh token
  refreshToken: async (refresh) => {
    const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ refresh })
    });
    return handleResponse(response);
  }
};  
  //Articles APIs
export const articlesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/articles/?${queryString}`);
    return handleResponse(response);
  },

  getBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}/`);
    return handleResponse(response);
  },

  search: async (query) => {
    const response = await fetch(`${API_BASE_URL}/articles/?search=${encodeURIComponent(query)}`);
    return handleResponse(response);
  },

  trackDownload: async(slug) => {
    const response = await fetch(`${API_BASE_URL}/articles/${slug}/download/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Submissions APIs
export const submissionsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/submissions/`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  create: async (formData) => {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/submissions/`, {
      method: 'POST',
      headers: {
        ...(token && {'Authorization': `Bearer ${token}`})
      },
      body: formData
    });
    return handleResponse(response);
  },   

  withdraw: async (id) => {
    const response = await fetch(`${API_BASE_URL}/submissions/${id}/withdraw/`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Categories API
export const CategoriesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories/`);
    return handleResponse(response);
  }
};

export default {
  auth: authAPI,
  articles: articlesAPI,
  submissions: submissionsAPI,
  categories: CategoriesAPI
};

