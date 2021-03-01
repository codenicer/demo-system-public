'use strict';
module.exports = (sequelize, DataTypes) => {
    const order_item = sequelize.define('order_item', {
            order_item_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            order_id: DataTypes.INTEGER,
            order_item_status_id: DataTypes.INTEGER,
            product_id:DataTypes.INTEGER,
            properties_name: DataTypes.STRING,
            quantity: DataTypes.INTEGER,
            price: DataTypes.DECIMAL(10, 2),
            title: DataTypes.STRING,
            properties_value: DataTypes.STRING,
            remarks: DataTypes.TEXT,
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'order_item'


        });
    order_item.associate = function(models) {
        // associations can be defined here
        order_item.belongsTo(models.order,{foreignKey: 'order_id'});
        order_item.belongsTo(models.product,{foreignKey: 'product_id'})
        order_item.belongsTo(models.dispatch_job_detail,{foreignKey: 'order_item_id'})
//foreignKey: 'product_id',
    };
    order_item.selectable = [
        'order_item_id',
        'order_id',
        'product_id',
        'shopify_line_item_id',
        'shopify_order_id',
        'shopify_product_id',
        'shopify_variant_id',
        'order_item_status_id',
        'title',
        'quantity',
        'price',
        'properties_name',
        'properties_value',
        'grams',
        'graphiql_api_id',
        'cancel_reason',
        'prev_status',
      'remarks',

    ];
    return order_item;
};