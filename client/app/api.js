import axios from 'axios';

// Base API URL - change this in production
export const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGN_IN: `${API_BASE_URL}/users/signin`,
    SIGN_UP: `${API_BASE_URL}/users/signup`,
    UPDATE_PROFILE: (id) => `${API_BASE_URL}/users/profile/${id}`,
  },
  
  // Halls endpoints
  HALLS: {
    CREATE: `${API_BASE_URL}/halls/create`,
    GET_ALL: `${API_BASE_URL}/halls/all`,
    GET_BY_ID: (id) => `${API_BASE_URL}/halls/${id}`,
    GET_SHOWS: (id) => `${API_BASE_URL}/halls/${id}/shows`,
    UPDATE: (id) => `${API_BASE_URL}/halls/${id}/update`,
    DELETE: (id) => `${API_BASE_URL}/halls/${id}/delete`,
  },
  
  // Shows endpoints
  SHOWS: {
    CREATE: `${API_BASE_URL}/shows/create`,
    GET_ALL: `${API_BASE_URL}/shows/all`,
    GET_BY_ID: (id) => `${API_BASE_URL}/shows/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/shows/${id}/update`,
    DELETE: (id) => `${API_BASE_URL}/shows/${id}/delete`,
  },
  
  // Tickets endpoints
  TICKETS: {
    GENERATE: `${API_BASE_URL}/tickets/generate`,
    GET_ALL: `${API_BASE_URL}/tickets/all`,
    GET_USER_TICKETS: (userId) => `${API_BASE_URL}/tickets/user/${userId}`,
    UPDATE_STATUS: (id) => `${API_BASE_URL}/tickets/${id}/update-status`,
  },
  
  // Seats endpoints
  SEATS: {
    GET_BY_ID: (id) => `${API_BASE_URL}/seats/${id}`,
  },
};

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Request interceptor for adding auth token (if needed)
axios.interceptors.request.use(
  (config) => {
    // You can add additional headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - could trigger logout here
      console.error('Unauthorized access - please login');
    } else if (error.response?.status === 403) {
      // Forbidden - user doesn't have permission
      console.error('Access forbidden - insufficient permissions');
    } else if (error.response?.status === 404) {
      // Not found
      console.error('Resource not found');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error - please try again later');
    }
    
    return Promise.reject(error);
  }
);

export default axios;
