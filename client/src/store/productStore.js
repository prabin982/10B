import { create } from 'zustand';
import api from '../services/api';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

const useProductStore = create((set, get) => {
    // Setting up socket listener immediately
    socket.on('product_update', ({ type, data }) => {
        const { products } = get();
        if (type === 'ADD') {
            set({ products: [data, ...products] });
        } else if (type === 'UPDATE') {
            set({
                products: products.map((p) => (p._id === data._id ? data : p)),
            });
        } else if (type === 'DELETE') {
            set({
                products: products.filter((p) => p._id !== data.id),
            });
        }
    });

    return {
        products: [],
        loading: false,
        error: null,

        fetchProducts: async (category = '', search = '') => {
            set({ loading: true });
            try {
                const { data } = await api.get(`/products?category=${category}&search=${search}`);
                set({ products: data, loading: false });
            } catch (error) {
                set({
                    loading: false,
                    error: error.response?.data?.message || error.message,
                });
            }
        },

        createProduct: async (productData) => {
            try {
                await api.post('/products', productData);
                // Socket handles the update
            } catch (error) {
                set({ error: error.response?.data?.message || error.message });
            }
        },

        updateProduct: async (id, productData) => {
            try {
                await api.put(`/products/${id}`, productData);
                // Socket handles the update
            } catch (error) {
                set({ error: error.response?.data?.message || error.message });
            }
        },

        deleteProduct: async (id) => {
            try {
                await api.delete(`/products/${id}`);
                // Socket handles the update
            } catch (error) {
                set({ error: error.response?.data?.message || error.message });
            }
        },
    };
});

export default useProductStore;
