'use strict';
module.exports = (sequelize, DataTypes) => {
    const payment_refund = sequelize.define('payment_refund', {
            id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            payments_id: DataTypes.INTEGER,
            shopify_order_name: DataTypes.STRING,
            amount: DataTypes.FLOAT,
            status: DataTypes.STRING,
            created_at: DataTypes.DATE,
            created_by_id: DataTypes.INTEGER,
            approved_by_id: DataTypes.INTEGER,
            approved_at: DataTypes.DATE,
            notes: DataTypes.STRING,
            payment_refund_request: DataTypes.STRING,
            payment_refund_response: DataTypes.STRING,
            refund_status: DataTypes.STRING,
            refund_type: DataTypes.STRING,
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'payment_refund'


        });
    payment_refund.associate = function(models) {
        // associations can be defined here


    };
    return payment_refund;
};