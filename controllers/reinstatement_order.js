const db = require('../models')
const Op = db.Sequelize.Op
const orderModel = db.order
const orderItemModel = db.order_item
const _ = require('lodash')
const  LogHistoryController = require('../controllers/order_history')
const reinstatementModel = db.reinstatement
const {queryStringToSQLQuery} = require('../helper/queryStringToSQLQuery')
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Manila");
const reinstate = 'Order has been sent to reinstatement order'
const acceptReinstate = 'Order has been sent to production from reinstatement order'
const declineReinstate = 'Order has been declined in reinstatement order'

module.exports = {
  createReinstatement: async (req, res) => {
    const reinstatementData = req.body
    const {user_id} =req.user
    const {order_id,remarks} = reinstatementData
    try {

      const insertdata = {
        order_id: reinstatementData.order_id,
        status: 0,
        remarks: reinstatementData.remarks,
        delivery_time: reinstatementData.delivery_time,
        delivery_date: reinstatementData.delivery_date,
        created_by: req.user.user_id

      }

      console.log(insertdata)
      
      await db.sequelize.query("INSERT INTO `order_note_history` SET  user_id = ? ,order_id =? ,note = ? ",{replacements:[user_id,order_id,remarks]})

      const result = await reinstatementModel.create(insertdata)

      if (!result) {
        console.log('Reinstatement controller error: ', result)
        res.status(400).json({msg: 'Unable to create reinstatement record'})
      } else {
        const order_id = reinstatementData.order_id
        await LogHistoryController.create({order_id,user_id,action:reinstate,action_id: 26
          ,data_changed : JSON.stringify(insertdata)})

        res.status(200).json({msg: 'Reinstatement successfully created.'})


      }
    } catch (err) {
      res.status(400).json({msg: 'Unable to create reinstatement record'})
    }
  },

  getReinstatementOrder: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req)


    try {
      const qs = {
        distinct: true,
        attributes: orderModel.selectable,
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true
          },
          {
            model: db.payment,
            attributes: ['name'],
            required: true
          },
          {
            model: db.order_address,
            as: 'addresses',
            attributes: db.order_address.selectable
            // required:true,

          },
          {
            model: db.hub,
            attributes: db.hub.selectable
            // required:true,

          },
          {
            model: db.reinstatement,
            required: true,
            where: {
              status: 0
            },
            include: {
              model: db.user,
              attributes: db.user.selectable,
            }

          }
        ],
        order: [
          ['priority', 'DESC'],
          ['delivery_date', 'DESC'],
          ['delivery_time', 'ASC']
        ]
      }

      //   const finalQS = Object.assign(qs,);

      let finalQS = {...qs, limit: reqQs['limit'], offset: reqQs['offset'], where: {...qs['where'], ...reqQs['where']}}

      const result = await orderModel.findAndCountAll(finalQS, {raw: true})

      if (!result) {

        res.status(200).json({status: 401, msg: 'No records found', rows: [], count: 0})
      } else {
        res.status(200).json(result)
      }
    } catch (err) {
      console.log('Reinstatement Controller', err.message)
      res.status(400).json({msg: 'Unable to process request'})
    }
  },



  updateReinstatement: async (req, res) => {

    try {
      const {user_id} = req.user
      const {order_id} = req.body
      const result = await reinstatementModel.findAll(
        {
          where: {order_reinstatement_request_id: req.body.order_reinstatement_request_id},
        },
        {raw: true}
      )
      if (!result) {
        res.status(401).json({msg: 'Unable to find reinstatement record'})
      } else {
        const update_res = await reinstatementModel.update({

          status: req.body.status,
          approved_by: req.user.user_id,

        }, {
          where: {order_reinstatement_request_id: req.body.order_reinstatement_request_id}
        })

        console.log('req.bod', req.body)



        if(req.body.payment_status_id){

          if(req.body.payment_status_id == 4){
            await orderModel.update({
                payment_status_id: 1,

              },
              {
                where: {order_id: req.body.order_id}
              })

          }
        }
        if (req.body.order_status_id != null) {
          await orderModel.update({
              order_status_id: req.body.order_status_id,
              delivery_date : req.body.delivery_date,
              delivery_time : req.body.delivery_time
            },
            {

              where: {order_id: req.body.order_id}
            })
          if (req.body.order_status_id == 3) {
            await orderItemModel.update({
                order_item_status_id: 2
              },
              {
                where: {order_id: req.body.order_id}
              })
            if (new Date().toISOString().slice(0, 10) == req.body.delivery_date ) {
              await db.sequelize.query("INSERT INTO job_florist (order_item_id)  SELECT oi.order_item_id FROM order_item oi JOIN `order` o on oi.order_id = o.order_id" +
                " AND oi.order_id = ? JOIN product p on oi.product_id = p.product_id AND p.florist_production = 1" +
                " WHERE oi.order_item_id not in (Select jb.order_item_id from job_florist jb)", {replacements: [req.body.order_id]})
            }

            if(req.body.payment_id == 3 && req.body.  payment_status_id !== 2){

              const updateJobrider = await db.job_rider.update({
                status: 7},{
                where : { order_id : req.body.order_id}
              })

              if(!updateJobrider){
                console.log('not updated')
              }else{
                console.log('Update Successful')
              }


            }
            await LogHistoryController.create({order_id,user_id,action:acceptReinstate,action_id: 29,
              data_changed : JSON.stringify({order_id : req.body.order_id, order_status_id : 3})})
          }

        }else{
          await LogHistoryController.create({order_id, user_id, action:declineReinstate})

        }


        if (!update_res) {
          console.log('error', update_res)
          res.status(401).json({msg: 'Unable to update record'})
        } else {
          res.status(200).json({msg: 'Reinstatement successfully updated'})
        }
      }
    } catch (err) {
      console.log('error', err)
      res.status(400).json({msg: 'Unable to update reinstatement record'})
    }
  },
}