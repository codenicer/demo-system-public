'use strict';
module.exports = (sequelize, DataTypes) => {
    const rider = sequelize.define('rider', {
            rider_id: {
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            last_name: DataTypes.STRING,
            first_name: DataTypes.STRING,
            rider_provider_id: DataTypes.INTEGER,
            code: DataTypes.INTEGER,

            mobile_number: DataTypes.STRING,
            status: DataTypes.STRING,
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE
        },
        {
            timestamps: false,
            underscored: true,
            deletedAt:false,
            freezeTableName: true,
            tableName:'rider'


        });
    rider.associate = function(models) {
        // associations can be defined here
        rider.belongsTo(models.rider_provider,{foreignKey: 'rider_provider_id'});


    };
    return rider;
};