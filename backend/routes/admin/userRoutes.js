// routes/admin/userRoutes.js

const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const userController = require('../../controllers/userController');
const bcrypt = require('bcryptjs');
const { User, Role, Department } = require('../../models');

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Role, as: 'roles', attributes: ['id', 'name'] },
        { model: Department, as: 'departments', attributes: ['id', 'name'] },
      ],
    });
    res.json(users);
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

// 获取单个用户
router.get('/:id', [
  param('id').isInt().withMessage('用户ID必须是整数。')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Role, as: 'roles', attributes: ['id', 'name'] },
        { model: Department, as: 'departments', attributes: ['id', 'name'] },
      ],
    });
    if (!user) return res.status(404).json({ message: '用户未找到。' });
    res.json(user);
  } catch (error) {
    console.error('获取单个用户错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

// 创建新用户
router.post('/', [
  body('username').notEmpty().withMessage('用户名不能为空。'),
  body('displayName').notEmpty().withMessage('显示名不能为空。'),
  body('email').isEmail().withMessage('无效的邮箱地址。'),
  body('password').isLength({ min: 6 }).withMessage('密码长度至少为6个字符。'),
  body('roles').optional().isArray().withMessage('roles 必须是数组。'),
  body('departments').optional().isArray().withMessage('departments 必须是数组。'),
  body('phone').notEmpty().withMessage('联系电话不能为空。'),
], userController.createUser);

// 更新用户信息
router.put('/:id', [
  param('id').isInt().withMessage('用户ID必须是整数。'),
  body('username').optional().notEmpty().withMessage('用户名不能为空。'),
  body('displayName').optional().notEmpty().withMessage('显示名不能为空。'),
  body('email').optional().isEmail().withMessage('无效的邮箱地址。'),
  body('roles').optional().isArray().withMessage('roles 必须是数组。'),
  body('departments').optional().isArray().withMessage('departments 必须是数组。'),
  body('phone').optional().notEmpty().withMessage('联系电话不能为空。'),
  body('password').optional().isLength({ min: 6 }).withMessage('密码长度至少为6个字符。'),
], userController.updateUser);

// 删除用户
router.delete('/:id', [
  param('id').isInt().withMessage('用户ID必须是整数。')
], userController.deleteUser);

module.exports = router;
