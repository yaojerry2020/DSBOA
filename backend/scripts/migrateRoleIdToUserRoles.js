// scripts/migrateRoleIdToUserRoles.js

const { User, Role, UserRoles, sequelize } = require('../models');

const migrateRoleId = async () => {
  try {
    await sequelize.transaction(async (t) => {
      // 获取所有用户
      const users = await User.findAll({ transaction: t });

      for (const user of users) {
        if (user.roleId) {
          // 检查关联是否已经存在
          const existing = await UserRoles.findOne({
            where: { userId: user.id, roleId: user.roleId },
            transaction: t,
          });

          if (!existing) {
            await UserRoles.create(
              {
                userId: user.id,
                roleId: user.roleId,
              },
              { transaction: t }
            );
          }
        }
      }

      // 事务结束后，可以选择删除 roleId 字段（如果尚未删除）
      // 如果已经在迁移文件中删除 roleId 字段，这一步可跳过
    });

    console.log('角色ID迁移完成');
    process.exit();
  } catch (error) {
    console.error('角色ID迁移失败:', error);
    process.exit(1);
  }
};

migrateRoleId();
