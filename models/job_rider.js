"use strict";
module.exports = (sequelize, DataTypes) => {
  const job_rider = sequelize.define(
    "job_rider",
    {
      job_rider_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      order_id: DataTypes.INTEGER,
      hub_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      accepted_at: DataTypes.DATE,
      completed_at: DataTypes.DATE,
      status: DataTypes.INTEGER,
      target_pickup_date: DataTypes.DATEONLY,
      target_pickup_time: DataTypes.STRING,
      reschedule : DataTypes.INTEGER
    },
    {
      timestamps: false,
      underscored: true,
      deletedAt: false,
      freezeTableName: true,
      tableName: "job_rider"
    }
  );
  job_rider.associate = function(models) {
    // associations can be defined here
    job_rider.belongsTo(models.order,{foreignKey: 'order_id'});
  };
  return job_rider;
};
