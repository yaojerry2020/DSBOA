// routes/permission.js

'use strict';

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const permissionController = require('../controllers/permissionController');

const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');

/**
 * 权限管理路由
 */

// 创建新权限
router.post('/',
  auth,
  roleCheck(['admin']),
  [
    body('name').notEmpty().withMessage('权限名称不能为空。'),
  ],
  permissionController.createPermission
);

// 其他权限相关路由...

module.exports = router;
