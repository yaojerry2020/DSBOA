// routes/vehicle.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const { Vehicle } = require('../models');
const { body, validationResult } = require('express-validator');

// 获取所有车辆（仅管理员可访问）
router.get('/',
  auth,
  roleCheck(['admin']),
  async (req, res) => {
    try {
      const vehicles = await Vehicle.findAll();
      res.json(vehicles);
    } catch (error) {
      console.error('获取车辆列表错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 获取特定车辆信息（仅管理员可访问）
router.get('/:id',
  auth,
  roleCheck(['admin']),
  async (req, res) => {
    const { id } = req.params;
    try {
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({ message: '车辆未找到。' });
      }
      res.json(vehicle);
    } catch (error) {
      console.error('获取车辆信息错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 创建新车辆（仅管理员可访问）
router.post('/',
  auth,
  roleCheck(['admin']),
  [
    body('licensePlate').notEmpty().withMessage('车牌不能为空。'),
    body('licensePlate').isString().withMessage('车牌必须是字符串。'),
    body('licensePlate').custom(value => {
      // 这里可以添加更复杂的车牌格式验证
      if (value.trim() === '') {
        throw new Error('车牌不能为空。');
      }
      return true;
    }),
    body('brand').optional().isString().withMessage('品牌必须是字符串。'),
    body('model').optional().isString().withMessage('型号必须是字符串。'),
    body('color').optional().isString().withMessage('颜色必须是字符串。'),
    // 其他可选字段的验证...
  ],
  async (req, res) => {
    // 验证请求体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { licensePlate, brand, model, color } = req.body;

    try {
      // 检查车牌是否已存在
      const existingVehicle = await Vehicle.findOne({
        where: {
          licensePlate: licensePlate,
        },
      });

      if (existingVehicle) {
        return res.status(400).json({ message: '车牌已存在。' });
      }

      // 创建车辆
      const newVehicle = await Vehicle.create({ licensePlate, brand, model, color });
      res.status(201).json({ message: '车辆创建成功。', vehicle: newVehicle });
    } catch (error) {
      console.error('创建车辆错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 更新车辆信息（仅管理员可访问）
router.put('/:id',
  auth,
  roleCheck(['admin']),
  [
    body('licensePlate').optional().isString().withMessage('车牌必须是字符串。'),
    body('licensePlate').optional().notEmpty().withMessage('车牌不能为空。'),
    body('brand').optional().isString().withMessage('品牌必须是字符串。'),
    body('model').optional().isString().withMessage('型号必须是字符串。'),
    body('color').optional().isString().withMessage('颜色必须是字符串。'),
    // 其他可选字段的验证...
  ],
  async (req, res) => {
    const { id } = req.params;
    const { licensePlate, brand, model, color } = req.body;

    // 验证请求体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const vehicle = await Vehicle.findByPk(id);
      if (!vehicle) {
        return res.status(404).json({ message: '车辆未找到。' });
      }

      // 检查车牌是否已存在（如果有更改）
      if (licensePlate && licensePlate !== vehicle.licensePlate) {
        const existingVehicle = await Vehicle.findOne({ where: { licensePlate } });
        if (existingVehicle) {
          return res.status(400).json({ message: '车牌已存在。' });
        }
      }

      // 更新车辆字段
      if (licensePlate) vehicle.licensePlate = licensePlate;
      if (brand) vehicle.brand = brand;
      if (model) vehicle.model = model;
      if (color) vehicle.color = color;
      // 其他可选字段的更新...

      await vehicle.save();
      res.json({ message: '车辆信息更新成功。', vehicle });
    } catch (error) {
      console.error('更新车辆信息错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// 删除车辆（仅管理员可访问）
router.delete('/:id', auth, roleCheck(['admin']), async (req, res) => {
  const { id } = req.params;
  try {
    const vehicle = await Vehicle.findByPk(id);
    if (!vehicle) {
      return res.status(404).json({ message: '车辆未找到。' });
    }

    await vehicle.destroy();
    res.json({ message: '车辆删除成功。' });
  } catch (error) {
    console.error('删除车辆错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

module.exports = router;
