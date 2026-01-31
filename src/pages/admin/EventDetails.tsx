import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { eventsService, departmentsService, usersService } from '../../services';
import { Event, Department, User } from '../../types';
import { Layout, Spinner } from '../../components/common';
import { formatDate } from '../../utils';
import CSVUploader from '../../components/admin/CSVUploader';
import TaskTable from '../../components/admin/TaskTable';

const EventDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const [eventData, deptsData, usersData] = await Promise.all([
        eventsService.getOne(id),
        departmentsService.getAll(),
        usersService.getUsers(),
      ]);
      setEvent(eventData);
      setDepartments(deptsData);
      setUsers(usersData);
    } catch (err) {
      setError('Failed to fetch event details');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <Layout><div className="h-96 flex items-center justify-center"><Spinner size="lg" /></div></Layout>;
  if (error || !event) return <Layout><div className="p-8 text-center text-red-600 font-bold bg-red-50 rounded-2xl border border-red-100">{error || 'Event not found'}</div></Layout>;

  return (
    <Layout>
      <div className="flex flex-col space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-start">
          <div>
            <nav className="flex text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
              <Link to="/admin/events" className="hover:text-blue-600 transition-colors">Events</Link>
              <span className="mx-2 text-gray-300">/</span>
              <span className="text-blue-600">{event.name}</span>
            </nav>
            <h1 className="text-4xl font-black text-gray-900 leading-tight">{event.name}</h1>
            <div className="flex items-center text-gray-500 mt-2 font-medium">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {formatDate(event.eventDate, { dateStyle: 'long' })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar: Details & Upload */}
          <div className="space-y-6 lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Description</h2>
              <p className="text-gray-700 text-sm leading-relaxed italic">{event.description || 'No description provided.'}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border overflow-hidden">
              <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Upload BOQ</h2>
              <CSVUploader eventId={event.id} onUploadSuccess={fetchData} />
            </div>
          </div>

          {/* Main: Task Table */}
          <div className="lg:col-span-3">
            <div className="bg-white p-8 rounded-2xl shadow-sm border min-h-[500px]">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">BOQ Worksheet</h2>
                  <p className="text-gray-500 text-sm mt-1">Found {event.tasks?.length || 0} tasks for this event.</p>
                </div>
                <button onClick={fetchData} className="p-2 border rounded-lg hover:bg-gray-50 transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
              </div>

              {event.tasks && event.tasks.length > 0 ? (
                <TaskTable
                  tasks={event.tasks}
                  users={users}
                  departments={departments}
                  onRefresh={fetchData}
                />
              ) : (
                <div className="text-center py-32 border-2 border-dashed border-gray-100 rounded-3xl group">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-50 transition-colors">
                    <svg className="w-8 h-8 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <p className="text-gray-400 font-medium italic">No tasks uploaded yet.</p>
                  <p className="text-gray-300 text-xs mt-1">Upload a CSV file to begin assigning tasks.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetails;
