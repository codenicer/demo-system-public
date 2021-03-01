'use strict';
module.exports = (sequelize, DataTypes) => {
  const view_dispatch_for_assignment = sequelize.define('view_dispatch_for_assignment', {
            job_id:{
                  type: DataTypes.INTEGER,
                  primaryKey: true
            },
        datetime_created: DataTypes.DATE,
        payment_method:DataTypes.STRING,
          payment_id:DataTypes.INTEGER,
        quality_check:DataTypes.BOOLEAN,
        order_id: DataTypes.INTEGER,
        shopify_order_name:DataTypes.STRING,
       
        order_status_id:DataTypes.INTEGER,
        title:DataTypes.STRING,
        total: DataTypes.DOUBLE,
        customer_id: DataTypes.INTEGER,
        customer_email:DataTypes.STRING,
        order_address_id:DataTypes.INTEGER,
        hub_id: DataTypes.INTEGER,
        payment_status_id:DataTypes.INTEGER,
        created_at:DataTypes.DATE,
        delivery_date: DataTypes.DATEONLY,
        delivery_time: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        name:DataTypes.STRING,
        company:DataTypes.STRING,
        customer_phone:DataTypes.STRING,
        address_1:DataTypes.STRING,
        address_2:DataTypes.STRING,
        city:DataTypes.STRING,
        province:DataTypes.STRING,
        country:DataTypes.STRING,
        zip:DataTypes.STRING,
        province_code:DataTypes.STRING,
        country_code:DataTypes.STRING,
        jobtype: DataTypes.STRING,
        remarks:DataTypes.STRING

  },
  {
        timestamps:false,
        freezeTableName:true,
        underscored:false,
        tableName:'view_dispatch_for_assignment'
        
      });
 return view_dispatch_for_assignment;
};