'use strict';
module.exports = (sequelize, DataTypes) => {
    const ticket = sequelize.define('ticket', {
            ticket_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            order_id: DataTypes.INTEGER,
            order_item_id: DataTypes.INTEGER,
            desposition_id: DataTypes.INTEGER,
            notes: DataTypes.STRING,
            // description: DataTypes.STRING,
            status_id: DataTypes.INTEGER,
            updated_by: DataTypes.INTEGER,
            created_by: DataTypes.INTEGER,
            can_be_continued: DataTypes.INTEGER,
            level:DataTypes.INTEGER,
            tagged_from:DataTypes.STRING,
            viewed:DataTypes.INTEGER
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'ticket'


        });
    ticket.associate = function(models) {
        // associations can be defined here
       // ticket.hasMany(models.ticket_annotation)


    };
    return ticket;
};