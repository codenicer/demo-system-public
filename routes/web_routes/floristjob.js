const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')
// const {OrderHelper} = require('../../helper/helper_funtions')
const {pool,sock_domain} = require('../../config/db')
// const clientsock = require('socket.io-client')(sock_domain)

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Manila");

// const {tablerowResetEmit,floristJobEmit} = require('../../helper/socket_emitters')


router.get('/',m_auth, async (req,res)=>{
    try {
        const result = await pool.query(qs.loadFloristJobMonitoring)
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //



module.exports = router