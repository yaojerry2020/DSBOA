// src/pages/UserPortal.js
import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography, Button, AppBar, Toolbar } from '@mui/material';
import Profile from '../components/Profile'; // 引用单独的 Profile 组件
import { useAuth } from '../contexts/AuthContext';

function UserPortal() {
    const [tabIndex, setTabIndex] = useState(0);
    const { logout } = useAuth();

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    const handleLogout = () => {
        logout(); // 执行退出操作
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {/* 顶部导航栏 */}
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        用户门户
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        退出
                    </Button>
                </Toolbar>
            </AppBar>

            {/* 标签栏 */}
            <Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ mt: 2 }}>
                <Tab label="工作台" />      {/* 将工作台放在第一个位置 */}
                <Tab label="聊天窗口" />
                <Tab label="通讯录" />
                <Tab label="我" />
            </Tabs>

            <TabPanel value={tabIndex} index={0}>
                <Typography variant="h6">工作台 - 开发中</Typography>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <Typography variant="h6">聊天窗口 - 开发中</Typography>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <Typography variant="h6">通讯录 - 开发中</Typography>
            </TabPanel>
            <TabPanel value={tabIndex} index={3}>
                <Profile /> {/* 使用单独的 Profile 组件 */}
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

export default UserPortal;
