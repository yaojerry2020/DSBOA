// src/components/RoleManagement.js

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Typography,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import api from '../api'; // 确保导入 axios 实例
// 移除了 useNavigate 的导入

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState({ name: '', description: '' });
  const [editing, setEditing] = useState(false);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // 移除了 navigate 的声明

  const fetchRoles = async () => {
    try {
      const response = await api.get('/admin/roles'); // 使用 axios 实例
      setRoles(response.data);
    } catch (error) {
      console.error('获取角色数据失败:', error.response ? error.response.data : error.message);
      setSnackbar({ open: true, message: '获取角色数据失败。', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpen = (role = {}) => {
    setCurrentRole(role);
    setEditing(!!role.id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRole({ name: '', description: '' });
    setEditing(false);
  };

  const handleChange = (e) => {
    setCurrentRole({ ...currentRole, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editing ? 'put' : 'post';
    const url = editing ? `/admin/roles/${currentRole.id}` : '/admin/roles';
    
    try {
      await api({
        method,
        url,
        data: currentRole,
      });

      handleClose();
      fetchRoles();
      setSnackbar({ open: true, message: editing ? '角色更新成功。' : '角色创建成功。', severity: 'success' });
    } catch (error) {
      console.error('提交角色数据失败:', error.response ? error.response.data : error.message);
      setSnackbar({ open: true, message: error.response?.data?.message || '提交角色数据失败。', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/roles/${id}`);
      setRoles(roles.filter(role => role.id !== id));
      setSnackbar({ open: true, message: '角色已删除。', severity: 'success' });
    } catch (error) {
      console.error('删除角色失败:', error.response ? error.response.data : error.message);
      setSnackbar({ open: true, message: error.response?.data?.message || '删除角色失败。', severity: 'error' });
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        新增角色
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>角色名</TableCell>{/* */}
              <TableCell>描述</TableCell>{/* */}
              <TableCell>操作</TableCell>{/* */}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.length > 0 ? (
              roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>{/* */}
                  <TableCell>{role.description || '无'}</TableCell>{/* */}
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleOpen(role)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      onClick={() => handleDelete(role.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">暂无角色数据。</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            {editing ? '编辑角色' : '新增角色'}
          </Typography>
          <TextField
            name="name"
            label="角色名"
            value={currentRole.name}
            onChange={handleChange}
            fullWidth
            required
            sx={{ marginTop: 2 }}
          />
          <TextField
            name="description"
            label="描述"
            value={currentRole.description}
            onChange={handleChange}
            fullWidth
            sx={{ marginTop: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
            {editing ? '保存' : '创建'}
          </Button>
        </Box>
      </Modal>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RoleManagement;
