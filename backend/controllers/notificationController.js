// backend/controllers/notificationController.js

const { Notification } = require('../models');

// 创建通知
exports.createNotification = async (req, res) => {
    try {
        const { userId, type, title, content } = req.body;
        const notification = await Notification.create({ userId, type, title, content });
        res.status(201).json(notification);
    } catch (error) {
        console.error('创建通知失败:', error);
        res.status(500).json({ message: '创建通知失败', error });
    }
};

// 获取用户的所有通知
exports.getUserNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
        });
        res.json(notifications);
    } catch (error) {
        console.error('获取通知失败:', error);
        res.status(500).json({ message: '获取通知失败', error });
    }
};

// 标记通知为已读
exports.markNotificationAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOne({ where: { id, userId: req.user.id } });
        if (!notification) return res.status(404).json({ message: '通知未找到' });

        notification.isRead = true;
        await notification.save();

        res.json({ message: '通知已标记为已读' });
    } catch (error) {
        console.error('标记通知失败:', error);
        res.status(500).json({ message: '标记通知失败', error });
    }
};

// 获取未读通知数量
exports.getUnreadNotificationCount = async (req, res) => {
    try {
        const count = await Notification.count({
            where: { userId: req.user.id, isRead: false },
        });
        res.json({ unreadCount: count });
    } catch (error) {
        console.error('获取未读通知数量失败:', error);
        res.status(500).json({ message: '获取未读通知数量失败', error });
    }
};
