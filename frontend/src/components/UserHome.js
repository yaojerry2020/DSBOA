// src/components/UserHome.js
import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const UserHome = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users/${user.id}`);
        setFormData({
          phone: response.data.phone || '',
          email: response.data.email || '',
          password: '',
        });
      } catch (error) {
        console.error('加载用户数据失败：', error);
      }
    };
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${user.id}`, {
        phone: formData.phone,
        email: formData.email,
        password: formData.password || undefined,
      });
      alert('信息更新成功');
      setFormData((prevData) => ({ ...prevData, password: '' }));
    } catch (error) {
      console.error('更新信息失败：', error);
      alert('信息更新失败');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>个人信息</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="手机"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          fullWidth
          required
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
          label="新密码"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary" fullWidth>更新信息</Button>
        </Box>
      </form>
    </Container>
  );
};

export default UserHome;
