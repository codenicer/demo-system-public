const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const db = require('../../models');
const query_string = require('qs')
const qs = require('../../helper/query_string')
const AssemblyController = require('../../controllers/assembly')
const OrderController = require('../../controllers/order')
const UserController = require('../../controllers/user')
const OrderItemController = require('../../controllers/order_item')
const  LogHistoryController = require('../../controllers/order_history')
const accept = 'Assembler started assembling the order.'
const cancel = 'Assembler canceled assembling the order.'
const complete = 'Order has been assembled.'
const {pool,
    // sock_domain
} = require('../../config/db')
// const {OrderHelper} = require('../../helper/helper_funtions')
// const clientsock = require('socket.io-client')(sock_domain)
// const {next,commands } = require('../../helper/dynamic_emitter')
// const {GETorders,GETforassignment,GETassemblerjob,GETtickets,GETassembler,GETassemblerInJob} = commands

router.get('/',m_auth, async (req,res)=>{
    try {
        console.log("REQ QUERY:",req.query)
        const result = await AssemblyController.getJob(req)
        res.json(result)
    } catch (err) {
        res.status(err.status).json(err.msg)
    }
})

// ************ NEXT LINE ************ //

router.get('/myjob',m_auth, async (req,res)=>{
    const {user_id} = req.user
    try {
        const result = await AssemblyController.getInJobSelected(user_id)
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})


// ************ NEXT LINE ************ //

router.put('/completed',m_auth,async (req,res)=>{
    const {user_id} = req.user
   req.body.form.user.user_id = user_id
    const {order_id} = req.body.form.order

    try {
            await AssemblyController.update(req)
            await OrderController.updateOrderFromAssembly(req)
            await UserController.simpleUpdate(req)
            await LogHistoryController.create({order_id,user_id,action:complete,action_id : 33,
              data_changed : JSON.stringify({order_id})})

            // deleted on socket tuning.
            // next([{[GETorders]:order_id},{[GETassembler]:true},{[GETassemblerjob]:true},{[GETassemblerInJob]:true},
            //         {[GETforassignment]:'update'}]
            //     ,()=>{
            //         res.json({msg:"Job submitted."})
            // })


            res.json({msg:"Job submitted."})
    } catch (err) {
            console.log(err.message)
            res.status(500).json({msg:"Server error"})
    }
})

// ************ NEXT LINE ************ //

router.put('/accept',m_auth, async (req,res)=>{
  
    const {user_id} = req.user
    req.body.form.user.user_id = user_id
    req.body.form.job_assembler.toUpdate.user_id = user_id
    const {order_id} = req.body.form.order
    try {
        await AssemblyController.update(req)
        await OrderItemController.update(req)
        await OrderController.updateOrderAcceptFromAssembly(req)
        await UserController.simpleUpdate(req)
        await LogHistoryController.create({order_id,user_id,action:accept,action_id : 34,
          data_changed : JSON.stringify({order_id})
        })


        //deleted on socket tuning
        // next([{[GETorders]:order_id},{[GETassembler]:true},{[GETassemblerjob]:true},{[GETassemblerInJob]:true}]
        // ,()=>{
        //     res.json({msg:"Job accepted."})
        // })


        res.json({msg:"Job accepted."})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

router.put('/cancel',m_auth,async (req,res)=>{
    const {user_id} = req.user
    req.body.form.user.user_id = user_id
    const {order_id} = req.body.form.order
   
    try {
        await AssemblyController.update(req)

        await OrderItemController.update(req)

        await OrderController.updateOrderCancelFromAssebmly(req)

        await UserController.simpleUpdate(req)

        await LogHistoryController.create({order_id,user_id,action:cancel})


        //deleted on socket tuning
        // next([{[GETorders]:order_id},{[GETassembler]:true},{[GETassemblerjob]:true},{[GETassemblerInJob]:true}]
        // ,()=>{
        //     res.json({msg:"Job updated."})
        // })
        

        res.json({msg:"Job updated."})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

router.put('/printed',m_auth, async (req,res)=>{
   
    try {
        const {order_id} = req.body.form.order.where
        await OrderController.dynamicOrderUpdate(req)
            // next([{[GETorders]:order_id},{[GETassemblerInJob]:true}],()=>{
            //     res.json({msg:"Update successful."})
            // })

            res.json({msg:"Update successful."})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})




//////////////////////////////////////////////////////////////////
// ************ NEXT LINE ************ //

router.get('/holdjob',m_auth, async (req,res)=>{
    try {
        const {user_id} = req.user
        
        const result = await pool.query(qs.loadFloristHoldJobQuery + " AND jf.user_id = ?",[user_id])
            res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})

// ************ NEXT LINE ************ //
// /system/mobile/update_order_item
// @desc : Hold the user order_item / job
router.put('/hold',m_auth, async (req,res)=>{
    try {
        const {user_id} = req.user
        const {order_id,order_item_id} = req.body.item
        const {notes,disposition_id} = req.body.form
        await pool.query("UPDATE order_item SET  order_item_status_id = 12   \n"+
                 " WHERE order_item_id = ?",[order_item_id])
        await pool.query("INSERT INTO ticket SET created_by = ?, order_id = ? ,order_item_id = ? , notes = ? ,disposition_id = ?",
             [user_id,order_id,order_item_id,notes,disposition_id])
             
        await db.sequelize.query("UPDATE `job_rider` SET status = 12  WHERE order_id = ?` ",{replacements:[cancel_status,order_id]})

        await pool.query('UPDATE `user` set status = 2 where user_id = ?',[user_id])
        
        const result = await pool.query(qs.loadFloristHoldJobQuery + " AND jf.user_id = ?",[user_id])
        const hold_job = result[0]
        // next(order_id,res,
        //     {msg:'Order item status updated to hold.',hold_job})

        res.json({msg:'Order item status updated to hold.'})
            
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})

// ************ NEXT LINE ************ //
///system/order_item_completed
// @desc : Complete the status of order_item / job


// ************ NEXT LINE ************ //

// /mobile/order_item_resumed
// @desc : Resumed user hold item
router.put('/resumed',m_auth, async (req,res)=>{
    const {user_id} = req.user
    const {order_item_id,ticket_id,order_id} = req.body.item
    try {
        await pool.query(qs.updateItemAccepted,[order_item_id,user_id]) 
        await pool.query("UPDATE ticket SET can_be_continued = 0 WHERE ticket_id = ?",[ticket_id])
        await pool.query('UPDATE `user` set status = 3 where user_id = ?',[user_id]) 
        // const msg = "Job resumed"

        
        // next(order_id,res,{msg})

        res.json({msg:'Job resumed'})
    } catch (err) {
        res.status(500).json({msg:"Server Error"})
    }
})



// ************ SAMPLE ROUTER FRO DISPATCH  RETURNS ************ //

router.put('/redispatch',m_auth, async (req,res)=>{
    try {
        const {order_id} = req.body
         await pool.query("UPDATE `order` o JOIN order_item oi set o.order_status_id = 5, oi.order_item_status_id = 5 \n"+
         "AND  o.order_status_id  WHERE order_item != 5 WHERE o.order_id = ?",
            [order_id])
            // const msg = "Update successful."
            // next(order_id,res,msg)

            res.json({msg:'Update successful.'})
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error"})
    }
})


module.exports = router