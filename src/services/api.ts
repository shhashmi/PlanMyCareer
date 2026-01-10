import axios from 'axios';

// In development, use relative path (proxied by Vite)
// In production, use full backend URL from environment variable
const API_BASE_URL = import.meta.env.PROD
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Crucial for sending/receiving cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
