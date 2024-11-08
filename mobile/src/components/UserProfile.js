// src/components/UserProfile.js

import React, { useState, useContext, useEffect } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import AuthContext from '../contexts/AuthContext';
import axios from 'axios';

const UserProfile = () => {
  const { user, token } = useContext(AuthContext); // 从 AuthContext 中获取用户信息
  const [formData, setFormData] = useState({
    username: user?.username || '',
    displayName: user?.displayName || '',
    phone: user?.phone || '',
    email: user?.email || '',
    password: '',
  });

  useEffect(() => {
    // 设置默认值为用户当前信息
    setFormData({
      username: user?.username || '',
      displayName: user?.displayName || '',
      phone: user?.phone || '',
      email: user?.email || '',
      password: '',
    });
  }, [user]);

  // 更新输入字段值
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        '/api/user/profile', // 假设此为后端更新用户信息的API
        { phone: formData.phone, email: formData.email, password: formData.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('个人信息已更新');
    } catch (error) {
      console.error('更新失败:', error);
      alert('更新失败，请重试');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, border: '1px solid #ddd', borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        个人信息
      </Typography>

      <TextField
        label="用户名"
        name="username"
        value={formData.username}
        InputProps={{
          readOnly: true,
        }}
        fullWidth
        margin="normal"
      />

      <TextField
        label="显示名称"
        name="displayName"
        value={formData.displayName}
        InputProps={{
          readOnly: true,
        }}
        fullWidth
        margin="normal"
      />

      <TextField
        label="手机"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="邮箱"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="密码"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ mt: 2 }}>
        保存修改
      </Button>
    </Box>
  );
};

export default UserProfile;
