// src/pages/Login.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const { login, error } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        login(username, password);
    };

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>登录</Text>
            {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}
            <TextInput
                placeholder="用户名"
                value={username}
                onChangeText={setUsername}
                style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />
            <TextInput
                placeholder="密码"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ borderBottomWidth: 1, marginBottom: 15 }}
            />
            <Button title="登录" onPress={handleLogin} />
        </View>
    );
};

export default Login;
