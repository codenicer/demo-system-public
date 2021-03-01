const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')
const {orderFilter} = require('../../helper/helper_funtions')
const {pool,sock_domain} = require('../../config/db')
const clientsock = require('socket.io-client')(sock_domain)
const db = require('../../models');
const {OrderHelper} = require('../../helper/helper_funtions')
// const {tablerowResetEmit,floristJobEmit} = require('../../helper/socket_emitters')
const AssemblyController = require('../../controllers/assembly')
const {next,commands:c} = require('../../helper/dynamic_emitter')
const  LogHistoryController = require('../../controllers/order_history')

const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Manila");

const {GETweb_floristjob,GETflorists,GETorders,GETtickets,GETassembler,GETassemblerInJob,GETfloristjob,GETprio_list,GETclosedorder,GETtickets_counts,GETnotesnlogs} = c
const hold = 'Order has been hold by florist and create ticket automatically.'
const accept = 'Florist start arranging the flower.'
const done =  'Order has been arranged by the florist.'
const sendToAssembler = 'Order has been sent to assembly.'
const resume = 'Florist resume arranging the flower.'
const cancelAccept = "Florist canceled arranging the flower."
const assigned = "Order has been assigned to florist."
const cancelAssigned = "Assigning to florist has been canceled."
//@API  /api/mobile/orderitem/

// ************ NEXT LINE ************ //

