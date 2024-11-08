// routes/assignment.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/role');
const { Assignment, Application, Driver, Vehicle } = require('../models');
const { body, param, validationResult } = require('express-validator');

// -------------------- 创建分配 --------------------
router.post('/',
  auth,
  roleCheck(['admin', 'approver']),
  [
    body('applicationId').isInt().withMessage('应用ID必须是整数。'),
    body('driverId').isInt().withMessage('驾驶员ID必须是整数。'),
    body('vehicleId').isInt().withMessage('车辆ID必须是整数。'),
  ],
  async (req, res) => {
    // 验证请求体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { applicationId, driverId, vehicleId } = req.body;

    try {
      // 检查申请是否存在且未被分配
      const application = await Application.findByPk(applicationId);
      if (!application) {
        return res.status(404).json({ message: '用车申请未找到。' });
      }

      // 检查是否已有分配
      const existingAssignment = await Assignment.findOne({ where: { applicationId } });
      if (existingAssignment) {
        return res.status(400).json({ message: '该用车申请已被分配。' });
      }

      // 检查驾驶员是否存在
      const driver = await Driver.findByPk(driverId);
      if (!driver) {
        return res.status(404).json({ message: '驾驶员未找到。' });
      }

      // 检查车辆是否存在
      const vehicle = await Vehicle.findByPk(vehicleId);
      if (!vehicle) {
        return res.status(404).json({ message: '车辆未找到。' });
      }

      // 创建分配
      const newAssignment = await Assignment.create({
        applicationId,
        driverId,
        vehicleId,
      });

      res.status(201).json({
        message: '分配创建成功。',
        assignment: newAssignment,
      });
    } catch (error) {
      console.error('创建分配错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// -------------------- 获取所有分配 --------------------
router.get('/',
  auth,
  roleCheck(['admin', 'approver']),
  async (req, res) => {
    try {
      const assignments = await Assignment.findAll({
        include: [
          { model: Application, as: 'application' },
          { model: Driver, as: 'driver' },
          { model: Vehicle, as: 'vehicle' },
        ],
        order: [['createdAt', 'DESC']],
      });
      res.json(assignments);
    } catch (error) {
      console.error('获取分配列表错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// -------------------- 获取特定分配 --------------------
router.get('/:id',
  auth,
  roleCheck(['admin', 'approver']),
  [
    param('id').isInt().withMessage('分配ID必须是整数。'),
  ],
  async (req, res) => {
    const { id } = req.params;

    // 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const assignment = await Assignment.findByPk(id, {
        include: [
          { model: Application, as: 'application' },
          { model: Driver, as: 'driver' },
          { model: Vehicle, as: 'vehicle' },
        ],
      });

      if (!assignment) {
        return res.status(404).json({ message: '分配未找到。' });
      }

      res.json(assignment);
    } catch (error) {
      console.error('获取分配错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// -------------------- 更新分配 --------------------
router.put('/:id',
  auth,
  roleCheck(['admin', 'approver']),
  [
    param('id').isInt().withMessage('分配ID必须是整数。'),
    body('driverId').optional().isInt().withMessage('驾驶员ID必须是整数。'),
    body('vehicleId').optional().isInt().withMessage('车辆ID必须是整数。'),
  ],
  async (req, res) => {
    const { id } = req.params;
    const { driverId, vehicleId } = req.body;

    // 验证请求参数和体
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const assignment = await Assignment.findByPk(id);
      if (!assignment) {
        return res.status(404).json({ message: '分配未找到。' });
      }

      // 更新驾驶员ID（如果提供）
      if (driverId) {
        const driver = await Driver.findByPk(driverId);
        if (!driver) {
          return res.status(404).json({ message: '驾驶员未找到。' });
        }
        assignment.driverId = driverId;
      }

      // 更新车辆ID（如果提供）
      if (vehicleId) {
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
          return res.status(404).json({ message: '车辆未找到。' });
        }
        assignment.vehicleId = vehicleId;
      }

      await assignment.save();

      res.json({
        message: '分配更新成功。',
        assignment,
      });
    } catch (error) {
      console.error('更新分配错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

// -------------------- 删除分配 --------------------
router.delete('/:id',
  auth,
  roleCheck(['admin', 'approver']),
  [
    param('id').isInt().withMessage('分配ID必须是整数。'),
  ],
  async (req, res) => {
    const { id } = req.params;

    // 验证请求参数
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const assignment = await Assignment.findByPk(id);
      if (!assignment) {
        return res.status(404).json({ message: '分配未找到。' });
      }

      await assignment.destroy();
      res.json({ message: '分配删除成功。' });
    } catch (error) {
      console.error('删除分配错误:', error);
      res.status(500).json({ message: '内部服务器错误。' });
    }
  }
);

module.exports = router;
