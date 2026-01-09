import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // Crucial for sending/receiving cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
