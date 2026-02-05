import axios from 'axios';
import { getStoredQueryParams } from '../utils/queryParamStore';

const API_BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : 'https://api.aifluens.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Forward stored query params on every request (without overriding explicit params)
api.interceptors.request.use((config) => {
    const stored = getStoredQueryParams();
    if (Object.keys(stored).length > 0) {
        config.params = { ...stored, ...config.params };
    }
    return config;
});

export default api;
