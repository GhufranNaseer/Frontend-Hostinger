import api from './api';
import { User } from '../types';

export interface CreateUserPayload {
    email: string;
    name: string;
    role?: string;
    departmentId?: string;
    password?: string;
}

export interface UpdateUserPayload {
    email?: string;
    name?: string;
    role?: string;
    departmentId?: string;
    password?: string;
}

export const usersService = {
    getAll: async (): Promise<User[]> => {
        const { data } = await api.get('/users');
        return data;
    },

    getOne: async (id: string): Promise<User> => {
        const { data } = await api.get(`/users/${id}`);
        return data;
    },

    create: async (payload: CreateUserPayload): Promise<User> => {
        const { data } = await api.post('/users', payload);
        return data;
    },

    update: async (id: string, payload: UpdateUserPayload): Promise<User> => {
        const { data } = await api.patch(`/users/${id}`, payload);
        return data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    },
};
