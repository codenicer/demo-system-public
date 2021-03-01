const db = require("../models");
const Op = db.Sequelize.Op;
const floristModel = db.job_florist;
const { queryStringToSQLQuery } = require("../helper/queryStringToSQLQuery");
const _ = require("lodash");

// Get All Pending for Florist
exports.floristQeuePending = async (req, res) => {
  const reqQs = queryStringToSQLQuery(req);

  let filterDate = req.query.deliveryDate
    ? {
        delivery_date: req.query.deliveryDate
      }
    : {};

  const qs = {
    attributes: [
      db.Sequelize.col("order_item.title"),
      db.Sequelize.col("order_item->order.order_id"),
      db.Sequelize.col("order_item->order.payment_id"),
      db.Sequelize.col("order_item->order.payment_status_id"),
      db.Sequelize.col("order_item->order.shopify_payment_gateway"),
      db.Sequelize.col("order_item->order.delivery_date"),
      db.Sequelize.col("order_item->order.delivery_time"),
      db.Sequelize.col("order_item->order.shopify_order_name"),
      db.Sequelize.col("order_item->order->addresses.billing_city"),
      db.Sequelize.col("order_item->order->addresses.shipping_city"),
      db.Sequelize.col("order_item->product.img_src")
    ],
    include: [
      {
        model: db.order_item,
        attributes: [],
        where: {
          order_item_status_id: 2
        },
        include: [
          {
            model: db.order,
            attributes: [],
            required: true,
            where: {},
            include: [
              {
                model: db.order_address,
                attributes: [],
                as: "addresses",
                required: true
              }
            ],

            order: [["priority", "DESC"]]
          },
          {
            model: db.product,
            required: true,
            attributes: []
          }
        ]
      }
    ],
    raw: true
  };

  const finalQS = _.merge(reqQs, qs);

  if (req.query.hasOwnProperty("shippingCity")) {
    if (req.query.shippingCity.length > 0) {
      if (req.query.shippingCity.charAt(0) === " ") {
        finalQS.include[0].include[0].include[0]["where"] = {
          shipping_city: {
            [Op.like]: `${req.query.shippingCity.substr(1)}%`
          }
        };
      } else {
        finalQS.include[0].include[0].include[0]["where"] = {
          shipping_city: {
            [Op.like]: `${req.query.shippingCity}%`
          }
        };
      }
    }
  }

  if (req.query.hasOwnProperty("payment_id")) {
    if (req.query.payment_id && req.query.payment_id != 0) {
      filterDate = _.merge({ payment_id: req.query.payment_id }, filterDate);
    }
  }

  if (req.query.hasOwnProperty("shopifyOrderName")) {
    if (req.query.shopifyOrderName) {
      finalQS.include[0].include[0]["where"] = {
        shopify_order_name: { [Op.like]: `%${req.query.shopifyOrderName}%` }
      };
    } else {
      if (req.query.hasOwnProperty("deliveryTime")) {
        if (req.query.deliveryTime) {
          console.log("EYYYYYYYYYYYYYYY", filterDate);

          finalQS.include[0].include[0]["where"] = _.merge(
            {
              delivery_time: { [Op.like]: `%${req.query.deliveryTime}%` }
            },
            filterDate
          );
        } else {
          finalQS.include[0].include[0]["where"] = filterDate;
        }
      }
    }
  }

  try {
    const response = await floristModel.findAndCountAll(finalQS);

    if (!response) {
    } else {
      try {
        const city_result = await floristModel.findAll({
          attributes: [
            [
              db.Sequelize.fn(
                "DISTINCT",
                db.Sequelize.col("order_item->order->addresses.shipping_city")
              ),
              "city"
            ]
          ],
          include: [
            {
              model: db.order_item,
              attributes: [],
              where: {
                order_item_status_id: 2
              },
              include: [
                {
                  model: db.order,
                  attributes: [],
                  required: true,
                  include: [
                    {
                      model: db.order_address,
                      attributes: [],
                      as: "addresses",
                      required: true,
                      where: {}
                    }
                  ],
                  order: [["priority", "DESC"]]
                },
                {
                  model: db.product,
                  required: true,
                  attributes: []
                }
              ]
            }
          ],
          raw: true
        });
        if (!city_result) {
          console.log("error in distinct city", city_result);
        } else {
          response.cities = city_result;
          response.count = 0;
          response.rows = response.rows.filter(item => {
            if (item.payment_id === 3 && item.payment_status_id === 1) {
              return false;
            } else {
              response.count += 1;
              return item;
            }
          });
          res.json(response);
        }
      } catch (cerror) {
        console.log("error in distinct city", cerror);
      }
    }
  } catch (error) {
    console.log("ERROR FloristPending", error);
  }
};
