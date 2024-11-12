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
      allowNull: true,
      comment: "用户头像文件路径",
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Role, {
      through: 'UserRoles',
      as: 'roles',
      foreignKey: 'userId',
      otherKey: 'roleId',
    });

    User.belongsToMany(models.Department, {
      through: 'UserDepartments',
      as: 'departments',
      foreignKey: 'userId',
      otherKey: 'departmentId',
    });

    User.belongsToMany(models.Notice, {
      through: 'UserNotices',
      as: 'notices',
      foreignKey: 'userId',
      otherKey: 'noticeId',
    });
  };

  return User;
};
