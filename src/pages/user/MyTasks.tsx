import React from 'react';
import { tasksService } from '../../services';
import { Layout, Spinner } from '../../components/common';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils';

const MyTasks: React.FC = () => {
    const { data: tasks, loading, error, execute: fetchTasks } = useFetch(() => tasksService.getMyTasks());

    return (
        <Layout>
            <div className="flex flex-col space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">My Assigned Tasks</h2>
                        <p className="text-gray-500 mt-1 font-medium">View and track tasks assigned to you or your department.</p>
                    </div>
                    {tasks && (
                        <div className="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg shadow-blue-100">
                            {tasks.length} {tasks.length === 1 ? 'TASK' : 'TASKS'}
                        </div>
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-bold animate-pulse">
                        {error}
                        <button onClick={() => fetchTasks()} className="ml-4 underline">Try again</button>
                    </div>
                )}

                {loading && !tasks ? (
                    <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
                ) : tasks && tasks.length > 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">S.No</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Event Name</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Task Details</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Assignment Date</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {tasks.map((task) => (
                                        <tr key={task.id} className="hover:bg-blue-50/20 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-black text-gray-300 group-hover:text-blue-200 transition-colors">#{task.sNo}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{task.event?.name}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                                    {task.event?.eventDate && new Date(task.event.eventDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-extrabold text-blue-600 mb-0.5">{task.taskName}</div>
                                                <p className="text-xs text-gray-500 line-clamp-1 italic">{task.description}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm text-gray-600 font-medium">
                                                    <svg className="w-4 h-4 mr-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    {formatDate(task.assignments?.[0]?.assignedAt || new Date().toISOString())}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-xs font-black text-blue-600 hover:text-blue-800 uppercase tracking-wider">Details</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100 group">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-300">
                            <svg className="h-8 w-8 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 tracking-tight">No tasks assigned yet</h3>
                        <p className="text-gray-400 text-sm mt-1 italic">When an admin assigns you a task, it will appear here.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyTasks;
