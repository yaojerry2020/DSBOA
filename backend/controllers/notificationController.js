// controllers/notificationController.js

'use strict';

const { User } = require('../models');

/**
 * 发送通知给驾驶员
 */
exports.sendNotificationToDriver = async (req, res) => {
  const { driverId, message } = req.body;

  if (!driverId || !message) {
    return res.status(400).json({ message: '驾驶员ID和消息不能为空。' });
  }

  try {
    const driver = await User.findByPk(driverId, {
      include: [{ model: Role, as: 'role' }],
    });

    if (!driver || driver.role.name !== 'driver') {
      return res.status(404).json({ message: '驾驶员未找到。' });
    }

    // 这里添加发送通知的逻辑，例如通过Socket.io或邮件
    // 示例: console.log(`发送给驾驶员 ${driver.username}: ${message}`);

    return res.status(200).json({ message: '通知已发送给驾驶员。' });
  } catch (error) {
    console.error('发送通知错误:', error);
    return res.status(500).json({ message: '内部服务器错误。' });
  }
};
