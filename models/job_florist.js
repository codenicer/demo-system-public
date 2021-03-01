"use strict";
module.exports = (sequelize, DataTypes) => {
  const job_florist = sequelize.define(
    "job_florist",
    {
      job_florist_id: {
        field: "job_florist_id",
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_item_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      created_at: DataTypes.DATE,
      accepted_at: DataTypes.DATE,
      completed_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: false,
      tableName: "job_florist"
    }
  );
  job_florist.associate = function(models) {
    // associations can be defined here
    // //config.belongsToMany(models.user, { through: models.user_config, foreignKey:'config_id'});
    job_florist.belongsTo(models.order_item,{foreignKey: 'order_item_id'});
  };
  return job_florist;
};
