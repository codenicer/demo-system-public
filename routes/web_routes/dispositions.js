const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')
// const {OrderHelper} = require('../../helper/helper_funtions')
const {pool,
    // sock_domain
} = require('../../config/db')

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Manila");

// const {tablerowResetEmit} = require('../../helper/socket_emitters')


router.get('/',m_auth, async (req,res)=>{
    try {
        const result = await pool.query("SELECT disposition_id,name,category FROM disposition")
        res.json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

module.exports = router