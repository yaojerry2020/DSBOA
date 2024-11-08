// controllers/permissionController.js

'use strict';

const { Permission } = require('../models');
const { validationResult } = require('express-validator');

/**
 * 创建新权限
 * 仅限管理员通过此功能创建新权限
 */
exports.createPermission = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name } = req.body;

  try {
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return res.status(400).json({ message: '权限名称已存在。' });
    }

    const newPermission = await Permission.create({ name });

    return res.status(201).json({
      message: '权限创建成功。',
      permission: newPermission,
    });
  } catch (error) {
    console.error('创建权限错误:', error);
    return res.status(500).json({ message: '内部服务器错误。' });
  }
};

// 其他权限控制器方法...
