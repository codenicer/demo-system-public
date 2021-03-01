'use strict';
module.exports = (sequelize, DataTypes) => {
    const order_note_history = sequelize.define('order_note_history', {
            order_note_history_id: {
                type:DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: DataTypes.INTEGER,
            order_id: DataTypes.STRING,
            order_item_id: DataTypes.INTEGER,
            note: DataTypes.TEXT,
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE
        },
        {
            timestamps: false,
            underscored: true,
            deletedAt:false,
            freezeTableName: true,
            tableName:'order_note_history'


        });
    order_note_history.associate = function(models) {
        // associations can be defined here
        order_note_history.belongsTo(models.order,{foreignKey: 'order_id'});
        order_note_history.belongsTo(models.user,{foreignKey: 'user_id'});


    }
  order_note_history.selectable = [
    'order_note_history_id',
    'order_id',
    'order_item_id',
    'user_id',
    'note',
    'created_at',
    'updated_at',


  ];

  order_note_history.logEvent = async (params) => {

    try{
      const xType = typeof params;

      let res = null;
      if ( xType === 'array'){
        res = await order_note_history.bulkCreate(params);
      }else{
        res = await order_note_history.create(params)
      }
      return res;
    }catch(err){
      console.log('order_note_history model error', err);
      return false;

    }

  }

    return order_note_history;
};