'use strict';
module.exports = (sequelize, DataTypes) => {
  const customer_address = sequelize.define('customer_address', {
      customer_address_id: {
        type:DataTypes.INTEGER,
        primaryKey: true
      },

      updated_at: DataTypes.DATE,
      created_at: DataTypes.DATE
    },
    {
      timestamps: false,
      underscored: false,
      freezeTableName: true,
      tableName:'customer_address'


    });
  customer_address.associate = function(models) {


  };

  customer_address.selectable = [
      'customer_address_id',
    'customer_id',
    'shipping_customer_address_id',
    'billing_customer_address_id',
    'order_address_id',
    'type',
    'updated_at',
    'created_at',
    'first_name',
    'last_name',
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
    'longtitude',
  ];

  return customer_address;
};