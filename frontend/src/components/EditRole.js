// src/components/EditRole.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField, Button, Typography, Box, Alert, CircularProgress
} from '@mui/material';

const EditRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [roleName, setRoleName] = useState('');
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchRole();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRole = async () => {
    try {
      const response = await api.get(`/admin/roles/${id}`);
      setRoleName(response.data.name || '');
      setLoading(false);
    } catch (error) {
      console.error('获取角色信息失败:', error.response ? error.response.data : error.message);
      setErrorMsg(error.response?.data?.message || '获取角色信息失败。');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setErrorMsg('角色名称不能为空。');
      return;
    }

    try {
      const payload = { name: roleName.trim() };
      const response = await api.put(`/admin/roles/${id}`, payload);
      setSuccessMsg(response.data.message || '角色更新成功。');
      navigate('/admin/roles');
    } catch (error) {
      console.error('更新角色失败:', error.response ? error.response.data : error.message);
      setErrorMsg(error.response?.data?.message || '更新角色失败。');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography variant="h6">加载中...</Typography>
      </div>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>编辑角色</Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: '400px' }}>
          <TextField
            label="角色名称"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
          {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
          {successMsg && <Alert severity="success">{successMsg}</Alert>}
          <Button type="submit" variant="contained" color="primary">
            保存修改
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default EditRole;
