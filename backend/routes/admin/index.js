// routes/admin/index.js

const express = require('express');
const router = express.Router();
const authenticate = require('../../middleware/authenticate');
const roleCheck = require('../../middleware/role');

// 导入各个管理模块的路由
const userRoutes = require('./userRoutes');
const departmentRoutes = require('./departmentRoutes');
const roleRoutes = require('./roleRoutes');

// 应用通用的中间件
router.use(authenticate);
router.use(roleCheck(['admin']));

// 挂载各个子路由
router.use('/users', userRoutes);
router.use('/departments', departmentRoutes);
router.use('/roles', roleRoutes);

// 如果未来有其他管理模块，如项目管理，可以在此挂载
// const projectRoutes = require('./projectRoutes');
// router.use('/projects', projectRoutes);

module.exports = router;
