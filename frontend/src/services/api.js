import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const resumeService = {
  analyzeFile: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/resume/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return response.data;
  },

  analyzeText: async (text) => {
    const response = await api.post('/resume/analyze-text', { text });
    return response.data;
  },

  getHealth: async () => {
    const response = await api.get('/resume/health');
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/resume/stats');
    return response.data;
  },
};

export default api;
