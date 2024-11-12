// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const UserPortal = lazy(() => import('./pages/UserPortal'));

function AppContent() {
    const { currentUser } = useAuth();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to={currentUser ? (currentUser.roles.includes('admin') ? '/admin' : '/user/home') : '/login'} />} />

                <Route element={<PrivateRoute roles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    {/* 其他 admin 路由 */}
                </Route>

                <Route path="/user/home" element={<PrivateRoute roles={['user']}><UserPortal /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </Suspense>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
