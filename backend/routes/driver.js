// routes/driver.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const { Driver } = require('../models');
const { body, validationResult } = require('express-validator');

// 获取所有驾驶员（仅管理员可访问）
router.get('/',
  auth,
  roleCheck(['admin']),
  async (req, res) => {
    try {
      const drivers = await Driver.findAll();
      res.json(drivers);
    } catch (error) {
      console.error('获取驾驶员列表错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 获取特定驾驶员信息（仅管理员可访问）
router.get('/:id',
  auth,
  roleCheck(['admin']),
  async (req, res) => {
    const { id } = req.params;
    try {
      const driver = await Driver.findByPk(id);
      if (!driver) {
        return res.status(404).json({ message: '驾驶员未找到。' });
      }
      res.json(driver);
    } catch (error) {
      console.error('获取驾驶员信息错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 创建新驾驶员（仅管理员可访问）
router.post('/',
  auth,
  roleCheck(['admin']),
  [
    body('name').notEmpty().withMessage('姓名不能为空。'),
    body('phone').notEmpty().withMessage('手机不能为空。'),
    body('phone').matches(/^[0-9\-+()\s]+$/).withMessage('手机格式不正确。'),
    body('email').optional().isEmail().withMessage('邮箱格式不正确。'),
    body('licenseNumber').optional().isString(),
    // 其他可选字段的验证...
  ],
  async (req, res) => {
    // 验证请求体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, email, licenseNumber } = req.body;

    try {
      // 检查手机是否已存在
      const existingDriver = await Driver.findOne({
        where: { phone },
      });

      if (existingDriver) {
        return res.status(400).json({ message: '手机已存在。' });
      }

      // 创建驾驶员
      const newDriver = await Driver.create({ name, phone, email, licenseNumber });
      res.status(201).json({ message: '驾驶员创建成功。', driver: newDriver });
    } catch (error) {
      console.error('创建驾驶员错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 更新驾驶员信息（仅管理员可访问）
router.put('/:id',
  auth,
  roleCheck(['admin']),
  [
    body('name').optional().notEmpty().withMessage('姓名不能为空。'),
    body('phone').optional().notEmpty().withMessage('手机不能为空。'),
    body('phone').optional().matches(/^[0-9\-+()\s]+$/).withMessage('手机格式不正确。'),
    body('email').optional().isEmail().withMessage('邮箱格式不正确。'),
    body('licenseNumber').optional().isString(),
    // 其他可选字段的验证...
  ],
  async (req, res) => {
    const { id } = req.params;
    const { name, phone, email, licenseNumber } = req.body;

    // 验证请求体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const driver = await Driver.findByPk(id);
      if (!driver) {
        return res.status(404).json({ message: '驾驶员未找到。' });
      }

      // 检查手机是否已存在（如果有更改）
      if (phone && phone !== driver.phone) {
        const existingPhone = await Driver.findOne({ where: { phone } });
        if (existingPhone) {
          return res.status(400).json({ message: '手机已存在。' });
        }
      }

      // 更新驾驶员字段
      if (name) driver.name = name;
      if (phone) driver.phone = phone;
      if (email) driver.email = email;
      if (licenseNumber) driver.licenseNumber = licenseNumber;
      // 其他可选字段的更新...

      await driver.save();
      res.json({ message: '驾驶员信息更新成功。', driver });
    } catch (error) {
      console.error('更新驾驶员信息错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 删除驾驶员（仅管理员可访问）
router.delete('/:id',
  auth,
  roleCheck(['admin']),
  async (req, res) => {
    const { id } = req.params;
    try {
      const driver = await Driver.findByPk(id);
      if (!driver) {
        return res.status(404).json({ message: '驾驶员未找到。' });
      }

      await driver.destroy();
      res.json({ message: '驾驶员删除成功。' });
    } catch (error) {
      console.error('删除驾驶员错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

module.exports = router;
