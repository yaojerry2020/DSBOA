// src/contexts/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const API_URL = Constants.expoConfig?.extra?.API_URL || 'http://dsm.yaojerry.cn:4321/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const login = async (username, password) => {
        try {
            setError(null); // 清空之前的错误
            const response = await axios.post(`${API_URL}/auth/login`, { username, password });
            
            const token = response.data.token; // 假设服务器返回的令牌字段是 `token`
            if (token) {
                await AsyncStorage.setItem('authToken', token); // 将令牌存储在本地
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            setUser(response.data.user); // 假设 `response.data.user` 包含用户信息
            navigation.navigate("UserPortal"); // 登录成功后跳转
        } catch (err) {
            if (err.response) {
                setError("用户名或密码错误，请重试");
            } else if (err.request) {
                setError("无法连接到服务器，请检查网络");
            } else {
                setError("登录时出现问题，请稍后重试");
            }
            //console.error("登录请求失败:", err);
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('authToken'); // 清除本地存储的令牌
        delete axios.defaults.headers.common['Authorization']; // 移除全局设置的 Authorization 头
        setUser(null);
        navigation.navigate("Login");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
