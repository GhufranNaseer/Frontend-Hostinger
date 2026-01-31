import api from './api';
import { LoginDto, LoginResponse } from '../types';

export const authService = {
    login: async (credentials: LoginDto): Promise<LoginResponse> => {
        const { data } = await api.post('/auth/login', credentials);
        return data;
    },

    getProfile: async () => {
        const { data } = await api.get('/auth/profile');
        return data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};
