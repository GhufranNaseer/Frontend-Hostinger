import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            BOQ Manager
                        </Link>

                        {isAdmin && (
                            <div className="hidden md:block ml-10 flex items-baseline space-x-1">
                                <Link
                                    to="/admin/dashboard"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/admin/events"
                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition"
                                >
                                    Events
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900 leading-none">{user?.name}</p>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter mt-1">
                                {user?.role?.replace('_', ' ')} {user?.department ? `• ${user.department.name}` : ''}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-600 hover:text-white transition duration-200"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
