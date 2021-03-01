const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const query_string = require('qs')
const db = require('../../models');
const Op = db.Sequelize.Op;
const orderModel = db.order;
const qs = require('../../helper/query_string')
const {OrderHelper} = require('../../helper/helper_funtions')

const axios = require('axios')

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Manila");

const OrderController = require('../../controllers/order')
const MailController = require('../../controllers/mailer')
const  LogHistoryController = require('../../controllers/order_history')
const  ReinstatementOrderController = require('../../controllers/reinstatement_order')
const PrioritizationController = require('../../controllers/prioritization')
const  NoteHistoryController = require('../../controllers/order_note_history');

const PaymentRefundController = require('../../controllers/payment_refund');

const nodemailer = require('nodemailer')
const paid = `Order has been successfully verified as paid with reference number `
const toProd = `Order has been sent to production.`
const toAssemblyDirect = `Order has been sent to directly to assembly.`
const hold = 'Order has been hold and create ticket automatically'
const cancel = 'Order has been cancelled.'
const updateDeliveryTime = 'Delivery Time of Order has been updated to '
const updateDeliveryDate = 'Delivery Date of Order has been updated to '
const updateHubId = 'Hub of Order has been updated to '
const updatePaymentMethod = 'Payment Method of Order has been updated to '
const updateShippingAddress = 'Shipping Address of Order has been updated to '
const updateBillingAddress = 'Billing Address of Order has been updated to '
const updateShippingContact = 'Shipping Contact Info of Order has been updated to '
const updateBillingContact = 'Billing Contact Info of Order has been updated to '
const updateMessage = 'Message of Order has been updated'
const updateInstructions = 'Instructions of Order has been updated'
const updateCpuDeliveryDate = 'Delivery Date of Cash pick up order has been updated to '
const updateCpuDeliveryTime = 'Delivery Time of Cash pick up order has been updated to '
const updateCpuHub = 'Hub of Cash pick up order has been updated'

//deleted on socket tuning.
// const {GETorders,GETtickets,GETfloristjob,GETprio_list,GETclosedorder,GETtickets_counts,GETnotesnlogs,GETclosedticket,GETselected_ticket} = commands
// const {pool,sock_domain} = require('../../config/db')
// const {next,commands } = require('../../helper/dynamic_emitter')
// const {tablerowResetEmit} = require('../../helper/socket_emitters')









const sendEMail = require('../../helper/sendEmail.json')

