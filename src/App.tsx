import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { ErrorBoundary } from './components/common';
import './index.css';

const App: React.FC = () => {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </ErrorBoundary>
    );
};

export default App;
