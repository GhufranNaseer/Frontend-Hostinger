import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/common';

const AdminDashboard: React.FC = () => {
    return (
        <Layout>
            <div className="flex flex-col space-y-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Dashboard</h2>
                    <p className="text-gray-500 mt-1">Manage events, users, and track project status.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Events Card */}
                    <Link
                        to="/admin/events"
                        className="group bg-white p-6 rounded-2xl shadow-sm border hover:shadow-xl hover:border-blue-500 transition-all duration-300"
                    >
                        <div className="flex flex-col">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mt-4">Manage Events</h3>
                            <p className="text-gray-500 mt-2 text-sm leading-relaxed">Create and manage events, upload BOQ files, and oversee project timelines.</p>
                            <div className="mt-4 flex items-center text-blue-600 font-bold text-sm">
                                Go to Events
                                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Users Card (Coming Soon) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border opacity-60 grayscale cursor-not-allowed">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-400 mt-4">Manage Users</h3>
                        <p className="text-gray-400 mt-2 text-sm leading-relaxed">Invite team members, assign departments, and manage permissions.</p>
                        <span className="mt-4 inline-block bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-full uppercase">Coming Soon</span>
                    </div>
                </div>

                {/* Quick Stats Section */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        Quick Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 group hover:bg-blue-50 transition-colors">
                            <p className="text-blue-900 font-semibold text-sm">Active Events</p>
                            <div className="flex items-end justify-between mt-2">
                                <p className="text-4xl font-black text-blue-600">0</p>
                                <div className="text-blue-200">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 group hover:bg-indigo-50 transition-colors">
                            <p className="text-indigo-900 font-semibold text-sm">Total Tasks</p>
                            <div className="flex items-end justify-between mt-2">
                                <p className="text-4xl font-black text-indigo-600">0</p>
                                <div className="text-indigo-200">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 18h7v-2H2v2z" /></svg>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-100 group hover:bg-emerald-50 transition-colors">
                            <p className="text-emerald-900 font-semibold text-sm">Assignments</p>
                            <div className="flex items-end justify-between mt-2">
                                <p className="text-4xl font-black text-emerald-600">0</p>
                                <div className="text-emerald-200">
                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
