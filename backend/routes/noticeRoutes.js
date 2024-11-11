const express = require('express');
const router = express.Router();
const noticeController = require('../controllers/noticeController');
const authenticate = require('../middleware/authenticate');
const roleCheck = require('../middleware/role');

// 公告管理员和admin都可以创建公告
router.post('/', authenticate, roleCheck(['notice_admin', 'admin']), noticeController.createNotice);

// 普通用户获取未归档公告
router.get('/', authenticate, noticeController.getPublishedNotices);

// 公告管理员和admin获取所有公告（包括归档）
router.get('/all', authenticate, roleCheck(['notice_admin', 'admin']), noticeController.getAllNotices);

// 公告管理员和admin可以编辑公告，但公告管理员不能编辑归档公告
router.put('/:id', authenticate, roleCheck(['notice_admin', 'admin']), noticeController.editNotice);

// 删除公告：公告管理员只能删除未归档公告，admin可以删除所有公告
router.delete('/:id', authenticate, roleCheck(['notice_admin', 'admin']), noticeController.deleteNotice);

// 归档公告
router.patch('/:id/archive', authenticate, roleCheck(['notice_admin', 'admin']), noticeController.archiveNotice);

// 标记公告为已读
router.post('/:id/read', authenticate, noticeController.markAsRead);

module.exports = router;
