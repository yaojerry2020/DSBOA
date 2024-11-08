// src/components/DepartmentManagement.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, IconButton,
  Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Typography
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  // State for delete confirmation dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDeptId, setSelectedDeptId] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await api.get('/admin/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('获取部门列表失败:', error.response ? error.response.data : error.message);
      // 可选：显示错误提示给用户
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedDeptId(id);
    setOpenDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await api.delete(`/admin/departments/${selectedDeptId}`);
      setDepartments(departments.filter(dept => dept.id !== selectedDeptId));
      setOpenDialog(false);
      alert('部门已删除。');
    } catch (error) {
      console.error('删除部门失败:', error.response ? error.response.data : error.message);
      alert(error.response?.data?.message || '删除部门失败。');
      setOpenDialog(false);
    }
  };

  const handleDeleteCancel = () => {
    setOpenDialog(false);
    setSelectedDeptId(null);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>部门管理</Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/admin/departments/create')} 
        style={{ marginBottom: '20px' }}
      >
        创建新部门
      </Button>
      <TableContainer component={Paper}>
        <Table aria-label="部门表">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>{/* 添加ID列 */}
              <TableCell>部门名称</TableCell>{/* */}
              <TableCell>父部门</TableCell>{/* */}
              <TableCell align="right">操作</TableCell>{/* */}
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.length > 0 ? (
              departments.map(dept => (
                <TableRow key={dept.id}>
                  <TableCell>{dept.id}</TableCell>{/* */}
                  <TableCell>{dept.name}</TableCell>{/* */}
                  <TableCell>{dept.parentDepartment ? dept.parentDepartment.name : '无'}</TableCell>{/* */}
                  <TableCell align="right">
                    <IconButton 
                      color="primary" 
                      onClick={() => navigate(`/admin/departments/edit/${dept.id}`)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="secondary" 
                      onClick={() => handleDeleteClick(dept.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">暂无部门数据。</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 删除确认对话框 */}
      <Dialog
        open={openDialog}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            你确定要删除这个部门吗？此操作无法撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            取消
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DepartmentManagement;
