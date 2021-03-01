'use strict';
module.exports = (sequelize, DataTypes) => {
    const annotation = sequelize.define('annotation', {
            annotation_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            note: DataTypes.TEXT,
            user_id: DataTypes.INTEGER,
            timestamp: DataTypes.DATE,
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'annotation'


        });
    annotation.associate = function(models) {
        // associations can be defined here
        annotation.belongsTo(models.ticket,{foreignKey: 'ticket_id'});

    };
    return annotation;
};