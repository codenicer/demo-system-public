'use strict';
module.exports = (sequelize, DataTypes) => {
    const product = sequelize.define('product', {
            product_id: {
                type:DataTypes.INTEGER,
                primaryKey: true
            },
            title: DataTypes.STRING,
            handle: DataTypes.STRING,
            tags: DataTypes.STRING,
            type: DataTypes.STRING,
            img_src: DataTypes.TEXT,
            html_body: DataTypes.TEXT,
            updated_at: DataTypes.DATE,
            created_at: DataTypes.DATE,
            florist_production : DataTypes.INTEGER
        },
        {
            timestamps: false,
            underscored: false,
            freezeTableName: true,
            tableName:'product'


        });
    product.associate = function(models) {
    product.belongsTo(models.order_item,{foreignKey: 'product_id'});
    };
    return product;
};