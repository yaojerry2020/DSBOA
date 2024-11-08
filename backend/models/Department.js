// models/Department.js

module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Departments',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // 其他字段...
  });

  Department.associate = (models) => {
    Department.belongsTo(models.Department, { as: 'parentDepartment', foreignKey: 'parentId' });
    Department.hasMany(models.Department, { as: 'subDepartments', foreignKey: 'parentId' });

    // 多对多关联 User
    Department.belongsToMany(models.User, {
      through: 'UserDepartments',
      as: 'users',
      foreignKey: 'departmentId',
      otherKey: 'userId',
    });
  };

  return Department;
};
