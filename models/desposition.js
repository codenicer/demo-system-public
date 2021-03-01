'use strict';
module.exports = (sequelize, DataTypes) => {
    const desposition = sequelize.define('desposition', {
            desposition_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'desposition'


        });
    desposition.associate = function(models) {
        // associations can be defined here


    };
    return desposition;
};