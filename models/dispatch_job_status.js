"use strict";
module.exports = (sequelize, DataTypes) => {
  const dispatch_job_status = sequelize.define(
    "dispatch_job_status",
    {
      dispatch_job_status_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      dispatch_job_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING
    },
    {
      timestamps: false,
      underscored: false,
      freezeTableName: true,
      tableName: "dispatch_job_status"
    }
  );
  dispatch_job_status.associate = function(models) {};
  return dispatch_job_status;
};
