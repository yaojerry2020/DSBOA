//backend/routes/notificationRoutes.js

const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middleware/authenticate');

// 创建通知
router.post('/', authenticate, notificationController.createNotification);

// 获取用户的所有通知
router.get('/', authenticate, notificationController.getUserNotifications);

// 标记通知为已读
router.post('/:id/read', authenticate, notificationController.markNotificationAsRead);

// 获取未读通知数量
router.get('/unread/count', authenticate, notificationController.getUnreadNotificationCount);

module.exports = router;
