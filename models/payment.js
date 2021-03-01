'use strict';
module.exports = (sequelize, DataTypes) => {
    const payment = sequelize.define('payment', {
            payment_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            name: DataTypes.STRING,
            type: DataTypes.STRING,
            description: DataTypes.STRING,
            shopify_payment_gateway: DataTypes.STRING,
            allow_prod_b4_payment: DataTypes.BOOLEAN,
            active: DataTypes.BOOLEAN,
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'payment'


        });
    payment.associate = function(models) {
        // associations can be defined here


    };
    return payment;
};