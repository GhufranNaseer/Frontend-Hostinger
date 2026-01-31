import api from './api';
import { Event } from '../types';

export const eventsService = {
    getAll: async (): Promise<Event[]> => {
        const { data } = await api.get('/events');
        return data;
    },

    getOne: async (id: string): Promise<Event> => {
        const { data } = await api.get(`/events/${id}`);
        return data;
    },

    create: async (eventData: { name: string; description?: string; eventDate: string }): Promise<Event> => {
        const { data } = await api.post('/events', eventData);
        return data;
    },

    update: async (id: string, eventData: Partial<Event>): Promise<Event> => {
        const { data } = await api.patch(`/events/${id}`, eventData);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/events/${id}`);
    },
};
