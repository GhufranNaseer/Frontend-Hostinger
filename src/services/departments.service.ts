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

    create: async (name: string): Promise<Department> => {
        const { data } = await api.post('/departments', { name });
        return data;
    },
};