router.get('/',  m_auth, async (req,res)=>{
   const {arrayToString,replacement,sortBy,pagination} = paramsToQuery(req)   
    try {
        const [[{count}]] = await db.sequelize.query(qs.floristJobCount + arrayToString + " ORDER BY  o.delivery_date DESC, o.priority DESC " + sortBy ,{replacements:{...replacement}})
        const [florsitJob] = await db.sequelize.query(qs.loadFloristJobQuery + arrayToString + " ORDER BY  o.delivery_date DESC, o.priority DESC " + sortBy + pagination,{replacements:{...replacement}})
        const [orderNotes] = await db.sequelize.query("SELECT * FROM order_note_history")
        const result = []
                florsitJob.forEach((f)=>{
                        let newJob = {...f, notes:[]}
                    orderNotes.forEach((n,i)=>{
                            if( f.order_id === n.order_id)newJob.notes.push(n)
                            if(i === orderNotes.length - 1)result.push(newJob)
                    })
            })
       res.json({rows:result,count:count})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})



router.get('/all',  m_auth, async (req,res)=>{
    const {arrayToString,replacement,sortBy,pagination} = paramsToQuery(req)
    console.log({arrayToString,replacement,sortBy,pagination})
     try {
        const [[{count}]] = await db.sequelize.query(qs.floristJobAllCount + arrayToString  + sortBy ,{replacements:{...replacement}})
         const [florsitJob] = await db.sequelize.query(qs.loadFloristJobQueryAll + arrayToString + "  ORDER BY  jf.user_id DESC, o.delivery_date DESC ,o.priority DESC" + sortBy + pagination,{replacements:{...replacement}})
         const [orderNotes] = await db.sequelize.query("SELECT * FROM order_note_history")
         const result = []
                 florsitJob.forEach((f)=>{
                    let newJob = {...f, notes:[]}
                     orderNotes.forEach((n,i)=>{
                             if( f.order_id === n.order_id)newJob.notes.push(n)
                             if(i === orderNotes.length - 1)result.push(newJob)
                     })
             })
             res.json({rows:result,count:count})
     } catch (err) {
         console.log(err.message)
         res.status(500).json({msg:"Server error"})
     }
 })

 // ************ NEXT LINE ************ //

 router.get('/history', m_auth, async (req,res)=>{
    const {arrayToString,replacement,sortBy,pagination} = paramsToQuery(req)
     console.log({arrayToString,replacement,sortBy,pagination})
     try {
        const [[{count}]] = await db.sequelize.query(qs.jobFloristHistoryCount + arrayToString  + sortBy ,{replacements:{...replacement}})
         const [florsitJob] = await db.sequelize.query(qs.loadFloristJobHistory + arrayToString + "  ORDER BY o.delivery_date DESC ,o.priority DESC" + sortBy + pagination,{replacements:{...replacement}})
         
         const [orderNotes] = await db.sequelize.query("SELECT * FROM order_note_history")
         const result = []
                 florsitJob.forEach((f)=>{
                    let newJob = {...f, notes:[]}
                     orderNotes.forEach((n,i)=>{
                             if( f.order_id === n.order_id)newJob.notes.push(n)
                             if(i === orderNotes.length - 1)result.push(newJob)
                     })
             })
             res.json({rows:result,count:count})
     } catch (err) {
         console.log(err.message)
         res.status(500).json({msg:"Server error"})
     }
 })

// ************ NEXT LINE ************ //

router.get('/injob',m_auth, async (req,res)=>{
    const {user_id} = req.user
    try {
        const [results] = await db.sequelize.query(qs.loadFloristInjob + " AND jf.user_id = ? ",{replacements:[user_id]})
        const [orderNotes] = await db.sequelize.query("SELECT onh.* ,u.first_name ,u.last_name , u.email , u.img_src FROM order_note_history onh join `user` u on onh.user_id = u.user_id")
        const result = []
           results.forEach((f)=>{
                        let newJob = {...f, notes:[]}
                    orderNotes.forEach((n,i)=>{
                            if( f.order_id === n.order_id)newJob.notes.push(n)
                            if(i === orderNotes.length - 1)result.push(newJob)
                    })
            })  
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})

// ************ NEXT LINE ************ //

router.get('/holdjob',m_auth, async (req,res)=>{
    try {
        const {user_id} = req.user
        const [result] = await db.sequelize.query(qs.loadFloristHoldJobQuery + " AND jf.user_id = ?",{replacements:[user_id]})
            res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})

// ************ NEXT LINE ************ //
// /system/mobile/update_order_item
// @desc : Hold the user order_item / job
router.put('/fhold',m_auth, async (req,res)=>{
    try {
        const {user_id} = req.user
        const {order_id,order_item_id} = req.body.item
        const {notes,disposition_id} = req.body.form
          await db.sequelize.query("UPDATE order_item SET  order_item_status_id = 12   \n"+
                 " WHERE order_item_id = ?",{replacements:[order_item_id]})
          await db.sequelize.query("UPDATE `order` SET  order_status_id = 12   \n"+
                  " WHERE order_id = ?",{replacements:[order_id]})
          await db.sequelize.query("UPDATE `job_rider` SET status = 12 WHERE order_id = ?` ",{replacements:[cancel_status,order_id]})
          await db.sequelize.query(qs.insertTicket+"level=0,tagged_from='FLORIST_PROD' ",
                 {replacements:[user_id,order_id,order_item_id,notes,disposition_id]})
                 await db.sequelize.query('UPDATE `user` set status = 2 where user_id = ?',{replacements:[user_id]})
                 await LogHistoryController.create({order_id,user_id,action:hold})
            next([{[GETorders]:order_id},{[GETtickets]:true},{[GETfloristjob]:true},{[GETflorists]:true},{[GETweb_floristjob]:true},{[GETtickets_counts]:true}],
                ()=>res.json({msg:'Order item status updated to hold.'}))
      
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})


// ************ NEXT LINE ************ //
///system/order_item_completed
// @desc : Complete the status of order_item / job
router.put('/fcompleted',m_auth,async (req,res)=>{
    const {user_id} = req.user
    const {order_item_id,order_id} = req.body.item
    try {
            await db.sequelize.query(qs.m_OICompleted,{replacements:[order_item_id ,user_id]})

            await LogHistoryController.create({order_id,user_id,action:done})

         const [rowsCount] = await db.sequelize.query(qs.m_FJCount,{replacements:[order_id]})
         
         let status = 4
         if(rowsCount.length < 1) status = 5
         await  db.sequelize.query('UPDATE `order` SET order_status_id = ? WHERE order_id = ?',{replacements:[status,order_id]})
         
         if(status === 5){
            await db.sequelize.query('UPDATE order_item SET order_item_status_id = ? WHERE order_id = ?',{replacements:[status,order_id]})
            await db.sequelize.query(qs.inserToAssemblyJob,{replacements:[order_id]})
            await LogHistoryController.create({order_id,user_id,action:sendToAssembler})
         }
         await db.sequelize.query("UPDATE `user` SET status = 2 WHERE user_id = ?",{replacements:[user_id]})
         next([{[GETorders]:order_id},{[GETtickets]:true},{[GETfloristjob]:true},{[GETflorists]:true},{[GETweb_floristjob]:true},{[GETassembler]:true}],
            ()=>res.json({msg:"Job completed"}))
    } catch (err) {
            console.log(err.message)
            res.status(500).json({msg:"Server error"})
    }
})



// ************ NEXT LINE ************ //

//  /api/mobile/orderitem/assignjob
// @desc : assigned job from table
router.put('/tablet/assignjob',m_auth, async (req,res)=>{
   
    try {
            const {user_id} = req.user
         
            const {florist_id} = req.body
         
            const {order_item_id_list} = req.body
            // console.log("JOB ASSIGNED !!!!",{user_id},{florist_id},{order_item_id_list})
            // let order_id_handler= null
            await asyncForEach (order_item_id_list,async (order_item_id)=>{
                    try {
                      const [{affectedRows}] =  await db.sequelize.query(qs.updateItemAccepted,{replacements:[order_item_id,florist_id]})

                     
                        if(affectedRows > 0){
                            await db.sequelize.query('UPDATE `user` set status = 3 where user_id = ?',{replacements:[florist_id]}) 

                            const [result] = await db.sequelize.query("SELECT order_id from `order_item` WHERE order_item_id = ?",{replacements:[order_item_id]})
                          
                            const [order_id] = result.map(x=> x.order_id)
                            order_id_handler = order_id
                           await LogHistoryController.create({order_id,user_id,action:assigned})
                           next([{[GETorders]:order_id},{[c.GETtablet_floristjob]:order_id}])
                        }else{
                            res.json({msg:"Assigned successful."})
                        }
                    
                    } catch (err) {
                        console.log("ERROR:",err.message)
                    }
                    
            })

            next([{[GETtickets]:true},{[GETfloristjob]:true},{[c.GETfloristjob_all]:true},
                    {[GETflorists]:true},{[GETweb_floristjob]:true},{[GETassembler]:true},{[c.GETfloristsv2]:true}],()=>{
                        res.json({msg:"Assigned successful."})
                })
         
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})

router.put('/tablet/hold',m_auth, async (req,res)=>{
    try {
            const {user_id} = req.user
            const {order_item_id_list} = req.body
            const  {name:notes,id:disposition_id} = req.body.hold_info
            console.log(notes,disposition_id)
            await asyncForEach (order_item_id_list,async (order_item_id)=>{
                    try {   
                        
                        await db.sequelize.query("UPDATE order_item SET  order_item_status_id = 12   \n"+
                                             " WHERE order_item_id = ?",{replacements:[order_item_id]})

                        const [result] = await db.sequelize.query("SELECT order_id from `order_item` WHERE order_item_id = ?",{replacements:[order_item_id]})

                        const [order_id] = result.map(x=> x.order_id)

                        await db.sequelize.query("UPDATE `order` SET  order_status_id = 12   \n"+
                         " WHERE order_id = ?",{replacements:[order_id]})

                         

                        await db.sequelize.query(qs.insertTicket + "level=0,tagged_from='FLORIST_PROD' ",
                            {replacements:[user_id,order_id,order_item_id,notes,disposition_id]})

                       await db.sequelize.query("UPDATE `job_rider` SET status = 12  WHERE order_id = ?` ",{replacements:[cancel_status,order_id]})

                       const [florist_id_list] = await db.sequelize.query("SELECT user_id FROM job_florist WHERE order_item_id = ?",{replacements:[order_item_id]})
                        
                       if(florist_id_list.length > 0){
                            const [florist_id] = florist_id_list.map(x=> x.user_id)

                            if(florist_id){
                                const [remaining_job] =  await db.sequelize.query(qs.selectFloristRemainingJob,{replacements:[florist_id]})
    
                                if(remaining_job.length === 0){
                                    await db.sequelize.query('UPDATE `user` set status = 2 where user_id = ?',{replacements:[florist_id]}) 
                                }
                            }
                        }
                       
                        
                        await LogHistoryController.create({order_id,user_id,action:hold})

                        next([{[GETorders]:order_id},{[c.GETtablet_floristjob]:order_id}])
                 
                    } catch (err) {
                        console.log("ERROR:",err.message)
                    }
            })
                    
            next([{[GETtickets]:true},{[GETfloristjob]:true},{[GETflorists]:true},{[GETweb_floristjob]:true},
                {[GETtickets_counts]:true},{[c.GETfloristsv2]:true},{[c.GETfloristjob_all]:true}],
                
                ()=>res.json({msg:'Order item status updated to hold.'}))
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})


// ************ NEXT LINE ************ //

//  /api/mobile/orderitem/assignjob/cancel
// @desc : cancel assigned from tablet

router.put('/tablet/assignjob/cancel',m_auth, async (req,res)=>{
    try {

     
        const {user_id} = req.user
        const {order_item_id,florist_id} = req.body
        await db.sequelize.query(qs.cancelItemAssigned,{replacements:[order_item_id]})
        const [result] = await db.sequelize.query("SELECT order_id from `order_item` WHERE order_item_id = ?",{replacements:[order_item_id]})
        const [order_id] = result.map(x=> x.order_id)
        const [remaining_job] =  await db.sequelize.query(qs.selectFloristRemainingJob,{replacements:[florist_id]})
        if(remaining_job.length === 0){
            await db.sequelize.query('UPDATE `user` set status = 2 where user_id = ?',{replacements:[florist_id]}) 
        }
        await LogHistoryController.create({order_id,user_id,action:cancelAssigned})

        next([{[GETorders]:order_id},{[GETtickets]:true},{[GETfloristjob]:true},{[GETflorists]:true},{[c.GETtablet_floristjob]:order_id},
                  {[c.GETfloristjob_all]:true},{[GETweb_floristjob]:true},{[c.GETfloristsv2]:true}], 
                  ()=>res.json({msg: "Job canceld assigned."}))
        // ()=>res.json({msg: "Job canceld assigned."})
    //    res.json({msg: "Job canceld assigned."})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})



// ************ NEXT LINE ************ //

//  /api/mobile/orderitem/assignjob/cancel
// @desc : Resumed user hold item


router.put('/tablet/complete',m_auth,async (req,res)=>{
    const {order_item_id,florist_id} = req.body
  
    try {
            await db.sequelize.query(qs.m_OICompleted,{replacements:[order_item_id ,florist_id]})
            const [result] = await db.sequelize.query("SELECT order_id from `order_item` WHERE order_item_id = ?",{replacements:[order_item_id]})
            const [order_id] = result.map(x=> x.order_id)
            await LogHistoryController.create({order_id,florist_id,action:done})
            const [rowsCount] = await db.sequelize.query(qs.m_FJCount,{replacements:[order_id]})
            let status = 4
            if(rowsCount.length < 1) status = 5
            await  db.sequelize.query('UPDATE `order` SET order_status_id = ? WHERE order_id = ?',{replacements:[status,order_id]})
         
         if(status === 5){
            await db.sequelize.query('UPDATE order_item SET order_item_status_id = ? WHERE order_id = ?',{replacements:[status,order_id]})
            await db.sequelize.query(qs.inserToAssemblyJob,{replacements:[order_id]})
            await LogHistoryController.create({order_id,florist_id,action:sendToAssembler})
         }
         await db.sequelize.query("UPDATE `user` SET status = 2 WHERE user_id = ?",{replacements:[florist_id]})
         next([{[GETorders]:order_id},{[c.GETfloristjob_all]:true},{[c.GETassemblerjob]:true},{[c.GETfloristsv2]:true},{[GETtickets]:true},{[GETfloristjob]:true},{[GETflorists]:true},
                {[GETweb_floristjob]:true},{[GETassembler]:true},{[c.GETfloristsv2]:true}, {[c.GETfloristjob_all]:true}],
            ()=>res.json({msg:"Job completed"}))
    } catch (err) {
            console.log(err.message)
            res.status(500).json({msg:"Server error"})
    }
  
})



// ************ NEXT LINE ************ //

// /mobile/order_item_resumed
// @desc : Resumed user hold item
router.put('/fresumed',m_auth, async (req,res)=>{
    const {user_id} = req.user
    const {order_item_id,ticket_id,order_id} = req.body.item
    try {
         await db.sequelize.query(qs.updateItemAccepted,{replacements:[order_item_id,user_id]}) 
         await db.sequelize.query("UPDATE ticket SET can_be_continued = 0 WHERE ticket_id = ?",{replacements:[ticket_id]})
         await db.sequelize.query('UPDATE `user` set status = 3 where user_id = ?',{replacements:[user_id]}) 
         await LogHistoryController.create({order_id,user_id,action:resume})
          next([{[GETorders]:order_id},{[GETtickets]:true},{[GETfloristjob]:true},{[GETflorists]:true},{[GETweb_floristjob]:true}],
            ()=>res.json({msg:"Job resumed"}))
    } catch (err) {
        res.status(500).json({msg:"Server Error"})
    }
})

// ************ NEXT LINE ************ //

/// /system/order_item_accedted
router.put('/faccept',m_auth, async (req,res)=>{
    try {
        const {user_id} = req.user
        const {order_item_id,order_id} = req.body.item
        await db.sequelize.query(qs.updateItemAccepted,{replacements:[order_item_id,user_id]})
        await db.sequelize.query('UPDATE `user` set status = 3 where user_id = ?',{replacements:[user_id]}) 
        await LogHistoryController.create({order_id,user_id,action:accept})
        next([{[GETorders]:order_id},{[GETtickets]:true},{[GETfloristjob]:true},{[GETflorists]:true},{[GETweb_floristjob]:true}],
            ()=>res.json({msg: "Job accepted."}))
      
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})

// ************ NEXT LINE ************ //mobil

router.put('/cancelaccept',m_auth, async (req,res)=>{
    try {
        const {user_id} = req.user
        const {order_item_id,order_id} = req.body.item
        await db.sequelize.query(qs.cancelAcceptOnFloristMobile,{replacements:[order_item_id]})
        await db.sequelize.query('UPDATE `user` set status = 2 where user_id = ?',{replacements:[user_id]}) 
        await LogHistoryController.create({order_id,user_id,action:cancelAccept})
        next([{[GETorders]:order_id},{[GETtickets]:true},{[GETfloristjob]:true},{[GETflorists]:true},{[GETweb_floristjob]:true}],
            ()=>res.json({msg: "Job accepted."}))
      
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})


// ************ NEXT LINE ************ //

function paramsToQuery(req){
    let arrayToString = ''
    let replacement = {}
    let sortBy = ''
    let pagination = ''

    const {filters} = req.query

    if((filters && filters !== 'undefined')&& Object.keys(filters).length > 0){
        try {
                    const querytoArray = Object.entries(JSON.parse(filters))
                    querytoArray.forEach((query) => { 
                    if(query[0] === "shopify_order_name"){
                        replacement = {
                            ...replacement,
                        shopify_order_name :`%${query[1]}%`
                        }
                        const q  =  ` AND o.${query[0]} like :shopify_order_name` 
                        arrayToString = arrayToString + q
                    }else if(query[1] && query[0] === "title" ){
                        arrayToString = arrayToString + ` AND oi.title LIKE "${query[1]}" `
                    }else if(query[0] === "delivery_time"){
                        let qs= ''
                        query[1].map((q,i)=>{
                                replacement = {
                                    ...replacement,
                                [`index_${i}`] :`%${q}%`
                            }
                            if( query[1].length > 1){
                                if(i === 0 ){
                                    qs = qs +   ` AND ( o.${query[0]} like :index_${i}`
                                }else if (i === query[1].length - 1){
                                    qs = qs +   ` OR o.${query[0]} like :index_${i} )` 
                                }else{
                                    qs = qs +   `  OR o.${query[0]} like :index_${i} ` 
                                }
                            }else if(query[1].length === 1){
                                qs = qs +   ` AND o.${query[0]} like :index_${i} ` 
                            }
                        
                        })
                        arrayToString = arrayToString + qs
                    }else if(query[0] === "sortByTilte" && query[1] !== null && query[1] .length > 0 ){

                    sortBy =   ` , oi.title ${query[1]}`

                    }else if(query[0] === "delivery_date" ){
                    arrayToString = arrayToString + ` AND convert(o.delivery_date,DATE) = convert("${query[1]}",DATE) `
                    }
                
            }) 
            
        } catch (err) {
                console.log(err.message)
        }
               
    }

    if(req.query.pagination && Object.keys(req.query.pagination).length > 0){
        const {limit , offset} = JSON.parse(req.query.pagination)
         pagination = ` LIMIT ${offset},${limit}`
    }
   
    return {
        arrayToString,
        replacement,
        sortBy,
        pagination
    }
}


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }


module.exports = router
