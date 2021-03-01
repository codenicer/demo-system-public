'use strict';
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    user_id: {
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    img_src: DataTypes.STRING,
    //updated_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    status: DataTypes.INTEGER,
    hub_id: DataTypes.INTEGER,
    role_id: DataTypes.INTEGER,
    //active: DataTypes.BOOLEAN
  },
  {
        timestamps: false,
        underscored: false,
        freezeTableName: true,
        tableName:'user'


      });
    user.associate = function(models) {
    // associations can be defined here
        user.belongsToMany(models.hub, { through:models.user_hub, foreignKey:'user_id', otherKey:'hub_id'});
        user.belongsTo(models.role, { foreignKey:'role_id'});
        user.hasMany(models.order_note_history,{foreignKey: 'user_id'});

  };
    //custom property
    //filter through
    user.filterable = [
        'email',
        'first_name',
        'last_name',
        'status',
    ];


  return user;
};