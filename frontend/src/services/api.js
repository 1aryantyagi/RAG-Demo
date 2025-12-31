import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000,
});

// Interceptors
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

// ✅ Upload (FIXED)
export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });

  return response.data;
};

// ✅ Query
export const queryDocument = async (docId, query) => {
  const response = await api.post('/query', {
    doc_id: docId,
    query,
  });
  return response.data;
};

// ✅ List
export const listDocuments = async () => {
  const response = await api.get('/documents');
  return response.data.documents;
};

// ✅ Get document
export const getDocument = async (docId) => {
  const response = await api.get(`/documents/${docId}`);
  return response.data;
};

// ✅ Health check (FIXED)
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;