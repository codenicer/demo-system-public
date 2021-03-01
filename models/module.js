'use strict';
module.exports = (sequelize, DataTypes) => {
    const module = sequelize.define('module', {
            module_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            title: DataTypes.STRING,
            description: DataTypes.STRING,
        },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName:'module'


        });
    module.associate = function(models) {
        // associations can be defined here
       module.hasMany(models.module_item,{foreignKey: 'module_id'})

    };
    return module;
};