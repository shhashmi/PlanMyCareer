import axios from 'axios';

// Use backend URL from environment variable (VITE_API_URL in .env)
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Crucial for sending/receiving cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
