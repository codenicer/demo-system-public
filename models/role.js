'use strict';
module.exports = (sequelize, DataTypes) => {
    const role = sequelize.define('role', {
            role_id: {
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement:true,
            },
            title: DataTypes.STRING,
            description: DataTypes.STRING,
            default_module_item_id: DataTypes.INTEGER,
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
            active: DataTypes.TINYINT
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'role'


        });
    role.associate = function(models) {
        // associations can be defined here
        role.belongsToMany(models.module_item, { through:models.role_module_item, foreignKey:'role_id', otherKey:'module_item_id'});
        role.belongsToMany(models.hub, { through:models.role_hub, foreignKey:'role_id', otherKey:'hub_id'});


    };
    return role;
};