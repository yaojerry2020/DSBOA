// routes/notification.js

'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const notificationController = require('../controllers/notificationController');

const auth = require('../middleware/auth');
const permissionCheck = require('../middleware/permission');

/**
 * 通知路由
 */

// 发送通知给驾驶员
router.post('/send',
  auth,
  permissionCheck(['receive_notifications']),
  [
    body('driverId').isInt().withMessage('驾驶员ID必须是整数。'),
    body('message').notEmpty().withMessage('消息不能为空。'),
  ],
  notificationController.sendNotificationToDriver
);

module.exports = router;
