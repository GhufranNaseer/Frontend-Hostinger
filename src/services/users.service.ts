import api from './api';
import { User } from '../types';

export const usersService = {
    getAll: async (): Promise<User[]> => {
        const { data } = await api.get('/auth/users'); // We need to implement this endpoint or similar
        return data;
    },

    // Alternative: Get all users from users module if we had it
    getUsers: async (): Promise<User[]> => {
        // Assuming we might have a /users endpoint
        try {
            const { data } = await api.get('/users');
            return data;
        } catch {
            return [];
        }
    }
};
