'use strict';
module.exports = (sequelize, DataTypes) => {
    const order_history = sequelize.define('order_history', {
            order_history_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            order_id: DataTypes.INTEGER,
            order_item_id: DataTypes.INTEGER,
            user_id: DataTypes.INTEGER,
            created_at: DataTypes.DATE,
            updated_at: DataTypes.DATE,
            action: DataTypes.TEXT,
        action_id: DataTypes.INTEGER,
      data_changed:DataTypes.TEXT
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'order_history'


        });
    order_history.associate = function(models) {
        // associations can be defined here
        order_history.belongsTo(models.order,{foreignKey: 'order_id'});
        order_history.belongsTo(models.user,{foreignKey: 'user_id'});
      order_history.belongsTo(models.actions,{as : 'Actions', foreignKey: 'action_id'});
    };
    order_history.selectable = [
        'order_history_id',
        'order_id',
        'order_item_id',
        'user_id',
        'action',
        'created_at',
        'updated_at',



    ];

    order_history.logEvent = async (params) => {

      try{
        const xType = typeof params;

        let res = null;
        if ( xType === 'array'){
          res = await order_history.bulkCreate(params);
        }else{
          res = await order_history.create(params)
        }
        return res;
      }catch(err){
        console.log('order_history model error', err);
        return false;

      }

    }
    return order_history;
};