const express = require("express");
const query_string = require("qs");
const router = express.Router();
const m_auth = require("../../middleware/mid_auth");
const qs = require("../../helper/query_string");
const {
  OrderHelper: { orderFilter }
} = require("../../helper/helper_funtions");
const { pool } = require("../../config/db")
const db = require("../../models");
const Op = db.Sequelize.Op;
const viewDispatchJobDetailModel = db.view_dispatch_job_detail;
const viewJobsForDispatchModel = db.view_jobs_for_dispatch;
const orderModel = db.order;
const customerModel = db.customer;

//@route :  /api/web/gsearch

let gsResult_holder = [];
//q=:keyword&:first_offset&:last_offset&:loadmore

// /system/globalsearch
///q=:keyword&fos=:first_offset&los=:last_offset&:loadmore
router.get("/", m_auth, async (req, res) => {
  const { q, fos, los, lm } = query_string.parse(req)["query"];
  try {
    if (lm === "true") {
      res.json({
        result: gsResult_holder.slice(fos, los),
        resultRemaining: gsResult_holder.length - los
      });
    } else {
      gsResult_holder = [];
      const orders = await pool.query(
        ` ${qs.getOrderQuery} ${qs.searchOrder(
          pool.escape(`%${q}%`)
        )} GROUP BY 1 ORDER by 2 desc,3,4 LIMIT 15`
      );
      orders.map(o => {
        gsResult_holder = gsResult_holder.concat(orderFilter(o));
      });
      const customers = await pool.query(
        `${qs.loadCustomerInfo} ${qs.searchCustomer(
          pool.escape(`%${q}%`)
        )} LIMIT 15`
      );
      gsResult_holder = [...gsResult_holder, ...customers];
      const products = await pool.query(
        `${qs.loadProductInfo} ${qs.searchProduct(
          pool.escape(`%${q}%`)
        )} LIMIT 15`
      );
      gsResult_holder = [...gsResult_holder, ...products];
      res.json({
        result: gsResult_holder.slice(fos, los),
        resultRemaining: gsResult_holder.length - los
      });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server error." });
  }
});

router.get("/testSearch", m_auth, async (req, res) => {
  //const reqQs = queryStringToSQLQuery(req);
           let orders = null        
            const orders_result = await orderModel.findAll({
              where: { shopify_order_name: { [Op.like]: `%${req.query.q}%` } },
              attributes: [
                "hub_id",
                "order_id",
                "shopify_order_name",
                "delivery_date",
                "delivery_time",
                "payment_status_id",
                "order_status_id"
              ],
              include: [
                {
                  model: customerModel,
                  required: true
                }
              ],
              order: [["created_at", "DESC"]],
              limit: 50,
              raw: true
            });

            orders = orders_result

            if (orders.length) {
              res.json({ result: orders });
            } else {
              const customers = await customerModel.findAll({
                where: {
                  [Op.or]: [
                    {
                      first_name: { [Op.like]: `%${req.query.q}%` }
                    },
                    { last_name: { [Op.like]: `%${req.query.q}%` } },
                    { email: { [Op.like]: `%${req.query.q}%` } }
                  ]
                },
          
                limit: 50,
                raw: true
              });
          
              if (customers.length) {
                res.json({ result: customers });
              } else {
                res.json({ msg: "Not found" });
              }
            }

//type: Sequelize.QueryTypes.SELECT ,

});

module.exports = router;
