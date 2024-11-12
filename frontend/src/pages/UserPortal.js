import React, { useState } from 'react';
import { Container, Tabs, Tab, Box, Typography, Button, AppBar, Toolbar, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Profile from '../components/Profile';
import Dashboard from '../components/Dashboard';
import { useAuth } from '../contexts/AuthContext';

function UserPortal() {
    const [tabIndex, setTabIndex] = useState(0);
    const { logout, currentUser } = useAuth();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 判断是否为小屏幕

    console.log("UserPortal - Current User:", currentUser);

    const displayName = currentUser?.displayName || currentUser?.username || "用户";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return '早上好';
        if (hour < 18) return '下午好';
        return '晚上好';
    };

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Container 
            maxWidth={false}  // 设置全宽度
            sx={{
                maxWidth: isMobile ? '100%' : '1440px',  // 限制最大宽度，仅在桌面端应用
                px: isMobile ? 0.1 : 3,  // 移动端更小的左右边距
                mt: 2
            }}
        >
            <AppBar position="static" color="primary">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {`${getGreeting()}, ${displayName}`}
                    </Typography>
                    <Button color="inherit" onClick={logout}>
                        退出
                    </Button>
                </Toolbar>
            </AppBar>

            <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                centered
                sx={{
                    mt: 2,
                    mb: 3,
                    '& .MuiTab-root': {
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: '#555',
                        transition: 'color 0.3s',
                        '&:hover': {
                            color: theme => theme.palette.primary.main,
                        },
                    },
                    '& .Mui-selected': {
                        color: theme => theme.palette.primary.dark,
                    },
                    '& .MuiTabs-indicator': {
                        backgroundColor: theme => theme.palette.primary.dark,
                        height: '3px',
                    },
                }}
            >
                <Tab label="工作台" />
                <Tab label="聊天窗口" />
                <Tab label="通讯录" />
                <Tab label="我" />
            </Tabs>

            <TabPanel value={tabIndex} index={0}>
                <Dashboard />
            </TabPanel>
            <TabPanel value={tabIndex} index={1}>
                <Typography variant="h6">聊天窗口 - 开发中</Typography>
            </TabPanel>
            <TabPanel value={tabIndex} index={2}>
                <Typography variant="h6">通讯录 - 开发中</Typography>
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

export default UserPortal;
