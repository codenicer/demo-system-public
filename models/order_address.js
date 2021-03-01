'use strict';
module.exports = (sequelize, DataTypes) => {
    const order_address = sequelize.define('order_address', {
            order_address_id: {
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
            tableName:'order_address'


        });
    order_address.associate = function(models) {


    };
    
    order_address.selectable = [
        'order_address_id',
        'shopify_order_id',
        'billing_first_name',
        'billing_last_name',
        'billing_name',
        'billing_company',
        'billing_phone',
        'billing_address_1',
        'billing_address_2',
        'billing_city',
        'billing_province',
        'billing_country',
        'billing_zip',
        'billing_province_code',
        'billing_country_code',
        'billing_latitude',
        'billing_longitude',
        'shipping_first_name',
        'shipping_last_name',
        'shipping_name',
        'shipping_company',
        'shipping_phone',
        'shipping_address_1',
        'shipping_address_2',
        'shipping_city',
        'shipping_province',
        'shipping_country',
        'shipping_zip',
        'shipping_province_code',
        'shipping_country_code',
        'shipping_latitude',
        'shipping_longitude',
    ];
    
    return order_address;
};