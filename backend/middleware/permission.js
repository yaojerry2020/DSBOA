// middleware/permission.js

'use strict';

const { User, Role, Permission } = require('../models');

/**
 * permissionCheck 中间件
 * 根据用户拥有的权限数组来限制访问权限
 * @param {Array} permissions - 允许访问的权限名称
 * @returns {Function} 中间件函数
 */
module.exports = function(permissions) {
  return async function(req, res, next) {
    try {
      // 获取用户的角色及其权限
      const user = await User.findByPk(req.user.id, {
        include: [{
          model: Role,
          as: 'role',
          include: [{
            model: Permission,
            as: 'permissions',
            attributes: ['name'],
          }],
        }],
      });

      if (!user) {
        return res.status(403).json({ message: '用户信息未找到。' });
      }

      // 提取用户的权限名称
      const userPermissions = user.role.permissions.map(permission => permission.name);

      // 检查用户是否拥有至少一个所需权限
      const hasPermission = permissions.some(permission => userPermissions.includes(permission));

      if (!hasPermission) {
        return res.status(403).json({ message: '您没有执行此操作的权限。' });
      }

      next();
    } catch (error) {
      console.error('权限验证错误:', error);
      return res.status(500).json({ message: '内部服务器错误。' });
    }
  };
};
