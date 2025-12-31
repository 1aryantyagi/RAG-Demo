import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutes for large files
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const uploadDocument = async (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        if (onProgress) {
          onProgress(percentCompleted);
        }
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export const queryDocument = async (docId, query) => {
  try {
    const response = await api.post('/query', {
      doc_id: docId,
      query: query,
    });
    
    return response.data;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
};

export const listDocuments = async () => {
  try {
    const response = await api.get('/documents');
    return response.data.documents;
  } catch (error) {
    console.error('List documents error:', error);
    throw error;
  }
};

export const getDocument = async (docId) => {
  try {
    const response = await api.get(`/documents/${docId}`);
    return response.data;
  } catch (error) {
    console.error('Get document error:', error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get('/api/');
    return response.data;
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
};

export default api;