const request = require('supertest');
const app = require('../app'); // 替换为你的 Express 应用
const { User, Role } = require('../models');
const bcrypt = require('bcryptjs');

let adminToken;
let testUserId;

// 创建 admin 用户和测试用户的测试
beforeAll(async () => {
  // 创建一个 admin 用户并生成 JWT
  const adminUser = await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password: await bcrypt.hash('admin123', 10),
    roleId: 1, // 确保这是 admin 角色的 ID
    phone: '1234567890',
  });

  const response = await request(app)
    .post('/api/login')
    .send({ username: 'admin', password: 'admin123' });
  
  adminToken = response.body.token; // 保存 admin 的 JWT

  // 创建一个测试用户
  const testUser = await User.create({
    username: 'testuser',
    email: 'testuser@example.com',
    password: await bcrypt.hash('test123', 10),
    roleId: 2, // 确保这是普通用户的 ID
    phone: '0987654321',
  });

  testUserId = testUser.id; // 保存测试用户的 ID
});

// 测试新建用户
describe('User Management', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'newpass123',
        roleId: 2,
        phone: '1122334455',
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('用户创建成功。');
    expect(response.body.user.username).toBe('newuser');
  });

  // 测试查看用户列表
  it('should get all users', async () => {
    const response = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(1); // 包含 admin 和测试用户
  });

  // 测试删除用户
  it('should delete a user', async () => {
    const response = await request(app)
      .delete(`/api/admin/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('用户删除成功。');

    // 验证用户是否真的被删除
    const checkResponse = await request(app)
      .get(`/api/admin/users/${testUserId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(checkResponse.status).toBe(404); // 用户应已被删除
  });
});

// 清理测试数据
afterAll(async () => {
  await User.destroy({ where: { username: 'admin' } });
  await User.destroy({ where: { username: 'newuser' } });
});
