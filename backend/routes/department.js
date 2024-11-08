// routes/department.js

'use strict';

/**
 * 部门管理路由模块
 * 负责处理与部门管理相关的所有请求，包括部门的创建、获取、更新、删除等。
 */

const express = require('express');
const router = express.Router();
const { Department, User } = require('../models');
const { body, param, validationResult } = require('express-validator');
const { Op } = require('sequelize');

// 引入中间件
const auth = require('../middleware/auth');           // 身份验证中间件
const roleCheck = require('../middleware/role');      // 角色检查中间件

// 创建新部门
router.post('/',
  auth,                                     // 身份验证
  roleCheck(['admin']),                     // 仅限管理员
  [
    body('name').notEmpty().withMessage('部门名称不能为空。'),
    body('parentId').optional().isInt().withMessage('parentId 必须是整数。'),
  ],
  async (req, res) => {
    // 验证请求体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, parentId } = req.body;

    try {
      // 检查部门名称是否已存在
      const existingDept = await Department.findOne({ where: { name } });
      if (existingDept) {
        return res.status(400).json({ message: '部门名称已存在。' });
      }

      // 如果 parentId 提供，检查其有效性并确保不超过两层
      if (parentId) {
        const parentDept = await Department.findByPk(parentId);
        if (!parentDept) {
          return res.status(400).json({ message: '父部门不存在。' });
        }
        // 检查父部门是否已经有父部门（即新部门将是第三层）
        if (parentDept.parentId) {
          return res.status(400).json({ message: '部门层级不能超过两层。' });
        }
      }

      // 创建部门
      const newDept = await Department.create({ name, parentId: parentId || null });
      res.status(201).json({ message: '部门创建成功。', department: newDept });
    } catch (error) {
      console.error('创建部门错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 获取所有部门
router.get('/',
  auth,                                     // 身份验证
  roleCheck(['admin']),                     // 仅限管理员
  async (req, res) => {
    try {
      const departments = await Department.findAll({
        include: [
          { model: Department, as: 'parentDepartment', attributes: ['id', 'name'] },
          { model: Department, as: 'subDepartments', attributes: ['id', 'name'] },
        ],
      });
      res.json(departments);
    } catch (error) {
      console.error('获取部门列表错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 获取特定部门信息
router.get('/:id',
  auth,                                     // 身份验证
  roleCheck(['admin']),                     // 仅限管理员
  [
    param('id').isInt().withMessage('部门ID必须是整数。'),
  ],
  async (req, res) => {
    const { id } = req.params;

    // 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const dept = await Department.findByPk(id, {
        include: [
          { model: Department, as: 'parentDepartment', attributes: ['id', 'name'] },
          { model: Department, as: 'subDepartments', attributes: ['id', 'name'] },
        ],
      });
      if (!dept) {
        return res.status(404).json({ message: '部门未找到。' });
      }
      res.json(dept);
    } catch (error) {
      console.error('获取部门信息错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 更新部门信息
router.put('/:id',
  auth,                                     // 身份验证
  roleCheck(['admin']),                     // 仅限管理员
  [
    param('id').isInt().withMessage('部门ID必须是整数。'),
    body('name').optional().notEmpty().withMessage('部门名称不能为空。'),
    body('parentId').optional().isInt().withMessage('parentId 必须是整数。'),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { name, parentId } = req.body;

    // 验证请求体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const dept = await Department.findByPk(id);
      if (!dept) {
        return res.status(404).json({ message: '部门未找到。' });
      }

      // 如果更新名称，检查是否已存在
      if (name && name !== dept.name) {
        const existingDept = await Department.findOne({ where: { name } });
        if (existingDept) {
          return res.status(400).json({ message: '部门名称已存在。' });
        }
        dept.name = name;
      }

      // 如果更新 parentId，检查其有效性并确保不超过两层
      if (parentId !== undefined) {
        if (parentId === dept.id) {
          return res.status(400).json({ message: '部门不能成为自己的父部门。' });
        }

        if (parentId) {
          const parentDept = await Department.findByPk(parentId);
          if (!parentDept) {
            return res.status(400).json({ message: '父部门不存在。' });
          }
          // 检查父部门是否已经有父部门（即新部门将是第三层）
          if (parentDept.parentId) {
            return res.status(400).json({ message: '部门层级不能超过两层。' });
          }
        }

        dept.parentId = parentId || null;
      }

      await dept.save();
      res.json({ message: '部门更新成功。', department: dept });
    } catch (error) {
      console.error('更新部门错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 删除部门
router.delete('/:id',
  auth,                                     // 身份验证
  roleCheck(['admin']),                     // 仅限管理员
  [
    param('id').isInt().withMessage('部门ID必须是整数。'),
  ],
  async (req, res) => {
    const { id } = req.params;

    // 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const dept = await Department.findByPk(id);
      if (!dept) {
        return res.status(404).json({ message: '部门未找到。' });
      }

      // 获取顶层部门的 id
      const topDept = await Department.findOne({ where: { parentId: null } });
      if (!topDept) {
        return res.status(500).json({ message: '顶层部门不存在。' });
      }

      // 查找属于此部门的用户
      const usersInDept = await User.findAll({ where: { departmentId: id } });
      
      // 将这些用户移到顶层部门
      if (usersInDept.length > 0) {
        await User.update(
          { departmentId: topDept.id },
          { where: { departmentId: id } }
        );
      }

      // 删除部门及其子部门
      // 首先删除所有子部门
      await Department.destroy({ where: { parentId: id } });

      // 然后删除该部门
      await dept.destroy();

      res.json({ message: '部门删除成功。' });
    } catch (error) {
      console.error('删除部门错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 获取所有部门
router.get('/',
  auth,                                     // 身份验证
  roleCheck(['admin']),                     // 仅限管理员
  async (req, res) => {
    try {
      const departments = await Department.findAll({
        include: [
          { model: Department, as: 'parentDepartment', attributes: ['id', 'name'] },
          { model: Department, as: 'subDepartments', attributes: ['id', 'name'] },
        ],
      });
      res.json(departments);
    } catch (error) {
      console.error('获取部门列表错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

module.exports = router;
