import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PrivateRoute } from './PrivateRoute';
import { AdminRoute } from './AdminRoute';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

// Lazy load pages for better performance
const Login = lazy(() => import('../pages/auth/Login'));
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'));
const Events = lazy(() => import('../pages/admin/Events'));
const EventDetails = lazy(() => import('../pages/admin/EventDetails'));
const MyTasks = lazy(() => import('../pages/user/MyTasks'));

const LoadingFallback = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spinner size="lg" />
    </div>
);

const AppRoutes: React.FC = () => {
    const { isAuthenticated, isAdmin } = useAuth();

    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    {/* Public route */}
                    <Route
                        path="/login"
                        element={isAuthenticated ? <Navigate to={isAdmin ? "/admin/dashboard" : "/user/my-tasks"} replace /> : <Login />}
                    />

                    {/* Protected routes */}
                    <Route element={<PrivateRoute />}>
                        {/* Admin routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/events" element={<Events />} />
                            <Route path="/admin/events/:id" element={<EventDetails />} />
                        </Route>

                        {/* User routes */}
                        <Route path="/user/my-tasks" element={<MyTasks />} />
                    </Route>

                    {/* Root redirect */}
                    <Route
                        path="/"
                        element={<Navigate to={isAuthenticated ? (isAdmin ? "/admin/dashboard" : "/user/my-tasks") : "/login"} replace />}
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRoutes;
