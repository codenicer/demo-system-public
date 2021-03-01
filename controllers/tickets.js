const db = require('../models');
const Op = db.Sequelize.Op;
const ticket = db.ticket;
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Manila");
module.exports = {

        //get order info of specified id
    getAll: async (req) => {
            try{
                const logs = await ticket.findAll({raw: true});
                return Promise.resolve(logs)
            }catch(err){
                console.log('orderController error:', err);
               return Promise.reject('An error has occurred.');
            }
        }
    };
    //  create: async (toInsert) => {
    //         try{
    //             const logs = await orderNoteHistory.create({
    //                 ...toInsert
    //             });
    //             return Promise.resolve(logs)
    //         }catch(err){
    //             console.log('orderController error:', err);
    //            return Promise.reject('An error has occurred.');
    //         }
    // },
    // update: async (form) => {
    //     const {where,toUpdate} = form
    //     try{
    //         const logs = await orderNoteHistory.update({...toUpdate},{
    //             where: {...where}});
    //         return Promise.resolve(logs)
    //     }catch(err){
    //         console.log('orderController error:', err);
    //        return Promise.reject('An error has occurred.');
    //     }
    // },
        
