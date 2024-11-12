import React from 'react';
import { Box, Typography, Grid, Paper, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function Dashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Container 
            maxWidth={false} // 使用全宽度
            sx={{ 
                mt: 2, 
                px: isMobile ? 0.1 : 3, // 手机端几乎没有边距
                maxWidth: isMobile ? '100%' : '1440px' // 限制最大宽度仅在桌面端
            }}
        >
            <Grid container spacing={isMobile ? 1 : 2}>
                {/* 公告栏 */}
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: isMobile ? 1 : 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            公告栏
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            在这里显示最新公告
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle1">系统维护通知</Typography>
                            <Typography variant="body2">系统将于今晚进行维护，敬请知悉。</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* 一周安排 */}
                <Grid item xs={12} sm={6}>
                    <Paper elevation={3} sx={{ p: isMobile ? 1 : 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            一周安排
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            本周重要活动和会议安排
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle1">周一：项目启动会议</Typography>
                            <Typography variant="subtitle1">周三：技术讨论会</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* 角色相关功能模块 */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: isMobile ? 1 : 2 }}>
                        <Typography variant="h6" gutterBottom>
                            我的功能模块
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            根据您的角色动态加载功能模块
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle1">公告管理员入口（示例）</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Dashboard;
