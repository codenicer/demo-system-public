'use strict';
module.exports = (sequelize, DataTypes) => {
  const ProductHub = sequelize.define('product_hub', {
    product_id: {
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
        tableName:'product_hub'


      });
    ProductHub.associate = function(models) {
    // associations can be defined here

        // ProductHub.belongsToMany(models.user, { through: models.product_hub, foreignKey: 'product_id'});
        // ProductHub.belongsToMany(models.hub, { through: models.product_hub,  foreignKey: 'hub_id'});

  };
  return ProductHub;
};