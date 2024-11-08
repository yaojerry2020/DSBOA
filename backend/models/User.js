// models/User.js

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true, // 头像字段允许为空
      comment: "用户头像文件路径",
    },
    // 其他字段...
  });

  User.associate = (models) => {
    // 多对多关联 Role
    User.belongsToMany(models.Role, {
      through: 'UserRoles',
      as: 'roles',
      foreignKey: 'userId',
      otherKey: 'roleId',
    });

    // 多对多关联 Department
    User.belongsToMany(models.Department, {
      through: 'UserDepartments',
      as: 'departments',
      foreignKey: 'userId',
      otherKey: 'departmentId',
    });
  };

  return User;
};
