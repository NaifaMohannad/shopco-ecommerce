import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Automatically add JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Handle 401 errors
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        }
        return Promise.reject(error);
    }
);

// Products
export const getProducts = (filters) => API.get('/products/', { params: filters });
export const getProductDetail = (id) => API.get(`/products/${id}/`);
export const getCategories = () => API.get('/products/categories/');
export const getDressStyles = () => API.get('/products/dress-styles/');
export const getProductReviews = (id) => API.get(`/products/${id}/reviews/`);
export const addReview = (id, data) => API.post(`/products/${id}/reviews/`, data);

// Auth
export const loginUser = (data) => API.post('/auth/login/', data);
export const registerUser = (data) => API.post('/auth/register/', data);
export const getUserProfile = () => API.get('/auth/profile/');

// Cart
export const getCart = () => API.get('/cart/');
export const addToCart = (data) => API.post('/cart/', data);
export const removeFromCart = (data) => API.delete('/cart/', { data });
export const updateCart = (data) => API.put('/cart/', data);

// Orders
export const getOrders = () => API.get('/orders/');
export const placeOrder = (data) => API.post('/orders/', data);

export default API;