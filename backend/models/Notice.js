module.exports = (sequelize, DataTypes) => {
  const Notice = sequelize.define('Notice', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: '公告标题',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '公告内容',
    },
    publishedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: '发布时间',
    },
    archived: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: '是否已归档',
    },
  });

  Notice.associate = (models) => {
    Notice.belongsToMany(models.User, {
      through: 'NoticeReadStatus',
      as: 'readers',
      foreignKey: 'noticeId',
      otherKey: 'userId',
    });
  };

  return Notice;
};
