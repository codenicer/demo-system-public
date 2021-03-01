"use strict";
module.exports = (sequelize, DataTypes) => {
  const Hub = sequelize.define(
    "hub",
    {
      hub_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      is_active: DataTypes.BOOLEAN
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: false,
      tableName: "hub"
    }
  );
  Hub.associate = function(models) {
    // associations can be defined here
    // //hub.belongsToMany(models.user, { through: models.user_hub, foreignKey:'hub_id'});
  };
  Hub.selectable = ["hub_id", "name", "address", "is_active"];
  return Hub;
};
