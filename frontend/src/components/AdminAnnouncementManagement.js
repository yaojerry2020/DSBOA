import React, { useEffect, useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button } from '@mui/material';
import { Archive, Unarchive, Delete } from '@mui/icons-material';
import api from '../api';

const AdminAnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      const response = await api.get('/admin/notices/all');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('获取公告失败:', error);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const toggleArchive = async (id, archived) => {
    try {
      await api.put(`/admin/notices/${id}`, { archived: !archived });
      setAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === id ? { ...announcement, archived: !archived } : announcement
        )
      );
    } catch (error) {
      console.error('切换公告归档状态失败:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除此公告吗？')) return;

    try {
      await api.delete(`/admin/notices/${id}`);
      setAnnouncements(announcements.filter((announcement) => announcement.id !== id));
    } catch (error) {
      console.error('删除公告失败:', error);
    }
  };

  // 导出公告为 CSV
  const handleExport = async () => {
    try {
      const response = await api.get('/admin/notices/export', {
        responseType: 'blob', // 确保接收文件数据
      });
      
      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'announcements.csv'); // 指定下载文件的文件名
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link); // 下载后移除链接
    } catch (error) {
      console.error('公告导出失败:', error);
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
