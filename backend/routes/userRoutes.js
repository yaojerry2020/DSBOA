// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticate'); // 添加身份验证中间件
const { getUserProfile, updateUserProfile, uploadAvatar } = require('../controllers/userProfileController'); // 导入上传头像控制器

// 普通用户查看和更新个人信息
router.get('/profile', authenticateToken, getUserProfile);
router.put('/profile', authenticateToken, updateUserProfile);

// 上传头像
router.post('/avatar', authenticateToken, uploadAvatar);

module.exports = router;
