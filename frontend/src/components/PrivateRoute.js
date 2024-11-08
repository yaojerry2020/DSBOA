// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ roles, children }) {
    const { user } = useAuth();
    console.log("PrivateRoute - User roles:", user?.roles, "Required roles:", roles); // 调试：确认用户角色和要求的角色

    if (!user) {
        console.log("User not authenticated, redirecting to login.");
        return <Navigate to="/login" />;
    }

    if (roles && !roles.some(role => user.roles.includes(role))) {
        console.log("User does not have the required roles, redirecting to /unauthorized.");
        return <Navigate to="/unauthorized" />;
    }

    return children ? children : <Outlet />;
}

export default PrivateRoute;
