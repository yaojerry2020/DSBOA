import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import api from '../api';

const UserBulkUpload = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv') {
        setSnackbar({ open: true, message: '请上传CSV格式的文件。', severity: 'error' });
        return;
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        setSnackbar({ open: true, message: '文件大小不能超过5MB。', severity: 'error' });
        return;
      }
      setFile(selectedFile);
      setSnackbar({ open: false, message: '', severity: 'success' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setSnackbar({ open: true, message: '请先选择一个CSV文件。', severity: 'error' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setSnackbar({ open: false, message: '', severity: 'success' });

    try {
      const response = await api.post('/admin/users/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSnackbar({ open: true, message: response.data.message || '导入成功！', severity: 'success' });
      setFile(null);

      if (onSuccess) {
        onSuccess(); // 通知父组件刷新用户列表
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || '导入失败，请重试。';
      setSnackbar({ open: true, message: msg, severity: 'error' });
      if (error.response?.data?.errors) {
        console.error('导入错误详情:', error.response.data.errors);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        批量上传用户
      </Typography>
      <input
        accept=".csv"
        style={{ display: 'none' }}
        id="user-bulk-upload-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="user-bulk-upload-file">
        <Button variant="contained" component="span" startIcon={<UploadFileIcon />}>
          选择CSV文件
        </Button>
      </label>
      {file && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          选中的文件: {file.name}
        </Typography>
      )}
      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={uploading || !file}
        >
          {uploading ? <CircularProgress size={24} /> : '上传并导入'}
        </Button>
      </Box>
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

export default UserBulkUpload;
