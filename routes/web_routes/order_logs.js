const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')
const {OrderHelper} = require('../../helper/helper_funtions')
const {pool,sock_domain} = require('../../config/db')
const clientsock = require('socket.io-client')(sock_domain)
const  LogHistoryController = require('../../controllers/order_history')
const {tablerowResetEmit} = require('../../helper/socket_emitters')

//@route : /api/web/ticket

// ************ NEXT LINE ************ //
// /ticket/annotations'
// @decs : filter annotation
router.get('/', m_auth, async (req,res)=>{
    try {
        const result = await LogHistoryController.getSelected(req)
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

router.post('/',async (req,res)=>{
    const {toInsert} = req.body.order_logs
    try {
        const result = await LogHistoryController.create(toInsert)
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

router.put('/',async (req,res)=>{
    const {toUpdate,where} = req.body.order_logs
    try {
        const [rowsAffected] = await LogHistoryController.update({toUpdate,where})
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