'use strict';
module.exports = (sequelize, DataTypes) => {
    const customer = sequelize.define('customer', {
            customer_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            email: DataTypes.STRING,
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            phone: DataTypes.STRING,
            // updated_at: DataTypes.DATE,
            // created_at: DataTypes.DATE,
            // accepts_marketing: DataTypes.BOOLEAN
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'customer'


        });
    customer.associate = function(models) {
        // associations can be defined here
        //customer.belongsToMany(models.module_item, { through:models.customer_module_item, foreignKey:'customer_id', otherKey:'module_item_id'});


    };
    return customer;
};

