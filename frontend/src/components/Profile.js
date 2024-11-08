// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import api, { uploadAvatar } from '../api/api';

function Profile() {
    const [profile, setProfile] = useState({
        username: '',
        displayName: '',
        email: '',
        phone: '',
        avatar: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get('/user/profile');
                setProfile(response.data);
            } catch (error) {
                console.error("获取用户信息失败", error);
            }
        }
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAvatarUpload = async () => {
        if (!file) return alert("请选择一个文件");

        try {
            const data = await uploadAvatar(file);
            setProfile((prevProfile) => ({ ...prevProfile, avatar: data.avatar }));
            alert("头像上传成功！");
        } catch (error) {
            console.error("头像上传失败", error);
            alert("头像上传失败");
        }
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setPassword('');
        setConfirmPassword('');
        setPasswordError('');
    };

    const handleSave = async () => {
        if (password && password !== confirmPassword) {
            setPasswordError('密码不一致，请重新输入');
            return;
        }

        try {
            await api.put('/user/profile', {
                email: profile.email,
                phone: profile.phone,
                password: password || undefined,
            });
            setEditMode(false);
        } catch (error) {
            console.error("保存用户信息失败", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" gutterBottom>个人信息</Typography>
            <Box>
                {/* 头像显示和上传 */}
                <img
                    src={profile.avatar ? `${process.env.REACT_APP_API_URL}${profile.avatar}` : '默认头像路径'}
                    alt="头像"
                    style={{ width: '100px', height: '100px', borderRadius: '50%' }}
                />
                {editMode && (
                    <>
                        <input type="file" onChange={handleFileChange} />
                        <Button variant="contained" color="primary" onClick={handleAvatarUpload}>
                            上传头像
                        </Button>
                    </>
                )}

                <TextField
                    label="用户名"
                    value={profile.username || ''}
                    margin="normal"
                    fullWidth
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    label="显示名"
                    value={profile.displayName || ''}
                    margin="normal"
                    fullWidth
                    InputProps={{ readOnly: true }}
                />
                <TextField
                    label="邮箱"
                    name="email"
                    value={profile.email || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    fullWidth
                    InputProps={{ readOnly: !editMode }}
                />
                <TextField
                    label="电话"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleInputChange}
                    margin="normal"
                    fullWidth
                    InputProps={{ readOnly: !editMode }}
                />
                {editMode && (
                    <>
                        <TextField
                            label="新密码"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            fullWidth
                        />
                        <TextField
                            label="确认新密码"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            margin="normal"
                            fullWidth
                            error={!!passwordError}
                            helperText={passwordError}
                        />
                    </>
                )}
                {editMode ? (
                    <Box display="flex" justifyContent="space-between" mt={2}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            保存修改
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={() => setEditMode(false)}>
                            返回
                        </Button>
                    </Box>
                ) : (
                    <Button variant="contained" color="primary" onClick={toggleEditMode} fullWidth>
                        修改个人信息
                    </Button>
                )}
            </Box>
        </Container>
    );
}

export default Profile;
