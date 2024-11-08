// src/components/EditDepartment.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 使用 named import
//import AuthContext from '../contexts/AuthContext';
import {
  TextField, Button, Paper, Typography,
  Grid, Alert, CircularProgress, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';

/**
 * 递归函数生成带有层级缩进的部门选项
 * @param {Array} departments - 部门列表
 * @param {number} level - 当前层级，用于缩进
 * @returns {JSX.Element[]} - 渲染的菜单项数组
 */
const renderDepartmentOptions = (departments, level = 0) => {
  let options = [];
  departments.forEach(dept => {
    options.push(
      <MenuItem key={dept.id} value={dept.id}>
        {'—'.repeat(level)} {dept.id} - {dept.name}
      </MenuItem>
    );
    if (dept.subDepartments && dept.subDepartments.length > 0) {
      options = options.concat(renderDepartmentOptions(dept.subDepartments, level + 1));
    }
  });
  return options;
};

const EditDepartment = () => {
  const { user, authLoading } = useAuth(); // 获取用户信息
  const { id } = useParams(); // 获取部门ID
  const navigate = useNavigate();
  
  const [dept, setDept] = useState({
    name: '',
    parentId: '',
  });
  
  const [departments, setDepartments] = useState([]); // 存储部门列表
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) { // 确保用户已加载
      const fetchInitialData = async () => {
        try {
          // 获取部门信息
          const deptResponse = await api.get(`/admin/departments/${id}`);
          const deptData = deptResponse.data;
          
          // 获取所有部门并排除当前部门，防止循环引用
          const departmentsResponse = await api.get('/admin/departments');
          const departmentsData = departmentsResponse.data.filter(d => d.id !== parseInt(id));

          setDept({
            name: deptData.name || '',
            parentId: deptData.parentId || '',
          });
          
          setDepartments(departmentsData);
          setLoading(false);
          console.log('获取部门信息和部门列表成功。');
        } catch (err) {
          console.error('获取数据失败:', err.response ? err.response.data : err.message);
          setError(err.response?.data?.message || '获取数据失败。');
          setLoading(false);
        }
      };

      fetchInitialData();
    }
  }, [user, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDept(prevState => ({
      ...prevState,
      [name]: name === 'parentId' && value ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const updatedData = {
        name: dept.name,
        parentId: dept.parentId || null,
      };
      
      console.log(`发送更新部门 ID ${id} 的请求:`, updatedData);
      await api.put(`/admin/departments/${id}`, updatedData);
      alert('部门信息已更新。');
      navigate('/admin/departments');
    } catch (err) {
      console.error('更新部门失败:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || '更新部门失败。');
      // 如果后端返回 401/403，前端的 Axios 拦截器可能会处理跳转到登录
    }
  };

  if (loading || authLoading) { // 考虑认证加载状态
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography variant="h6">加载中...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <Paper style={{ padding: '20px', margin: '20px' }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" color="primary" onClick={() => navigate('/admin/departments')} style={{ marginTop: '20px' }}>
          返回部门管理
        </Button>
      </Paper>
    );
  }

  return (
    <Paper style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h5" gutterBottom>修改部门信息</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* 部门名称 */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="部门名称"
              name="name"
              value={dept.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          {/* 父部门 */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id="parent-dept-label">父部门</InputLabel>
              <Select
                labelId="parent-dept-label"
                label="父部门"
                name="parentId"
                value={dept.parentId}
                onChange={handleChange}
              >
                <MenuItem value="">
                  <em>无</em>
                </MenuItem>
                {renderDepartmentOptions(departments)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="contained" color="primary">
            保存修改
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => navigate('/admin/departments')} style={{ marginLeft: '10px' }}>
            取消
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default EditDepartment;
