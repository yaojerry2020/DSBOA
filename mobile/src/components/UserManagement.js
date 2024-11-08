// src/components/UserManagement.js
import React, { useState, useEffect } from 'react';
import {
  Grid, Button, Container, Typography, IconButton, Paper, Modal, Box
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import UserBulkUpload from './UserBulkUpload';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('获取用户数据失败：', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    // 显示确认框
    const isConfirmed = window.confirm('确定要删除该用户吗？');
    if (!isConfirmed) return; // 用户点击“取消”则退出

    try {
      await api.delete(`/admin/users/${userId}`);
      console.log(`用户 ${userId} 已删除`);
      fetchUsers(); // 重新获取用户列表
    } catch (error) {
      console.error(`删除用户 ${userId} 失败：`, error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>用户管理</Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/admin/users/create')}>新增用户</Button>
      <Button variant="contained" color="secondary" onClick={() => setBulkUploadOpen(true)} sx={{ ml: 2 }}>批量上传用户</Button>
      
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} key={user.id}>
            <Paper sx={{ padding: 2 }}>
              <Typography variant="h6">{user.displayName || user.username}</Typography>
              <Typography>用户名: {user.username}</Typography>
              <Typography>邮箱: {user.email}</Typography>
              <Typography>电话: {user.phone}</Typography>
              <Typography>部门: {user.departments ? user.departments.map(dep => dep.name).join(', ') : '无'}</Typography>
              <IconButton color="primary" onClick={() => navigate(`/admin/users/edit/${user.id}`)}><Edit /></IconButton>
              <IconButton color="secondary" onClick={() => handleDeleteUser(user.id)}><Delete /></IconButton>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Modal open={bulkUploadOpen} onClose={() => setBulkUploadOpen(false)}>
        <Box sx={{ ...modalStyle }}>
          <UserBulkUpload onSuccess={() => { setBulkUploadOpen(false); fetchUsers(); }} />
        </Box>
      </Modal>
    </Container>
  );
};

const modalStyle = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: '90%',
  maxWidth: 400,
  bgcolor: 'background.paper', boxShadow: 24, p: 4,
};

export default UserManagement;
