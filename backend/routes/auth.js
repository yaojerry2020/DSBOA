// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role, Department } = require('../models');
const authenticate = require('../middleware/authenticate');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
	  attributes: ['id', 'username', 'displayName', 'password'],  // 确保包含 'displayName'
      include: [
        { model: Role, as: 'roles' },
        { model: Department, as: 'departments' }
      ],
    });
    if (!user) return res.status(404).json({ message: '用户不存在' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: '密码错误' });

    const roles = user.roles.map(role => role.name);
    const token = jwt.sign(
      { id: user.id, username: user.username, roles },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('生成的 token:', token);
    
    res.json({
      user: {
        id: user.id,
        username: user.username,
		displayName: user.displayName, // 返回 displayName
        roles,
        departments: user.departments.map(dept => dept.name),
      },
      token,
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
