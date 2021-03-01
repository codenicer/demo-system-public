'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserToken = sequelize.define('user_token', {
    id: {
        type:DataTypes.INTEGER,
        primaryKey: true
    },
    token: DataTypes.STRING,
    timestamp: DataTypes.DATE,
    active: DataTypes.BOOLEAN
  },
  {
        timestamps: false,
        freezeTableName: true


      });
    UserToken.associate = function(models) {
    // associations can be defined here
  };
  return UserToken;
};