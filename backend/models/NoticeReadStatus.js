module.exports = (sequelize, DataTypes) => {
  const NoticeReadStatus = sequelize.define('NoticeReadStatus', {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id',
      },
      primaryKey: true,
    },
    noticeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Notices',
        key: 'id',
      },
      primaryKey: true,
    },
    readAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      comment: '阅读时间',
    },
  }, {
    timestamps: false,
  });

  return NoticeReadStatus;
};
