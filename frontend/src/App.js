// src/App.js
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';

const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
//const UserHome = lazy(() => import('./components/UserHome'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const DepartmentManagement = lazy(() => import('./components/DepartmentManagement'));
const EditDepartment = lazy(() => import('./components/EditDepartment'));
const CreateDepartment = lazy(() => import('./components/CreateDepartment'));
const RoleManagement = lazy(() => import('./components/RoleManagement'));
const CreateUser = lazy(() => import('./components/CreateUser'));
const EditUser = lazy(() => import('./components/EditUser'));
const UserPortal = lazy(() => import('./pages/UserPortal'));

function AppContent() {
    const { user } = useAuth();
	console.log("App.js loaded, user:", user); // 调试：确认App.js加载并输出user状态

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
