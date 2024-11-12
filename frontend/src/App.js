// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const DepartmentManagement = lazy(() => import('./components/DepartmentManagement'));
const EditDepartment = lazy(() => import('./components/EditDepartment'));
const CreateDepartment = lazy(() => import('./components/CreateDepartment'));
const RoleManagement = lazy(() => import('./components/RoleManagement'));
const CreateUser = lazy(() => import('./components/CreateUser'));
const EditUser = lazy(() => import('./components/EditUser'));
const UserPortal = lazy(() => import('./pages/UserPortal'));
const AdminAnnouncementManagement = lazy(() => import('./components/AdminAnnouncementManagement'));

function AppContent() {
    const { user } = useAuth();

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to={user ? (user.roles.includes('admin') ? '/admin' : '/user/home') : '/login'} />} />
                
                <Route element={<PrivateRoute roles={['admin']} />}>
                    <Route path="/admin" element={<AdminDashboard />}>
                        <Route path="users" element={<UserManagement />} />
                        <Route path="users/create" element={<CreateUser />} />
                        <Route path="users/edit/:id" element={<EditUser />} />
                        <Route path="departments" element={<DepartmentManagement />} />
                        <Route path="departments/create" element={<CreateDepartment />} />
                        <Route path="departments/edit/:id" element={<EditDepartment />} />
                        <Route path="roles" element={<RoleManagement />} />
                        <Route path="announcements" element={<AdminAnnouncementManagement />} />
                    </Route>
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
