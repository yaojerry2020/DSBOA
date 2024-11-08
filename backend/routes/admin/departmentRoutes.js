// routes/admin/departmentRoutes.js
const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const db = require('../../models'); // 确保从 db 中正确导入
const sequelize = db.sequelize;      // 从 db 中引入 sequelize
const { Department } = db;           // 从 db 中解构出 Department 模型

// 创建新部门
router.post('/', [
  body('name').notEmpty().withMessage('部门名称不能为空。'),
  body('parentId').optional({ nullable: true, checkFalsy: true }).isInt().withMessage('parentId 必须是整数。'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  let { name, parentId } = req.body;
  if (parentId === '' || parentId === undefined) parentId = null;

  try {
    await sequelize.transaction(async (t) => { // 使用 sequelize.transaction
      const existingDept = await Department.findOne({ where: { name }, transaction: t });
      if (existingDept) return res.status(400).json({ message: '部门名称已存在。' });

      if (parentId) {
        const parentDept = await Department.findByPk(parentId, { transaction: t });
        if (!parentDept) return res.status(400).json({ message: '父部门不存在。' });
      }

      const newDept = await Department.create({ name, parentId }, { transaction: t });
      res.status(201).json({ message: '部门创建成功。', department: newDept });
    });
  } catch (error) {
    console.error('创建部门错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

// 获取所有部门
router.get('/', async (req, res) => {
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
});

// 获取单个部门
router.get('/:id', [
  param('id').isInt().withMessage('部门ID必须是整数。')
], async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const department = await Department.findByPk(id, {
      include: [
        { model: Department, as: 'parentDepartment', attributes: ['id', 'name'] },
        { model: Department, as: 'subDepartments', attributes: ['id', 'name'] },
      ],
    });

    if (!department) return res.status(404).json({ message: '部门未找到。' });
    res.json(department);
  } catch (error) {
    console.error('获取单个部门错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

// 更新部门信息
router.put('/:id', [
  param('id').isInt().withMessage('部门ID必须是整数。'),
  body('name').optional().notEmpty().withMessage('部门名称不能为空。'),
  body('parentId').optional().isInt().withMessage('parentId 必须是整数。'),
], async (req, res) => {
  const { id } = req.params;
  const { name, parentId } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await sequelize.transaction(async (t) => {
      const dept = await Department.findByPk(id, { transaction: t });
      if (!dept) return res.status(404).json({ message: '部门未找到。' });

      if (name && name !== dept.name) {
        const existingDept = await Department.findOne({ where: { name }, transaction: t });
        if (existingDept) return res.status(400).json({ message: '部门名称已存在。' });
        dept.name = name;
      }

      if (parentId !== undefined) {
        if (parentId === parseInt(id)) return res.status(400).json({ message: '部门不能设置为自己的父部门。' });
        
        if (parentId) {
          const parentDept = await Department.findByPk(parentId, { transaction: t });
          if (!parentDept) return res.status(400).json({ message: '父部门不存在。' });
        }
        dept.parentId = parentId;
      }

      await dept.save({ transaction: t });
      res.json({ message: '部门更新成功。', department: dept });
    });
  } catch (error) {
    console.error('更新部门错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

// 删除部门
router.delete('/:id', [
  param('id').isInt().withMessage('部门ID必须是整数。'),
], async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    await sequelize.transaction(async (t) => {
      const dept = await Department.findByPk(id, {
        include: [{ model: Department, as: 'subDepartments' }],
        transaction: t,
      });
      if (!dept) return res.status(404).json({ message: '部门未找到。' });

      if (dept.subDepartments && dept.subDepartments.length > 0) {
        return res.status(400).json({ message: '请先删除子部门。' });
      }

      await dept.destroy({ transaction: t });
      res.json({ message: '部门删除成功。' });
    });
  } catch (error) {
    console.error('删除部门错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
});

module.exports = router;
