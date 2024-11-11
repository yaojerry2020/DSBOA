const { Notice, NoticeReadStatus } = require('../models');

// 创建公告
exports.createNotice = async (req, res) => {
    try {
        const notice = await Notice.create({
            title: req.body.title,
            content: req.body.content
        });
        res.status(201).json(notice);
    } catch (error) {
        res.status(500).json({ message: '公告创建失败', error });
    }
};

// 获取所有未归档公告（普通用户访问）
exports.getPublishedNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll({ where: { archived: false }, order: [['publishedAt', 'DESC']] });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: '无法获取公告', error });
    }
};

// 获取所有公告（公告管理员和admin访问，包括归档的公告）
exports.getAllNotices = async (req, res) => {
    try {
        // 如果是公告管理员，过滤掉未归档公告的修改和删除权限
        const notices = await Notice.findAll({ order: [['publishedAt', 'DESC']] });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: '无法获取公告', error });
    }
};

// 编辑公告（仅允许非归档公告编辑）
exports.editNotice = async (req, res) => {
    try {
        const notice = await Notice.findByPk(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: '公告未找到' });
        }

        // 如果公告已归档且不是admin，拒绝编辑
        if (notice.archived && req.user.roles.includes('notice_admin') && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: '归档公告无法编辑，权限不足' });
        }

        await notice.update({
            title: req.body.title,
            content: req.body.content
        });
        res.json(notice);
    } catch (error) {
        res.status(500).json({ message: '公告更新失败', error });
    }
};

// 删除公告（公告管理员只能删除未归档公告，admin可以删除所有公告）
exports.deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findByPk(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: '公告未找到' });
        }

        // 如果公告已归档且用户不是 admin，拒绝删除
        if (notice.archived && !req.user.roles.includes('admin')) {
            return res.status(403).json({ message: '只有管理员可以删除已归档公告' });
        }

        await notice.destroy();
        res.json({ message: '公告已删除' });
    } catch (error) {
        res.status(500).json({ message: '公告删除失败', error });
    }
};

// 归档公告
exports.archiveNotice = async (req, res) => {
    try {
        const notice = await Notice.findByPk(req.params.id);
        if (!notice) {
            return res.status(404).json({ message: '公告未找到' });
        }

        await notice.update({ archived: true });
        res.json(notice);
    } catch (error) {
        res.status(500).json({ message: '公告归档失败', error });
    }
};

// 标记公告为已读
exports.markAsRead = async (req, res) => {
    try {
        await NoticeReadStatus.create({ userId: req.user.id, noticeId: req.params.id });
        res.json({ message: '公告已标记为已读' });
    } catch (error) {
        res.status(500).json({ message: '标记已读失败', error });
    }
};
