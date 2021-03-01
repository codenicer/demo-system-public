const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')
const db = require('../../models');

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Manila");

const  LogHistoryController = require('../../controllers/order_history')
const DispatchJobDetailController = require('../../controllers/dispatch_job_detail');
const resume = 'Order ticket has been resolved.'

const OrderController = require('../../controllers/order')

//deleted on socket tuning.
// const {GETorders,GETholdjobs,GETtickets, GETselected_ticket, GETnotesnlogs, GETfloristjob,GETclosedorder,GETclosedticket} = commands
// const {next,commands } = require('../../helper/dynamic_emitter')

//@route : /api/web/ticket

// ************ NEXT LINE ************ //

router.get('/',async (req,res) =>{
    const {pagination,arrayToString,replacement} = paramsToQuery(req)
    //(pagination,"pagination",arrayToString,"arrayToString","replacement",replacement)
    try {
        const [count] = await  db.sequelize.query(qs.loadOpenTicket +  arrayToString +  " group by t.ticket_id ",{replacements:{...replacement}})
        const [tickets] = await  db.sequelize.query(qs.loadOpenTicket + arrayToString +" group by t.ticket_id ORDER BY t.created_at DESC" + pagination ,{replacements:{...replacement}})
        //  //(tickets)
        res.json({count:count.length ,rows:tickets})
    } catch (err) {
        //(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //


router.get('/closed',  m_auth, async (req,res) =>{
    const {pagination,arrayToString,replacement} = paramsToQuery(req)
    // //(pagination,"pagination",arrayToString,"arrayToString","replacement",replacement)
    try {
        const [count] = await  db.sequelize.query(qs.loadClosedTicket + arrayToString+ " group by t.ticket_id ",{replacements:{...replacement}})
        //  //("QUERY:",qs.loadClosedTicket + arrayToString + " group by t.ticket_id " + pagination)
        const [tickets] = await  db.sequelize.query(qs.loadClosedTicket + arrayToString + " group by t.ticket_id ORDER BY t.created_at DESC " + pagination,{replacements:{...replacement}})

        res.json({count:count.length ,rows:tickets})
    } catch (err) {
        //(err.message)
        res.status(500).json({msg:"Server error."})
    }
    
  // res.json({count:0,rows:[]})
})

// ************ NEXT LINE ************ //

router.get('/all/:order_id', async (req,res) =>{
   const {order_id} = req.params
    try {
         const [ticket] = await  db.sequelize.query(qs.loadAlltickets +  " WHERE t.order_id = ?" +  " group by t.ticket_id ORDER BY t.created_at DESC ",{replacements:[order_id]})
         res.json(ticket)
    } catch (err) {
        //(err.message)
        res.status(500).json({msg:"Server error."})
    }
})



// ************ NEXT LINE ************ //

router.get('/count_new',  m_auth, async (req,res) =>{
    try {
        const {list} = JSON.parse(req.query.hub_id)
        const [open_ticket] = await  db.sequelize.query(qs.getOpenTicketCount,{replacements:[list]})
        
        
         const no_hub_count = await OrderController.getOpenOrderNoHubCount({query:{ filter: {delivery_date: {
              eq:db.sequelize.literal('`order`.delivery_date = CONVERT(NOW(),DATE)') }}}})
            
        const no_datentime_count = await OrderController.getOpenOrderNoDateOrTimeCount({query:{ filter: { hub_id: { in: list.toLocaleString() } }}})
       
        const undelivered_job_count = await  DispatchJobDetailController.getAllCountOnly({query:{hub_filter:list.toLocaleString(),filter: { status: { in: '11,16' } }}})
            
        const orders_on_hold_count = await OrderController.getOrdersOnholdCount({query:{filter: { delivery_date: { eq: moment(Date.now()).format('YYYY-MM-DD') }  }}}) 

        const unpaid_orders_count = await OrderController.getOpenOrderCountOnly({query:{filter: {
              delivery_date: {  like: moment().format('YYYY-MM-DD') }, hub_id: { in: list.toString() } }}}) 

        const [{count}] = await db.sequelize.query(qs.getSympathyCount, 
             {replacements : {delivery_date :  moment(Date.now()).format('YYYY-MM-DD') },type: db.sequelize.QueryTypes.SELECT})

        res.json({
            open_ticket:open_ticket.length,
            no_hub:no_hub_count,
            no_datentime:no_datentime_count,
            returns_count:undelivered_job_count,
            sympathy_count:count,
            orders_on_hold_count,
            unpaid_orders_count,
      
        })        

    } catch (err) {
        //(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

router.put('/resolve',m_auth, async (req,res) =>{
    const {user_id} = req.user
    const {tagged_from,level} = req.body
    const {ticket_id,order_id} = req.body

    console.log({tagged_from,level})
    try {
        if((level === 0 && tagged_from.toLowerCase() === 'florist_prod') ||  tagged_from.toLowerCase() === 'integromat'){
           
            await db.sequelize.query(qs.resolveTicket,{replacements:[user_id,ticket_id]})
        }else if(level === 1 && ["order_table","email_script"].includes ( tagged_from.toLowerCase()) ){
           console.log("HERE 1")
         
            await db.sequelize.query(qs.resolveTicket,{replacements:[user_id,ticket_id]})
           
            const [ticket_list] = await db.sequelize.query("SELECT * FROM ticket WHERE order_id = ? and status_id = 1",{replacements:[order_id]})
            console.log("HERE 2",ticket_list.length)
            if(ticket_list.length === 0){
                console.log("HERE 3",ticket_list.length)
                await db.sequelize.query("UPDATE job_rider SET status = 7 WHERE order_id = ? AND status = 12",{replacements:[order_id]})
                await db.sequelize.query(qs.updateOrderAndOrderItemOnResolved,{replacements:[order_id]})
                 await LogHistoryController.create({order_id,user_id,action:resume,action_id : 31, data_changed : JSON.stringify({order_id, ticket_id})})
            }
         
          
        }


        //deleted on socket tuning.

        // next([{[GETorders]:order_id},{[GETholdjobs]:true},{[GETselected_ticket]:ticket_id},{[GETnotesnlogs]:order_id},{[GETtickets]:true},
        //     {[GETclosedorder]:true},{[GETfloristjob]:true},{[GETclosedticket]:true}],()=>{
        
        // })


        res.json({msg:"Ticket resolved."})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

router.put('/resolve/testing',m_auth, async (req,res) =>{
    const {user_id} = req.user
    const {ticket_id,order_id} = req.body
    try {
        await db.sequelize.query(qs.resolveTicket,{replacements:[user_id,ticket_id]})
        await db.sequelize.query("UPDATE `order` SET order_status_id = prev_status WHERE order_id = ?",{replacements:[order_id]})
        // next([{[GETorders]:order_id},{[GETtickets]:true}],()=>{
        //     res.json({msg:"Ticket resolved."})
        // })
        res.json({msg:"Ticket resolved."})
    } catch (err) {
        //(err.message)
        res.status(500).json({msg:"Server error."})
    }
})


// ************ NEXT LINE ************ //

router.put('/oi_close',m_auth, async (req,res) =>{
    const {user_id} = req.user
    const {cancel_status,cancel_order,cancel_reason} = req.body.form
    const {ticket_id,order_id,tagged_from,level} = req.body.item
    // //(req.body.item)

    try {

        await db.sequelize.query(qs.updateTicketOnClosed, {replacements:[user_id,cancel_status,cancel_reason,ticket_id]})
        

        
        if((cancel_order && order_id  ||(tagged_from==="ORDER_TABLE"&& level === 1) )) {
          
                await db.sequelize.query("UPDATE `order` SET order_status_id = ? ,cancel_reason = ?  WHERE order_id = ?",
                {replacements:[cancel_status , cancel_reason , order_id]})
                await db.sequelize.query("UPDATE `order_item` SET order_item_status_id = ? ,cancel_reason = ?  WHERE order_id = ?",
                {replacements:[cancel_status , cancel_reason , order_id]})
        }


         if(tagged_from === "FLORIST_PROD"){
            const [rows] = await db.sequelize.query("SELECT * FROM `order` o JOIN  order_item oi ON o.order_id = oi.order_id \n"+
                 " JOIN product p ON oi.product_id = p.product_id  WHERE oi.order_item_status_id in (2,3) AND p.florist_production = 1 AND oi.order_id = ? "
            ,{replacements:[order_id]})

            if(rows.length < 1){
                        
                    await db.sequelize.query("UPDATE `order` SET order_status_id = ? ,cancel_reason = ?  WHERE order_id = ?",
                    {replacements:[cancel_status , cancel_reason , order_id]})
                    await db.sequelize.query("UPDATE `order_item` SET order_item_status_id = ? ,cancel_reason = ?  WHERE order_id = ?",
                    {replacements:[cancel_status , cancel_reason , order_id]})
            }
         }
      await LogHistoryController.create({order_id,user_id,action:'Order has been closed',action_id : 32,
        data_changed : JSON.stringify({order_id, ticket_id, cancel_status, cancel_reason})})
       
            if(order_id){
            //deleted on socket tuning.
            // next([{[GETorders]:order_id},{[GETholdjobs]:true},{[GETselected_ticket]:ticket_id},
            //     {[GETtickets]:true},{[GETclosedorder]:true},{[GETfloristjob]:true}],()=>{
            //     res.json({msg:"Ticket closed."})
            // })
            res.json({msg:"Ticket closed."})
        }else{
            //deleted on socket tuning.
            // next([{[GETtickets]:true},{[GETselected_ticket]:ticket_id}],()=>{
            //     res.json({msg:"Ticket closed."})
            // })
            res.json({msg:"Ticket closed."})
        }
    } catch (err) {
        //(err.message)
        res.status(500).json({msg:"Server error."})
    }   

    res.json({msg:"Ticket closed."})
})

// ************ NEXT LINE ************ //

router.get('/:ticket_id', async (req,res) =>{
    //(req.params,"params from ticket")
    try {
        const [ticket] = await  db.sequelize.query(qs.loadAlltickets +  " WHERE ticket_id = ?" +  " group by t.ticket_id ",{replacements:[req.params.ticket_id]})
        res.json(ticket)
    } catch (err) {
        //(err.message)
        res.status(500).json({msg:"Server error."})
    }

    
})

function paramsToQuery(req){
    let pagination = ''
    let arrayToString = ''
    let replacement = {}
    if(req.query.pagination && Object.keys(req.query.pagination).length > 0){
        const {pagesize,page} = JSON.parse( req.query.pagination)
        pagination =  ` LIMIT ${page},${pagesize}`
    }

    if(req.query.filters && Object.keys(req.query.filters).length > 0){
        const querytoArray = Object.entries(JSON.parse(req.query.filters))
        querytoArray.forEach((query) => {
            if(query[0] === "shopify_order_name"){
                //("SHOP ORDER NAME ",query[1])
                replacement = {
                    ...replacement,
                    shopify_order_name:(`%${query[1]}%`).replace(/\s/g, '')
                }
            }else if(query[0] === "delivery_time"){
                replacement = {
                    ...replacement,
                    delivery_time:`%${query[1]}%`
                }
            }
            //
            const q  = query[0] === "shopify_order_name" ? ` AND o.shopify_order_name like :shopify_order_name ` :
                  query[0] === "hub_id" ?  ` AND (o.${query[0]} in ( ${query[1]} ) or o.hub_id IS NULL  )`  : query[0] === "created_at" ?
                  ` AND (CONVERT(t.${query[0]},DATE) = CONVERT('${query[1]}',DATE) or CONVERT(o.delivery_date,DATE) = CONVERT('${query[1]}',DATE) )` : 
                    query[0] === "order_id" ? ` AND o.${query[0]} = ${query[1]}`
                  : query[0] === "delivery_time"  ? ` AND o.${query[0]} like :delivery_time` : ` AND t.${query[0]} = ${query[1]}`
                
            arrayToString = arrayToString + q
        })
    }

    return {
        pagination,
        arrayToString,
        replacement
    }
}

module.exports = router



