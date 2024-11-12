const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const authenticate = require('../middleware/authenticate');
const roleCheck = require('../middleware/role');

// 公告管理员和admin可以创建公告
router.post('/', authenticate, roleCheck(['notice_admin', 'admin']), noticeController.createNotice);

// 公告管理员获取所有公告（包括归档）
router.get('/all', authenticate, roleCheck(['notice_admin']), noticeController.getAllNotices);

// 普通用户获取未读公告
router.get('/unread', authenticate, noticeController.getUnreadNotices);

// 普通用户标记公告为已读
router.post('/:id/read', authenticate, noticeController.markNoticeAsRead);

// 普通用户获取所有未归档公告（带 isRead）
router.get('/', authenticate, noticeController.getNotices);

module.exports = router;
