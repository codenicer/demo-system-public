const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const  NoteHistoryController = require('../../controllers/order_note_history')
const qs = require('../../helper/query_string')
// const {OrderHelper} = require('../../helper/helper_funtions')
// const {pool,sock_domain} = require('../../config/db')
// const clientsock = require('socket.io-client')(sock_domain)
// const {tablerowResetEmit} = require('../../helper/socket_emitters')
// const {next,commands } = require('../../helper/dynamic_emitter')
// const {GETorders,GETtickets,GETassembler,GETassemblerInJob,GETfloristjob,GETprio_list,GETclosedorder,GETnotesnlogs} = commands

//@route : /api/web/ticket

// ************ NEXT LINE ************ //
// /ticket/annotations'
// @decs : filter annotation
router.get('/', m_auth, async (req,res)=>{
    try {
        const result = await NoteHistoryController.getSelected(req)
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

router.post('/',m_auth,async (req,res)=>{
    const {user_id} = req.user
    const {toInsert} = req.body.order_notes
    const ftoInsert = {
        ...toInsert,
        user_id
    }

    try {
        await NoteHistoryController.create(ftoInsert)
        
        //Delete on socket tuning.
        // next([{[GETorders]:ftoInsert.order_id},{[GETnotesnlogs]:ftoInsert.order_id}],()=>{
        //     res.json({msg:"Order Notes created"})
        //  })

        res.json({msg:"Order Notes created"})

    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

router.put('/',async (req,res)=>{
    const {toUpdate,where} = req.body.order_notes
    try {
        const [rowsAffected] = await NoteHistoryController.update({toUpdate,where})
        res.json(rowsAffected)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})


// ************ NEXT LINE ************ //
// /ticket/add_annotation
// @decs : add annotation

// ************ NEXT LINE ************ //




module.exports = router