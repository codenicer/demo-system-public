"use strict";
module.exports = (sequelize, DataTypes) => {
  const dispatch_job = sequelize.define(
    "dispatch_job",
    {
      dispatch_job_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      tracking_no: DataTypes.STRING,
      rider_id: DataTypes.INTEGER,
      rider_first_name: DataTypes.STRING,
      rider_last_name: DataTypes.STRING,
      rider_mobile_number: DataTypes.STRING,
      rider_provider_id: DataTypes.INTEGER,
      rider_provider_name: DataTypes.STRING,
      status: DataTypes.INTEGER, //1 ASSIGNED, 2 - DISPATCHED, 3 - COMPLETE, 4 - UNDELIVERED 5 - CLOSED
      created_at: DataTypes.DATE,
      created_by_id: DataTypes.INTEGER,
      created_by_name: DataTypes.STRING,
      updated_at: DataTypes.DATE,
      updated_by_id: DataTypes.INTEGER,
      updated_by_name: DataTypes.STRING,
      remarks: DataTypes.STRING,
      batch_type: DataTypes.STRING
      // hub_id: DataTypes.INTEGER
    },
    {
      timestamps: false,
      underscored: false,
      freezeTableName: true,
      tableName: "dispatch_job"
    }
  );
  dispatch_job.associate = function(models) {
    // associations can be defined here
    // dispatch_job.belongsToMany(models.module_item, { through:models.dispatch_job_module_item, foreignKey:'dispatch_job_id', otherKey:'module_item_id'});
    dispatch_job.hasMany(models.dispatch_job_detail, {
      foreignKey: "dispatch_job_id"
    });
    dispatch_job.hasMany(models.view_dispatch_job_detail, {
      foreignKey: "dispatch_job_id"
    });
  };
  return dispatch_job;
};
