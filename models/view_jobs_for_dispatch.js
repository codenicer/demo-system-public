'use strict';
module.exports = (sequelize, DataTypes) => {
  const view_jobs_for_dispatch = sequelize.define('view_jobs_for_dispatch', {
        job_id: DataTypes.INTEGER,
        order_id: DataTypes.INTEGER,
        delivery_date: DataTypes.DATEONLY,
        delivery_time: DataTypes.STRING,
        customer_first_name: DataTypes.STRING,
        customer_last_name: DataTypes.STRING,
        jobtype: DataTypes.STRING,
        total: DataTypes.DOUBLE,
        hub_id: DataTypes.INTEGER,
        customer_id: DataTypes.INTEGER,
        customer_email:DataTypes.STRING,
        customer_phone:DataTypes.STRING,
        shopify_order_name:DataTypes.STRING

  },
  {
        timestamps:false,
        freezeTableName:true,
        underscored:false,
        tableName:'view_jobs_for_dispatch'


      });
    view_jobs_for_dispatch.associate = function(models) {
    // associations can be defined here

    view_jobs_for_dispatch.belongsTo(models.hub, {
      foreignKey: "hub_id"
    });
  };
    view_jobs_for_dispatch.selectable = [
        'order_id',
        'shopify_order_name',
        'job_id',
        'delivery_date',
        'delivery_time',
        'customer_first_name',
        'customer_last_name',
        'jobtype',
        'total',
        'customer_id',
        'customer_email',
        'customer_phone',
        'order_status_id',
        'order_item_status_id',
        'title',
        'order_address_id',
        'payment_status_id',
        'created_at',
        'delivery_date',
        'delivery_time',
        'first_name',
        'last_name',
        'name',
        'company',
        'phone',
        'address_1',
        'address_2',
        'city',
        'province',
        'country',
        'zip',
        'province_code',
        'country_code',
        'latitude',
        'longitude',
        'remarks',
       'hub_id',
       'hub_name',
        'quality_check',
      'payment_method',

    ];
  return view_jobs_for_dispatch;
};