const { Notice, User, UserNotice, Role, Notification } = require('../models');
const { Parser } = require('json2csv');


// 创建公告，并为每个用户创建未读通知记录
// 创建公告，并为每个用户创建未读通知记录
exports.createNotice = async (req, res) => {
    try {
        const notice = await Notice.create({
            title: req.body.title,
            content: req.body.content
        });

        const users = await User.findAll({
            include: {
                model: Role,
                as: 'roles',
                where: { name: 'user' },
                through: { attributes: [] }
            }
        });

        const userNotices = users.map(user => ({
            userId: user.id,
            noticeId: notice.id,
            isRead: false
        }));

        await UserNotice.bulkCreate(userNotices);

        // 为每个用户创建一条通知
        const notifications = users.map(user => ({
            userId: user.id,
            type: '公告',
            title: '新公告发布',
            content: `公告标题: ${notice.title}`,
            isRead: false
        }));
        
        await Notification.bulkCreate(notifications);

        res.status(201).json(notice);
    } catch (error) {
        console.error('创建公告时出错:', error);
        res.status(500).json({ message: '公告创建失败', error });
    }
};

// 切换公告的归档状态
exports.updateNoticeArchiveStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { archived } = req.body;

        const notice = await Notice.findByPk(id);
        if (!notice) {
            return res.status(404).json({ message: '公告未找到' });
        }

        notice.archived = archived;
        await notice.save();

        res.status(200).json({ message: '公告归档状态已更新', notice });
    } catch (error) {
        console.error('更新公告归档状态时出错:', error);
        res.status(500).json({ message: '更新公告归档状态失败', error });
    }
};

// 获取用户的所有未读公告
exports.getUnreadNotices = async (req, res) => {
    try {
        const unreadNotices = await UserNotice.findAll({
            where: { userId: req.user.id, isRead: false },
            include: [{ model: Notice, as: 'notice' }] // 添加 as 别名
        });
        res.json(unreadNotices);
    } catch (error) {
        console.error("获取未读公告时出错:", error);
        res.status(500).json({ message: '获取未读公告失败', error });
    }
};

// 标记公告为已读
exports.markNoticeAsRead = async (req, res) => {
    try {
        const userNotice = await UserNotice.findOne({
            where: { userId: req.user.id, noticeId: req.params.id }
        });
        
        if (!userNotice) return res.status(404).json({ message: '未找到此公告通知' });

        userNotice.isRead = true;
        userNotice.readAt = new Date();
        await userNotice.save();

        res.json({ message: '公告已标记为已读' });
    } catch (error) {
        res.status(500).json({ message: '标记已读失败', error });
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

// 获取当前用户所有未归档公告，并标记已读状态
exports.getNotices = async (req, res) => {
    try {
        console.log("用户ID:", req.user.id); // 调试日志：用户ID

        // 查询所有未归档公告，关联当前用户的未读记录
        const notices = await Notice.findAll({
            where: { archived: false }, // 只获取未归档的公告
            include: [{
                model: UserNotice,
                as: 'userNotices',  // 确保与 Notice.js 中的关联别名一致
                where: { userId: req.user.id },
                required: false // 包括没有关联的公告
            }],
            order: [['publishedAt', 'DESC']]
        });

        // 打印调试日志：查询到的公告数据
        console.log("查询到的公告数据:", JSON.stringify(notices, null, 2));

        // 格式化公告数据，标记当前用户是否已读
        const formattedNotices = notices.map(notice => {
            // 检查每条公告的关联数据
            const isRead = notice.userNotices && notice.userNotices.length > 0 ? notice.userNotices[0].isRead : false;

            // 打印调试日志：每条公告的ID和是否已读状态
            console.log(`公告ID: ${notice.id}, isRead状态: ${isRead}`);

            return {
                id: notice.id,
                title: notice.title,
                content: notice.content,
                publishedAt: notice.publishedAt,
                archived: notice.archived,
                createdAt: notice.createdAt,
                updatedAt: notice.updatedAt,
                isRead: isRead
            };
        });

        // 打印格式化后的公告数据
        console.log("格式化后的公告数据:", JSON.stringify(formattedNotices, null, 2));

        res.json(formattedNotices);
    } catch (error) {
        console.error("获取公告时出错:", error);
        res.status(500).json({ message: '获取公告失败', error });
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


// 导出公告为 CSV
exports.exportNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll();
        const fields = ['id', 'title', 'content', 'publishedAt', 'archived'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(notices);

        // 设置响应头，确保文件作为附件下载
        res.header('Content-Type', 'text/csv');
        res.header('Content-Disposition', 'attachment; filename="notices.csv"');
        res.send(csv);
    } catch (error) {
        console.error('导出公告错误:', error);
        res.status(500).json({ message: '导出公告失败', error });
    }
};
