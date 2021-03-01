'use strict';
module.exports = (sequelize, DataTypes) => {
    const view_available_rider = sequelize.define('view_available_rider', {
            rider_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            last_name: DataTypes.STRING,
            first_name: DataTypes.STRING,
            rider_provider_id: DataTypes.INTEGER,
            rider_provider_name: DataTypes.STRING,
            mobile_number: DataTypes.STRING,
            status: DataTypes.STRING,
            code: DataTypes.STRING,
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE
        },
        {
            timestamps: false,
            underscored: true,
            deletedAt:false,
            freezeTableName: true,
            tableName:'view_available_rider',



        });
    view_available_rider.associate = function(models) {
        // associations can be defined here
       // view_available_rider.hasMany(models.rider_provider,{foreignKey: 'rider_provider_id'});


    };
    return view_available_rider;
};