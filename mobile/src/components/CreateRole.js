// src/components/CreateRole.js

import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, Typography, Box, Alert
} from '@mui/material';

const CreateRole = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roleName.trim()) {
      setErrorMsg('角色名称不能为空。');
      return;
    }

    try {
      const payload = { name: roleName.trim() };
      const response = await api.post('/admin/roles', payload);
      setSuccessMsg(response.data.message || '角色创建成功。');
      setRoleName('');
      navigate('/admin/roles');
    } catch (error) {
      console.error('创建角色失败:', error.response ? error.response.data : error.message);
      setErrorMsg(error.response?.data?.message || '创建角色失败。');
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>创建新角色</Typography>
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
            创建角色
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CreateRole;
