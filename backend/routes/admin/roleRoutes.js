// routes/admin/roleRoutes.js
const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const { Role, Permission } = require('../../models');
const { transaction } = require('sequelize');

// 创建角色
router.post('/', [
  body('name').notEmpty().withMessage('角色名称不能为空。'),
  body('description').optional().notEmpty().withMessage('角色描述不能为空。'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, description } = req.body;

  try {
    await transaction(async (t) => {
      const existingRole = await Role.findOne({ where: { name }, transaction: t });
      if (existingRole) return res.status(400).json({ message: '角色名称已存在。' });

      const newRole = await Role.create({ name, description }, { transaction: t });
      res.status(201).json({ message: '角色创建成功。', role: newRole });
    });
  } catch (error) {
    console.error('创建角色错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

// 获取所有角色
router.get('/', async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [{
        model: Permission,
        as: 'permissions',
        through: { attributes: [] },
      }],
    });
    res.json(roles);
  } catch (error) {
    console.error('获取角色列表错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

// 更新角色
router.put('/:id', [
  param('id').isInt().withMessage('角色ID必须是整数。'),
  body('name').optional().notEmpty().withMessage('角色名称不能为空。'),
  body('description').optional().notEmpty().withMessage('角色描述不能为空。'),
], async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await transaction(async (t) => {
      const role = await Role.findByPk(id, { transaction: t });
      if (!role) return res.status(404).json({ message: '角色未找到。' });

      if (name && name !== role.name) {
        const existingRole = await Role.findOne({
          where: { name },
          transaction: t,
        });
        if (existingRole) return res.status(400).json({ message: '角色名称已存在。' });
        role.name = name;
      }

      if (description !== undefined) role.description = description;

      await role.save({ transaction: t });
      res.json({ message: '角色更新成功。', role });
    });
  } catch (error) {
    console.error('更新角色错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

// 删除角色
router.delete('/:id', [
  param('id').isInt().withMessage('角色ID必须是整数。'),
], async (req, res) => {
  const { id } = req.params;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await transaction(async (t) => {
      const role = await Role.findByPk(id, { transaction: t });
      if (!role) return res.status(404).json({ message: '角色未找到。' });

      await role.destroy({ transaction: t });
      res.json({ message: '角色删除成功。' });
    });
  } catch (error) {
    console.error('删除角色错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

module.exports = router;
