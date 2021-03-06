"use strict";
module.exports = (sequelize, DataTypes) => {
  const view_dispatch_for_delivery = sequelize.define(
    "view_dispatch_for_delivery",
    {
        dispatch_job_detail_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        shopify_order_name: DataTypes.STRING,
        tracking_no: DataTypes.STRING,
        order_id: DataTypes.INTEGER,
        dispatch_job_id: DataTypes.INTEGER,
        job_item_type: DataTypes.STRING,
        item: DataTypes.STRING,
        shipping_name: DataTypes.STRING,
        shipping_phone: DataTypes.STRING,
        shipping_address_1: DataTypes.STRING,
        shipping_address_2: DataTypes.STRING,
        shipping_city: DataTypes.STRING,
        shipping_province: DataTypes.STRING,
        //status: DataTypes.INTEGER, //1 ASSIGNED, 2 - DISPATCHED, 3 - COMPLETE, 4 - UNDELIVERED 5 - CLOSED
        created_at: DataTypes.DATE,
        quality_check: DataTypes.INTEGER,
        status: DataTypes.INTEGER,
        hub_id: DataTypes.INTEGER,
        delivery_date: DataTypes.DATE,
        delivery_time: DataTypes.STRING,
        payment_id: DataTypes.INTEGER,

    },
    {
      timestamps: false,
      freezeTableName: true,
      underscored: false,
      tableName: "view_dispatch_for_delivery"
    }
  );


    view_dispatch_for_delivery.selectable = [
        "created_at",
        "order_id",
        "tracking_no",
        "dispatch_job_id",
        "dispatch_job_detail_id",
        "shopify_order_name",
        "job_item_type",
        "item",
        "delivery_date",
        "delivery_time",
        "payment_id",
        "shipping_name",
        "shipping_phone",
        "shipping_address_1",
        "shipping_address_2",
        "shipping_city",
        "shipping_province",
        "quality_check",
        "hub_id",
        "status"
    ];
  return view_dispatch_for_delivery;
};
