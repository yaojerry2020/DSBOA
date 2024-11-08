// controllers/departmentController.js

'use strict';

/**
 * 部门控制器
 * 负责处理与部门管理相关的业务逻辑，如创建部门、获取部门、更新部门、删除部门等。
 */

const { Department } = require('../models');

/**
 * 创建新部门
 * 仅限管理员通过此功能创建新部门
 */
exports.createDepartment = async (req, res) => {
  // 验证请求体中的数据是否有效
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { name } = req.body;

  try {
    // 检查部门名称是否已存在
    const existingDept = await Department.findOne({ where: { name } });
    if (existingDept) {
      return res.status(400).json({ message: '部门名称已存在。' });
    }

    // 创建新部门
    const newDepartment = await Department.create({ name });

    return res.status(201).json({
      message: '部门创建成功。',
      department: newDepartment,
    });
  } catch (error) {
    console.error('创建部门错误:', error);
    return res.status(500).json({ message: '内部服务器错误。' });
  }
};

/**
 * 获取所有部门
 * 仅限管理员查看所有部门的信息
 */
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(departments);
  } catch (error) {
    console.error('获取所有部门错误:', error);
    return res.status(500).json({ message: '内部服务器错误。' });
  }
};

/**
 * 根据ID获取特定部门
 * 仅限管理员查看特定部门的信息
 */
exports.getDepartmentById = async (req, res) => {
  const { id } = req.params;

  // 验证请求参数
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const department = await Department.findByPk(id, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'username', 'email'],
        },
      ],
    });

    if (!department) {
      return res.status(404).json({ message: '部门未找到。' });
    }

    return res.status(200).json(department);
  } catch (error) {
    console.error('获取部门错误:', error);
    return res.status(500).json({ message: '内部服务器错误。' });
  }
};

/**
 * 更新部门信息
 * 仅限管理员更新特定部门的信息
 */
exports.updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // 验证请求参数和体
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: '部门未找到。' });
    }

    // 如果更新名称，检查是否已存在
    if (name && name !== department.name) {
      const existingDept = await Department.findOne({ where: { name } });
      if (existingDept) {
        return res.status(400).json({ message: '部门名称已存在。' });
      }
      department.name = name;
    }

    // 保存更新
    await department.save();

    return res.status(200).json({
      message: '部门信息更新成功。',
      department,
    });
  } catch (error) {
    console.error('更新部门错误:', error);
    return res.status(500).json({ message: '内部服务器错误。' });
  }
};

/**
 * 删除部门
 * 仅限管理员删除特定部门
 */
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;

  // 验证请求参数
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const department = await Department.findByPk(id);

    if (!department) {
      return res.status(404).json({ message: '部门未找到。' });
    }

    // 检查部门是否有用户关联
    const users = await department.getUsers();
    if (users.length > 0) {
      return res.status(400).json({ message: '该部门下存在用户，无法删除。' });
    }

    // 删除部门
    await department.destroy();

    return res.status(200).json({ message: '部门删除成功。' });
  } catch (error) {
    console.error('删除部门错误:', error);
    return res.status(500).json({ message: '内部服务器错误。' });
  }
};
