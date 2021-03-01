const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')
// const {orderFilter} = require('../../helper/helper_funtions')
const {pool,
    // sock_domain
} = require('../../config/db')

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Manila");

// const {tablerowResetEmit,floristJobEmit} = require('../../helper/socket_emitters')

//@route : /api/web/product


// /system/load_product_info
router.get('/:product_id',m_auth, async (req,res)=>{
    const {product_id} = req.params
    try {
        const products = await pool.query(qs.loadProductInfo + " WHERE p.product_id = ? ",[product_id])
        if(products.length > 0){
            res.json(products)
        }else{
            res.status(404).json({
                mgs:'Product not found'
              })
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //


module.exports = router