// routes/protectedRoute.js

const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // 根据项目结构调整路径

// 受保护的路由示例
router.get('/dashboard', authenticate, (req, res) => {
  res.json({
    message: `欢迎，${req.user.displayName}！`,
    user: req.user,
  });
});

module.exports = router;