router.get('/',m_auth, async (req,res)=>{
    try {
         const result = await OrderController.getOpenOrder(req)
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
});
router.patch("/setqualitycheck", m_auth,  async (req,res)=> {
  
    OrderController.setQualityCheck(req,res)
})
router.get("/vieworder/",  m_auth, OrderController.getInfo);

router.get('/nohub', m_auth,  async (req,res)=>{
    try {
        const result = await OrderController.getOpenOrderNoHub(req)
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
});

router.get('/restofphil', m_auth,  async (req,res)=>{
  try {
      const result = await OrderController.getRestofPhilOrder(req)
      res.json(result)
  } catch (err) {
      console.log(err.message)
      res.status(500).json({msg:"Server error."})
  }
});

router.get('/restofphilDispatch', m_auth,  async (req,res)=>{
  try {
      const result = await OrderController.getRestofPhilOrderDispatch(req)
      res.json(result)
  } catch (err) {
      console.log(err.message)
      res.status(500).json({msg:"Server error."})
  }
});

router.get('/noDateTime', m_auth,  async (req,res)=>{
    try {
        const result = await OrderController.getOpenOrderNoDateOrTime(req)
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})


router.get('/filter', m_auth,  async (req,res)=>{
    try {
        const result = await OrderController.getOpenOrder(req)

        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

router.post("/riderInfo", m_auth,  OrderController.getRiderInformation);


// ************ NEXT LINE ************ //
router.get("/closedorders", m_auth,  async (req, res) => {
    try {
      const result = await OrderController.getClosedOrder(req);
      res.status(200).json(result);
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
  });

  // ************ NEXT LINE ************ //
router.get("/unpaidorders", m_auth,  async (req, res) => {
  try {
    const result = await OrderController.getUnpaidOrders(req);
    res.status(200).json(result);
  } catch (err) {
      console.log(err.message)
      res.status(500).json({msg:"Server error."})
  }
});

  // ************ NEXT LINE ************ //
  router.get("/ordersonhold", m_auth,  async (req, res) => {
    try {
      const result = await OrderController.getOrdersOnhold(req);
      res.status(200).json(result);
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
  });

router.post('/sympathy',m_auth, async (req,res)=>{
  
  try {
    const result = await OrderController.getSympathyOrder(req)
    res.json(result)
  } catch (err) {
    console.log(err.message)
    res.status(500).json({msg:"Server error."})
  }
});


// ************ NEXT LINE ************ //

// /system/update_order
router.patch('/',  m_auth, async (req,res)=>{


   
    const {resolve} = req.body
    const {user_id} = req.user
   const {delivery_date,delivery_time,message,note,order_id,order_address_id,hub_id,ticket_id,payment_id,action,from} = req.body.order
    const {billing_address_1,billing_address_2,billing_city,billing_name,billing_phone,billing_country,billing_province,billing_zip} = req.body.order['addresses']
    const {shipping_address_1,shipping_address_2,shipping_city,shipping_name,shipping_phone,shipping_country,shipping_province,shipping_zip} = req.body.order['addresses']

    try {
 
const customer_order_address = await db.sequelize.query("SELECT * FROM `customer_order_address` where id = ?",
  {replacements:[order_address_id]})

      const last_billing_name = billing_name.split(" ").splice(-1);
       const first_billing_name = billing_name.replace(/ .*/,'');
       const last_shipping_name = shipping_name.split(" ").splice(-1);
       const first_shipping_name = shipping_name.replace(/ .*/,'');

      const [result1 ] = await db.sequelize.query("UPDATE `order`  SET hub_id = ? ,delivery_date = ?, delivery_time = ?, message = ?, note = ?, payment_id = ? WHERE order_id = ?",
                                                         {replacements:[hub_id,delivery_date,delivery_time,message,note,payment_id,order_id]})
    //   const [result] = await db.sequelize.query(qs.updateBillingOrderInfo,{replacements:[
    //     first_billing_name,last_billing_name,billing_address_1,billing_address_2,billing_city,billing_province,billing_zip,
    //   billing_phone,billing_country,customer_order_address[0][0].billing_address_id
    // ]})
    //     await db.sequelize.query(qs.updateShippingOrderInfo,{replacements:[
    //       first_shipping_name,last_shipping_name,shipping_address_1,shipping_address_2,shipping_city,shipping_province,shipping_zip,shipping_phone,
    //     shipping_country,customer_order_address[0][0].shipping_address_id
    // ]})

      await db.sequelize.query(qs.updateOrderInfo,{replacements:[
        shipping_name,shipping_address_1,shipping_address_2,shipping_city,shipping_province,shipping_zip,shipping_phone,
        shipping_country,billing_name,billing_address_1,billing_address_2,billing_city,billing_province,billing_zip,
        billing_phone,billing_country,order_address_id
      ]})


      await db.sequelize.query("INSERT INTO job_florist (order_item_id) SELECT oi.order_item_id FROM order_item oi JOIN `order` o on oi.order_id = o.order_id" +
        " AND oi.order_id = ? JOIN product p on oi.product_id = p.product_id AND p.florist_production = 1" +
        " WHERE  DATE(o.delivery_date) = CURDATE() and  " +
        "oi.order_item_id not in (Select jb.order_item_id from job_florist jb)", {replacements: [req.body.order.order_id]})


      await db.sequelize.query("UPDATE `order` SET `order_status_id` = 2 WHERE DATE(delivery_date) = CURDATE() and order_id = ? AND order_status_id < 2" , {replacements: [req.body.order.order_id]})
      if(req.body.order.payment.name == 'CPU'){
        if(req.body.order.payment.payment == 'yes'){
          await db.sequelize.query(`INSERT INTO job_rider (order_id) SELECT ${req.body.order.order_id} FROM job_rider WHERE NOT EXISTS (SELECT order_id FROM job_rider WHERE order_id =${req.body.order.order_id}) LIMIT 1`
    )
          await db.sequelize.query(`update job_rider jr inner join` +  ' `order` ' + `o on o.order_id = jr.order_id and o.shopify_order_name = '${req.body.order.shopify_order_name}'` +
          ` set jr.target_pickup_date =` +
          ` CASE` +
          ` WHEN Hour(o.created_at) > 18 THEN  DATE(date_add( o.created_at ,INTERVAL 1 DAY)) WHEN Hour(o.created_at) = 18 THEN  daTE(o.created_at)` +
          ` ELSE` +
          ` CASE` +
          ` WHEN Hour(o.created_at) < 10 THEN daTE(o.created_at) WHEN Hour(o.created_at) >= 10 THEN daTE(o.created_at) WHEN Hour(o.created_at) >= 14 THEN daTE(o.created_at)` +
          ` END` +
          ` END,` +
          ` jr.target_pickup_time = CASE WHEN Hour(o.created_at) > 18 THEN  'Morning: 9am - 1pm' WHEN Hour(o.created_at) = 18 THEN  'Anytime'` +
          ` ELSE` +
          ` CASE` +
          ` WHEN Hour(o.created_at) < 10 THEN 'Morning: 9am - 1pm' WHEN Hour(o.created_at) >= 10 THEN 'Afternoon: 1pm - 5pm' WHEN Hour(o.created_at) >= 14 THEN 'Evening: 5pm - 8pm'` +
          ` END` +
          ` END;`)

        }
      }

      console.log('req.', action)

      if (action.includes('delivery_date')){

        await orderModel.update({
          reschedule : 1
          },
          {where : { order_id : req.body.order.order_id}
        })
        await LogHistoryController.create({order_id,user_id,action:updateDeliveryDate + delivery_date, action_id : 2
          ,data_changed : JSON.stringify({order_id : req.body.order.order_id, delivery_date})})

      }
      if (action.includes('delivery_time')){

        await orderModel.update({
            reschedule : 1
          },
          {where : { order_id : req.body.order.order_id}
          })

        await LogHistoryController.create({order_id,user_id,action:updateDeliveryTime + delivery_time, action_id : 3
          ,data_changed : JSON.stringify({order_id : req.body.order.order_id, delivery_time})})

      }
      if (action.includes('hub_id')){
        // console.log("HERE")
        // console.log(req.body.order)
        await db.sequelize.query("UPDATE job_rider SET status = 7 WHERE order_id = ? AND status = 12",{replacements:[order_id]})
        await db.sequelize.query(qs.updateOrderAndOrderItemOnResolved,{replacements:[order_id]})
        await db.sequelize.query("UPDATE `ticket` set status_id = 3 ,updated_by = ? where order_id = ? and disposition_id = 4",{
          replacements:[user_id,order_id]
        })


       

        await LogHistoryController.create({order_id,user_id,action:updateHubId + req.body.order.hubname.name, action_id : 4
          ,data_changed : JSON.stringify({order_id : req.body.order.order_id, hub_name: req.body.order.hubname.name,
            hub_id : req.body.order.hub_id})})

      }
      if (action.includes('payment_id')){
          await LogHistoryController.create({order_id,user_id,action:updatePaymentMethod + req.body.order.payment.name, action_id : 5
            ,data_changed : JSON.stringify({order_id : req.body.order.order_id, payment_name : req.body.order.payment.name,
              payment_id : req.body.order.payment_id})})

      }

      if (action.includes('sname')){
        await LogHistoryController.create({order_id,user_id,action:'Shipping Name Has Been Updated', action_id : 7
          ,data_changed : JSON.stringify({order_id : req.body.order.order_id,})})

      }
      if (action.includes('bname')){
        await LogHistoryController.create({order_id,user_id,action:'Billing Name Has Been Updated', action_id : 7
          ,data_changed : JSON.stringify({order_id : req.body.order.order_id})})

      }
      if (action.includes('scontact')){
        if(req.body.order.edit_ship_phone != shipping_phone) {
          await LogHistoryController.create({order_id,user_id,action:updateShippingContact + shipping_phone, action_id : 23
            ,data_changed : JSON.stringify({order_id : req.body.order.order_id, shipping_phone})})
        }

      }  
      if (action.includes('bcontact')){
        if(req.body.order.edit_billing_phone != billing_phone) {
          await LogHistoryController.create({order_id,user_id,action:updateBillingContact + billing_phone, action_id : 23
            ,data_changed : JSON.stringify({order_id : req.body.order.order_id, billing_phone})})
        }

      }
      if (action.includes('message')){
        if(req.body.order.edit_message != message) {
          await LogHistoryController.create({order_id,user_id,action:updateMessage, action_id : 9
            ,data_changed : JSON.stringify({order_id : req.body.order.order_id, message: req.body.order.edit_message})})
        }

      }
      if (action.includes('notes')){
        if(req.body.order.edit_notes != note) {
          await LogHistoryController.create({order_id,user_id,action:updateInstructions, action_id : 10
            ,data_changed : JSON.stringify({order_id : req.body.order.order_id, notes: req.body.order.edit_notes})})
        }

      }
      if (action.includes('saddress')){
        await LogHistoryController.create({order_id,user_id,action:updateShippingAddress +
        `${shipping_address_1} ${shipping_address_2} ${shipping_city} ${shipping_province} ${shipping_country} ${shipping_zip}`, action_id : 6
          ,data_changed : JSON.stringify({order_id : req.body.order.order_id, shipping_address: `${shipping_address_1} ${shipping_address_2} ${shipping_city} ${shipping_province} ${shipping_country} ${shipping_zip}` })})

      }
      if (action.includes('baddress')){
        await LogHistoryController.create({order_id,user_id,action:updateBillingAddress +
        `${billing_address_1} ${billing_address_2} ${billing_city} ${billing_province} ${billing_country} ${billing_zip}`, action_id : 6
          ,data_changed : JSON.stringify({order_id : req.body.order.order_id, billing_address: `${billing_address_1} ${billing_address_2} ${billing_city} ${billing_province} ${billing_country} ${billing_zip}` })})

      }


      if (req.body.order.job_riders.length > 0){
        const updateJobRider = await db.sequelize.query(`UPDATE job_rider SET target_pickup_date = ?,target_pickup_time = ?, hub_id = ?` +
          ` WHERE order_id = ?`, {replacements: [req.body.order.job_riders[0].target_pickup_date,req.body.order.job_riders[0].target_pickup_time,req.body.order.job_riders[0].hub_id,order_id]})
        if (updateJobRider[0].affectedRows > 0){

          if (action.includes('cpu_date')){

            await db.job_rider.update({
                reschedule : 1
              },
              {where : { order_id : req.body.order.order_id}
              })

              // await orderModel.update({
              //   cpu_printout_ready: 0
              // },
              // {where : { order_id : req.body.order.order_id}
              // })

            await LogHistoryController.create({order_id,user_id,action:updateCpuDeliveryDate + req.body.order.job_riders[0].target_pickup_date, action_id : 30
              ,data_changed : JSON.stringify({order_id : req.body.order.order_id, cpu_target_pickup_date : req.body.order.job_riders[0].target_pickup_date })})
          }
          if (action.includes('cpu_time')){

            await db.job_rider.update({
                reschedule : 1
              },
              {where : { order_id : req.body.order.order_id}
              })

              // await orderModel.update({
              //   cpu_printout_ready: 0
              // },
              // {where : { order_id : req.body.order.order_id}
              // })

            await LogHistoryController.create({order_id,user_id,action:updateCpuDeliveryTime + req.body.order.job_riders[0].target_pickup_time, action_id : 30
              ,data_changed : JSON.stringify({order_id : req.body.order.order_id, cpu_target_pickup_time : req.body.order.job_riders[0].target_pickup_time })})

          }
          if (action.includes('cpu_hub')){
            await LogHistoryController.create({order_id,user_id,action:updateCpuHub, action_id : 30
              ,data_changed : JSON.stringify({order_id : req.body.order.order_id, cpu_hub_id : req.body.order.job_riders[0].hub_id })})

          }
          return res.json({msg: 'Order has been successfully updated'})
        }
      }

                 if(result1.affectedRows > 0){

                    //  let emitParams = [{[GETorders]:order_id}]
                     
                    if(resolve){
                        await db.sequelize.query("UPDATE job_rider SET status = 7 WHERE order_id = ? AND status = 12",{replacements:[order_id]})
                        await db.sequelize.query(qs.updateOrderAndOrderItemOnResolved,{replacements:[order_id]})
                        await db.sequelize.query(qs.resolveTicket,{replacements:[user_id,ticket_id]})

                        //Deleted socket emit
                        // emitParams =  [{[GETorders]:order_id},{[GETtickets]:true},{[GETclosedticket]:true},{[GETselected_ticket]:ticket_id}]
                    }


                    //Deleted socket emit
                    // next(emitParams,()=>{
                    //     
                    // })
                    res.json({msg:'Successfully updated'})
                }else{
                    // tablerowResetEmit(order_id)
                    res.status(404).json({msg:'Failed to update order info.'})
                }
    // res.json({msg:'Successfully updated'})
    } catch (err) {
        console.log(err.message)
        // tablerowResetEmit(order_id)
        res.status(500).json({msg:"Server error."})
    }

})


// ************ NEXT LINE ************ //

// /system/get_order_prio_list
//@desc : Get orders sort by priority
router.get('/sort/priority',m_auth, async (req,res)=>{

    let querypage = ""

    if(req.query.pagination && Object.keys( req.query.pagination).length > 0){
        const {pagesize,page} = JSON.parse(req.query.pagination)
        querypage = `LIMIT ${page},${pagesize}`
    }
    try {
        const [count] = await  db.sequelize.query(qs.getOrderQuery + ` AND o.order_status_id NOT IN (10,11,13,14,15,16,17)   GROUP BY 1 ORDER BY priority DESC `)
        const [result] = await  db.sequelize.query(qs.getOrderQuery + ` AND o.order_status_id NOT IN (10,11,13,14,15,16,17) GROUP BY 1 ORDER BY priority DESC ${querypage}  `)
        const  prio_order_list = result.map(row=>OrderHelper.orderFilter(row))

        res.json({rows:prio_order_list,count:count.length})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }

})



router.get("/forassignment",  m_auth, async (req, res) => {
    try {
      const result = await DispatchController.forassignment(req);
      res.status(200).json(result);
    } catch (err) {
      res.status(err.status).json({ msg: err.msg });
    }
  });

//@desc : Get orders sort by priority
router.get('/priority',  m_auth, async (req,res)=>{
    try {
       const result = await PrioritizationController.getAllPrio(req)
       res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }

})

// ************ NEXT LINE ************ //



// /system/update_order_priority
// @desc  : Update order priority
router.put('/priority',m_auth, async (req,res)=>{
    const {orders_ontop,selectedorder_id,order_onbot} = req.body
    let priority_needed =  0
    try {
        if(orders_ontop === undefined && order_onbot === undefined){

        }else{
            let id_list_ontop = orders_ontop.map(e=>e['order_id'])
            if(order_onbot === undefined){
                priority_needed = Number(orders_ontop[orders_ontop.length-1]['priority']) - 1
                id_list_ontop = ['nicer']
             }else{
                if(id_list_ontop.length < 1) id_list_ontop = ['nicer']
                priority_needed = Number(order_onbot['priority']) + 1
             }
              db.sequelize.query("UPDATE `order` set priority = priority + 1 WHERE order_id in ( ? ) ",{replacements:[ id_list_ontop ]})
              db.sequelize.query("UPDATE `order` set priority = ? WHERE order_id = ?",{replacements:[priority_needed, selectedorder_id]})

             //Deleted on socket tuning.
            //  next([{[GETprio_list]:true},{[GETfloristjob]:true}],()=>{
            //     res.json({msg:"Order priority updated"})
            //  })

             res.json({msg:"Order priority updated"})
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

// @desc : Cancel order item
router.put('/cancel',m_auth, async(req,res)=>{
    const {cancel_status ,cancel_reason,order_id,payment_id } = req.body


  const {user_id} = req.user

  const mailSend = {
    user: user_id,
    customer: req.body.customer,
    action : 'cancel_order',
    contact : req.body.contact
  }


    try {
        //const orders = await  pool.query("SELECT * FROM `order` WHERE order_id = ?",[order_id])
       const orders = await db.order.findAll({ where : {order_id, order_status_id:{[Op.ne]:cancel_status}} },{raw:true});
       const order = orders[0]
       const [[{count}]] = await db.sequelize.query ("SELECT COUNT(o.order_id) as `count` from `order` o join order_item oi ON o.order_id = oi.order_id WHERE (o.order_status_id = 9 or oi.order_item_status_id = 9) AND o.order_id = ?",
       {replacements:[order_id]})
 
      if(count > 0){
          res.status(400).json({msg:"Unable to cancel order that is already on shipped."})
      }else{
          if(!orders){
            res.json({msg:"Unable to process transaction."})

            // here is thes scripts where we need to create a refund something...
            // next([{[GETorders]:order_id},{[GETclosedorder]:true}],()=>{
            //     res.json({msg:"Order status changed to Cancel."})
            // })

          }else {

              if (!orders.length) {
                  res.json({msg: "Unable to cancel record."})
              } else {

                // await pool.query("UPDATE `order` SET order_status_id = ? , cancel_reason = ?  WHERE order_id = ?",
                //      [cancel_status ,cancel_reason , order_id])
                // await  pool.query("UPDATE order_item SET order_item_status_id = ? , cancel_reason =?  WHERE order_id = ?",
                //     [cancel_status ,cancel_reason , order_id])

                await db.sequelize.query("UPDATE `order` SET order_status_id = ? , cancel_reason = ?  WHERE order_id = ?",
                {replacements: [cancel_status, cancel_reason, order_id]})
                await db.sequelize.query("UPDATE `order` o inner join  order_item oi on o.order_id = oi.order_id inner join product p "+
                 " on oi.product_id = p.product_id"+
                 " SET oi.order_item_status_id = ? , oi.cancel_reason =?  "+
               //  " p.current_stock = if(p.current_stock is null, oi.quantity , p.current_stock + oi.quantity) "+
                 " WHERE oi.order_id = ? and (o.order_status_id not in (13,14) or oi.order_item_status_id not in (13,14))",
                {replacements: [cancel_status, cancel_reason, order_id]})

                if (req.body.payment_status_id !== 2) {
                  await db.sequelize.query("UPDATE `job_rider` SET status = ?  WHERE order_id = ? ", {replacements: [cancel_status, order_id]})
                }
                await LogHistoryController.create({order_id,user_id,action:cancel, action_id : 35
                ,data_changed : JSON.stringify({order_id : req.body.order_id, order_status_id : cancel_status,reason : cancel_reason})})

                //Deleted on socket tuning.
                // next([{[GETorders]: order_id}, {[GETclosedorder]: true}], () => {
                // res.json({msg: "Order status changed to Cancel."})
                // })

                res.json({msg: "Order status changed to Cancel."})
                
                await MailController.sendEmail(mailSend)
            }
          }

      }

       

    } catch (err) {
      console.log(err)
        // tablerowResetEmit(order_id)
        // console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})


// ************ NEXT LINE ************ //

router.put('/hold',m_auth, async(req,res)=>{
    const {user_id} = req.user

    const {order_id,notes,disposition_id,comment, onhold, payment_id, payment_status_id} = req.body;

    try{
        
      const [[{count}]] = await db.sequelize.query ("SELECT COUNT(o.order_id) as `count` from `order` o join order_item oi ON o.order_id = oi.order_id WHERE (o.order_status_id = 9 or oi.order_item_status_id = 9) AND o.order_id = ?",
      {replacements:[order_id]})

     if(count > 0){
      res.status(400).json({msg:"Unable to Hold order that is already shipped."})
     }else{
        await db.sequelize.query(qs.updateOrderOnHold,{replacements:[order_id]})
        if(onhold == true){
          await db.sequelize.query(qs.updateOrderItemOnHold,{replacements:[order_id]})

      }
      if(payment_status_id !== 2) {
        await db.sequelize.query("UPDATE `job_rider` SET status = 12  WHERE order_id = ? ", {replacements: [order_id]})
      }
      await db.sequelize.query(qs.insertTicket + "level=1, tagged_from='ORDER_TABLE'",{replacements:[user_id,order_id,null,notes,disposition_id]})
        comment !== "" && await NoteHistoryController.create({order_id,user_id,note:comment})
         LogHistoryController.create({order_id,user_id,action:hold, action_id : 36
           ,data_changed : JSON.stringify({order_id : req.body.order_id, order_status_id : 12,notes, disposition_id, comment })})

           //Deleted on socket tuning
        //  next([{[GETorders]:order_id},{[GETtickets]:true},{[GETfloristjob]:true},{[GETtickets_counts]:true}], async () => {

        //     if(payment_id === 3){
        //        await db.sequelize.query('UPDATE job_rider SET status = ? WHERE order_id = ?', {
        //         type: db.sequelize.QueryTypes.UPDATE,
        //         replacements:[12, order_id]
        //       });
        //     }
           
        //       res.json({msg:'Ticket Has Been Created.'})
          

           
        // })
        if(payment_id === 3){
          await db.sequelize.query('UPDATE job_rider SET status = ? WHERE order_id = ?', {
           type: db.sequelize.QueryTypes.UPDATE,
           replacements:[12, order_id]
         });
       }
      
         res.json({msg:'Ticket Has Been Created.'})

     }
      

    
     
    } catch (err) {
        // tablerowResetEmit(order_id)
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})

// ************ NEXT LINE ************ //

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

router.put('/holdmany',m_auth, async(req,res)=>{
  const {user_id} = req.user
  const {orders,notes,disposition_id,comment} = req.body
  try{
    let fs_list = 0
    await asyncForEach( orders,async(order_id)=>{
     
      try {
        const [[{count}]] = await db.sequelize.query ("SELECT COUNT(o.order_id) as `count` from `order` o join order_item oi ON o.order_id = oi.order_id WHERE (o.order_status_id = 9 or oi.order_item_status_id = 9) AND o.order_id = ?",
        {replacements:[order_id]})
  
        if(count > 0){
            await db.sequelize.query(qs.updateOrderOnHold,{replacements:[order_id]})
            await db.sequelize.query(qs.updateOrderItemOnHold,{replacements:[order_id]})
            await db.sequelize.query(qs.insertTicket + "level=1, tagged_from='ORDER_TABLE'",{replacements:[user_id,order_id,notes,disposition_id]})
            comment !== "" && await NoteHistoryController.create({order_id,user_id,note:comment})
            await db.sequelize.query("UPDATE `job_rider` SET status = 12  WHERE order_id = ?` ",{replacements:[order_id]})
            await LogHistoryController.create({order_id,user_id,action:hold, action_id : 1})
            // next([{[GETorders]:order_id}])
        }
      } catch (err) {
        console.log(err.message)
      }
    })
    // next([{[GETtickets]:true},{[GETfloristjob]:true},{[GETtickets_counts]:true}])
    if(fs_list > 0){
      
    }
    res.json({msg:'Update successful'})

    } catch (err) {

        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})
//

//@desc : Update oder payment
router.put('/payment',m_auth, async (req,res)=>{


    const {user_id} = req.user
    const stringQuery = " UPDATE `order` SET payment_status_id = 2 ,payment_reference = ? , payment_note = ?"
    const {order_id,allowed,reference,note,deliver_date} = req.body

  const mailSend = {
        user: user_id,
        customer: req.body.customer,
        action : 'confirm_payment',
        contact : req.body.contact
  }
  const mailPrimeArc = {
    user: user_id,
    customer: req.body.customer,
    action : 'prime_arc',
    contact : req.body.contact,
    order_name : req.body.order_name,
    picture : req.body.imageUrl
  }



  try {

    const findOrder = await db.order.findAll({
      where: {order_id: req.body.order_id}
    })

      let order_info = null
    if (!findOrder){
      res.status(400).json({msg:"Order Not Found"})
    }else{
      order_info = findOrder[0].dataValues

    }



    if(allowed === 1) {
      await db.sequelize.query(`${stringQuery} WHERE order_id = ?`,{replacements:[reference,note,order_id]})

        await LogHistoryController.create({order_id,user_id,action:paid+''+reference,action_id: 25,
          data_changed : JSON.stringify({order_id : req.body.order_id, order_status_id : 3, payment_status_id : 3, reference, note})})


      //Deleted on socket tuning
      // next([{[GETorders]:order_id},{[GETfloristjob]:true},{[GETprio_list]:true},{[GETnotesnlogs]:order_id}],()=>{
      //   res.json({ error:false, msg:"Update Successful." })
      // })

    

      await MailController.sendEmail(mailSend)
      await MailController.sendEmail(mailPrimeArc)

      res.json({ error:false, msg:"Update Successful." })


    }else if(moment(deliver_date).format('YYYY-DD-MM') !== moment().format('YYYY-DD-MM') ){
      // if (order_info.order_status_id <= 2){
        await  db.sequelize.query(`${stringQuery}, order_status_id = 2  WHERE order_id = ?`,{replacements:[reference,note,order_id]})
      // }

      await LogHistoryController.create({order_id,user_id,action:paid+''+reference,action_id: 25,
        data_changed : JSON.stringify({order_id : req.body.order_id, order_status_id : 3, payment_status_id : 3, reference, note})})

        //Deleted on socket tuning
      // next([{[GETorders]:order_id},{[GETfloristjob]:true},{[GETprio_list]:true},{[GETnotesnlogs]:order_id}],()=>{
      //   res.json({ error:false, msg:"Update Successful." })
      // })


      await MailController.sendEmail(mailSend)
      await MailController.sendEmail(mailPrimeArc)

      res.json({ error:false, msg:"Update Successful." })
    }else{
      //fixed payment
      // if (order_info.order_status_id <= 3) {

        await db.sequelize.query(`${stringQuery}, order_status_id = 3 WHERE order_id = ?`, {replacements: [reference, note, order_id]})
      // }
      const [order_item_ids] =  await db.sequelize.query("SELECT order_item_id FROM order_item WHERE order_id = ?" ,{replacements:[order_id]})

      const idList = order_item_ids.map(x=>x.order_item_id)

      const [floristJobChek] = await db.sequelize.query("SELECT * FROM job_florist  WHERE order_item_id in (?)",{replacements:idList})

      await LogHistoryController.create({order_id,user_id,action:paid+''+reference,action_id: 25,
        data_changed : JSON.stringify({order_id : req.body.order_id, order_status_id : 3, payment_status_id : 3, reference, note})})
            if(floristJobChek.length > 0){


                  
                    //Deleted on socket tuning
                    // next([{[GETorders]:order_id},{[GETfloristjob]:true},{[GETprio_list]:true},{[GETnotesnlogs]:order_id}],()=>{
                    //     res.json({ error:false, msg:"This order is already in florist job." })
                    //  })
              
                  await MailController.sendEmail(mailSend)
                  await MailController.sendEmail(mailPrimeArc)

                  res.json({ error:false, msg:"This order is already in florist job." })

                }else{

                    const [lastID,affectedRows] = await db.sequelize.query(qs.inserToFloristJob,{replacements:[order_id]})

                    await LogHistoryController.create({order_id,user_id,action:toProd, action_id: 25,
                      data_changed : JSON.stringify({order_id : req.body.order_id, order_status_id : 3, payment_status_id : 3, reference, note})})
                        

                          //Deleted on socket tuning
                        // next([{[GETorders]:order_id},{[GETfloristjob]:true},{[GETprio_list]:true},{[GETnotesnlogs]:order_id}],()=>{
                        //         res.json({ error:false, msg:"Update Successful." })
                        // })

                      await MailController.sendEmail(mailSend)
                      await MailController.sendEmail(mailPrimeArc)

                      res.json({ error:false, msg:"Update Successful." })

                    if(affectedRows > 0){

                            db.sequelize.query(qs.updateOrderItem,{replacements:[req.body.order_id]})


                              //Deleted on socket tuning
                            // next([{[GETorders]:order_id},{[GETfloristjob]:true},{[GETprio_list]:true},{[GETnotesnlogs]:order_id}],()=>{
                            //         res.json({ error:false, msg:"Update Successful." })
                            // })

          // await MailController.sendEmail(mailSend)
          // await MailController.sendEmail(mailPrimeArc)
                         res.json({ error:false, msg:"Update Successful." })

                    }else{
                            const [result] = await db.sequelize.query(qs.floristCompleted,{replacements:[req.body.order_id]})

                            let status = 4

                            if(result.length < 1) status = 5

                            await db.sequelize.query('UPDATE `order` SET order_status_id = ? WHERE order_id = ?',{replacements:[status,req.body.order_id]})

                            status === 5 &&  await LogHistoryController.create({order_id,user_id,action:toAssemblyDirect, action_id: 25,
                              data_changed : JSON.stringify({order_id : req.body.order_id, order_status_id : 3, payment_status_id : 3, reference, note})})


                                //Deleted on socket tuning
                            // next([{[GETorders]:order_id},{[GETfloristjob]:true},{[GETprio_list]:true},{[GETnotesnlogs]:order_id}],()=>{

                            //     res.json({ error:false, msg:"Update Successful" })

                            // })

          // await MailController.sendEmail(mailSend)
          // await MailController.sendEmail(mailPrimeArc)
                             res.json({ error:false, msg:"Update Successful" })
                    }
                }

        }
        // res.json({ error:false, msg:"Update Successful." })
    }catch (err) {
        console.log(err.message)
        // tablerowResetEmit(order_id)
        res.status(500).json({msg:"Server Error."})
    }
})

// ************ NEXT LINE ************ //

router.put('/advance',m_auth, async (req,res)=>{
    const {order_id} = req.body
    const {user_id} = req.user
    try {
        await db.sequelize.query("UPDATE `order` SET order_status_id = 3 WHERE order_id = ?",{replacements:[order_id]})

        const [lastID,affectedRows] = await db.sequelize.query(qs.inserToFloristJob,{replacements:[order_id]})

        await LogHistoryController.create({order_id,user_id,action:toProd, action_id : 1})
        
       if(affectedRows > 0){
               db.sequelize.query(qs.updateOrderItem,{replacements:[req.body.order_id]})

               //deleted on socket tuning.
              //  next([{[GETorders]:order_id},{[GETfloristjob]:true},{[GETprio_list]:true}],()=>{
              //          res.json({ error:false, msg:"Update Successful." })
              //  })

              res.json({ error:false, msg:"Update Successful." })
       }else{
                const [result] = await db.sequelize.query(qs.floristCompleted,{replacements:[req.body.order_id]})
               let status = 4
               if(result.length < 1) status = 5
               await db.sequelize.query('UPDATE `order` SET order_status_id = ? WHERE order_id = ?',{replacements:[status,req.body.order_id]})
               status === 5 &&  await LogHistoryController.create({order_id,user_id,action:toAssemblyDirect, action_id : 1})

               //deleted on socket tunung.
              //  next([{[GETorders]:order_id},{[GETfloristjob]:true},{[GETprio_list]:true}],()=>{
              //      res.json({ error:false, msg:"Update Successful." })
              //  })

               res.json({ error:false, msg:"Update Successful." })
       }
    } catch (err) {
        console.log(err.message)
        // tablerowResetEmit(order_id)
        res.status(500).json({msg:"Server Error."})
    }
})

router.post("/file_upload", m_auth, OrderController.payment_file_attachment);

router.get("/getReinstatement/", ReinstatementOrderController.getReinstatementOrder)

router.patch("/updateReinstatement/",m_auth, ReinstatementOrderController.updateReinstatement)

router.post("/addReinstatement/",m_auth, ReinstatementOrderController.createReinstatement)

router.post("/removeOverdue/", m_auth, OrderController.removeOverdue)
// ************ NEXT LINE ************ //

// /system/load_order_info
// @desc : Get order item with its ID
router.get('/:order_id',  m_auth, async (req,res)=>{
    try {
        const result = await OrderController.getSelectedOrder(req)
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
});

router.get("/orderTicket/:orderId", OrderController.getOrderTicket)
router.patch("/unpaidOrder/:orderId",m_auth, OrderController.unpaidOrder)



router.get("/payment/paymentDetail",m_auth,  PaymentRefundController.getPaymentDetails);
router.get("/payment/refund" ,m_auth, PaymentRefundController.getPaymentRefund);
router.post("/payment/refund" ,m_auth, PaymentRefundController.createPaymentRefund);
router.patch("/payment/refund/decline" ,m_auth, PaymentRefundController.disapprovePaymentRefund);
router.patch("/payment/refund/accept" , m_auth,PaymentRefundController.approvePaymentRefund);


module.exports = router