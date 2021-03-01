const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')
const db = require('../../models')

const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Manila");

// const {tablerowResetEmit,floristJobEmit} = require('../../helper/socket_emitters')
// const {OrderHelper} = require('../../helper/helper_funtions')
// const {next,commands:c} = require('../../helper/dynamic_emitter')

//@route  : /api/web/order_item

// /system/order_page_item_search
router.get('/:keyword',m_auth, async (req,res)=>{
    const {keyword} = req.params
    try {
        const [rows] = await  db.sequelize.query(qs.searchItemQuery,{replacements:[`%${keyyword}%`,`%${keyword}%`,`%${keyword}%`,`%${keyword}%`,`%${keyword}%`]})
        res.json({
            result:rows
          })  
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

//  /system/add_order_item
router.post('/',m_auth, async (req,res)=>{
    const {order_item_list,order_id,line_item} = req.body
    try {
        totalLineItem = 0
        order_item_list.forEach(item=>{
            totalLineItem = totalLineItem + (Number(item['price'])*Number(item['qty']) )
        })
        
        let orderListIntoQuery = ''
        if(order_item_list.length > 0){   
            order_item_list.forEach((row,i)=>{
                if(i !== order_item_list.length -1){
                orderListIntoQuery =  orderListIntoQuery.concat(" ("+pool.escape(row['order_id'])+","+pool.escape(row['product_id'])+","+pool.escape(row['title'])+","+pool.escape(row['price'])+","+pool.escape(row['qty'])+"),")
                }else{
                orderListIntoQuery = orderListIntoQuery.concat(" ("+pool.escape(row['order_id'])+","+pool.escape(row['product_id'])+","+pool.escape(row['title'])+","+pool.escape(row['price'])+","+pool.escape(row['qty'])+")")
                }
            
            })
        }
        const [lastID,affectedRows] = await  db.sequelize.query('INSERT INTO order_item  (order_id,product_id,title,price,quantity) VALUES '+ orderListIntoQuery)
        if(affectedRows > 0){


            // next([{[c.GETorders]:order_id}] ,()=>{
            //     res.json({msg:'New order item added.',result})
            // })

            res.json({msg:'New order item added.',result})
        }else{
            // tablerowResetEmit(order_id)
              res.status(400).json({msg:'Failed to add new order item.'})
        }

    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})



// ************ NEXT LINE ************ //

router.put('/status',m_auth, async (req,res)=>{
    console.log(req.body,"STATUS")
    const {order_item_id,order_item_status_id,order_id} = req.body
    try {
            await db.sequelize.query("UPDATE order_item SET order_item_status_id = ? WHERE order_item_id = ?",
           {replacements:[order_item_status_id,order_item_id]})
         
            // next([{[c.GETorders]:order_id}] ,()=>{
            //         res.json({msg:"Update successful."})
            //     })
            
            res.json({msg:"Update successful."})
    } catch (err) {
        console.log(err.message,"ERROR FROM ORDER_ITEM UPDATE!")
        res.status(500).json({msg:"Server error."})
    }
})


// ************ NEXT LINE ************ //

router.put('/status/all',m_auth, async (req,res)=>{
   
    const {order_item_id_list,order_id,order_item_status_id} = req.body
   // console.log({order_item_id_list,order_id,order_item_status_id})
    try {
            await db.sequelize.query("UPDATE order_item SET order_item_status_id = ? WHERE order_item_id in (?)",
           {replacements:[order_item_status_id,order_item_id_list]})
           
            // next([{[c.GETorders]:order_id}] ,()=>{
            //         res.json({msg:"Update successful."})
            //     })
                
            res.json({msg:"Update successful."})
    } catch (err) {
        console.log(err.message,"ERROR FROM ORDER_ITEM UPDATE!")
        res.status(500).json({msg:"Server error."})
    }
})


// ************ NEXT LINE ************ //



module.exports = router