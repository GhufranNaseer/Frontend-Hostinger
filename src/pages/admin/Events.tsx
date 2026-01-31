import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { eventsService } from '../../services';
import { Layout, Spinner } from '../../components/common';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils';

const Events: React.FC = () => {
    const { data: events, loading, error, execute: fetchEvents, setData: setEvents } = useFetch(() => eventsService.getAll());
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !eventDate) return;

        setSubmitting(true);
        try {
            const newEvent = await eventsService.create({ name, description, eventDate });
            setName('');
            setDescription('');
            setEventDate('');
            // Optimistic update or just refetch
            if (events) setEvents([newEvent, ...events]);
        } catch (err) {
            alert('Failed to create event');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Create Event Form */}
                <div className="w-full md:w-1/3">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Event</h2>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Event Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-all"
                                    placeholder="e.g. Badar Expo 2026"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                    required
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 focus:bg-white transition-all"
                                    placeholder="Brief event details..."
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 disabled:bg-blue-300 transition shadow-lg shadow-blue-100"
                            >
                                {submitting ? <Spinner size="sm" /> : 'Create Event'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Events List */}
                <div className="flex-1">
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Active Events</h2>
                            <button onClick={() => fetchEvents()} className="text-blue-600 font-bold text-sm hover:underline">Refresh</button>
                        </div>

                        {error && (
                            <div className="m-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="divide-y">
                            {loading && !events ? (
                                <div className="p-12"><Spinner /></div>
                            ) : !events || events.length === 0 ? (
                                <div className="p-12 text-center text-gray-500 italic">
                                    No events found. Create one to get started.
                                </div>
                            ) : (
                                events.map((event) => (
                                    <div key={event.id} className="p-6 hover:bg-blue-50/30 transition-colors group">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <h3 className="text-lg font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">{event.name}</h3>
                                                    <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-blue-100">
                                                        {event._count?.tasks || 0} Tasks
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                        {formatDate(event.eventDate)}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 mt-3 text-sm leading-relaxed line-clamp-2 italic">{event.description || 'No description provided.'}</p>
                                            </div>
                                            <Link
                                                to={`/admin/events/${event.id}`}
                                                className="ml-4 p-2 bg-gray-50 rounded-xl text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            >
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Events;
