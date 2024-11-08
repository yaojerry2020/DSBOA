// models/Role.js

module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 其他字段...
  });

  Role.associate = (models) => {
    // 多对多关联 User
    Role.belongsToMany(models.User, {
      through: 'UserRoles',
      as: 'users',
      foreignKey: 'roleId',
      otherKey: 'userId',
    });

    // 多对多关联 Permission（如果存在）
    Role.belongsToMany(models.Permission, {
      through: 'RolePermissions',
      as: 'permissions',
      foreignKey: 'roleId',
      otherKey: 'permissionId',
    });
  };

  return Role;
};
