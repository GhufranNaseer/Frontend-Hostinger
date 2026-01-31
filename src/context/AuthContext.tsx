import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginDto } from '../types';
import { authService } from '../services/auth.service';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (credentials: LoginDto) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    const login = async (credentials: LoginDto) => {
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('token', response.access_token);
            localStorage.setItem('user', JSON.stringify(response.user));
            setUser(response.user);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
