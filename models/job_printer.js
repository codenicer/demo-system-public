"use strict";
module.exports = (sequelize, DataTypes) => {
  const job_printer = sequelize.define(
    "job_printer",
    {
      job_printer_id: {
        field: "job_printer_id",
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      type: DataTypes.STRING,
      file_location: DataTypes.STRING,
      order_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      reprinted_at: DataTypes.DATE,
      printed_at: DataTypes.DATE,
      shopify_order_name: DataTypes.STRING
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: false,
      tableName: "job_printer"
    }
  );
  job_printer.associate = function(models) {
    // associations can be defined here
    // //config.belongsToMany(models.user, { through: models.user_config, foreignKey:'config_id'});
  };
  return job_printer;
};
