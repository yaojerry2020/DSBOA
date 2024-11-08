// middleware/auth.js

'use strict';

const jwt = require('jsonwebtoken');
const { User, Role, Department } = require('../models');

module.exports = async function(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '未提供令牌。' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      include: [
        { model: Role, as: 'role' },
        { model: Department, as: 'department' },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: '用户不存在。' });
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role.name,
      department: user.department.name,
    };

    next();
  } catch (error) {
    return res.status(403).json({ message: '令牌无效。' });
  }
};
