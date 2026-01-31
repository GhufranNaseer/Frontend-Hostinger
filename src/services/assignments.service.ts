import api from './api';
import { Assignment } from '../types';

export const assignmentsService = {
    create: async (assignmentData: {
        taskId: string;
        userId?: string;
        departmentId?: string;
    }): Promise<Assignment> => {
        const { data } = await api.post('/assignments', assignmentData);
        return data;
    },

    getByTask: async (taskId: string): Promise<Assignment[]> => {
        const { data } = await api.get(`/assignments/task/${taskId}`);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/assignments/${id}`);
    },
};
