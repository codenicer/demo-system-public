'use strict';
module.exports = (sequelize, DataTypes) => {
  const email_check = sequelize.define('email_check', {
      email_id: {
        type:DataTypes.INTEGER,
        primaryKey: true
      },
      order_id: DataTypes.INTEGER,
      shopify_order_name: DataTypes.STRING,
      eghl_delivery_tom: DataTypes.INTEGER,
      cod_delivery_tom: DataTypes.INTEGER,
      cpu_delivery_tom: DataTypes.INTEGER,
      paypal_delivery_tom: DataTypes.INTEGER,
      paypalintl_delivery_tom: DataTypes.INTEGER,
      bpi_delivery_tom: DataTypes.INTEGER,
      dragonpay_delivery_tom: DataTypes.INTEGER,
      eghl_delivery_today: DataTypes.INTEGER,
      cod_delivery_today: DataTypes.INTEGER,
      cpu_delivery_today: DataTypes.INTEGER,
      paypal_delivery_today: DataTypes.INTEGER,
      paypalintl_delivery_today: DataTypes.INTEGER,
      bpi_delivery_today: DataTypes.INTEGER,
      dragonpay_delivery_today: DataTypes.INTEGER,
      nopayment_bpi: DataTypes.INTEGER,
      nopayment_dragonpay: DataTypes.INTEGER,
      nopayment_paypalintl: DataTypes.INTEGER,
      oneday_placement_bpi: DataTypes.INTEGER,
      oneday_placement_dragon: DataTypes.INTEGER,
      oneday_placement_paypalintl: DataTypes.INTEGER,
      twoday_placement_bpi: DataTypes.INTEGER,
      twoday_placement_dragonpay: DataTypes.INTEGER,
      twoday_placement_paypalintl: DataTypes.INTEGER,
      cod_sameday: DataTypes.INTEGER,
      paypalintl_sameday: DataTypes.INTEGER,
      bpi_sameday: DataTypes.INTEGER,
      dragonpay_sameday: DataTypes.INTEGER,



    },
    {
      timestamps: false,
      underscored: false,
      freezeTableName: true,
      tableName:'email_check'


    });
  email_check.associate = function(models) {
    // associations can be defined here
    email_check.hasOne(models.order,{foreignKey: 'order_id'});


  };


  return email_check;
};