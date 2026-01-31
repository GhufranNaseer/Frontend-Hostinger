import api from './api';
import { Task } from '../types';

export const tasksService = {
    uploadCSV: async (eventId: string, file: File): Promise<{ success: boolean; tasksCreated: number; message: string }> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await api.post(`/tasks/upload-csv/${eventId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data;
    },

    getEventTasks: async (eventId: string): Promise<Task[]> => {
        const { data } = await api.get(`/tasks/event/${eventId}`);
        return data;
    },

    getMyTasks: async (): Promise<Task[]> => {
        const { data } = await api.get('/tasks/my-tasks');
        return data;
    },

    getOne: async (id: string): Promise<Task> => {
        const { data } = await api.get(`/tasks/${id}`);
        return data;
    },
};
