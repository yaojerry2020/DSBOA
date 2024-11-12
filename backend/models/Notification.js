// backend/models/Notification.js

module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '通知类型（如公告、任务等）',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '通知标题',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '通知内容',
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否已读',
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Notification;
};
