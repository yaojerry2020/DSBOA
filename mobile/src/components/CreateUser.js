// src/components/CreateUser.js
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import {
  TextField, Button, Paper, Typography, CircularProgress,
  FormControl, InputLabel, Select, OutlinedInput, Checkbox, MenuItem, ListItemText
} from '@mui/material';

const CreateUser = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '', displayName: '', phone: '', email: '', departmentIds: [], roleIds: [], password: ''
  });
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [departmentsResponse, rolesResponse] = await Promise.all([
        api.get('/admin/departments'), api.get('/admin/roles')
      ]);
      setDepartments(departmentsResponse.data);
      setRoles(rolesResponse.data);
      setLoading(false);
    } catch (err) {
      setError('获取数据失败');
      setLoading(false);
    }
  };

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
      await api.post('/admin/users', {
        ...user,
        roles: user.roleIds,
        departments: user.departmentIds
      });
      navigate('/admin/users');
    } catch {
      setError('创建用户失败');
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Paper style={{ padding: 20 }}>
      <Typography variant="h5">创建用户</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField label="用户名" name="username" value={user.username} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="显示名" name="displayName" value={user.displayName} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="电话" name="phone" value={user.phone} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="邮箱" name="email" value={user.email} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="密码" name="password" type="password" value={user.password} onChange={handleChange} fullWidth margin="normal" />

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
          创建
        </Button>
      </form>
    </Paper>
  );
};

export default CreateUser;
