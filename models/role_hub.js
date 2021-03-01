'use strict';
module.exports = (sequelize, DataTypes) => {
  const role_hub = sequelize.define('role_hub', {
    role_id: {
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
        tableName:'role_hub'


      });
    role_hub.removeAttribute('id');
    role_hub.associate = function(models) {
    // associations can be defined here
      role_hub.belongsTo(models.role, {foreignKey:'role_id'});


  };
  return role_hub;
};