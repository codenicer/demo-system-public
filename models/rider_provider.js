'use strict';
module.exports = (sequelize, DataTypes) => {
    const rider_provider = sequelize.define('rider_provider', {
            rider_provider_id: {
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
            is_active: DataTypes.INTEGER
        },
        {
            timestamps: false,
            underscored: true,
            freezeTableName: true,
            tableName:'rider_provider'


        });
    rider_provider.associate = function(models) {
        // associations can be defined here



    };
    return rider_provider;
};