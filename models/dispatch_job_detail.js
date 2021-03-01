'use strict';
module.exports = (sequelize, DataTypes) => {
    const dispatch_job_detail = sequelize.define('dispatch_job_detail', {
            dispatch_job_detail_id: {
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
                dispatch_job_id:DataTypes.INTEGER,
                order_id:DataTypes.INTEGER,
                order_reference_id:DataTypes.INTEGER,
                order_item_id:DataTypes.INTEGER,
                status:DataTypes.STRING,
                created_at:DataTypes.DATE,
                updated_at:DataTypes.DATE,
                remarks:DataTypes.TEXT,
                job_description:DataTypes.STRING,
                job_item_type:DataTypes.STRING,
                lat:DataTypes.DECIMAL(14,10),
                lng:DataTypes.DECIMAL(14,10),
                address:DataTypes.STRING,
                city:DataTypes.STRING,
                shopify_order_name:DataTypes.STRING,



        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'dispatch_job_detail'


        });
    dispatch_job_detail.associate = function(models) {
        // associations can be defined here
       dispatch_job_detail.belongsTo(models.dispatch_job, {foreignKey:'dispatch_job_id'});
       dispatch_job_detail.hasMany(models.order, {foreignKey:'order_id'});
       dispatch_job_detail.belongsTo(models.order_item, {foreignKey:'order_item_id'});
      dispatch_job_detail.belongsTo(models.job_rider, {foreignKey:'order_reference_id'});


    };
    return dispatch_job_detail;
};