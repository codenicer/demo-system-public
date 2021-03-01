'use strict';
module.exports = (sequelize, DataTypes) => {
    const module_item = sequelize.define('module_item', {
            module_item_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            url: DataTypes.STRING,
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'module_item'


        });
    module_item.associate = function(models) {
        // associations can be defined here

        module_item.hasMany(models.role_module_item,{foreignKey: 'module_item_id'});
        module_item.belongsTo(models.module, {foreignKey: 'module_id'});

    };
    return module_item;
};