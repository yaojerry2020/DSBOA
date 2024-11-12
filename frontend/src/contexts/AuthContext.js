import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (token) {
            console.log("AuthContext - Setting token and user in localStorage");
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
            console.log("AuthContext - Removing token and user from localStorage");
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }, [currentUser, token]);

    const login = async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            console.log("AuthContext - Login successful:", response.data.user);
            setCurrentUser(response.data.user);
            setToken(response.data.token);
            navigate(response.data.user.roles.includes('admin') ? '/admin' : '/user/home');
        } catch (error) {
            console.error("AuthContext - Login error:", error);
            throw new Error("登录失败，请检查用户名或密码");
        }
    };

    const logout = () => {
        setCurrentUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ currentUser, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
