// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

// 创建 AuthContext 用于提供用户认证相关信息和方法
const AuthContext = createContext();

// AuthProvider 组件，负责管理用户认证状态
export function AuthProvider({ children }) {
    const navigate = useNavigate();
    // 初始化 currentUser 和 token，尝试从 localStorage 获取
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // 当 currentUser 或 token 变化时，将其同步到 localStorage
    useEffect(() => {
        if (token && currentUser) {
            console.log("AuthContext - Token 和用户信息存在，保存到 localStorage");
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
            console.log("AuthContext - Token 或用户信息不存在，清空 localStorage");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [currentUser, token]);

    // 登录函数，尝试登录并获取用户信息和 token
    const login = async (username, password) => {
        try {
            console.log("AuthContext - 尝试登录中，用户名:", username);
            const response = await api.post('/auth/login', { username, password });
            const { user, token } = response.data;

            console.log("AuthContext - 登录成功，用户信息:", user);
            // 更新当前用户和 token
            setCurrentUser(user);
            setToken(token);
            // 根据用户角色导航到对应的页面
            navigate(user.roles.includes('admin') ? '/admin' : '/user/home');
        } catch (error) {
            console.error("AuthContext - 登录失败，错误信息:", error);
            throw new Error("登录失败，请检查用户名或密码");
        }
    };

    // 注销函数，清除用户信息和 token
    const logout = () => {
        console.log("AuthContext - 用户注销");
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        // 提供 currentUser, token, login, logout 给子组件使用
        <AuthContext.Provider value={{ currentUser, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// 自定义钩子，便于其他组件获取 AuthContext 中的值
export const useAuth = () => useContext(AuthContext);
