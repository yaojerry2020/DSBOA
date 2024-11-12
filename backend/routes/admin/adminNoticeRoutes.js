const express = require('express');
const router = express.Router();
const noticeController = require('../../controllers/noticeController');
const authenticate = require('../../middleware/authenticate');
const roleCheck = require('../../middleware/role');

// 使用身份验证和角色检查中间件，确保只有admin可以访问
router.use(authenticate, roleCheck(['admin']));

// 获取所有公告，包括归档公告
router.get('/all', noticeController.getAllNotices);

// 删除公告，包括已归档的公告（仅admin）
router.delete('/:id', noticeController.deleteNotice);

// 导出公告为 CSV
router.get('/export', noticeController.exportNotices);

module.exports = router;
