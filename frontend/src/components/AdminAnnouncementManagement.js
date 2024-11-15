// src/components/AdminAnnouncementManagement.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button
} from '@mui/material';
import { Archive, Unarchive, Delete } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const AdminAnnouncementManagement = () => {
  const { token, currentUser } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!token || !currentUser || !currentUser.roles.includes('admin')) {
      console.warn('用户认证无效，重定向到登录');
      navigate('/login');
      return;
    }
    fetchAnnouncements();
  }, [token, currentUser, navigate]);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/admin/notices/all');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('获取公告失败:', error);
    }
  };

  const toggleArchive = async (id, archived) => {
    try {
      const response = await api.put(`/admin/notices/${id}/toggle-archive`, { archived: !archived });
      console.log('公告归档状态更新:', response.data);
      fetchAnnouncements(); // 更新列表
    } catch (error) {
      console.error('更新公告归档状态失败:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/admin/notices/${id}`);
      console.log('公告已删除');
      fetchAnnouncements(); // 更新列表
    } catch (error) {
      console.error('删除公告失败:', error);
    }
  };

  // 修复 handleExport 函数
  const handleExport = () => {
    try {
      const csvContent = announcements
        .map((announcement) =>
          [announcement.title, announcement.content, new Date(announcement.publishedAt).toLocaleString(), announcement.archived ? '已归档' : '活跃']
            .join(',')
        )
        .join('\n');
      const blob = new Blob([`标题,内容,发布时间,状态\n${csvContent}`], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'announcements.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('公告已导出');
    } catch (error) {
      console.error('导出公告失败:', error);
    }
  };

  return (
    <Box>
      <Button variant="contained" color="primary" onClick={handleExport}>
        导出公告
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>标题</TableCell>
              <TableCell>内容</TableCell>
              <TableCell>发布时间</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>{announcement.title}</TableCell>
                <TableCell>{announcement.content}</TableCell>
                <TableCell>{new Date(announcement.publishedAt).toLocaleString()}</TableCell>
                <TableCell>{announcement.archived ? '已归档' : '活跃'}</TableCell>
                <TableCell>
                  <IconButton
                    color={announcement.archived ? 'default' : 'primary'}
                    onClick={() => toggleArchive(announcement.id, announcement.archived)}
                  >
                    {announcement.archived ? <Unarchive /> : <Archive />}
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(announcement.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminAnnouncementManagement;
