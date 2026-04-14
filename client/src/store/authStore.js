import { create } from 'zustand';
import api from '../services/api';

const useAuthStore = create((set) => ({
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo'))
        : null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/users/login', { email, password });
            set({ userInfo: data, loading: false });
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || error.message,
            });
        }
    },

    register: async (userData) => {
        set({ loading: true, error: null });
        try {
            const { data } = await api.post('/users', userData);
            set({ userInfo: data, loading: false });
            localStorage.setItem('userInfo', JSON.stringify(data));
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || error.message,
            });
        }
    },

    logout: () => {
        localStorage.removeItem('userInfo');
        set({ userInfo: null });
    },
}));

export default useAuthStore;
