'use strict';
module.exports = (sequelize, DataTypes) => {
    const view_jobs = sequelize.define('view_jobs', {
            order_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            //hub_name: DataTypes.STRING,
            payment_method: DataTypes.STRING,
            job_id: DataTypes.INTEGER,
            title: DataTypes.STRING,
            order_status_id: DataTypes.INTEGER,
            total: DataTypes.INTEGER,
            customer_id: DataTypes.INTEGER,
            customer_email: DataTypes.STRING,
            customer_first_name: DataTypes.STRING,
            customer_last_name: DataTypes.STRING,
            customer_phone: DataTypes.STRING,
            order_address_id: DataTypes.STRING,
            shopify_order_name: DataTypes.INTEGER,
            hub_id: DataTypes.INTEGER,
            quality_check: DataTypes.INTEGER,
            delivery_date: DataTypes.DATEONLY,
            delivery_time: DataTypes.STRING,
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            name: DataTypes.STRING,
            company: DataTypes.STRING,
            address_1: DataTypes.STRING,
            address_2: DataTypes.STRING,
            city: DataTypes.STRING,
            province: DataTypes.STRING,
            country: DataTypes.STRING,
            zip: DataTypes.STRING,
            province_code: DataTypes.STRING,
            country_code: DataTypes.STRING,
            latitude: DataTypes.DECIMAL,
            phone:DataTypes.INTEGER,
            payment_status_id:DataTypes.INTEGER,
            created_at: DataTypes.DATE,
            remarks: DataTypes.TEXT,
            email_ticket_process:DataTypes.INTEGER,
            proof_of_payment: DataTypes.STRING,
            jobtype: DataTypes.STRING
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'view_jobs'


        });
    view_jobs.associate = function(models) {
        // associations can be defined here
    //     view_jobs.hasMany(models.order_item , {foreignKey:'order_id'});
    //     view_jobs.belongsTo(models.hub,{foreignKey: 'hub_id'});
    view_jobs.belongsTo(models.order,{foreignKey: 'order_id'});
    //     view_jobs.belongsTo(models.order_address , {as: 'addresses', foreignKey:'order_address_id', otherKey:'order_id'});
    //     view_jobs.belongsTo(models.customer , {foreignKey:'customer_id', otherKey:'order_id'})
    //     view_jobs.hasMany(models.job_rider,{foreignKey: 'order_id'});
    //   view_jobs.hasMany(models.reinstatement , {foreignKey:'order_id'})


    };


    view_jobs.selectable = [
        'order_id',
        'customer_id',
        'payment_method',
        'job_id',
        'title',
        'order_status_id',
        'total',
        'customer_id',
        'customer_email',
        'customer_first_name',
        'customer_last_name',
        'customer_phone',
        'order_address_id',
        'shopify_order_name',
        'hub_id',
        'payment_status_id',
        'quality_check',
        'delivery_date',
        'delivery_time',
        'first_name',
        'last_name',
        'name',
        'company',
        'address_1',
        'address_2',
        'city',
        'province',
        'country',
        'zip',
        'province_code',
        'country_code',
        'latitude',
        'phone',
        'payment_status_id',
        'created_at',
        'remarks',
        'jobtype'
        
    ];
    return view_jobs;
};