// src/components/CreateDepartment.js

import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 使用 named import
//import AuthContext from '../contexts/AuthContext';
import {
  TextField, Button, Paper, Typography,
  Grid, FormControl, InputLabel, Select, MenuItem, Alert, CircularProgress
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

const CreateDepartment = () => {
  const { user } = useAuth();// 获取用户信息
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [parentId, setParentId] = useState(null); // 初始化为 null
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) { // 确保用户已加载
      const fetchDepartments = async () => {
        try {
          const response = await api.get('/admin/departments');
          setDepartments(response.data);
          setLoading(false);
          console.log('获取部门列表成功:', response.data);
        } catch (error) {
          console.error('获取部门列表失败:', error.response ? error.response.data : error.message);
          setError('获取部门列表失败。');
          setLoading(false);
        }
      };
      fetchDepartments();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { name, parentId: parentId }; // parentId 已为 null 或整数
      console.log('发送创建部门请求:', payload);
      await api.post('/admin/departments', payload);
      alert('部门创建成功。');
      navigate('/admin/departments');
    } catch (error) {
      console.error('创建部门失败:', error.response ? error.response.data : error.message);
      setError(error.response?.data?.message || '创建部门失败。');
      // 如果后端返回 401/403，前端的 Axios 拦截器可能会处理跳转到登录
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
    <Paper style={{ padding: '20px', margin: '20px' }}>
      <Typography variant="h5" gutterBottom>创建新部门</Typography>
      {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* 部门名称 */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="部门名称"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
                value={parentId}
                name="parentId"
                onChange={(e) => setParentId(e.target.value ? parseInt(e.target.value) : null)} // 设置为 null
              >
                <MenuItem value={null}>
                  <em>无</em>
                </MenuItem>
                {renderDepartmentOptions(departments)}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <div style={{ marginTop: '20px' }}>
          <Button type="submit" variant="contained" color="primary">
            创建
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => navigate('/admin/departments')}
            style={{ marginLeft: '10px' }}
          >
            取消
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default CreateDepartment;
