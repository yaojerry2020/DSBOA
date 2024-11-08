// scripts/checkAdminUser.js

const { User, Role } = require('../models');

const checkAdminUser = async () => {
  try {
    const user = await User.findOne({
      where: { username: 'adminuser' },
      include: [
        { model: Role, as: 'roles' },
      ],
    });

    if (user) {
      console.log(`用户 ${user.username} 关联的角色:`, user.roles.map(role => role.name));
    } else {
      console.log('未找到管理员用户');
    }
  } catch (error) {
    console.error('检查管理员用户失败:', error);
  }
};

checkAdminUser().then(() => process.exit());
