// models/UserRoles.js

module.exports = (sequelize, DataTypes) => {
  const UserRoles = sequelize.define('UserRoles', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Roles',
        key: 'id',
      },
      primaryKey: true,
    },
    // 其他字段...
  }, {
    timestamps: false,
  });

  return UserRoles;
};
