// ═══════════════════════════════════════════════════
// API Service — Axios instance with JWT interceptor
// ═══════════════════════════════════════════════════
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 min for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Attach JWT ─────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor: Handle 401 ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth API ────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

// ─── CV API ──────────────────────────────────────
export const cvAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('cv_file', file);
    return api.post('/api/cv/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: () => api.get('/api/cv/list'),
  getById: (id) => api.get(`/api/cv/${id}`),
  getStatus: (id) => api.get(`/api/cv/${id}/status`),
  delete: (id) => api.delete(`/api/cv/${id}`),
};

// ─── Recommendations API ─────────────────────────
export const recommendationsAPI = {
  getForCV: (cvId, params = {}) => api.get(`/api/recommendations/${cvId}`, { params }),
};

// ─── Jobs API ────────────────────────────────────
export const jobsAPI = {
  getFeed: () => api.get('/api/jobs/feed'),
  getSuggestions: () => api.get('/api/jobs/suggestions'),
  getById: (id) => api.get(`/api/jobs/${id}`),
  toggleBookmark: (id) => api.post(`/api/jobs/${id}/bookmark`),
  recordApply: (id, data = {}) => api.post(`/api/jobs/${id}/apply`, data),
  applyWithCV: (jobId, file) => {
    const formData = new FormData();
    formData.append('cv_file', file);
    return api.post(`/api/jobs/${jobId}/apply-cv`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 90000, // 90s — AI processing can be slow
    });
  },
};

// ─── Tracking API ────────────────────────────────
export const trackingAPI = {
  sendEvents: (events) => api.post('/api/tracking/events', { events }),
  getStats: () => api.get('/api/tracking/stats'),
};

// ─── Companies API ───────────────────────────────
export const companiesAPI = {
  list: (params = {}) => api.get('/api/companies', { params }),
  getById: (id) => api.get(`/api/companies/${id}`),
  getJobs: (id) => api.get(`/api/companies/${id}/jobs`),
};

export default api;
