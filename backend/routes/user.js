// routes/user.js

const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const authenticate = require('../middleware/authenticate'); // 确保用户身份

// 获取当前登录用户的信息
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: require('../models').Role, as: 'role', attributes: ['name'] },
        { model: require('../models').Department, as: 'department', attributes: ['name'] },
      ],
    });
    if (!user) {
      return res.status(404).json({ message: '用户未找到。' });
    }
    res.json(user);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

// 更新当前登录用户的信息
router.put('/me', authenticate,
  [
    body('email').optional().isEmail().withMessage('无效的邮箱地址。'),
    body('phone').optional().notEmpty().withMessage('联系电话不能为空。'),
    body('password').optional().isLength({ min: 6 }).withMessage('密码长度至少为6个字符。'),
  ],
  async (req, res) => {
    // 验证请求体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, phone } = req.body;

    try {
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: '用户未找到。' });
      }

      // 检查邮箱是否已存在
      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ where: { email, id: { [Op.ne]: user.id } } });
        if (existingEmail) {
          return res.status(400).json({ message: '邮箱已存在。' });
        }
        user.email = email;
      }

      // 更新电话
      if (phone) {
        user.phone = phone;
      }

      // 更新密码
      if (password) {
        user.password = password; // 模型钩子会处理哈希
      }

      await user.save();

      const userResponse = user.toJSON();
      delete userResponse.password;

      res.json({ message: '用户信息更新成功。', user: userResponse });
    } catch (error) {
      console.error('更新用户信息错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

module.exports = router;
