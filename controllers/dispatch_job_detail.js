const db = require('../models')
const _ = require('lodash')
const Op = db.Sequelize.Op
const dispatchJobModel = db.dispatch_job
const dispatchJobDetailModel = db.dispatch_job_detail
const viewJobsForDispatchModel = db.view_jobs_for_dispatch
const orderModel = db.order
const orderItemModel = db.order_item
const jobRiderModel = db.job_rider
const viewDispatchJobDetailModel = db.view_dispatch_job_detail
const viewAvailableRiderModel = db.view_available_rider
const orderHistoryModel = db.order_history
const LogHistoryController = require('../controllers/order_history')
const redispatchOrder = 'Order has been redispatched from returns';
const redispatchCPU = 'CPU delivery has been redispatched from returns';
const {queryStringToSQLQuery} = require('../helper/queryStringToSQLQuery')
const pad = require('pad-left')
const undelivered = 'Order was not delivered'
const cpu_delivered = 'Cash Pickup has been tag as delivered'
const delivery_delivered = 'Flower has been tag as delivered'
const cpu_undelivered = 'Cpu was not delivered'

const arrStatus = [
  'pending', 'created', 'accepted', 'ready_for_production',
  'in production', 'ready_to_assemble',
  'in assembly', 'ready to ship', 'rider assigned', 'shipped',
  'delivered', 'failed delivery', 'on_hold', 'cancelled internal',
  'cancelled by customer', 'dispatch booked', 're-dispatched',
  'completed',]

