'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserHub = sequelize.define('user_hub', {
    user_id: {
        type:DataTypes.INTEGER

    },
    hub_id: {
        type:DataTypes.INTEGER,
    },
  },
  {
        timestamps: false,
        freezeTableName: true,
        underscored:false,
        tableName:'user_hub'


      });
    UserHub.associate = function(models) {
    // associations can be defined here

        // UserHub.belongsToMany(models.user, { through: models.user_hub, foreignKey: 'user_id'});
        // UserHub.belongsToMany(models.hub, { through: models.user_hub,  foreignKey: 'hub_id'});

  };
  return UserHub;
};