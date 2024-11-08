// authenticate.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    console.warn('认证失败：未提供 Authorization 头部。');
    return res.status(401).json({ message: '未提供认证信息。' });
  }

  const token = authHeader.split(' ')[1]; // 期望格式为 "Bearer <token>"

  if (!token) {
    console.warn('认证失败：未找到 Token。');
    return res.status(401).json({ message: '未提供认证信息。' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('JWT 验证错误:', err.message);
      return res.status(403).json({ message: '无效的令牌。' });
    }
    req.user = user;
    console.log(`认证成功：用户 ${user.username}，角色 ${user.roles}`);
	console.log('完整的 user 对象:', user);
    next();
  });
};
