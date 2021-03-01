'use strict';
module.exports = (sequelize, DataTypes) => {
    const role_module_item = sequelize.define('role_module_item', {
            role_id: {
                type:DataTypes.INTEGER,
                foreignKey:true,
            },
            module_item_id: {
                type:DataTypes.INTEGER,
                foreignKey:true,
            }

        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'role_module_item'


        });
    role_module_item.associate = function(models) {
        // associations can be defined here

        role_module_item.belongsTo(models.module_item, {foreignKey:'module_item_id'});
       // role_module_item.hasMany(models.role, {foreignKey:'role_id'});

    };
    return role_module_item;
};