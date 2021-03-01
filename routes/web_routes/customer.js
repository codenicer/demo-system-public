const db = require("../../models");
const Op = db.Sequelize.Op;
const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')
const {orderFilter} = require('../../helper/helper_funtions')
const {pool,sock_domain} = require('../../config/db')

const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Manila");

const orderModel = db.order;
// const {tablerowResetEmit,floristJobEmit} = require('../../helper/socket_emitters')

//@route  : /api/web/customer


// /system/load_customer_info
router.get('/:customer_id', async (req,res)=>{
    console.log('qusery',`${qs.loadCustomerInfo} WHERE c.customer_id = ? `);
    const {customer_id} = req.params
    try {
        const result = await pool.query(`${qs.loadCustomerInfo} WHERE c.customer_id = ? `,[customer_id])
        if(result.length > 0){
            const customerInfo = result[0]
            const adrList = await pool.query(qs.w_CAdrList,customer_id)
            if(adrList.length > 0){
              const customerOrder =  await orderModel.findAll({
                where:{
                    customer_id : customer_id
                },
                attributes: orderModel.selectable,
                include: [
                  {
                    model: db.customer,
                    required: true
                  },
                  {
                    model: db.order_item,
                    attributes: db.order_item.selectable,
                    required: true
                  },

                  {
                    model: db.hub,
                    required: true
                  },
                  {
                    model: db.payment,
                    attributes: ["name"],
                    required: true
                  },
                  {
                    model: db.order_address,
                    as: "addresses",
                    attributes: db.order_address.selectable,
                    required: true
                  }
                ],
                distinct: true,
                order: [
                  ["priority", "DESC"],
                  ["delivery_date", "DESC"],
                  ["delivery_time", "ASC"]
                ]

              });
                res.json({customerInfo,adrList, customerOrder})
            }else{
                res.json({
                    msg:'Customer information found, but address is null.',
                    customerInfo:customerInfo,
                    customerOrderList:null
                  })
            }
        }else{
            res.status(404).json({msg:'Customer not found.'})
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //





module.exports = router