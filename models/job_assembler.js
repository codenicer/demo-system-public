'use strict';
module.exports = (sequelize, DataTypes) => {
    const job_assembler = sequelize.define('job_assembler', {
            job_assembler_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            order_id:{type:DataTypes.INTEGER,foreignKey:true},
            user_id:DataTypes.INTEGER,
            accepted_at:DataTypes.DATE,
            completed_at:DataTypes.DATE
                
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'job_assembler'


        });
    job_assembler.associate = function(models) {
        // associations can be defined here
        job_assembler.belongsTo(models.order,{foreignKey:'order_id'});
        job_assembler.belongsTo(models.user,{foreignKey:'user_id'})
       



    };
    
    return job_assembler;
};