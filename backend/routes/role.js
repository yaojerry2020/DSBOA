// routes/role.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const { Role, Permission } = require('../models');
const { body, param, validationResult } = require('express-validator');

/**
 * 1. 创建角色
 * 仅管理员可以执行
 */
router.post('/',
  auth,
  roleCheck(['admin']),
  [
    body('name').isString().notEmpty().withMessage('角色名称不能为空。'),
    body('description').optional().isString(),
  ],
  async (req, res) => {
    // 验证请求体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
      // 检查角色是否已存在
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return res.status(400).json({ message: '角色名称已存在。' });
      }

      // 创建角色
      const role = await Role.create({ name, description });
      res.status(201).json({ message: '角色创建成功。', role });
    } catch (error) {
      console.error('创建角色错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

/**
 * 2. 获取所有角色
 * 仅管理员可以执行
 */
router.get('/',
  auth,
  roleCheck(['admin']),
  async (req, res) => {
    try {
      const roles = await Role.findAll({
        include: [{
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }, // 不显示中间表字段
        }],
      });
      res.json(roles);
    } catch (error) {
      console.error('获取角色列表错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

/**
 * 3. 分配权限给角色
 * 仅管理员可以执行
 */
router.post('/:roleId/permissions',
  auth,
  roleCheck(['admin']),
  [
    param('roleId').isInt().withMessage('角色ID必须是整数。'),
    body('permissionIds').isArray({ min: 1 }).withMessage('权限ID数组不能为空。'),
    body('permissionIds.*').isInt().withMessage('权限ID必须是整数。'),
  ],
  async (req, res) => {
    const { roleId } = req.params;
    const { permissionIds } = req.body;

    // 验证请求参数和体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(404).json({ message: '角色未找到。' });
      }

      // 检查权限是否存在
      const permissions = await Permission.findAll({
        where: { id: permissionIds },
      });
      if (permissions.length !== permissionIds.length) {
        return res.status(400).json({ message: '部分权限ID无效。' });
      }

      // 分配权限
      await role.addPermissions(permissionIds);

      res.json({ message: '权限分配成功。' });
    } catch (error) {
      console.error('分配权限错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

/**
 * 4. 移除角色的权限
 * 仅管理员可以执行
 */
router.delete('/:roleId/permissions/:permissionId',
  auth,
  roleCheck(['admin']),
  [
    param('roleId').isInt().withMessage('角色ID必须是整数。'),
    param('permissionId').isInt().withMessage('权限ID必须是整数。'),
  ],
  async (req, res) => {
    const { roleId, permissionId } = req.params;

    // 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res.status(404).json({ message: '角色未找到。' });
      }

      const permission = await Permission.findByPk(permissionId);
      if (!permission) {
        return res.status(404).json({ message: '权限未找到。' });
      }

      // 移除权限
      await role.removePermission(permissionId);

      res.json({ message: '权限移除成功。' });
    } catch (error) {
      console.error('移除权限错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

module.exports = router;
