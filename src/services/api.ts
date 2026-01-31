import axios from 'axios';

const getBaseUrl = () => {
    const url = import.meta.env.VITE_API_URL || '/api';
    // If it's just '/api', return it
    if (url === '/api') return url;
    // If it already ends with /api, return it
    if (url.endsWith('/api')) return url;
    // Otherwise append /api, handling potential trailing slash
    return `${url.replace(/\/$/, '')}/api`;
};

const api = axios.create({
    baseURL: getBaseUrl(),
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle 401 errors
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

export default api;