module.exports = {
  //get dispatch info of specified id

  getUndelivered: async (req, res) => {
    const dispatch_job_detail_id = req.params.dispatch_job_detail_id

    if (!dispatch_job_detail_id) {
      return res.status(404).json({msg: 'Unable find record for update'})
    }

    const new_status = 13

    //find
    try {
      const djd = await dispatchJobDetailModel.findAll(
        {
          where: {
            dispatch_job_detail_id: dispatch_job_detail_id,
            status: {[Op.ne]: new_status}
          }
        },
        {raw: true}
      )

      if (!djd) {
        res.status(404).json({msg: 'Unable to find record'})
      } else {
        if (!djd.length) {
          return res.status(404).json({msg: 'Unable find record for update'})
        }

        const updatedjd = await dispatchJobDetailModel.update(
          {status: new_status},
          {
            where: {
              status: {[Op.ne]: new_status},
              dispatch_job_detail_id
            }
          }
        )

        if (!updatedjd) {
          console.log('unable to unable to update dispatch job detail')
        } else {
          console.log('dispatch job detail update')

          if (djd.job_item_type === 'delivery') {
            const oiResult = await orderItemModel.update(
              {order_item_status_id: 7},
              {
                where: {
                  order_item_status_id: {[Op.ne]: 7},
                  order_item_id: djd.order_reference_id,
                  order_id: djd.order_id
                }
              }
            )

            if (!oiResult) {
              console.log('order item no update')
            } else {
              const oResult = await orderModel.update(
                {order_status_id: 7},
                {
                  where: {
                    order_status_id: {[Op.ne]: 7},
                    order_id: djd.order_id
                  }
                }
              )
              if (!oResult) {
                console.log('order no update')
              } else {
                console.log('order update ok')
              }
            }
          } else if (djd.job_item_type === 'cash pickup') {
            const jrResult = await jobRiderModel.update(
              {status: 7},
              {
                where: {
                  status: {[Op.ne]: 7},
                  job_rider_id: djd.order_reference_id,
                  order_id: djd.order_id
                }
              }
            )
            if (!jrResult) {
              console.log('no job rider update')
            } else {
              console.log('job rider update', jrResult)
            }
          }
        }
      }

      res.status(200).json({msg: 'Item successfully removed.'})
    } catch (err) {
      console.log('update failed', err)
      res.status(405).json({msg: 'Unable to update records status.'})
    }
  },
  getAll: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req)

    if(!req.query.hub_filter){
      return;
    }
    try {
      let qs = {
        //distinct: true,
        attributes: viewDispatchJobDetailModel.selectable,
        where:{
          hub_id:[req.query.hub_filter].toString().split(","),
          status: 11
        },
        include: [
          {
            model: dispatchJobModel,
            required: true
            // separate: true,
            //duplicate:false,
          }
        ],
        order: [['updated_at', 'desc']]
      }

      if (req.query.filterVal) {
        qs.where = {shopify_order_name: {[Op.like]: `%${req.query.filterVal}%`}}
      }

      else if (req.query.payment_method) {
        qs.where = {payment_method: {[Op.like]: `%${req.query.payment_method}%`}}
      }

      //const finalQS = _.union({}, reqQs,qs);
      const finalQS = Object.assign(reqQs, qs)

      console.log('finalQS filter:', finalQS)
      const result = await viewDispatchJobDetailModel.findAndCountAll(finalQS, {
        raw: true
      })

      if (!result) {
        res.status(401).json({msg: 'No records found', rows: [], count: 0})
      } else {
        res.status(200).json(result)
      }
    } catch (err) {
      console.log('Dispatch Controller assigned job', err)
      res.status(400).json({msg: 'Unable to process request'})
    }
  },
  addJobItem: async (req, res) => {
    const shopify_order_name = req.body.shopify_order_name

    // console.log("shopify_order_name", shopify_order_name);
    const qs = {
      where: {
        // order_item_status_id: 7,
        // order_status_id: 7,
        shopify_order_name: shopify_order_name.replace('-CPU',''),
        jobtype: shopify_order_name.includes('-CPU') ? 'cash pickup': 'delivery',
      },
      limit: 1,

      order: [['shopify_order_name', 'ASC'], ['job_id', 'ASC']],
      attributes: viewJobsForDispatchModel.selectable,

    }

    try {
      //find the item to add
      const result = await viewJobsForDispatchModel.findAll(qs, {raw: true})

      if (!result) {
        return res.status(405).json({msg: 'Unable to process request'})
      } else {
        if (result.length) {
          //select dispatch model

          const dispatch_job_id = req.body.dispatch_job_id
          const djRes = await dispatchJobDetailModel.findAll(
            {
              where: {
                dispatch_job_id,
                status: [7, 8, 15]
              },
              include: [
                {
                  model: dispatchJobModel,
                  required: true,
                  where: {
                    status: [7, 8, 15],
                    dispatch_job_id
                  },
                }
              ]
            },
            {raw: true}
          )

          if (!djRes) {
            return res.status(405).json({msg: 'Unable to process request'})
          } else {
            console.log('djRes[0]', djRes)
            if (djRes.length) {
              //select

              let x = []
              let y = []
              let filter = {}
              _.each(result, async (rec) => {
                console.log('rec', rec.dataValues)
                console.log('view_jobs_for_dispatch', rec.dataValues.order_id)

                //find first
                filter = {
                  order_id: rec.dataValues.order_id,
                  order_reference_id: rec.dataValues.job_id,
                  dispatch_job_id,
                  shopify_order_name
                }
                x = _.filter(djRes, filter)

                if (x.length) {
                  //delete
                  y = await dispatchJobDetailModel.update(
                    {status: 13},
                    {where: filter}
                  )

                  if (!y) {
                    console.log('No Record was updated')
                  } else {
                    res.status(200).json({msg: 'Job Item Removed'})
                  }
                } else {
                  y = await dispatchJobDetailModel.create({
                    order_reference_id: rec.dataValues.job_id,
                    dispatch_job_id: dispatch_job_id,
                    order_id: rec.dataValues.order_id,
                    order_item_id: rec.dataValues.job_id,
                    shopify_order_name: rec.shopify_order_name,
                    job_item_type: rec.dataValues.jobtype,
                    created_at: Date.now(),
                    status: djRes[0].status
                  })

                  if (!y) {
                    console.log('No Record was added')
                  } else {
                    const new_status = djRes[0].status
                    const old_status = 7

                    if (rec.dataValues.jobtype === 'cash pickup') {
                      upRest = await db.job_rider.update(
                        {status: new_status},
                        {
                          where: {
                            job_rider_id: rec.dataValues.job_id,
                            order_id: rec.dataValues.order_id,
                        //    status: old_status
                          }
                        }
                      )

                      if (!upRest) {
                        console.log('err must delete dispatch job item')
                      } else {
                        console.log('job_rider should be updated')

                        try {

                          let action = djRes[0].dispatch_job.dataValues.tracking_no ? `${rec.dataValues.shopify_order_name}-CPU was added to dispatch job with Tracking No:${djRes[0].dispatch_job.dataValues.tracking_no}`
                            : `${rec.dataValues.shopify_order_name}-CPU was added to advanced booking dispatch job`
                          await orderHistoryModel.create({
                            order_id: rec.dataValues.order_id,
                            order_item_id: rec.dataValues.job_id,
                            user_id: req.user.user_id,
                            //need to know if dispatch job is assigned or advance booking
                            action,
                            action_id : 19,
                            data_changed : JSON.stringify({order_id : rec.dataValues.order_id, order_item_id: rec.dataValues.job_id})

                          })
                        } catch (errorOHM) {
                          console.log('error in creating order history log', errorOHM)
                        }

                      }
                    } else {
                      //flower delivery

                      try {
                        let action = djRes[0].dispatch_job.dataValues.tracking_no ? `Order Item ${rec.dataValues.title} was added to dispatch job with Tracking No:${djRes[0].dispatch_job.dataValues.tracking_no}`
                          : `Order Item ${rec.dataValues.title} was added to advanced booking dispatch job`

                        await orderHistoryModel.create({
                          order_id: rec.dataValues.order_id,
                          order_item_id: rec.dataValues.job_id,
                          user_id: req.user.user_id,
                          action,
                          action_id : 14,
                          data_changed : JSON.stringify({order_id : rec.dataValues.order_id, order_item_id: rec.dataValues.job_id})



                        })
                      } catch (errorOHM) {
                        console.log('error in creating order history log', errorOHM)
                      }

                      upRest = await db.order_item.update(
                        { order_item_status_id: new_status },
                        {
                          where: {
                            order_id: rec.dataValues.order_id,
                            order_item_id: rec.dataValues.job_id,
                            //order_item_status_id: old_status
                          }
                        }
                      );

                      upRest = await db.order.update(
                        { order_status_id: new_status },
                        {
                          where: {
                            order_id: rec.dataValues.order_id
                            //order_item_status_id: old_status
                          }
                        }
                      );
                      //
                      // if (!upRest) {
                      //   console.log("err must delete dispatch order item");
                      // } else {
                      //   console.log("order item updated", {
                      //     where: {
                      //       order_id: rec.dataValues.order_id,
                      //       order_item_id: rec.dataValues.job_id,
                      //       order_item_status_id: old_status
                      //     }
                      //   });
                      //
                      //   try{
                      //     let action = djRes[0].dispatch_job.dataValues.tracking_no ? `Order Item ${rec.dataValues.title} was added to dispatch job with Tracking No:${djRes[0].dispatch_job.dataValues.tracking_no}`
                      //       : `Order Item ${rec.dataValues.title} was added to advanced booking dispatch job`
                      //
                      //
                      //     await orderHistoryModel.create({
                      //       order_id: rec.dataValues.order_id,
                      //       order_item_id: rec.dataValues.job_id,
                      //       user_id: req.user.user_id,
                      //       action
                      //
                      //     });
                      //   }catch(errorOHM){
                      //     console.log('error in creating order history log', errorOHM);
                      //   }
                      //
                      //   const headerUpdateRes = await db.sequelize.query(
                      //     "CALL proc_update_order_status(:order_id, :new_order_status, :order_item_status_id)",
                      //     {
                      //       replacements: {
                      //         order_id: rec.dataValues.order_id,
                      //         new_order_status: new_status,
                      //         order_item_status_id: new_status
                      //       }
                      //     }
                      //   );
                      //   if (!headerUpdateRes) {
                      //     console.log("update called false", headerUpdateRes);
                      //   } else {
                      //     console.log("update called true", headerUpdateRes);
                      //   }
                      // }
                    }

                    res.status(200).json({msg: 'Job Item Added'})
                  }
                }
              })
            } else {
              return res
                .status(404)
                .json({msg: 'Unable to select Dispatch Job'})
            }
          }
        } else {
          return res.status(404).json({msg: 'Unable to select Job Item'})
        }
      }
    } catch (err) {
      console.log('update failed', err)
      res.status(405).json({msg: 'Unable to update records status.'})
    }
  },
  cancelJobItem: async (req, res) => {
    const dispatch_job_detail_id = req.params.dispatch_job_detail_id
    if (!dispatch_job_detail_id) {
      return res.status(404).json({msg: 'Unable find record for update'})
    }
    const new_status = 13
    //find
    try {
      const djd = await dispatchJobDetailModel.findAll(
        {
          where: {
            dispatch_job_detail_id: dispatch_job_detail_id,
            //status: {[Op.ne]: new_status },
             status: {[Op.notIn]: [9,10,13,14]} //add 13 or 14 mayb job was already cancelled
          },
          include: [
            {
              model: db.dispatch_job,
              required: true

            }
          ],
          raw: true
        }
      )

      if (!djd) {
        res.status(404).json({msg: 'Unable to find record'})
      } else {
        if (!djd.length) {
          return res.status(404).json({msg: 'Unable find record for update'})
        }
        const djd_item = djd
        var advanceBookingLog = ""
        console.log('dispatch status:',djd[0].status);
        if(djd[0].status === 15){
          advanceBookingLog = ' from Advance Booking '
        }else{
            advanceBookingLog = ''
        }

        const updatedjd = await dispatchJobDetailModel.update(
          {status: new_status},
          {
            where: {
              status: {[Op.notIn]: [new_status,9,10,13,14]},
              dispatch_job_detail_id
            }
          }
        )

        if (!updatedjd) {
          console.log('unable to unable to update dispatch job detail')
        } else {
          console.log('dispatch job detail update job_item_type', djd_item[0].order_id)

          if (djd_item[0].job_item_type === 'delivery') {
            const oResult = await orderModel.update(
              {order_status_id: 7},
              {
                where: {
                  order_status_id: {[Op.in]: [8,15]},
                  order_id: djd_item[0].order_id
                }
              }
            )
            if (!oResult) {
              console.log('order no update')
            } else {
              console.log('order update ok')

            }
            try {
              await orderHistoryModel.create({
                order_id: djd_item[0].order_id,
                user_id: req.user.user_id,
                action: `Order Item was removed from dispatch Job with Tracking No.${djd_item[0]['dispatch_job.tracking_no']} ${advanceBookingLog}`,
                action_id : 28,
                data_changed : JSON.stringify({order_id : djd_item[0].order_id,
                  order_status_id : 7,tracking_no: djd_item[0]['dispatch_job.tracking_no']})

              })
            } catch (errorOHM) {
              console.log('error in creating order history log', errorOHM)
            }
            // const oiResult = await orderItemModel.update(
            //   { order_item_status_id: 7 },
            //   {
            //     where: {
            //       order_item_status_id: { [Op.eq]: 8 },
            //       order_item_id: djd_item.dataValues.order_reference_id,
            //       order_id: djd_item.dataValues.order_id
            //     }
            //   }
            // );
            //
            // if (!oiResult) {
            //   console.log("order item no update");
            // } else {
            //
            // }
          } else if (djd[0].job_item_type === 'cash pickup') {
            const jrResult = await jobRiderModel.update(
              {status: 7},
              {
                where: {
                  status: {[Op.ne]: 7},
                  job_rider_id: djd_item[0].order_reference_id,
                  order_id: djd_item[0].order_id
                }
              }
            )
            if (!jrResult) {
              console.log('no job rider update')
            } else {
              console.log('job rider update', jrResult)

            }

            try {
              await orderHistoryModel.create({
                order_id: djd_item[0].order_id,
                order_item_id: djd_item[0].order_reference_id,
                user_id: req.user.user_id,
                action: `${ djd_item[0].shopify_order_name}-CPU was removed from dispatch Job with Tracking No.${djd_item[0]['dispatch_job.tracking_no']} ${advanceBookingLog}`,
                action_id : 28,
                data_changed : JSON.stringify({order_id : djd_item[0].order_id,
                  order_status_id : 7,tracking_no: djd_item[0]['dispatch_job.tracking_no']})

              })
            } catch (errorOHM) {
              console.log('error in creating order history log', errorOHM)
            }
          }
        }
      }

      res.status(200).json({msg: 'Item successfully removed.'})
    } catch (err) {
      console.log('update failed', err)
      res.status(405).json({msg: 'Unable to update records status.'})
    }
  },
  updateStatus: async (req, res) => {

    const dispatch_job_detail_id = req.params.dispatch_job_detail_id



    if (!dispatch_job_detail_id) {
      return res.status(404).json({msg: 'Unable find record for update una to'})
    }

    const new_status = req.body.status
    const lbl_status = arrStatus[parseInt(new_status)]
    const reason = req.body.reason || ''

    let dispatch_job_id = 0

    //find
    try {
      const djd = await dispatchJobDetailModel.findAll(
        {
          where: {
            dispatch_job_detail_id: dispatch_job_detail_id,
            status: {[Op.ne]: new_status}
          }
        },
        {raw: true}
      );

      if (!djd) {
        res.status(404).json({msg: 'Unable to find record'})
      } else {
        if (!djd.length) {
          return res.status(404).json({msg: 'Unable find record for update pangalawa to'})
        }

        console.log('dispatch_job_id', djd[0]['dispatch_job_id'])

        dispatch_job_id = djd[0]['dispatch_job_id']

        let updateObj = {
          status: new_status
        }
        if (reason.length) {
          if (djd)
            if (!djd[0].remarks) {
              updateObj.remarks = reason
            } else {
              updateObj.remarks = [djd[0].remarks, reason].join('|')
            }
        }

        const updatedjd = await dispatchJobDetailModel.update(updateObj, {
          where: {
            status: 9,
            dispatch_job_detail_id
          }
        })

        if (updatedjd[0] == 0) {
          res.status(404).json({msg: 'Unable to update records status.'})
        } else {
          console.log('dispatch job detail update', djd)

          if (djd[0].job_item_type === 'delivery') {
            const oiResult = await orderItemModel.update(
              {
                order_item_status_id: new_status,

                remarks: db.sequelize.fn(
                  'CONCAT',
                  db.sequelize.fn('COALESCE', db.sequelize.col('remarks'), ''),
                  `|${reason}`
                )
              },
              {
                where: {
                  order_item_status_id: {[Op.ne]: new_status},
                  order_item_id: djd[0].order_reference_id,
                  order_id: djd[0].order_id
                }
              }
            )

            if (!oiResult) {
              console.log('order item no update')
            } else {
              console.log('new_status expeced COD', new_status)
              console.log('new_status expeced COD', new_status)
              console.log('new_status expeced COD', new_status)
              if (new_status === 10 || new_status === '10') { //delivered

                try {
                  await orderModel.update({
                    payment_status_id: 2
                  }, {

                    where: {
                      payment_status_id: {[Op.ne]: 2},
                      order_id: djd[0].order_id,
                      payment_id: 2
                    }

                  })
                } catch (errorOHM1) {
                  console.log('error in updating payment delivery', errorOHM1)
                }


              }




              try {
                await orderHistoryModel.create({
                  order_id: djd[0].order_id,
                  order_item_id: djd[0].order_reference_id,
                  user_id: req.user.user_id,
                  action: `The status of the Order Item was set to ${lbl_status}:${reason}`,
                  action_id: req.body.action_id,
                  data_changed : JSON.stringify({order_id : djd[0].order_id, order_item_id : djd[0].order_reference_id,
                    order_status_id : req.body.status ,dispatch_job_detail_id: djd[0].dispatch_job_detail_id})

                })
              } catch (errorOHM) {
                console.log('error in creating order history log', errorOHM)
              }

              console.log('new status', new_status)
              const oResult = await orderModel.update(
                {
                  order_status_id: new_status,
                  remarks: db.sequelize.fn(
                    'CONCAT',
                    db.sequelize.fn(
                      'COALESCE',
                      db.sequelize.col('remarks'),
                      ''
                    ),
                    `|${reason}`
                  )
                },
                {
                  where: {
                    order_status_id: {[Op.ne]: new_status},
                    order_id: djd[0].order_id
                  }
                }
              )
              if (!oResult) {
                console.log('order no update')
              } else {
                console.log('order update ok')
              }
            }
          } else if (djd[0].job_item_type === 'cash pickup') {
            const jrResult = await jobRiderModel.update(
              {
                status: new_status,
                remarks: db.sequelize.fn(
                  'CONCAT',
                  db.sequelize.fn('COALESCE', db.sequelize.col('remarks'), ''),
                  `|${reason}`
                )
              },
              {
                where: {
                  status: 9,
                  job_rider_id: djd[0].order_reference_id,
                  order_id: djd[0].order_id
                }
              }
            )

            if (jrResult[0] == 0) {
              res.status(404).json({msg: 'Unable to update records status.'})
            } else {
              console.log('job rider update', jrResult)

              console.log('new_status', djd[0].order_id)

              if (new_status === 10 || new_status === '10') { //delivered

                console.log('new_status', new_status)
                console.log('new_status', new_status)
                console.log('new_status', new_status)
                console.log('new_status', new_status)
                console.log('new_status', new_status)

                try {
                  const updateRes = await orderModel.update({
                    payment_status_id: 2
                  }, {
                    where: {
                      payment_status_id: {[Op.ne]: 2},
                      order_id: djd[0].order_id,
                      payment_id: 3
                    }

                  })
                  console.log('updateRes', updateRes)

                  console.log('insert ionto floristjob', updateRes)

                  await db.sequelize.query('INSERT INTO job_florist (order_item_id)  SELECT oi.order_item_id FROM order_item oi JOIN `order` o on oi.order_id = o.order_id' +
                    ' AND oi.order_id = ? JOIN product p on oi.product_id = p.product_id AND p.florist_production = 1' +
                    ' WHERE  DATE(o.delivery_date) = CURDATE() and  ' +
                    'oi.order_item_id not in (Select jb.order_item_id from job_florist jb)', {replacements: [djd[0].order_id]})
                  await db.sequelize.query('UPDATE `order` SET `order_status_id` = 3 WHERE DATE(delivery_date) = CURDATE() and order_id = ? AND order_status_id <= 2', {replacements: [djd[0].order_id]})

                } catch (errorOHM1) {

                  console.log('error in updating payment', errorOHM1)
                }

              }

              try {
                await orderHistoryModel.create({
                  order_id: djd[0].order_id,
                  order_item_id: djd[0].order_reference_id,
                  user_id: req.user.user_id,
                  action: `The status of the CPU Job: ${djd[0].shopify_order_name}-CPU  was set to ${lbl_status}:${reason}`,
                  action_id: req.body.action_cpu_id,
                  data_changed: JSON.stringify({
                    order_id: djd[0].order_id, order_item_id: djd[0].order_reference_id,
                    order_status_id: req.body.status, tracking_no: djd[0].tracking_no
                  })

                })
              } catch (errorOHM) {
                console.log('error in creating order history log', errorOHM)
              }
            }
          }
        }

        //update if all status are delivered or undelivered or redispatched

        const djr = await dispatchJobDetailModel.count({
          where: {
            status: {[Op.notIn]: [11, 10, 16]},
            dispatch_job_id
          }
        })
        console.log('dispatchJob Items not cleared', djr)
        if (!djr) {
          const djResult = await dispatchJobModel.update(
            {status: 17},
            {
              where: {
                dispatch_job_id
              }
            }
          )

          if (!djResult) {
            console.log('dispatchJobModel status update failed', djResult)
          } else {
            console.log('dispatchJobModel status updated')
          }
        }
      }

      if (req.body.status === 11) {
        if (djd[0].job_item_type === 'delivery') {
          let order_id = djd[0].order_id
          let {user_id} = req.user
          await LogHistoryController.create({
            order_id, user_id, action: undelivered + ` (${reason})`, action_id: req.body.action_id,
            data_changed: JSON.stringify({
              order_id: djd[0].order_id, order_item_id: djd[0].order_reference_id,
              order_status_id: req.body.status, tracking_no: djd[0].tracking_no
            })
          })
        }
      }
      res.status(200).json({msg: 'Item successfully updated.'})

    } catch (err) {
      console.log('update failed', err)
      res.status(405).json({msg: 'Unable to update records status.'})
    }
  },
  redispatch: async (req, res) => {

    const dispatch_job_detail_id = req.body.requestRedispatchForm.redispatchData.view_dispatch_job_detail_id

    try {

      const result = await dispatchJobDetailModel.findAll(
        {
          where: {dispatch_job_detail_id},

          include: [
            {
              model: db.order_item,
              required: true,
            }
          ]

        },
        {raw: true}
      )

      if (!result) {
        res.status(401).json({msg: 'Unable to find dispatch record'})
      } else {

        const {user_id} = req.user

        await orderModel.update({
            delivery_date: req.body.requestRedispatchForm.delivery_date,
            delivery_time: req.body.requestRedispatchForm.delivery_time,
            order_status_id: 3,
            quality_check: 0
          },
          {

            where: {shopify_order_name: req.body.requestRedispatchForm.redispatchData.shopify_order_name}
          })
        const {order_id} = req.body.requestRedispatchForm.redispatchData
        await LogHistoryController.create({order_id, user_id, action: redispatchOrder,action_id : 29,
          data_changed : JSON.stringify({order_id : req.body.requestRedispatchForm.redispatchData.order_id, order_status_id : 3,
          delivery_date : req.body.requestRedispatchForm.delivery_date, delivery_time: req.body.requestRedispatchForm.redispatchData.delivery_time,
          })})

        const djdrec = result[0]
        let upRest = null
        if (djdrec.job_item_type === 'cash pickup') {
          //update job rider
          upRest = await db.job_rider.update(
            {status: 7},
            {
              where: {
                job_rider_id: parseInt(djdrec.order_reference_id),
                order_id: djdrec.order_id,
              //  status: [11, 9]
              }
            }
          )

          if (!upRest) {
            console.log('err must delete dispatch job item')
          } else {
            console.log('job_rider ok')
            try {
              await orderHistoryModel.create({
                order_id: djdrec.order_id,
                order_item_id: djdrec.order_reference_id,
                user_id: req.user.user_id,
                action: `CPU Job: ${result[0].shopify_order_name}  was set for redispatch.`,
                action_id : 30,
                data_changed : JSON.stringify({order_id : djdrec.order_id, order_item_id : djdrec.order_reference_id
                })

              })
            } catch (errorOHM) {
              console.log('error in creating order history log', errorOHM)
            }
          }
        }

        if (djdrec.job_item_type === 'delivery') {
          //update order_item
          upRest = await db.order_item.update(
            {order_item_status_id: 7},
            {
              where: {
                order_id: djdrec.order_id,
                order_item_id: djdrec.order_reference_id,
                order_item_status_id: [11, 9]
              }
            }
          )

          if (!upRest) {
            console.log('err must delete dispatch order item')
          } else {
            console.log('order item ok')
            try {
              await orderHistoryModel.create({
                order_id: djdrec.order_id,
                order_item_id: djdrec.order_reference_id,
                user_id: req.user.user_id,
                action: `Order Item: ${result[0].dataValues.order_items[0].title}  was set to redispatch`,
                action_id : 29,
                data_changed : JSON.stringify({order_id : djdrec.order_id, order_item_id : djdrec.order_reference_id
                })

              })
            } catch (errorOHM) {
              console.log('error in creating order history log', errorOHM)
            }
          }

          upRest = await db.order.update(
            {order_status_id: 7},
            {
              where: {
                order_id: djdrec.order_id,
                order_status_id: [11, 9]
              }
            }
          )

          if (!upRest) {
            console.log('err must delete dispatch order item')
          } else {
            console.log('order ok')
          }
        }

        const djdUpdate = await dispatchJobDetailModel.update(
          {status: 16},
          {where: {dispatch_job_detail_id}},
          {raw: true}
        )

        if (!djdUpdate) {
          res.status(401).json({msg: 'Unable to update dispatch record'})
        } else {
          res
            .status(200)
            .json({
              msg: 'Item successfully redispatch and currently in the Dispatch Job List.'
            })
        }
      }
    } catch (err) {
      res.status(400).json({msg: 'Unable to update dispatch record'})
    }
  },
  redispatchCpu : async (req,res) => {


     const dispatch_job_detail = req.body.reqform.redispatchData.view_dispatch_job_detail_id
    try{

      const result = await dispatchJobDetailModel.findAll(
        {
          where: {dispatch_job_detail_id : dispatch_job_detail},
          include: [
            {
              model: db.order_item,
              required: true,
            }
          ]
        },
        {raw: true})

      if(!result){
        res.status(401).json({msg: 'Unable to find dispatch job detail'})
      }else {
        const dispatchJobDetail = result[0].dataValues
        if (dispatchJobDetail.job_item_type == 'cash pickup'){

            const updateJob = await jobRiderModel.update(
              {status: 7},
          {where: {
              job_rider_id: dispatchJobDetail.order_reference_id,
              order_id : dispatchJobDetail.order_id
              }
            })

          if(!updateJob){
            res.status(400).json({msg: 'Unable to update job rider'})

          }else{
              try {
                await orderHistoryModel.create({
                  order_id: dispatchJobDetail.order_id,
                  order_item_id: dispatchJobDetail.order_reference_id,
                  user_id: req.user.user_id,
                  action: `CPU Job: ${dispatchJobDetail.shopify_order_name}  was set for redispatch.`,
                  action_id : 30,
                  data_changed: JSON.stringify({
                    order_id: dispatchJobDetail.order_id, order_item_id: dispatchJobDetail.order_reference_id,
                    job_rider_status: 7
                  })


                })
              } catch (errorOHM) {
                console.log('error in creating order history log', errorOHM)
              }
          }


        }else  if (dispatchJobDetail.job_item_type == 'delivery') {

          const updateItem = await orderItemModel.update(
          {order_item_status_id : 2 },
          {where : { order_item_id : dispatchJobDetail.order_item_id}
          })

          if (!updateItem){
            res.status(400).json({msg: 'Unable to update order item'})
          }else{

            const updateOrder = orderModel.update(
              {order_status_id: 3},
              {where : {order_id : dispatchJobDetail.order_id}}
            )

            if(!updateOrder) {
              res.status(400).json({msg: 'Unable to update order'})
            }else{

              try {
                await orderHistoryModel.create({
                  order_id: dispatchJobDetail.order_id,
                  order_item_id: dispatchJobDetail.order_id,
                  user_id: req.user.user_id,
                  action: `Order Item: ${dispatchJobDetail.order_item.dataValues.title}  was set to redispatch`,
                  action_id : 29,
                  data_changed: JSON.stringify({
                    order_id: dispatchJobDetail.order_id, order_item_id: dispatchJobDetail.order_reference_id,
                    order_status_id: 3
                  })
                })
              } catch (errorOHM) {
                console.log('error in creating order history log', errorOHM)
              }

            }
          }
        }

        const updataDispatchJob = await dispatchJobDetailModel.update(
          {status: 16},
          {where: {dispatch_job_detail_id : dispatchJobDetail.dispatch_job_detail_id,
            status: 11}},
          {raw: true}
        )

        if (!updataDispatchJob) {
          res.status(401).json({msg: 'Unable to update dispatch record!'})
        } else {
          res
            .status(200)
            .json({
              msg: 'Item successfully redispatch and currently in the Dispatch Job List.'
            })
        }


      }

    }catch(err){
      res.status(400).json({msg: 'Unable to update dispatch records'})
    }

  },
  addremoveBCJobItem: async (req, res) => {
    const shopify_order_name = req.body.shopify_order_name

    console.log('shopify_order_name', shopify_order_name)
    const qs = {
      where: {
        order_item_status_id: 7,
        order_status_id: 7,
        shopify_order_name
      },
      limit: 1,

      order: [['shopify_order_name', 'ASC'], ['job_id', 'ASC']],
      attributes: viewJobsForDispatchModel.selectable
    }

    try {
      const result = await viewJobsForDispatchModel.findAll(qs, {raw: true})

      if (!result) {
        return res.status(405).json({msg: 'Unable to process request'})
      } else {
        if (result.length) {
          //select dispatch model

          const dispatch_job_id = req.body.dispatch_job_id

          const djRes = await dispatchJobDetailModel.findAll(
            {
              where: {
                dispatch_job_id,
                status: [7, 8, 15]
              },
              includes: [
                {
                  model: dispatchJobModel,
                  required: true,
                  where: {
                    status: [7, 8, 15],
                    dispatch_job_id
                  },
                  limit: 7
                }
              ]
            },
            {raw: true}
          )

          if (!djRes) {
            return res.status(405).json({msg: 'Unable to process request'})
          } else {
            if (djRes.length) {
              //select

              let x = []
              let y = []
              let filter = {}
              _.each(result, async (rec, key) => {
                //  console.log('rec',rec.dataValues.jo);
                //  console.log('view_jobs_for_dispatch',rec.dataValues.order_id);
                //  djRes[0].dataValues.order_reference_id = parseInt(djRes[0].dataValues.order_reference_id);

                //             //find first
                filter = {
                  order_id: rec.dataValues.order_id,
                  order_reference_id: rec.dataValues.job_id,
                  dispatch_job_id,
                  shopify_order_name
                }
                //  x = _.isMatch(djRes[0].dataValues, filter);

                x = await dispatchJobDetailModel.findAll({
                  where: {
                    order_id: rec.dataValues.order_id,
                    order_reference_id: rec.dataValues.job_id,
                    dispatch_job_id,
                    shopify_order_name,
                    status: [7, 8, 15]
                  },
                  limit: 1
                })

                //  console.log('FILTER', filter);
                //  console.log('DJ RES', djRes[0].dataValues);
                //  return console.log(x);
                if (x.length) {
                  //delete
                  y = await dispatchJobDetailModel.update(
                    {status: 13},
                    {where: filter}
                  )

                  if (!y) {
                    console.log('No Record was updated')
                  } else {
                    res.status(200).json({msg: 'Job Item Removed'})
                  }
                } else {
                  y = await dispatchJobDetailModel.create({
                    order_reference_id: rec.dataValues.job_id,
                    dispatch_job_id: dispatch_job_id,
                    order_id: rec.dataValues.order_id,
                    order_item_id: rec.dataValues.job_id,
                    shopify_order_name: rec.shopify_order_name,
                    job_item_type: rec.dataValues.jobtype,
                    created_at: Date.now(),
                    status: djRes[0].status
                  })

                  if (!y) {
                    console.log('No Record was added')
                  } else {
                    const new_status = djRes[0].status
                    const old_status = 7

                    if (rec.dataValues.jobtype === 'cash pickup') {
                      upRest = await db.job_rider.update(
                        {status: new_status},
                        {
                          where: {
                            job_rider_id: rec.dataValues.job_id,
                            order_id: rec.dataValues.order_id,
                            status: old_status
                          }
                        }
                      )

                      if (!upRest) {
                        console.log('err must delete dispatch job item')
                      } else {
                        console.log('job_rider should be updated')
                      }
                    } else {
                      //flower delivery

                      upRest = await db.order_item.update(
                        {order_item_status_id: new_status},
                        {
                          where: {
                            order_id: rec.dataValues.order_id,
                            order_item_id: rec.dataValues.job_id,
                            order_item_status_id: old_status
                          }
                        }
                      )

                      if (!upRest) {
                        console.log('err must delete dispatch order item')
                      } else {
                        console.log('order item updated', {
                          where: {
                            order_id: rec.dataValues.order_id,
                            order_item_id: rec.dataValues.job_id,
                            order_item_status_id: old_status
                          }
                        })

                        const headerUpdateRes = await db.sequelize.query(
                          'CALL proc_update_order_status(:order_id, :new_order_status, :order_item_status_id)',
                          {
                            replacements: {
                              order_id: rec.dataValues.order_id,
                              new_order_status: new_status,
                              order_item_status_id: new_status
                            }
                          }
                        )
                        if (!headerUpdateRes) {
                          console.log('update called false', headerUpdateRes)
                        } else {
                          console.log('update called true', headerUpdateRes)
                        }
                      }
                    }

                    res.status(200).json({msg: 'Job Item Added'})
                  }
                }
              })
            } else {
              return res
                .status(404)
                .json({msg: 'Unable to select Dispatch Job'})
            }
          }
        } else {
          return res.status(404).json({msg: 'Unable to select Job Item'})
        }
      }
    } catch (err) {
      console.log('update failed', err)
      res.status(405).json({msg: 'Unable to update records status.'})
    }
  },
  tagAsDeliveredCpu: async (req, res) => {

    const {shopify_order_name, FS_KEY} = req.body

    if (FS_KEY !== process.env.FS_KEY) {
      console.log('fs', FS_KEY)
      return res.status(404).json({msg: 'Authorization required'})
    }

    if (!shopify_order_name) {
      return res.status(404).json({msg: 'Unable to find record on update'})
    }

    let order_name = shopify_order_name.replace('-CPU','');
    order_name = `FS-${order_name.replace('FS-','')}`;

    try {

      const dispatchJobDetail = await dispatchJobDetailModel.findAll({
        where : {shopify_order_name : order_name, status : 9 , job_item_type : 'cash pickup'},

      })
      let  delivered = false;
      if(!dispatchJobDetail){
        return res.status(404).json({msg: 'Unable to find record on update'})
      }else{

      if(dispatchJobDetail.length){
           delivered = await dispatchJobDetailModel.update(
              {status: 10},
              {
                  where: {
                      [Op.and]: {
                          job_item_type: 'cash pickup',
                          shopify_order_name: order_name,
                          dispatch_job_detail_id : dispatchJobDetail[0].dispatch_job_detail_id,
                          status: 9
                      }
                  }
              }
          );

      }else{
          return res.status(404).json({msg: 'Unable to find record on update'})

      }


      if (!delivered) {
        console.log('Unable to find record on dispatch')
          return res.status(404).json({msg: 'Unable to find record on update'})
      }else {

          await db.sequelize.query(`UPDATE dispatch_job dj SET dj.status = 10` +
          ` WHERE (Select count(*) from dispatch_job_detail djd where djd.status != 10 AND djd.dispatch_job_id = ${dispatchJobDetail[0].dispatch_job_id}) = 0` +
          ` AND dj.dispatch_job_id = ${dispatchJobDetail[0].dispatch_job_id}`)

        }

        const updateOrder = await orderModel.update(
          {
            payment_status_id: 2
          },
          {
            where: {
              shopify_order_name: order_name
            }
          }
        )
        if (!updateOrder) {
          console.log('Unable to Update order')
        } else {
          console.log('updateorder', updateOrder)
          const order = await orderModel.findAll(
            {
              where: {shopify_order_name: order_name},
              attributes: ['order_id']

            }
          )

          if (!order) {
            console.log('Unable to find order')
            res.status(200).json({msg: 'Error in order selection'})
          }else{

            if(order.length){
              const user_id = 1
              const order_id = order[0].dataValues.order_id
              const upRider = jobRiderModel.update(
                {status: 10},
                {
                  where: {
                    [Op.and]: {
                      order_id: order_id,
                      status: 9
                    }
                  }
                }
              )

              if (!upRider) {
                console.log('unable to update rider')

              }
              LogHistoryController.create({
                  order_id,
                  user_id,
                  action: cpu_delivered,
                  action_id:21,
                  data_changed: JSON.stringify({order_id, status:10})

              });

              await db.sequelize.query('INSERT INTO job_florist (order_item_id)  SELECT oi.order_item_id FROM order_item oi JOIN `order` o on oi.order_id = o.order_id' +
                ' AND oi.order_id = ? JOIN product p on oi.product_id = p.product_id AND p.florist_production = 1' +
                ' WHERE  DATE(o.delivery_date) = CURDATE() and  ' +
                'oi.order_item_id not in (Select jb.order_item_id from job_florist jb)', {replacements: [order_id]})
              await db.sequelize.query('UPDATE `order` SET `order_status_id` = 3 WHERE DATE(delivery_date) = CURDATE() and order_id = ? AND order_status_id < 2', {replacements: [order_id]})

              res.status(200).json({msg: 'Tag as delivered successfully'})

            }else{
              res.status(200).json({msg: 'No Order selected'});
            }
          }

        }



      }



    } catch (err) {
      console.log('error tag:',err);
      res.status(404).json({msg: 'Unable to tag as delivered'})
    }

  },
  tagAsDeliveredDelivery: async (req, res) => {

    const {shopify_order_name, FS_KEY} = req.body

    if (FS_KEY !== process.env.FS_KEY) {
      return res.status(404).json({msg: 'Authorization required'})
    }

    if (!shopify_order_name) {
      return res.status(404).json({msg: 'Unable to find record on update'})
    }

    let order_name = shopify_order_name.replace('FS-','');
    order_name = `FS-${order_name}`;

    try {

      const dispatchJobDetail = await dispatchJobDetailModel.findAll({
        where: {shopify_order_name: order_name, job_item_type: 'delivery', status: 9},

      })

      if (!dispatchJobDetail) {
        return res.status(404).json({msg: 'Unable to find record on update'})

      } else {

          if (dispatchJobDetail.length) {
              const delivered = await dispatchJobDetailModel.update(
                  {status: 10},
                  {
                      where: {
                          [Op.and]: {
                              job_item_type: 'delivery',
                              shopify_order_name: order_name,
                              dispatch_job_detail_id: dispatchJobDetail[0].dispatch_job_detail_id,

                          }
                      }
                  }
              );
              if(delivered){

                 const Result = await db.sequelize.query(`UPDATE dispatch_job dj SET dj.status = 10` +
                      ` WHERE (Select count(*) from dispatch_job_detail djd where djd.status != 10 AND djd.dispatch_job_id = ${dispatchJobDetail[0].dispatch_job_id}) = 0` +
                      ` AND dj.dispatch_job_id = ${dispatchJobDetail[0].dispatch_job_id}`)




              }
          } else {
              res.status(404).json({msg: 'Unable to find updatable record'})
          }


      }


      const updateOrder = await orderModel.update(
        {
          order_status_id: 10,
        },
        {
          where: {
            shopify_order_name: order_name
          }
        }
      );

      if (!updateOrder) {
        res.status(400).json({msg: 'Unable to Update order'})
      } else {
        console.log('updateorder', updateOrder)
        const order = await orderModel.findAll(
          {
            where: {shopify_order_name: order_name},
            attributes: ['order_id']

          }
        )

        if (!order) {
          res.status(200).json({msg: 'Error in Order selection'})
        } else {
          if (order.length) {
            console.log('loggsss', order[0].dataValues.order_id)
            var user_id = 1;
            var order_id = order[0].dataValues.order_id;
            LogHistoryController.create({
                order_id,
                user_id,
                action: delivery_delivered,
                action_id:16,
                data_changed: JSON.stringify({order_id,order_status_id:10 })

            })
            res.status(200).json({msg: 'Tag as delivered successfully'})
          } else {
            res.status(200).json({msg: 'No Order selected'})
          }
        }

      }
    } catch (err) {
      console.log('error tag delivery:',err);
      res.status(404).json({msg: 'Unable to tag as delivered'})
    }

  },
  getAllCountOnly: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req)

    if(!req.query.hub_filter){
      return;
    }
    try {
      let qs = {
        distinct: true,
        where:{
          hub_id:[req.query.hub_filter].toString().split(","),
          status: 11
        },
        include: [
          {
            model: dispatchJobModel,
            required: true
          }
        ]
      }

      if (req.query.filterVal) {
        qs.where = {shopify_order_name: {[Op.like]: `%${req.query.filterVal}%`}}
      }

      else if (req.query.payment_method) {
        qs.where = {payment_method: {[Op.like]: `%${req.query.payment_method}%`}}
      }
      const finalQS = Object.assign(reqQs, qs)

     
      const count = await viewDispatchJobDetailModel.count(finalQS, {
        raw: true
      })

      if (!count) {
       return Promise.reject({msg: 'No records found', rows: [], count: 0})
      } else {
        return Promise.resolve(count)
      }
    } catch (err) {
      console.log('Dispatch Controller assigned job', err)
     return Promise.reject({msg: 'Unable to process request'})
    }
  }

}
