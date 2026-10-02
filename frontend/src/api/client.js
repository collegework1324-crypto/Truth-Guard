import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Auth token if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tg_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health Check Failed:', error);
    throw error;
  }
};

export const analyzeMultimodal = async (formData) => {
  try {
    const response = await api.post('/detection/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Detection request failed:', error);
    throw error;
  }
};

export const getHistory = async (params = {}) => {
  const response = await api.get('/history', { params });
  return response.data;
};

export const submitFeedback = async (feedbackData) => {
  const response = await api.post('/feedback', feedbackData);
  return response.data;
};

export const getAdminMetrics = async () => {
  const response = await api.get('/admin/metrics');
  return response.data;
};

export default api;
