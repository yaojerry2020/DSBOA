// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ roles, children }) {
    const { currentUser } = useAuth();  // 使用 currentUser
    console.log("PrivateRoute - User roles:", currentUser?.roles, "Required roles:", roles); // 调试：确认用户角色和要求的角色

    if (!currentUser) {
  console.log('PrivateRoute - 用户未登录，跳转到 /login');
  return <Navigate to="/login" />;
}

if (roles && !roles.some(role => currentUser.roles.includes(role))) {
  console.log(`PrivateRoute - 用户角色 ${currentUser.roles} 不匹配，跳转到 /unauthorized`);
  return <Navigate to="/unauthorized" />;
}


    return children ? children : <Outlet />;
}

export default PrivateRoute;
