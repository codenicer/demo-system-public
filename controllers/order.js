const db = require("../models");
const Op = db.Sequelize.Op;
const orderModel = db.order;
const orderItemModel = db.order_item;
const dispatchJobModel = db.dispatch_job;
const dispatchJobDetailModel = db.dispatch_job_detail;
const productModel = db.product;
const dispatchRiderModel = db.dispatch_job_detail;
const reinstatementModel = db.reinstatement;
const orderHistoryModel = db.order_history;
const sendEMail = require('../helper/sendEmail.json')
const viewJobsForDispatchModel = db.view_jobs_for_dispatch;
const { queryStringToSQLQuery } = require("../helper/queryStringToSQLQuery");
const moment = require("moment-timezone");

const _ = require('lodash');
const { paymentFileUpload } = require("../helper/aws_file_upload");
const singleUpload = paymentFileUpload.single("image");
const nodemailer = require('nodemailer')
const LogHistoryController = require('../controllers/order_history')
const unpaid = 'The Order has been unpaid'

moment.tz.setDefault("Asia/Manila");

var orders = {
  //get order info of specified id

  getAllOpenOrders: async req => {
    const where = {
      where: {
        [Op.or]: [
          {order_status_id: {[Op.lte]: 9}},
          {order_status_id: {[Op.in]: [11, 12, 15]}}
        ]
      },
    }
      orders.getAllOrders(req, where);
  },

  getAllOrders: async (req, where =null) => {
    //('called getAllOrders')

     try {

       const reqQs = queryStringToSQLQuery(req);
       const qs = {

         where,
         attributes: orderModel.selectable,
         include: [
           {
             model: db.customer,
             required: true
           },
           {
             model: db.order_item,
             attributes: orderItemModel.selectable,
             required: true,
             where:{
              deleted_at:{[Op.eq]:null}
            }
           },
           {
             model: db.payment,
             attributes: ["name"],
             required: true
           },
           {
             model: db.order_address,
             as: "addresses",
             attributes: db.order_address.selectable,
             required: true
           }
         ],
        //  distinct: true,
         order: [
           ["priority", "DESC"],
           ["delivery_date", "DESC"],
           ["delivery_time", "ASC"]
         ]
       };

       // if (req.query.filters && Object.keys(req.query.filters).length > 0) {
       //   const querytoArray = Object.entries(JSON.parse(req.query.filters));
       //   querytoArray.forEach(filter => {
       //     qs.where = {
       //       ...qs.where,
       //       [filter[0]]: {
       //         [Op.like]:
       //           filter[0] === "shopify_order_name"
       //             ? `%${filter[1]}%`
       //             : filter[1]
       //       }
       //     };
       //   });
       // }

       const finalQS = Object.assign(reqQs,qs);

       const result = await orderModel.findAndCountAll(finalQS, { raw: true });
       const prod_list = [];
       result.rows.forEach(row => {
         row.order_items.forEach(item => {
           //  //("order ID:",row.order_id,item.product_id)
           prod_list.push(item.product_id);
         });
       });

       if(!result){
         //('Error no result')
       }else{



       }

       const products = await productModel.findAll(
         { where: { product_id: { [Op.in]: prod_list } } },
         { raw: true }
       );

       let filteredResult = [];
       ////(prod_list,"LIST HERE")
       result.rows.forEach(_row => {
         const row = _row.toJSON();
         let newRow = row;
         row.order_items.forEach((item, i) => {
           products.forEach(p => {
             if (item.product_id === p.product_id) {
               newRow.order_items[i] = {
                 ...item,
                 product: p
               };
             }
           });
         });
         filteredResult = filteredResult.concat(newRow);
       });

       //  //(filteredResult.rows[0])
       // const count = await orderModel.(qs2,{raw:true});

       return Promise.resolve({ count: result.count, rows: filteredResult });
     } catch (err) {
       //("orderController error oo:", err);
       return Promise.reject({
         status: 500,
         msg: "An error has occurred."
       });
       // res.status(500).json({msg: 'An error has occurred.'});
     }
   },

  getInfo: async (req, res) => {

      //('called getAllOrders')

      try {

          const reqQs = queryStringToSQLQuery(req);
          const qs = {

              attributes: orderModel.selectable,
              include: [
                  {
                      model: db.customer,
                      required: true
                  },
                  {
                      model: db.order_item,
                      attributes: orderItemModel.selectable,
                      required: true,
                      where:{order_item_status_id: {[Op.ne]: 13}}
                  },
                  {
                      model: db.payment,
                      attributes: ["name"],
                      required: true
                  },
                  {
                      model: db.order_address,
                      as: "addresses",
                      attributes: db.order_address.selectable,
                      required: true
                  }
              ],
              distinct: true,
              order: [
                  ["priority", "DESC"],
                  ["delivery_date", "DESC"],
                  ["delivery_time", "ASC"]
              ]
          };



          const finalQS = Object.assign(reqQs,qs);

          const result = await orderModel.findAll(finalQS, { raw: true });

          if (!result) {
              res.status(200).json([]);
          } else {
              if(result.length){

              const prod_list = [];
              result.forEach(row => {
                  row.order_items.forEach(item => {
                      //  //("order ID:",row.order_id,item.product_id)
                      prod_list.push(item.product_id)
                  })
              })

              const products = await productModel.findAll(
                  {where: {product_id: {[Op.in]: prod_list}}},
                  {raw: true}
              )

              let filteredResult = []
              ////(prod_list,"LIST HERE")
              result.forEach(_row => {
                  const row = _row.toJSON()
                  let newRow = row
                  row.order_items.forEach((item, i) => {
                      products.forEach(p => {
                          if (item.product_id === p.product_id) {
                              newRow.order_items[i] = {
                                  ...item,
                                  product: p
                              }
                          }
                      })
                  })
                  filteredResult = filteredResult.concat(newRow)
              })


          //  //(filteredResult.rows[0])
          // const count = await orderModel.(qs2,{raw:true});


                  res.status(200).json(filteredResult);
              }else{
                  res.status(404).json({ msg: "Record not found" });
              }

          }
      } catch (err) {
          //("error:", err);
          res.status(500).json({ msg: "server error" });
      }
  },
  //insert order record to db to db
  test: async req => {
    try {
      const qs = {
        where: {
          order_status_id: { [Op.lte]: 12 }
        },
        attributes: orderModel.selectable,
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true,
            include: [
              {
                model: db.product,
                required: true
              }
            ]
          },

          {
            model: db.payment,
            attributes: ['name'],
            required: true
          },
          {
            model: db.order_address,
            as: 'addresses',
            attributes: db.order_address.selectable,
            required: true
          }
        ],

        order: [
          ['priority', 'DESC'],
          ['delivery_date', 'DESC'],
          ['delivery_time', 'DESC']
        ]
      }
      const resOrder = await orderModel.findAll(qs, {raw: true})
      return Promise.resolve(resOrder)
    } catch (err) {
      //('orderController error:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },
  tryme: () => {
    //('called try me')
  },
  getOpenOrder:   async req => {
    // console.log("\n\n\n\nHERE PARAMS",req.query,"PARAMS\n\n\n")


    

    const qstring = queryStringToSQLQuery(req);

      /*
       { limit: 30,
       offset: 0,
       where: { delivery_date: [String: '2019-08-22'] } }
       */


    try {
      let qs = {
        where: {
          // [Op.or]: [
             order_status_id: { [Op.notIn]: [10,13,14,16,17] } ,

          //],
          // delivery_date: [String: '2019-08-22']
          // order_status_id: {[Op.lte]:12},
        },

        //attributes: orderModel.selectable,
          attributes: [ ...orderModel.selectable,
             [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'open_ticket'],
             [db.sequelize.literal('(select count(job_florist.job_florist_id) from job_florist  inner join order_item oi on oi.order_item_id = job_florist.order_item_id ' +
                 ' inner join `order` o on oi.order_id = o.order_id where o.order_id = `order`.order_id group by `order`.order_id) '), 'job_florist'],
          ],
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true,
            where:{
              deleted_at:{[Op.eq]:null}
            }
          },
          {
            model: db.payment,
            attributes: ["name"],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          }


        ],
         distinct: true,
        order: [
            ["priority", "DESC"],
          ["delivery_date", "DESC"],
          ["delivery_time", "ASC"],

        ]
      };
      //  //('req.query.filters', req.query.filters);
      // if (req.query.filters && Object.keys(req.query.filters).length > 0) {
      //   const querytoArray = Object.entries(JSON.parse(req.query.filters));
      //   querytoArray.forEach(filter => {
      //     qs.where = {
      //       ...qs.where,
      //       [filter[0]]: filter[0] === "shopify_order_name" ?  {[Op.like]: `%${filter[1]}%`} : {[Op.eq]:filter[1]}
      //       // [filter[0]]: {
      //       //   [Op.like]:
      //       //     filter[0] === "shopify_order_name"
      //       //       ? `%${filter[1]}%`
      //       //       : filter[1]
      //       // }
      //     };
      //   });
      // }

      // if(req.query.filters && Object.keys(JSON.parse(req.query.filters)).length > 0){
      //   //('req.query.filters inside if', req.query.filters);
      //   const querytoArray = Object.entries(JSON.parse(req.query.filters))
      //   querytoArray.forEach(filter=>{
      //
      //
      //     qs.where = {
      //       ...qs.where,
      //
      //       [filter[0]]: filter[0] === "shopify_order_name" ?  {[Op.like]: `%${filter[1]}%`} :   filter[0] === "delivery_date"  ?     {[Op.eq]:db.sequelize.fn('DATE',filter[1]) } : {[Op.eq]:filter[1]}
      //
      //
      //      // [filter[0]]: filter[0] === "shopify_order_name" ?  {[Op.like]: `%${filter[1]}%`} : {[Op.eq]:filter[1]}
      //     }
      //   })
      // }

      let finalQS = {
        ...qs,
        limit: qstring['limit'],
        offset: qstring['offset'],
        where: {...qs['where'], ...qstring['where']}
      }
     console.log("finalQS >>>>>>>>>>>>>>>>>>",finalQS.where)
     
      const result = await orderModel.findAndCountAll(finalQS, {separete:true, raw: true});
      const count_ruther = await orderModel.count(finalQS, {separete:true, raw: true});
      console.log("count_ruther",count_ruther)
      console.log(result)
      const prod_list = [];
      result.rows.forEach(row => {
        row.order_items.forEach(item => {
          //  //("order ID:",row.order_id,item.product_id)
          prod_list.push(item.product_id)
        })
      })

      const products = await productModel.findAll(
        {where: {product_id: {[Op.in]: prod_list}}},
        {raw: true}
      )

      let filteredResult = []
      ////(prod_list,"LIST HERE")
      result.rows.forEach(_row => {
        const row = _row.toJSON()
        let newRow = row
        row.order_items.forEach((item, i) => {
          products.forEach(p => {
            if (item.product_id === p.product_id) {
              newRow.order_items[i] = {
                ...item,
                product: p
              }
            }
          })
        })
        filteredResult = filteredResult.concat(newRow)
      })

      //  //(filteredResult.rows[0])
      // const count = await orderModel.(qs2,{raw:true});
      //("COUNT >>>>>>>>>>>>",result.count)
      return Promise.resolve({count: result.count, rows: filteredResult})
    } catch (err) {
      //('orderController error oo:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },

  getOpenOrderNoHub: async req => {

    const qstring = queryStringToSQLQuery(req);

      /*
       { limit: 30,
       offset: 0,
       where: { delivery_date: [String: '2019-08-22'] } }
       */
    let filterPayment = {};
    if(req.query.payment_id){
      filterPayment['payment_id'] = req.query.payment_id;
    }
    
    try {
      let qs = {
        where:
            { hub_id: null, order_status_id :{[Op.notIn] : [13,14,12,11] }},



        attributes: [...db.view_jobs.selectable,
          [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `view_jobs`.order_id and ticket.status_id=1)'), 'open_ticket'],
            [db.sequelize.literal('(select IF(count(ticket.ticket_id), ticket.ticket_id, null) from ticket  where ticket.order_id = `view_jobs`.order_id and ticket.status_id=1) '), 'ticket_id'],
            //[db.sequelize.literal('(select ticket.ticket_id from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1)'), 'ticket_id'],
       ],
       include:[
        {
          model: db.order,
          attributes: ["payment_id"],
          required: true,
          where: filterPayment
        },
       ],
        order: [
          ["delivery_date", "DESC"],
          ["delivery_time", "ASC"]
        ]
      };

      let finalQS = {
        ...qs,
        limit: qstring['limit'],
        offset: qstring['offset'],
        where: {...qs['where'], ...qstring['where']}
      }

      const result = await db.view_jobs.findAndCountAll(finalQS, {raw: true});
      //  //(filteredResult.rows[0])
      // const count = await orderModel.(qs2,{raw:true});

      return Promise.resolve({count: result.count, rows: result.rows})
    } catch (err) {
      console.log('orderController error oo:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },

  getRestofPhilOrder: async req => {

    console.log("\n\n\n\nHERE PARAMS",req.query,"PARAMS\n\n\n")

    const qstring = queryStringToSQLQuery(req);

    try {
      let qs = {
        where: {
             hub_id: 5,
             shopify_order_name: {[Op.like]: `%${req.query.created_at}%`},
             order_status_id: { [Op.notIn]: [10,13,14,16,17] } ,

          //],
          // delivery_date: [String: '2019-08-22']
          // order_status_id: {[Op.lte]:12},
        },

        //attributes: orderModel.selectable,
          attributes: [ ...orderModel.selectable,
             [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'open_ticket'],
             [db.sequelize.literal('(select count(job_florist.job_florist_id) from job_florist  inner join order_item oi on oi.order_item_id = job_florist.order_item_id ' +
                 ' inner join `order` o on oi.order_id = o.order_id where o.order_id = `order`.order_id group by `order`.order_id) '), 'job_florist'],
          ],
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true,
            where:{
              deleted_at:{[Op.eq]:null}
            }
          },
          {
            model: db.payment,
            attributes: ["name"],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          }


        ],
         distinct: true,
        order: [
            ["priority", "DESC"],
          ["delivery_date", "DESC"],
          ["delivery_time", "ASC"],

        ]
      };

      let finalQS = {
        ...qs,
        limit: qstring['limit'],
        offset: qstring['offset'],
        where: {...qs['where'], ...qstring['where']}
      }
     console.log("finalQS >>>>>>>>>>>>>>>>>>",finalQS.where)
     
      const result = await orderModel.findAndCountAll(finalQS, {raw: true});


      const prod_list = [];
      result.rows.forEach(row => {
        row.order_items.forEach(item => {
          //  //("order ID:",row.order_id,item.product_id)
          prod_list.push(item.product_id)
        })
      })

      const products = await productModel.findAll(
        {where: {product_id: {[Op.in]: prod_list}}},
        {raw: true}
      )

      let filteredResult = []
      ////(prod_list,"LIST HERE")
      result.rows.forEach(_row => {
        const row = _row.toJSON()
        let newRow = row
        row.order_items.forEach((item, i) => {
          products.forEach(p => {
            if (item.product_id === p.product_id) {
              newRow.order_items[i] = {
                ...item,
                product: p
              }
            }
          })
        })
        filteredResult = filteredResult.concat(newRow)
      })

      //  //(filteredResult.rows[0])
      // const count = await orderModel.(qs2,{raw:true});
      //("COUNT >>>>>>>>>>>>",result.count)
      return Promise.resolve({count: result.count, rows: filteredResult})
    } catch (err) {
      //('orderController error oo:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },

  getRestofPhilOrderDispatch: async req => {

    console.log("\n\n\n\nHERE PARAMS",req.query,"PARAMS\n\n\n")

    const qstring = queryStringToSQLQuery(req);

    try {
      let qs = {
        where: {
             hub_id: 5,
             order_status_id: { [Op.notIn]: [10,13,14,16,17,9] },
             shopify_order_name: {[Op.like]: `%${req.query.created_at}%`},
             [Op.or]: [
               { payment_status_id: 2 },
               { payment_id: 2 }
             ]

          //],
          // delivery_date: [String: '2019-08-22']
          // order_status_id: {[Op.lte]:12},
        },

        //attributes: orderModel.selectable,
          attributes: [ ...orderModel.selectable,
             [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'open_ticket'],
             [db.sequelize.literal('(select count(job_florist.job_florist_id) from job_florist  inner join order_item oi on oi.order_item_id = job_florist.order_item_id ' +
                 ' inner join `order` o on oi.order_id = o.order_id where o.order_id = `order`.order_id group by `order`.order_id) '), 'job_florist'],
          ],
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true,
            where:{
              deleted_at:{[Op.eq]:null}
            }
          },
          {
            model: db.payment,
            attributes: ["name"],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          }


        ],
         distinct: true,
        order: [
            ["priority", "DESC"],
          ["delivery_date", "DESC"],
          ["delivery_time", "ASC"],

        ]
      };

      let finalQS = {
        ...qs,
        limit: qstring['limit'],
        offset: qstring['offset'],
        where: {...qs['where'], ...qstring['where']}
      }
     console.log("finalQS >>>>>>>>>>>>>>>>>>",finalQS.where)
     
      const result = await orderModel.findAndCountAll(finalQS, {raw: true});


      const prod_list = [];
      result.rows.forEach(row => {
        row.order_items.forEach(item => {
          //  //("order ID:",row.order_id,item.product_id)
          prod_list.push(item.product_id)
        })
      })

      const products = await productModel.findAll(
        {where: {product_id: {[Op.in]: prod_list}}},
        {raw: true}
      )

      let filteredResult = []
      ////(prod_list,"LIST HERE")
      result.rows.forEach(_row => {
        const row = _row.toJSON()
        let newRow = row
        row.order_items.forEach((item, i) => {
          products.forEach(p => {
            if (item.product_id === p.product_id) {
              newRow.order_items[i] = {
                ...item,
                product: p
              }
            }
          })
        })
        filteredResult = filteredResult.concat(newRow)
      })

      //  //(filteredResult.rows[0])
      // const count = await orderModel.(qs2,{raw:true});
      //("COUNT >>>>>>>>>>>>",result.count)
      return Promise.resolve({count: result.count, rows: filteredResult})
    } catch (err) {
      //('orderController error oo:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },

  getOpenOrderNoDateOrTime: async req => {
    //(req.query)
    const qstring = queryStringToSQLQuery(req);
      /*
       { limit: 30,
       offset: 0,
       where: { delivery_date: [String: '2019-08-22'] } }
       */

    try {
      let qs = {
        where: {
          [Op.or]: [
            { delivery_date:null },
            { delivery_time:null },
          ],
        order_status_id: { [Op.notIn]: [11,12,13,14] }

          // delivery_date: [String: '2019-08-22']
          // order_status_id: {[Op.lte]:12},
        },

        //attributes: orderModel.selectable,
        attributes: [ ...orderModel.selectable,
          [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1)'), 'open_ticket'],
          [db.sequelize.literal('(select IF(count(ticket.ticket_id), ticket.ticket_id, null) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'ticket_id'],
       ],
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true,
              where:{
              deleted_at:{[Op.eq]:null}
            }
          },
          {
            model: db.payment,
            attributes: ["name"],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          },
          {
            model: db.hub,
            required: true
          }


        ],
         distinct: true,
        order: [
          // ["priority", "DESC"],
          ["delivery_date", req.query.sort],
          ["delivery_time", req.query.sort]
          // db.sequelize.fn('isnull', db.sequelize.col('delivery_date')),
          // ['delivery_date', 'DESC']

        ]
      };

      let finalQS =  { ...qs, limit:qstring['limit'],offset:qstring['offset'], where: {...qs['where'], ...qstring['where'] } }



      const result = await orderModel.findAndCountAll(finalQS, { raw: true });
      const prod_list = [];
      result.rows.forEach(row => {
        row.order_items.forEach(item => {
          //  //("order ID:",row.order_id,item.product_id)
          prod_list.push(item.product_id)
        })
      })

      const products = await productModel.findAll(
        {where: {product_id: {[Op.in]: prod_list}}},
        {raw: true}
      )

      let filteredResult = []
      ////(prod_list,"LIST HERE")
      result.rows.forEach(_row => {
        const row = _row.toJSON()
        let newRow = row
        row.order_items.forEach((item, i) => {
          products.forEach(p => {
            if (item.product_id === p.product_id) {
              newRow.order_items[i] = {
                ...item,
                product: p
              }
            }
          })
        })
        filteredResult = filteredResult.concat(newRow)
      })

      //  //(filteredResult.rows[0])
      // const count = await orderModel.(qs2,{raw:true});

      return Promise.resolve({count: result.count, rows: filteredResult})
    } catch (err) {
      //('orderController error oo:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },
  getSympathyOrder: async req => {
    const qstring = queryStringToSQLQuery(req);

    let delTime = null



    try {
      let qs = {

        attributes: [ ...orderModel.selectable],

        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            where:{
              deleted_at:{[Op.eq]:null}
            },
            include : [
              {
                model: db.product,
                where : {
                  type : 'Funeral Stand'
                },
                required: true,
              },
            ],
            
          },
          {
            model: db.hub,
            required: true
          },
          {
            model: db.payment,
            attributes: ["name"],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          }


        ],
         distinct:true,
        order: [
          ["priority", "DESC"],
          ["delivery_date", "DESC"],
          ["delivery_time", "ASC"],

        ]
      };

      let finalQS = {
        ...qs,
        limit: qstring['limit'],
        offset: qstring['offset'],
        where: {...qs['where'], ...qstring['where']}
      }

      const result = await orderModel.findAndCountAll(finalQS, {raw: true});
      const prod_list = [];
      result.rows.forEach(row => {
        row.order_items.forEach(item => {
          //  //("order ID:",row.order_id,item.product_id)
          prod_list.push(item.product_id)
        })
      })

      if (qstring.where.delivery_date){
        delTime = moment(qstring.where.delivery_date).format('YYYY-MM-DD')
      }

      const sympathy_counts = async () => {

        if(qstring.where.shopify_order_name != undefined){
          return [{count: result.count}]
        }
        else if (delTime == null){
          const sympathyCount = await db.sequelize.query('SELECT count(DISTINCT(order.order_id)) ' +
            'AS count FROM `order` AS `order` INNER JOIN `customer` AS `customer` ON `order`.`customer_id` ' +
            '= `customer`.`customer_id` LEFT OUTER JOIN ( `order_item` AS `order_items` INNER JOIN `product` AS' +
            ' `order_items->product` ON `order_items`.`product_id` = `order_items->product`.`product_id` AND' +
            ' `order_items->product`.`type` = "Funeral Stand" ) ON `order`.`order_id` = `order_items`.`order_id`' +
            ' INNER JOIN `payment` AS `payment` ON `order`.`payment_id` = `payment`.`payment_id` INNER JOIN' +
            ' `order_address` AS `addresses` ON `order`.`order_address_id` = `addresses`.`order_address_id` WHERE' +
            ' `order_items->product`.`type` = "Funeral Stand"',
            {replacements : {delivery_date : delTime }, type: db.sequelize.QueryTypes.SELECT}
          )
          return sympathyCount
        }else{
          const sympathyCount = await db.sequelize.query('SELECT count(DISTINCT(order.order_id)) ' +
            'AS count FROM `order` AS `order` INNER JOIN `customer` AS `customer` ON `order`.`customer_id` ' +
            '= `customer`.`customer_id` LEFT OUTER JOIN ( `order_item` AS `order_items` INNER JOIN `product` AS' +
            ' `order_items->product` ON `order_items`.`product_id` = `order_items->product`.`product_id` AND' +
            ' `order_items->product`.`type` = "Funeral Stand" ) ON `order`.`order_id` = `order_items`.`order_id`' +
            ' INNER JOIN `payment` AS `payment` ON `order`.`payment_id` = `payment`.`payment_id` INNER JOIN' +
            ' `order_address` AS `addresses` ON `order`.`order_address_id` = `addresses`.`order_address_id` WHERE' +
            ' `order`.delivery_date =:delivery_date AND `order_items->product`.`type` = "Funeral Stand"',
            {replacements : {delivery_date : delTime }, type: db.sequelize.QueryTypes.SELECT}
          )
          return sympathyCount
        }
      }

      const sympathy_count = await sympathy_counts()

      const products = await productModel.findAll(
        {where: {product_id: {[Op.in]: prod_list}}},
        {raw: true}
      )

      let filteredResult = []
      ////(prod_list,"LIST HERE")
      result.rows.forEach(_row => {
        const row = _row.toJSON()
        let newRow = row
        row.order_items.forEach((item, i) => {
          products.forEach(p => {
            if (item.product_id === p.product_id) {
              newRow.order_items[i] = {
                ...item,
                product: p
              }
            }
          })
        })
        filteredResult = filteredResult.concat(newRow)
      })

      //  //(filteredResult.rows[0])
      // const count = await orderModel.(qs2,{raw:true});



      return Promise.resolve({count: sympathy_count[0].count , rows: filteredResult})
    } catch (err) {
      //('orderController error oo:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },

  getSelectedOrder: async req => {
    const {order_id} = req.params
    //(req.params)
    try {
      const qs = {
        where: {
          order_id
        },
        attributes: orderModel.selectable,
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true,
            include: [
              {
                model: db.product,
                required: true
              }
            ]
          },
          {
            model: db.payment,
            attributes: ["name"],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          },
          {
            model: db.job_rider,
            required: false
          }
        ],
        distinct: true
      };

      const resOrder = await orderModel.findAll(qs, { raw: true });
      //  const test = resOrder.toJSON()
      return Promise.resolve(resOrder);
    } catch (err) {
      //("orderController error:", err);
      return Promise.reject({
        status: 500,
        msg: "An error has occurred."
      });
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },

  getOrders: async (req, res) => {



    try{
      if(req.query.filters && Object.keys(JSON.parse(req.query.filters)).length > 0){
        //('req.query.filters inside if', req.query.filters);
        const querytoArray = Object.entries(JSON.parse(req.query.filters))
        querytoArray.forEach(filter=>{


          qs.where = {
            ...qs.where,

            [filter[0]]: filter[0] === "shopify_order_name" ?  {[Op.like]: `%${filter[1]}%`} :   filter[0] === "delivery_date"  ?     {[Op.eq]:db.sequelize.fn('DATE',filter[1]) } : {[Op.eq]:filter[1]}


            // [filter[0]]: filter[0] === "shopify_order_name" ?  {[Op.like]: `%${filter[1]}%`} : {[Op.eq]:filter[1]}
          }
        })
      }


      const result = await orderModel.findAndCountAll(qs, { raw: true });
      const prod_list = [];
      result.rows.forEach(row => {
        row.order_items.forEach(item => {
          //  //("order ID:",row.order_id,item.product_id)
          prod_list.push(item.product_id);
        });
      });

      const products = await productModel.findAll(
        { where: { product_id: { [Op.in]: prod_list } } },
        { raw: true }
      );

      let filteredResult = [];
      ////(prod_list,"LIST HERE")
      result.rows.forEach(_row => {
        const row = _row.toJSON();
        let newRow = row;
        row.order_items.forEach((item, i) => {
          products.forEach(p => {
            if (item.product_id === p.product_id) {
              newRow.order_items[i] = {
                ...item,
                product: p
              }
            }
          })
        })
        filteredResult = filteredResult.concat(newRow)
      })

      //  //(filteredResult.rows[0])
      // const count = await orderModel.(qs2,{raw:true});

      return Promise.resolve({count: result.count, rows: filteredResult})
    } catch (err) {
      //('orderController error oo:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },
  updateOrderCancelFromAssebmly: async req => {
    const { order_id, toUpdate } = req.body.form.order;
    //("TO UPDATE ORDER CANCEL ", toUpdate);
    try {
      let [numberOfAffectedRows] = await orderModel.update({
          ...toUpdate,
          quality_check: 0

      }, {
        where: { 
            order_id,
            order_status_id:{[Op.lte]:7}
         }
      });
      return Promise.resolve({ numberOfAffectedRows });
    } catch (err) {
      //(err.message);
      return Promise.reject({ status: 500, msg: "Server error" });
    }
  },
  
  updateOrderAcceptFromAssembly: async req => {
    const { order_id, toUpdate } = req.body.form.order;
    //("TO UPDATE ORDER ", toUpdate);
    try {
      let [numberOfAffectedRows] = await orderModel.update({
          ...toUpdate,
          quality_check: 0

      }, {
        where: { 
          order_id ,
          order_status_id:{[Op.lte]:7}
        }
      });
      return Promise.resolve({ numberOfAffectedRows });
    } catch (err) {
      //(err.message);
      return Promise.reject({ status: 500, msg: "Server error" });
    }
  },
  
  updateOrder: async req => {
    const { order_id, toUpdate } = req.body.form.order;
    //("TO UPDATE ORDER ", toUpdate);
    try {
      let [numberOfAffectedRows] = await orderModel.update({
          ...toUpdate,
          quality_check: 1

      }, {
        where: { order_id, quality_check: 0 }
      });
      return Promise.resolve({ numberOfAffectedRows });
    } catch (err) {
      //(err.message);
      return Promise.reject({ status: 500, msg: "Server error" });
    }
  },
    setQualityCheck: async (req, res) => {
    
    const { order_id } = req.body;
    try {
      let [numberOfAffectedRows] = await orderModel.update({
          quality_check:true
      }, {
        where: { order_id,
            quality_check:false
        }
      });
        //Get User by name

        let myUser = await db.user.findAll({
          where:{
            user_id: req.user.user_id
          },
          raw: true
        })
        .catch(err => {
          //("CAN'T FIND USER BY ID", err);
        })

        //(myUser, "MOTHER FUCKERS");
        if(!myUser){
          //("CAN'T FIND USER BY ID");
        }

        else{
          try{
            await orderHistoryModel.create({
                order_id,
                //order_item_id: djd[0].order_reference_id,
                user_id: req.user.user_id,
                action:`The order has been checked for quality by: ${myUser[0].first_name} ${myUser[0].last_name}`,
              action_id: 27,
              data_changed : JSON.stringify({order_id: order_id})

            });
        }catch(errorOHM){
            //('error in creating order history log', errorOHM);
        }

        return res.status(200).json('Record successfully updated');


        }

    } catch (err) {
        //('set quality check', err.message);
        return res.status(200).json('Error processing your request.');
    }
  },

    updateOrderFromAssembly: async req => {
        const { order_id, toUpdate } = req.body.form.order;
        //("TO UPDATE", toUpdate);
        try {
            let [numberOfAffectedRows] = await orderModel.update({
                ...toUpdate,
                quality_check: 1

            }, {
                where: {
                  order_id ,
                  order_status_id:{[Op.lte]:7}
                }
            });
            return Promise.resolve({ numberOfAffectedRows });
        } catch (err) {
            //(err.message);
            return Promise.reject({ status: 500, msg: "Server error" });
        }
    },
  dynamicOrderUpdate: async (req,res) => {
    return Promise.resolve('Record successfully updated   QWEQWEQWE QWE!!!');
    const { where, toUpdate } = req.body.form.order;
    //("TO UPDATE", toUpdate);
    try {
      let [numberOfAffectedRows] = await orderModel.update({...toUpdate}, {
        where: { ...where }
      });
      return Promise.resolve('Record successfully updated');
    } catch (err) {
      //(err.message);
      return Promise.resolve(result);
    }
  },
  testQuery: async (req, res) => {
    try {
      const qs = {
        where: {
          payment_status_id: { [Op.eq]: 2 },
          order_status_id: { [Op.eq]: 5 }
        },
        attributes: orderModel.selectable,
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            required: true
          },

          {
            model: db.payment,
            attributes: ['name'],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          }
        ],

        order: [
          ["priority", "DESC"],
          ["delivery_date", "DESC"],
          ["delivery_time", "DESC"]
        ]
      };

      //qs.attributes = orderModel.selectable;
      const result = await orderModel.findAll(qs, { raw: true });

      if (!result) {
        res.status(200).json([]);
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      //("error:", err);
      res.status(500).json({ msg: "server error" });
    }
  },
  getOrderTicket : async (req,res) =>{

    const {orderId} = req.params;

    //(orderId)
    try {


      const result = await ticketModel.findAll({
        where: {
          [Op.and]: [{ order_id: orderId }, { status_id: 1 }]
        }
      });

      if (!result.length > 0) {
        res.status(200).json([]);
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(400).json({ msg: "unable to get ticket" });
    }
  },
  getOrderDispatch : async (req,res) =>{

    const {orderId} = req.params;

    //(orderId)
    try {


      const result = await ticketModel.findAll({

        where: {
          order_id: orderId,

        }
      });

      if (!result.length > 0) {
        res.status(200).json([]);
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(400).json({ msg: "unable to get ticket" });
    }
    if (!result) {
      res.status(200).json([]);
    } else {
      res.status(200).json(result);
    }

  },

  getRiderInformation: async (req, res) => {
    try {
      ////(req.body.shopify_order_name);
      const {shopify_order_name} = req.body

      const response = await dispatchJobDetailModel.findAll({
        where: {shopify_order_name: shopify_order_name},
        order: [['dispatch_job_detail_id', 'desc']],
        limit: 1,
        attributes: ['dispatch_job_detail_id', 'shopify_order_name'],
        include: [
          {
            model: dispatchJobModel,
            required: true
          }
        ]
      })

      res.json(response);
    } catch (error) {
      //("CANNOT DISPATCH JOB DETAIL", error);
    }
  },

     payment_file_attachment: async(req, res) => {


       singleUpload(req, res, async (err) => {

             if (err) return res.json(err);

             if(req.file){
                 //(req.file.location, req.sOrderName, "HEYHEYHEYHEY");

                    const savePOPLink = await orderModel.update(
                    {
                      proof_of_payment: req.file.location
                    },
                    {
                      where: {
                        shopify_order_name: req.sOrderName
                      }
                    }
                  );
          
                  if (!savePOPLink) {
                    //("Error Inserting proof of payment image");
                  } else {
                    return res.json({ imageUrl: req.file.location });
                  }
             }
         });
     },

  getClosedOrder: async req => {


    //return //(req.query.hub_id);
    const reqQs = queryStringToSQLQuery(req)

    //('hahha', req.query.hub_id)
    let hubs = [1,2,3,4]
    if(req.query.hub_id != undefined ){
      hubs = req.query.hub_id.toString().split(",")
    }

    try {
      const qs = {
        where: {

          [Op.or]:[
            {order_status_id: { [Op.in]: [10, 13, 14]}, hub_id : { [Op.in]: hubs}},
            {payment_status_id : 4,hub_id : { [Op.in]: hubs}},
            {hub_id: null, order_status_id: { [Op.in]: [10, 13, 14]}}
      ]

        },

        attributes: orderModel.selectable,
        include: [
          {
            model: db.customer,
            required: false,
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true,
            where:{
              deleted_at:{[Op.eq]:null}
            },
            include:[{
              model: db.product,
              attributes: ['img_src'],

            }]

          },
          {
            model: db.payment,
            attributes: ['name'],
            required: true
          },

          {
            model: db.hub,
            required: false
          },

          {
            model: db.order_address,
            as: 'addresses',
            attributes: db.order_address.selectable,
            required:false,
          }
        ],
         distinct: true,
        order: [
          ['updated_at', 'DESC']
        ]
      }

      let finalQS = {...qs, limit: reqQs['limit'], offset: reqQs['offset'], where: {...qs['where'], ...reqQs['where']}}
      //return //(finalQS);
      const result = await orderModel.findAndCountAll(finalQS, {raw: true})

      if (!result) {
        return Promise.resolve({rows: [], count: 0})
        // res.status(200).json({status:401,msg:'No records found', rows:[],count:0});
      } else {
        order_id_list = []
        result.rows.forEach(row =>{
            order_id_list.push(row.order_id)
        })


        try {
          const dispatchResult = await dispatchRiderModel.findAll({
            where: {
              order_id: {[Op.in]: order_id_list},
              status : 10
            },
            include: [
              {
                model: db.dispatch_job,
                required: true
              }
            ]
          })

          if (!dispatchResult) {
            //('error no result')
          } else {
            result.dispatch_rider = dispatchResult
          }
        } catch (err) {
          return 'unable to get dispatch rider'
        }

        return result
        // res.status(200).json(result);
      }
    } catch (err) {
      //('Order Controller', err.message)
      return Promise.reject({status: 400, msg: 'Unable to process request'})
      // res.status(400).json({msg:'Unable to process request'});
    }
  },
  unpaidOrder : async (req,res) => {

    const order_id = req.params.orderId
    const {user_id} = req.user

    try{

      const updateOrder = await orderModel.update({
        payment_status_id: 1,
        order_status_id : 2
      }, {
        where: { order_id: order_id }
      });

      if(!updateOrder){
        //('Unable to unpaid order')
      }else{

        await db.job_rider.update({
          status: 7},{
          where : { order_id : order_id}
        })

        await LogHistoryController.create({order_id,user_id,action:unpaid, action_id: 1})
        await res.status(200).json({msg: 'Unpaid Order Successful'})
      }

    }catch (err){
        res.status(400).json({msg : 'Unable to unpaid order'})
    }

  }, getOpenOrderNoHubCount: async req => {

    const qstring = queryStringToSQLQuery(req);


    try {
      let qs = {
        where:

            { hub_id: null, order_status_id :{[Op.notIn] : [13,14,12,11] }},



        attributes: [ ...orderModel.selectable,
          [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1)'), 'open_ticket'],
            [db.sequelize.literal('(select IF(count(ticket.ticket_id), ticket.ticket_id, null) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'ticket_id'],
            //[db.sequelize.literal('(select ticket.ticket_id from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1)'), 'ticket_id'],
       ],
        include: [
          {
            model: db.customer,
            required: true
          },

          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true
          },
          {
            model: db.payment,
            attributes: ["name"],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          }
        ],
        distinct: true,
        order: [
          ["priority", "DESC"],
          ["delivery_date", "DESC"],
          ["delivery_time", "ASC"]
        ]
      };
      let finalQS = {
        ...qs,
        limit: qstring['limit'],
        offset: qstring['offset'],
        where: {...qs['where'], ...qstring['where']}
      }



      const count = await orderModel.count(finalQS, {raw: true});
      

      //("RUTHER COUNT V2",count)

      return Promise.resolve(count)
    } catch (err) {
      //('orderController error oo:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      
    }
  },
  
  getOpenOrderNoDateOrTimeCount: async req => {
    const qstring = queryStringToSQLQuery(req);
    try {
      let qs = {
        where: {
          [Op.or]: [
            { delivery_date:null },
            { delivery_time:null },
          ],
        order_status_id: { [Op.notIn]: [11,12,13,14] }
        },

        attributes: [ ...orderModel.selectable,
          [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1)'), 'open_ticket'],
          [db.sequelize.literal('(select IF(count(ticket.ticket_id), ticket.ticket_id, null) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'ticket_id'],
       ],
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true
          },
          {
            model: db.payment,
            attributes: ["name"],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          },
          {
            model: db.hub,
            required: true
          }


        ],
        distinct: true,
        order: [
          db.sequelize.fn('isnull', db.sequelize.col('delivery_date')),
          ['delivery_date', 'DESC']

        ]
      };

      let finalQS =  { ...qs, limit:qstring['limit'],offset:qstring['offset'], where: {...qs['where'], ...qstring['where'] } }



      const count = await orderModel.count(finalQS, { raw: true });
  
      return Promise.resolve(count)
    } catch (err) {
      //('orderController error oo:', err)
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
     
    }
    
  },

  getOpenOrderCountOnly:   async req => {
    const qstring = queryStringToSQLQuery(req);

      /*
       { limit: 30,
       offset: 0,
       where: { delivery_date: [String: '2019-08-22'] } }
       */


    try {
      let qs = {
        where: {
          // dont include orders with status of 
          // delivered, cancelled internal, cancelled by customer
          // dispatch booked, redispatch, completed and on hold (it has own table)
          order_status_id: { [Op.notIn]: [10,13,14,15,16,17,12] },

          // show only order with pending and overdue payment
          payment_status_id: { [Op.in]: [1,4] },

          // exclude orders with payment method of CPU
          // since it will be automatically paid when delivered
          payment_id: { [Op.ne]: 2 }
      },

          attributes: [ ...orderModel.selectable,
            [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'open_ticket'],
            [db.sequelize.literal('(select count(job_florist.job_florist_id) from job_florist  inner join order_item oi on oi.order_item_id = job_florist.order_item_id ' +
                ' inner join `order` o on oi.order_id = o.order_id where o.order_id = `order`.order_id group by `order`.order_id) '), 'job_florist'],
        ],
        include: [
          {
            model: db.customer,
            required: true
          },
          {
            model: db.order_item,
            attributes: orderItemModel.selectable,
            required: true
          },
          {
            model: db.payment,
            attributes: ["name"],
            required: true
          },
          {
            model: db.order_address,
            as: "addresses",
            attributes: db.order_address.selectable,
            required: true
          }


        ],
        distinct: true,
        order: [
            ["priority", "DESC"],
          ["delivery_date", "DESC"],
          ["delivery_time", "ASC"],

        ]
      };

     
      let finalQS = {
        ...qs,
        limit: qstring['limit'],
        offset: qstring['offset'],
        where: {...qs['where'], ...qstring['where']}
      }

      console.log("\n\nfinalQS v2 >>>>>>>>>>>>>>>>>>",finalQS.where,"\n\n\n")

      const count = await orderModel.count(finalQS, {raw: true});


      return Promise.resolve(count)
    } catch (err) {
      return Promise.reject({
        status: 500,
        msg: 'An error has occurred.'
      })
      // res.status(500).json({msg: 'An error has occurred.'});
    }
  },

// get unpaid orders
getUnpaidOrders: async req => {
  const qstring = queryStringToSQLQuery(req);

  try {
    let qs = {
      where: {
          // dont include orders with status of 
          // delivered, cancelled internal, cancelled by customer
          // dispatch booked, redispatch, completed and on hold (it has own table)
          order_status_id: { [Op.notIn]: [10,13,14,15,16,17,12] },

          // show only order with pending and overdue payment
          payment_status_id: { [Op.in]: [1,4] },

          // exclude orders with payment method of CPU
          // since it will be automatically paid when delivered
          payment_id: { [Op.ne]: 2 }
      },
      attributes: [ ...orderModel.selectable,
        [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'open_ticket'],
        [db.sequelize.literal('(select count(job_florist.job_florist_id) from job_florist  inner join order_item oi on oi.order_item_id = job_florist.order_item_id ' +
            ' inner join `order` o on oi.order_id = o.order_id where o.order_id = `order`.order_id group by `order`.order_id) '), 'job_florist'],
     ],
      include: [
        {
          model: db.customer,
          required: true
        },
        {
          model: db.order_item,
          attributes: orderItemModel.selectable,
          required: true,
          where:{
            deleted_at:{[Op.eq]:null}
          }
        },
        {
          model: db.payment,
          attributes: ["name"],
          required: true
        },
        {
          model: db.order_address,
          as: "addresses",
          attributes: db.order_address.selectable,
          required: true
        },
      ],
      // distinct: true,
      order: [ 
        ["priority", "DESC"],
        ["delivery_date", "DESC"],
        ["delivery_time", "ASC"],
      ]
    };

    let finalQS = {
      ...qs,
      limit: qstring['limit'],
      offset: qstring['offset'],
      where: {...qs['where'], ...qstring['where']}
    }

    const result = await orderModel.findAndCountAll(finalQS, {raw: true})
    const prod_list = [];
    result.rows.forEach(row => {
      row.order_items.forEach(item => {
        prod_list.push(item.product_id)
      })
    })

    const products = await productModel.findAll(
      {where: {product_id: {[Op.in]: prod_list}}},
      {raw: true}
    )

    let filteredResult = []
    result.rows.forEach(_row => {
      const row = _row.toJSON()
      let newRow = row
      row.order_items.forEach((item, i) => {
        products.forEach(p => {
          if (item.product_id === p.product_id) {
            newRow.order_items[i] = {
              ...item,
              product: p
            }
          }
        })
      })
      
      filteredResult = filteredResult.concat(newRow)
    })

    return Promise.resolve({count: result.count, rows: filteredResult})
  } catch (err) {
    console.log('orderController error oo:', err)
    return Promise.reject({
      status: 500,
      msg: 'An error has occurred.'
    })
  }
},

// get orders onhold
getOrdersOnholdCount: async req => {
  const qstring = queryStringToSQLQuery(req);

  try {
    let qs = {
      where: {
         // get all orders with onhold status
          order_status_id: { [Op.eq]: [12] },

      },
      attributes: [ ...orderModel.selectable,
        [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'open_ticket'],
        [db.sequelize.literal('(select count(job_florist.job_florist_id) from job_florist  inner join order_item oi on oi.order_item_id = job_florist.order_item_id ' +
            ' inner join `order` o on oi.order_id = o.order_id where o.order_id = `order`.order_id group by `order`.order_id) '), 'job_florist'],
     ],
      include: [
        {
          model: db.customer,
          required: true
        },
        {
          model: db.order_item,
          attributes: orderItemModel.selectable,
          required: true
        },
        {
          model: db.payment,
          attributes: ["name"],
          required: true
        },
        {
          model: db.order_address,
          as: "addresses",
          attributes: db.order_address.selectable,
          required: true
        },
      ],
      distinct: true,
      order: [ 
        ["priority", "DESC"],
        ["delivery_date", "DESC"],
        ["delivery_time", "ASC"],
      ]
    };

    let finalQS = {
      ...qs,
      limit: qstring['limit'],
      offset: qstring['offset'],
      where: {...qs['where'], ...qstring['where']}
    }

    console.log("\n\nfinalQS v2 >>>>>>>>>>>>>>>>>>",finalQS.where,"\n\n\n")

    const count = await orderModel.count(finalQS, {raw: true});


    return Promise.resolve(count)
  } catch (err) {
    return Promise.reject({
      status: 500,
      msg: 'An error has occurred.'
    })
    // res.status(500).json({msg: 'An error has occurred.'});
  }
},


// get orders onhold
getOrdersOnhold: async req => {
  const qstring = queryStringToSQLQuery(req);

  try {
    let qs = {
      where: {
         // get all orders with onhold status
          order_status_id: { [Op.eq]: [12] },

      },
      attributes: [ ...orderModel.selectable,
        [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `order`.order_id and ticket.status_id=1) '), 'open_ticket'],
        [db.sequelize.literal('(select count(job_florist.job_florist_id) from job_florist  inner join order_item oi on oi.order_item_id = job_florist.order_item_id ' +
            ' inner join `order` o on oi.order_id = o.order_id where o.order_id = `order`.order_id group by `order`.order_id) '), 'job_florist'],
     ],
      include: [
        {
          model: db.customer,
          required: true
        },
        {
          model: db.order_item,
          attributes: orderItemModel.selectable,
          required: true,
          where:{
            deleted_at:{[Op.eq]:null}
          }
        },
        {
          model: db.payment,
          attributes: ["name"],
          required: true
        },
        {
          model: db.order_address,
          as: "addresses",
          attributes: db.order_address.selectable,
          required: true
        },
      ],
      // distinct: true,
      order: [ 
        ["priority", "DESC"],
        ["delivery_date", "DESC"],
        ["delivery_time", "ASC"],
      ]
    };

    let finalQS = {
      ...qs,
      limit: qstring['limit'],
      offset: qstring['offset'],
      where: {...qs['where'], ...qstring['where']}
    }

    const result = await orderModel.findAndCountAll(finalQS, {raw: true})
    const prod_list = [];
    result.rows.forEach(row => {
      row.order_items.forEach(item => {
        prod_list.push(item.product_id)
      })
    })

    const products = await productModel.findAll(
      {where: {product_id: {[Op.in]: prod_list}}},
      {raw: true}
    )

    let filteredResult = []
    result.rows.forEach(_row => {
      const row = _row.toJSON()
      let newRow = row
      row.order_items.forEach((item, i) => {
        products.forEach(p => {
          if (item.product_id === p.product_id) {
            newRow.order_items[i] = {
              ...item,
              product: p
            }
          }
        })
      })
      
      filteredResult = filteredResult.concat(newRow)
    })

    return Promise.resolve({count: result.count, rows: filteredResult})
  } catch (err) {
    console.log('orderController error oo:', err)
    return Promise.reject({
      status: 500,
      msg: 'An error has occurred.'
    })
  }
},

removeOverdue : async (req, res) => {
  const {order_id} = req.body;
  const {user_id} = req.user;

  if(order_id){
    const order = await orderModel.findOne({
      where:{
        order_id
      }
    });
  
    if(order){
      order.payment_status_id = 1;
      await order.save();

      LogHistoryController.create({
        order_id,
        user_id,
        action: `Payment status has been updated to Pending`,
        action_id: 8,
      }).then(() => {
        res.json({
          msg: "Order has been updated successfully",
          order
        });
      });
  
      
    }
  }
  else{
    res.status(404).json({
      error: true,
      msg: 'Order not found'
    })
  }
}


}

module.exports = orders




