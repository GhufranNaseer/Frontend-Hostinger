import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute: React.FC = () => {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return isAdmin ? <Outlet /> : <Navigate to="/user/my-tasks" replace />;
};
