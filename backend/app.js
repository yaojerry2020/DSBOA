// app.js

'use strict';

const express = require('express');
require('dotenv').config(); // 加载环境变量
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const db = require('./models');

// 配置 CORS
app.use(cors({
  origin: ['http://20.0.0.55:3000', 'http://dsm.yaojerry.cn:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// 中间件设置
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置 uploads 目录为静态文件目录
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// 引入路由模块
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/department');
const roleRoutes = require('./routes/role');
const adminRoutes = require('./routes/admin');
const noticeRoutes = require('./routes/noticeRoutes'); // 新增的公告管理路由
const notificationRoutes = require('./routes/notificationRoutes');//通用通知路由

// 引入认证中间件
const authenticate = require('./middleware/authenticate');
const roleCheck = require('./middleware/role');

// 挂载路由
app.use('/api/auth', authRoutes);
app.use('/api/user', authenticate, userRoutes); // 受保护的普通用户路由
app.use('/api/departments', authenticate, roleCheck(['admin']), departmentRoutes); // 管理员访问
app.use('/api/roles', authenticate, roleCheck(['admin']), roleRoutes); // 管理员访问
app.use('/api/admin', authenticate, roleCheck(['admin']), adminRoutes); // 管理员路由
app.use('/api/notices', authenticate, noticeRoutes); // 公告管理路由
app.use('/api/notifications', notificationRoutes);//通用通知路由

// 404处理
app.use((req, res) => {
  res.status(404).json({ message: '路由未找到。' });
});

// 启动服务器并同步数据库
const PORT = process.env.PORT || 4321;

const server = app.listen(PORT, async () => {
  console.log(`服务器正在端口 ${PORT} 上运行。`);

  try {
    await db.sequelize.sync();

    console.log('数据库已同步。');

    const { Role, Department, User } = db;

    const roleCount = await Role.count();
    if (roleCount === 0) {
      const adminRole = await Role.create({ name: 'admin', description: '管理员' });
      const userRole = await Role.create({ name: 'user', description: '普通用户' });
      const noticeAdminRole = await Role.create({ name: 'notice_admin', description: '公告管理员' }); // 新增公告管理员角色
      console.log('角色已创建。');
    }

    const departmentCount = await Department.count();
    if (departmentCount === 0) {
      const defaultDept = await Department.create({ name: '默认部门', description: '系统默认部门' });
      console.log('部门已创建。');
    }

    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const adminRole = await Role.findOne({ where: { name: 'admin' } });
      const defaultDept = await Department.findOne({ where: { name: '默认部门' } });
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      const newAdmin = await User.create({
        username: 'admin',
        displayName: '管理员',
        email: 'admin@example.com',
        password: hashedPassword,
        phone: '1234567890',
      });
      if (adminRole) {
        await newAdmin.addRole(adminRole);
      }
      if (defaultDept) {
        await newAdmin.addDepartment(defaultDept);
      }
      console.log('默认管理员用户已创建。');
    } else {
      console.log('管理员用户已存在。');
    }

  } catch (error) {
    console.error('同步数据库或初始化数据失败:', error);
    process.exit(1);
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请选择一个不同的端口。`);
  } else {
    console.error('服务器错误:', error);
  }
  process.exit(1);
});

module.exports = app;
