// src/components/BulkUploadUsers.js

import React, { useState } from 'react';
import {
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';

const BulkUploadUsers = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMsg('请先选择一个CSV文件。');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await axios.post('/api/admin/users/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMsg(response.data.message || '导入成功！');
      setFile(null);

      if (onSuccess) {
        onSuccess(); // 通知父组件刷新用户列表
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || '导入失败，请重试。';
      setErrorMsg(msg);
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
        id="bulk-upload-users-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="bulk-upload-users-file">
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
      {successMsg && (
        <Alert severity="success" sx={{ mt: 2 }}>
          {successMsg}
        </Alert>
      )}
      {errorMsg && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMsg}
        </Alert>
      )}
    </Box>
  );
};

export default BulkUploadUsers;
