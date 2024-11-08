// controllers/userController.js

const { User, Role, Department } = require('../models');
const bcrypt = require('bcryptjs');

// 管理员更新用户信息
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { roles = [], departments = [], password, ...otherFields } = req.body;

    // 查找用户
    const user = await User.findByPk(id);
    if (!user) {
      console.log(`更新用户失败 - 用户未找到: ID ${id}`);
      return res.status(404).json({ message: '用户未找到。' });
    }

    // 更新用户基础信息
    await user.update(otherFields);
    console.log(`用户 ${id} 基本信息已更新`);

    // 如果有密码，则更新密码
    if (password) {
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      console.log(`用户 ${id} 的密码已更新`);
    }

    // 更新用户角色关联
    if (Array.isArray(roles)) {
      const roleInstances = await Role.findAll({ where: { id: roles } });
      await user.setRoles(roleInstances);
      console.log(`用户 ${id} 的角色已更新`);
    }

    // 更新用户部门关联
    if (Array.isArray(departments)) {
      const departmentInstances = await Department.findAll({ where: { id: departments } });
      await user.setDepartments(departmentInstances);
      console.log(`用户 ${id} 的部门已更新`);
    }

    const updatedUser = await User.findByPk(user.id, {
      include: [
        { model: Role, as: 'roles', attributes: ['id', 'name'] },
        { model: Department, as: 'departments', attributes: ['id', 'name'] },
      ],
    });
    res.json({ message: '用户更新成功。', user: updatedUser });
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ message: '内部服务器错误。' });
  }
};

// 管理员创建新用户
exports.createUser = async (req, res) => {
  try {
    const { username, displayName, email, password, roles = [], departments = [], phone } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, displayName, email, password: hashedPassword, phone });
    console.log(`用户 ${user.id} 创建成功`);

    if (roles && Array.isArray(roles)) {
      const roleInstances = await Role.findAll({ where: { id: roles } });
      await user.setRoles(roleInstances);
    }

    if (departments && Array.isArray(departments)) {
      const departmentInstances = await Department.findAll({ where: { id: departments } });
      await user.setDepartments(departmentInstances);
    }

    res.status(201).json({ message: '用户创建成功', user });
  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({ message: '创建用户失败' });
  }
};

// 管理员删除用户
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      console.log(`删除用户失败 - 用户未找到: ID ${id}`);
      return res.status(404).json({ message: '用户未找到' });
    }

    await user.destroy();
    console.log(`用户 ${id} 已被删除`);
    res.status(200).json({ message: '用户已删除' });
  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({ message: '删除用户失败' });
  }
};

