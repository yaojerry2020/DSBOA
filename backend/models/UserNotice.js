// models/UserNotice.js

module.exports = (sequelize, DataTypes) => {
  const UserNotice = sequelize.define('UserNotice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    noticeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'UserNotices',
    timestamps: false,
  });

  UserNotice.associate = (models) => {
    UserNotice.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    UserNotice.belongsTo(models.Notice, { foreignKey: 'noticeId', as: 'notice' });
  };

  return UserNotice;
};
