'use strict';
module.exports = (sequelize, DataTypes) => {
    const order = sequelize.define('order', {
            order_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            customer_id: DataTypes.INTEGER,
            hub_id: DataTypes.INTEGER,
            order_status_id: DataTypes.INTEGER,
            shopify_order_id: DataTypes.INTEGER,
            shopify_order_name: DataTypes.INTEGER,
            shopify_customer_id: DataTypes.INTEGER,
            dar_printout_ready: DataTypes.INTEGER,
            msg_printout_ready: DataTypes.INTEGER,
            cod_printout_ready: DataTypes.INTEGER,
            quality_check: DataTypes.INTEGER,
            cpu_printout_ready: DataTypes.INTEGER,
            message: DataTypes.STRING,
            delivery_date: DataTypes.DATEONLY,
            delivery_time: DataTypes.STRING,
            note: DataTypes.STRING,
            total_price: DataTypes.INTEGER,
            payment_id:DataTypes.INTEGER,
            payment_status_id:DataTypes.INTEGER,
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
            remarks: DataTypes.TEXT,
            email_ticket_process:DataTypes.INTEGER,
            proof_of_payment: DataTypes.STRING,
            datetime_created: DataTypes.DATE,
            reschedule: DataTypes.INTEGER
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'order'


        });
    order.associate = function(models) {
        // associations can be defined here
      order.hasOne(models.email_check , {foreignKey:'order_id'});
      order.hasMany(models.order_item , {foreignKey:'order_id'});
        order.belongsTo(models.hub,{foreignKey: 'hub_id'});
        order.belongsTo(models.payment,{foreignKey: 'payment_id'});
        order.belongsTo(models.order_address , {as: 'addresses', foreignKey:'order_address_id', otherKey:'order_id'});
        order.belongsTo(models.customer , {foreignKey:'customer_id', otherKey:'order_id'})
        order.hasMany(models.job_rider,{foreignKey: 'order_id'});
      order.hasMany(models.reinstatement , {foreignKey:'order_id'})


    };


    order.selectable = [
        'customer_id',
        'order_id',
        'order_address_id',
        'hub_id',
        'contact_email',
        'order_status_id',
        'payment_status_id',
        'payment_reference',
        'payment_note',
        'created_at',
        'updated_at',
        'last_updated_by',
        'shopify_order_id',
        'shopify_customer_id',
        'shopify_address_id',
        'shopify_order_number',
        'shopify_order_name',
        'shopify_fin_status',
        'shopify_confirmed',
        'shopify_order_status_url',
        'message',
        'delivery_date',
        'delivery_time',
        'note',
        'tags',
        'token',
        'payment_id',
        'shopify_payment_gateway',
        'test',
        'total_price',
        'total_price_USD',
        'subtotal_price',
        'total_weight',
        'total_tax',
        'tax_included',
        'currency',
        'total_discounts',
        'total_line_items_price',
        'buyer_accepts_marketing',
        'referring_site',
        'landing_site',
        'customer_locale',
        'app_id',
        'browser_ip',
        'discount_code',
        'processing_method',
        'source_name',
        'graphiql_api_id',
        'user_agent',
        'cancel_reason',
        'priority',
        'dar_printout_ready',
        'msg_printout_ready',
        'cpu_printout_ready',
        'cod_printout_ready',
        'remarks',
        'email_ticket_process',
        'datetime_created',
        'reschedule'
    ];


    order.payment_method = [

        {
            "id": 1,
            "value": "eGHL",
            "label": "eGHL"

        },
        {
            "id": 2,
            "value": "COD"    ,
            "label":"Cash On Delivery"

        },
        {
            "id": 3,
            "value": "CPU",
            "label": "CPU"

        },
        {
            "id": 4,
            "value": "Paypal",
            "label": "Paypal"

        },
        {
            "id": 5,
            "value": "Paypal_intl",
            "label": "Paypal International"

        },
        {
            "id": 6,
            "value": "Bank - BPI",
            "label": "BPI"

        },
        {
            "id": 7,
            "value": "Dragonpay",
            "label": "Dragonpay"

        },
        {
            "id": 8,
            "value": "Prepaid",
            "label": "Prepaid"

        }
    ];





    return order;
};