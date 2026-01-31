import api from './api';
import { Department } from '../types';

export const departmentsService = {
    getAll: async (): Promise<Department[]> => {
        const { data } = await api.get('/departments');
        return data;
    },

    getOne: async (id: string): Promise<Department> => {
        const { data } = await api.get(`/departments/${id}`);
        return data;
    },

    create: async (payload: { name: string; roles?: string[] }): Promise<Department> => {
        const { data } = await api.post('/departments', payload);
        return data;
    },

    update: async (id: string, payload: { name?: string; roles?: string[] }): Promise<Department> => {
        const { data } = await api.patch(`/departments/${id}`, payload);
        return data;
    },

    remove: async (id: string): Promise<void> => {
        await api.delete(`/departments/${id}`);
    },
};
