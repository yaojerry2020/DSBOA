// middleware/role.js
module.exports = (allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles; // 确保这是一个数组
    console.log('当前用户的角色:', userRoles); // 调试信息

    if (!userRoles || !Array.isArray(userRoles)) {
      console.warn('角色检查失败：用户角色信息无效。');
      return res.status(403).json({ message: '没有权限访问此资源。' });
    }

    const hasRole = userRoles.some(role => allowedRoles.includes(role));
    if (!hasRole) {
      console.warn(`角色检查失败：用户角色 "${userRoles}" 不在允许的角色列表中。`);
      return res.status(403).json({ message: '没有权限访问此资源。' });
    }

    console.log('角色验证通过'); // 验证通过日志
    next();
  };
};
