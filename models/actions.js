'use strict';
module.exports = (sequelize, DataTypes) => {
  const actions = sequelize.define('actions', {
      action_id: {
        type:DataTypes.INTEGER,
        primaryKey: true
      },
      description: DataTypes.TEXT

    },
    {
      timestamps: false,
      underscored: false,
      freezeTableName: true,
      tableName:'action'


    });
  actions.associate = function(models) {
    // associations can be defined here


  };
  actions.selectable = [
    'action_id',
    'description',
  ];


  return actions;
};