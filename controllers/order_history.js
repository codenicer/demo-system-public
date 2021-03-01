const db = require('../models');
const Op = db.Sequelize.Op;
const orderHistoryModel = db.order_history;
const orderModel = db.order;
const orderItemModel = db.order_item;
const productModel = db.product
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Manila");

module.exports = {

        //get order info of specified id
    
        getSelected: async (req) => {
            try{
                const logs = await orderHistoryModel.findAll({
                    where: {...req.query},
                    include:[
                        {
                            model:db.user,
                            require:true
                        }
                    ]
                }, {raw: true});
                return Promise.resolve(logs)
            }catch(err){
                console.log('orderController error:', err);
                res.status(500).json({msg: 'An error has occurred.'});
            }
        },
        create: async (toInsert) => {
console.log('toInsert', toInsert)
            try{
                const logs = await orderHistoryModel.create({
                    ...toInsert
                });
                return Promise.resolve(logs)
            }catch(err){
                console.log('orderController error:', err);
                res.status(500).json({msg: 'An error has occurred.'});
            }
    },
    update: async (form) => {
        const {where,toUpdate} = form
        try{
            const logs = await orderHistoryModel.update({...toUpdate},{
                where: {...where}});
            return Promise.resolve(logs)
        }catch(err){
            console.log('orderController error:', err);
            res.status(500).json({msg: 'An error has occurred.'});
        }
    },
    
};
