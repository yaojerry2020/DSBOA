// models/UserDepartments.js

module.exports = (sequelize, DataTypes) => {
  const UserDepartments = sequelize.define('UserDepartments', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      primaryKey: true,
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Departments',
        key: 'id',
      },
      primaryKey: true,
    },
    // 其他字段...
  }, {
    timestamps: false,
  });

  return UserDepartments;
};
