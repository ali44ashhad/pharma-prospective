
// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Smarter response interceptor to avoid instant redirect loops
let alreadyRedirecting = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // allow callers to opt out of automatic redirect by setting header 'x-skip-auth-redirect'
    const skipRedirect = !!error.config?.headers?.['x-skip-auth-redirect'];

    if (status === 401) {
      // remove token locally
      localStorage.removeItem('token');

      if (!skipRedirect) {
        // avoid redirect storms and don't redirect if already on /login
        if (!alreadyRedirecting) {
          const currentPath = window.location.pathname;
          if (currentPath !== '/login') {
            alreadyRedirecting = true;
            // small delay to let any other in-flight logic finish
            setTimeout(() => {
              window.location.href = '/login';
              // reset flag after short time so later auth flows can redirect again
              setTimeout(() => { alreadyRedirecting = false; }, 1200);
            }, 60);
          }
        }
      }
      // if skipRedirect is true, just let the caller handle the 401
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }).then(res => res.data),
  logout: () => api.post('/auth/logout').then(res => res.data),
  // getCurrentUser: (options = {}) => api.get('/auth/me', options).then(res => res.data),
  changePassword: (data) => api.put('/auth/change-password', data).then(res => res.data)
};

export const paperService = {
  getAll: (params = {}) => api.get('/papers', { params }).then(res => res.data),
  getById: (id) => api.get(`/papers/${id}`).then(res => res.data),
  getStats: () => api.get('/papers/stats').then(res => res.data),
  upload: (formData) => api.post('/papers', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(res => res.data),
  update: (id, data) => api.put(`/papers/${id}`, data).then(res => res.data),
  delete: (id) => api.delete(`/papers/${id}`).then(res => res.data)
};

export const adminService = {
  assignPaper: (paperId, userId) => api.post('/admin/papers/assign', { paperId, userId }).then(res => res.data),
  createUser: async (userData) => {
    try {
      // Generate a random temporary password if not provided
      if (!userData.password) {
        const tempPassword = Math.random().toString(36).slice(-8); // 8 characters
        userData.password = tempPassword;
        userData.isTemporaryPassword = true;
      }

      console.log('Creating user with data:', { 
        ...userData,
        password: '[HIDDEN]' 
      });

      const response = await api.post('/admin/users', userData);
      console.log('Server response:', response.data);

      return {
        ...response.data,
        temporaryPassword: userData.isTemporaryPassword ? userData.password : undefined
      };
    } catch (error) {
      console.error('Create user error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },
  getUsers: (params = {}) => api.get('/admin/users', { params }).then(res => res.data),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData).then(res => res.data),
  resetUserPassword: (id) => api.post(`/admin/users/${id}/reset-password`).then(res => res.data),
  getAccessLogs: (params = {}) => api.get('/admin/access-logs', { params }).then(res => res.data)
};

export default api;