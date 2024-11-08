// src/components/EditUser.js

import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField, Button, Paper, Typography, CircularProgress,
  FormControl, InputLabel, Select, OutlinedInput, Checkbox, MenuItem, ListItemText
} from '@mui/material';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 获取用户ID
  const [user, setUser] = useState({
    username: '', displayName: '', phone: '', email: '', departmentIds: [], roleIds: [], password: ''
  });
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [departmentsResponse, rolesResponse, userResponse] = await Promise.all([
          api.get('/admin/departments'),
          api.get('/admin/roles'),
          api.get(`/admin/users/${id}`)
        ]);
        setDepartments(departmentsResponse.data);
        setRoles(rolesResponse.data);
        setUser({
          ...userResponse.data,
          departmentIds: userResponse.data.departments.map(dep => dep.id),
          roleIds: userResponse.data.roles.map(role => role.id),
          password: ''
        });
        setLoading(false);
      } catch (err) {
        setError('获取数据失败');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeMultiple = (e, name) => {
    setUser({ ...user, [name]: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        ...user,
        roles: Array.isArray(user.roleIds) ? user.roleIds : [],
        departments: Array.isArray(user.departmentIds) ? user.departmentIds : [],
      };

      await api.put(`/admin/users/${id}`, updateData);
      navigate('/admin/users');
    } catch (error) {
      console.error('更新用户失败:', error);
      setError('更新用户失败，请检查数据格式');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h5">编辑用户</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="用户名"
          name="username"
          value={user.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="显示名"
          name="displayName"
          value={user.displayName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="电话"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="邮箱"
          name="email"
          value={user.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="密码"
          name="password"
          type="password"
          value={user.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          helperText="如果不更改密码，请保持为空"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>部门</InputLabel>
          <Select
            multiple
            value={user.departmentIds}
            onChange={(e) => handleChangeMultiple(e, 'departmentIds')}
            input={<OutlinedInput />}
            renderValue={(selected) => selected.map(id => departments.find(dep => dep.id === id)?.name).join(', ')}
          >
            {departments.map((department) => (
              <MenuItem key={department.id} value={department.id}>
                <Checkbox checked={user.departmentIds.includes(department.id)} />
                <ListItemText primary={department.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>角色</InputLabel>
          <Select
            multiple
            value={user.roleIds}
            onChange={(e) => handleChangeMultiple(e, 'roleIds')}
            input={<OutlinedInput />}
            renderValue={(selected) => selected.map(id => roles.find(role => role.id === id)?.name).join(', ')}
          >
            {roles.map((role) => (
              <MenuItem key={role.id} value={role.id}>
                <Checkbox checked={user.roleIds.includes(role.id)} />
                <ListItemText primary={role.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          保存修改
        </Button>
      </form>
    </Paper>
  );
};

export default EditUser;
