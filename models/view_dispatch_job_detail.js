"use strict";
module.exports = (sequelize, DataTypes) => {
  const view_dispatch_job_detail = sequelize.define(
    "view_dispatch_job_detail",
    {
        view_dispatch_job_detail_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        order_id: DataTypes.INTEGER,
        dispatch_job_id: DataTypes.INTEGER,
        order_reference_id: DataTypes.STRING,
        quality_check:  DataTypes.INTEGER,
        status: DataTypes.STRING,
        created_at: DataTypes.DATE,
        updated_at: DataTypes.DATE,
        delivery_date: DataTypes.DATEONLY,
        delivery_time: DataTypes.STRING,
        latitude: DataTypes.DECIMAL(14, 10),
        longitude: DataTypes.DECIMAL(14, 10),
        city: DataTypes.STRING,
        shopify_order_name: DataTypes.STRING,
        remarks: DataTypes.TEXT
    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: false,
      tableName: "view_dispatch_job_detail"
    }
  );
   view_dispatch_job_detail.removeAttribute('id');
  view_dispatch_job_detail.associate = function(models) {
    view_dispatch_job_detail.belongsTo(models.dispatch_job, {
      foreignKey: "dispatch_job_id"
    });
  };
  view_dispatch_job_detail.selectable = [
    "view_dispatch_job_detail_id",
    "dispatch_job_id",
    "shopify_order_name",
    "job_id",
    "delivery_date",
    "delivery_time",
    "customer_first_name",
    "customer_last_name",
    "jobtype",
    "total",
    "customer_id",
    "customer_email",
    "customer_phone",
    "order_id",
    "order_status_id",
    "order_item_status_id",
    "title",
    "order_address_id",
    "payment_status_id",
    "payment_method",
    "created_at",
    "delivery_date",
    "delivery_time",
    "first_name",
    "last_name",
    "name",
    "company",
    "phone",
    "address_1",
    "address_2",
    "city",
    "province",
    "country",
    "zip",
    "province_code",
    "country_code",
    "latitude",
    "longitude",
    "updated_at",
    "status",
    "remarks",
    'hub_id',
    'hub_name',
    'quality_check',
    'payment_method',
  ];
  return view_dispatch_job_detail;
};
