import axios from 'axios';

// Base API URL config to make deployment easy
// Accesses the VITE_API_URL from your .env file
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Base Frontend URL
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:5173';

// Configure axios instance
export const axiosInstance = axios.create({ 
  baseURL: API_BASE_URL, 
  withCredentials: true 
});
