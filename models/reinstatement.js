'use strict';
module.exports = (sequelize, DataTypes) => {
    const reinstatement = sequelize.define('reinstatement', {
            order_reinstatement_request_id: {
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            order_id: DataTypes.INTEGER,
            created_at: DataTypes.DATE,
            deleted_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            approved_by: DataTypes.STRING,
            created_by: DataTypes.INTEGER,
            delivery_date: DataTypes.DATE,
            delivery_time: DataTypes.STRING,
            remarks: DataTypes.INTEGER,

            status: DataTypes.STRING
            

        },
        {
            timestamps: false,
            underscored: true,
            deletedAt:false,
            freezeTableName: true,
            tableName:'order_reinstatement_request'


        });
    reinstatement.associate = function(models) {
        // associations can be defined here
        reinstatement.belongsTo(models.order,{foreignKey: 'order_id'});
        reinstatement.belongsTo(models.user,{foreignKey: 'created_by'});



    };
    return reinstatement;
};