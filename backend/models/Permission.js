// models/Permission.js

module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
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

  Permission.associate = (models) => {
    // 多对多关联 Role
    Permission.belongsToMany(models.Role, {
      through: 'RolePermissions',
      as: 'roles',
      foreignKey: 'permissionId',
      otherKey: 'roleId',
    });
  };

  return Permission;
};
