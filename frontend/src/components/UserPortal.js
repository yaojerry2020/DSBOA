// src/pages/UserPortal.js
import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography, Button, TextField } from '@mui/material';

function UserPortal() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="聊天窗口" />
                <Tab label="通讯录" />
                <Tab label="工作台" />
                <Tab label="我" />
            </Tabs>

            <TabPanel value={tabIndex} index={0}>
                <Typography variant="h6">开发中</Typography>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <Typography variant="h6">通讯录 - 开发中</Typography>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <Typography variant="h6">工作台 - 开发中</Typography>
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
                <Profile />
            </TabPanel>
        </Container>
    );
}

function TabPanel({ children, value, index }) {
    return (
        <Box role="tabpanel" hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </Box>
    );
}

function Profile() {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("更新个人信息:", { email, phone, password });
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>个人信息修改</Typography>
            <TextField label="邮箱" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="手机" fullWidth margin="normal" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <TextField label="密码" fullWidth margin="normal" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>保存修改</Button>
        </Box>
    );
}

export default UserPortal;
