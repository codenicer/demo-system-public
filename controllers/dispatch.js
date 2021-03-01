const db = require("../models");
const _ = require("lodash");
const Op = db.Sequelize.Op;
const dispatchJobModel = db.dispatch_job;
const dispatchJobDetailModel = db.dispatch_job_detail;
const viewDispatchJobDetailModel = db.view_dispatch_job_detail;
const viewDispatchForAassignmentModel = db.view_dispatch_for_assignment;
const viewDispatchRiderAssignedModel = db.view_dispatch_rider_assigned;
const viewDispatchAdvanceBookModel = db.view_dispatch_advance_book;
const viewDispatchForDeliveryModel = db.view_dispatch_for_delivery;
const viewDispatchHistoryModel = db.view_dispatch_history;
const riderModel = db.rider;
const userModel = db.user;
const orderModel = db.order;
const orderNoteHistModel = db.order_note_history;
const orderItemModel = db.order_item;
const jobRiderModel = db.job_rider;
const riderProviderModel = db.rider_provider;
const viewAvailableRiderModel = db.view_available_rider;
const orderHistoryModel = db.order_history;
const { queryStringToSQLQuery } = require("../helper/queryStringToSQLQuery");
const pad = require("pad-left");
const moment = require("moment-timezone");
const axios = require("axios");


moment.tz.setDefault("Asia/Manila");

module.exports = {
  //get dispatch info of specified id
  generateTracking: async (req, res) => {
    const seq = db.sequence;

    const default_hub_id=  req.params.hub_id ? req.params.hub_id : 1;
    try {
      const genseq = await seq.generate_sequence("dispatch_tracking_no");
      const prefix = moment().format('YYMMDD');
      res.status(200).json({ tracking_no: `${prefix}${default_hub_id}${pad(genseq, 5, 0)}` });
    } catch (err) {
      console.log('error', err);
      res.status(400).json({ msg: "Unable to generate code" });
    }
  },
  getCount: async (req, res) => {


      const reqQs = queryStringToSQLQuery(req);
      for (var i = 0; i < hub_id.length; i++) {
          console.log("HUB ID", hub_id[i]);

          let manilaHub = hub_id[i] === 1 ? " or hub_id is null" : "";
      }

      const queryStr = `select count(*),order_status_id  from view_dispatch_prep ` +
          ` where order_status_id not in (10,11,12,13,14) and delivery_date :delivery_date and ( hub_id in (?) ${manilaHub}) ` +
          ` group by order_status_id, hub_id `;
      const counter = await db.sequelize.query(queryStr,
          {replacements: { delivery_date, }, type: db.sequelize.QueryTypes.SELECT})
          .catch(err=>{

              console.log(err.message,`Error checking record ${dispatch_job_id}`);

              res.status(404).json({ msg: "Error in checking Quality status of this dispatch." });
              return false;

          });

      if (counter.length){
          res.json(counter);
      }else{

      }
  } ,
  getInfo: async (id, req, res) => {
    try {
      const dispatch = await dispatchJobModel.findAll(
        {
          where: { dispatch_id: { [Op.eq]: id } },
          //attributes:[db.sequelize.fn('count', db.sequelize.col('order_note_id'))]
          include: [
            {
              model: dispatchJobDetailModel,
              required: true
            },
            {
              model: riderModel,
              required: true,
              include: [
                {
                  model: riderProviderModel,
                  required: true
                }
              ]
            }
          ]
        },
        { raw: true }
      );
      if (!dispatch) {
        res.status(401).json({ msg: "Record not found." });
      } else {
        // console.log('dispatch data :',dispatch);
        res.json(dispatch[0]);
      }
    } catch (err) {
      console.log("Dispatch Controller error:", err);
      res.status(500).json({ msg: "An error has occurred." });
    }
  },
  create: async (req, res) => {
    // res.status(200).json({msg:'ok'});

    let riderData = req.body.riderForm;
    let tracking_no = req.body.tracking_no;
    const selectedData = req.body.selectedData;

    let default_hub_id=  1;
    if(req.body.hasOwnProperty('hub_id')){
        default_hub_id = req.body.hub_id;
    }

    
    let userData = {};

      try {
    //get user info

      const user_data = await userModel
        .findAll(
          {
            where: { user_id: req.user.user_id }
            // attributes: { exclude: ['password'] },
          },
          { raw: true }
        )
        .catch(err => console.log(err.message, "c1"));
      if (!user_data) {
        return Promise.reject({
          status: 404,
          msg: "User information not found."
        });
        //  res.status(404).json({msg:"User information not found."})
      } else {
        //  console.log('userdata: ', user_data[0]);
        userData = user_data[0];
      }
    } catch (userErr) {
      return Promise.reject({
        status: 404,
        msg: "User information not found."
      });
      //   res.status(404).json({msg:"User information not found."})
    }

    console.log("user ok");

    try {
      //new provider
      if (
        riderData.rider_provider_id === 0 ||
        isNaN(riderData.rider_provider_id)
      ) {
        //new provider
        //create provider
        const riderProviderData = { name: riderData.rider_provider_name };
        const rpResult = await riderProviderModel
          .create(riderProviderData)
          .catch(err => console.log(err.message, "c2"));
        if (!rpResult) {
          return Promise.reject({
            status: 400,
            msg: "Unable to create rider information for Dispatch Job."
          });
          //res.status(400).json({msg: 'Unable to create rider information for Dispatch Job.'});
        } else {
          riderData.rider_provider_id = rpResult.rider_provider_id;
          console.log("provider ok", rpResult);
        }
      }

      console.log("provider ok");

      //new rider

      let db_rider = {};

      if (riderData.rider_id === 0 || isNaN(riderData.rider_id)) {
        // new rider
        const rData = {
          first_name: riderData.first_name,
          last_name: riderData.last_name,
          mobile_number: riderData.mobile_number,
          rider_provider_id: riderData.rider_provider_id,
          status: 1
        };
        const rResult = await riderModel
          .create(rData)
          .catch(err => console.log(err.message, "c3"));
        if (!rResult) {
          return Promise.reject({
            status: 400,
            msg: "Unable to create rider for Dispatch Job."
          });
          //res.status(400).json({msg:'Unable to create rider for Dispatch Job.'});
        } else {
          console.log("New Rider Data", rResult);
          riderData.rider_id = rResult.rider_id;
        }

        console.log("rider create ok");
      } else {
        //extisting rider
        //check if still available

        const riderStatus = await viewAvailableRiderModel
          .findAll({ where: { rider_id: { [Op.eq]: riderData.rider_id } } })
          .catch(err => console.log(err.message, "c4"));

        if (!riderStatus) {
          return Promise.reject({
            status: 400,
            msg: "Rider may have been assigned to other jobs"
          });
          // res.status(400).json({msg: 'Rider may have been assigned to other jobs'});
        }

        console.log("rider exists ok", riderData);
      }
      //insert normal with predefined data
    } catch (e) {
      console.log("error:", e);
      return Promise.reject({
        status: 400,
        msg: "Unable to create rider and information for Dispatch Job."
      });
    }

    //insert header and details

    /*
         `dispatch_job_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
         `tracking_no` varchar(32) DEFAULT NULL,
         `rider_id` int(11) DEFAULT NULL,
         `rider_first_name` varchar(100) DEFAULT NULL,
         `rider_last_name` varchar(100) DEFAULT NULL,
         `rider_mobile_number` varchar(32) DEFAULT NULL,
         `rider_provider` varchar(100) DEFAULT NULL,
         `status` varchar(32) DEFAULT NULL,
         `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
         `created_by_id` int(11) DEFAULT NULL,
         `created_by_name` varchar(100) DEFAULT NULL,
         `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
         `updated_by_id` int(11) DEFAULT NULL,
         `updated_by_name` varchar(100) DEFAULT NULL,
         `remarks` text,
         */

    try {
      // const headerData = dispatchData.header;

      const headerData = {
        rider_id: riderData.rider_id,
        rider_first_name: riderData.first_name,
        rider_last_name: riderData.last_name,
        rider_mobile_number: riderData.mobile_number,
        rider_provider_name: riderData.rider_provider_name,
        rider_provider_id: riderData.rider_provider_id,
        rider_mobile_id: riderData.rider_mobile_id,
        created_by_name: userData.first_name + " " + userData.last_name,
        created_by_id: userData.user_id,
        created_at: Date.now(),
        tracking_no: tracking_no,
        hub_id: default_hub_id,
        status: 8
      };
      const result = await dispatchJobModel
        .create(headerData)
        .catch(err => console.log(err.message, "c5"));

      if (!result) {
        console.log("dispatch controller error: ", result);
        return Promise.reject({
          status: 400,
          msg: "Unable to create dispatch record"
        });
        // res.status(400).json({msg:'Unable to create dispatch record'});
      } else {
        //   console.log('dispatch header ok: ',result);
        let dres = null;
        let errors = [];

        //const order_items =_.filter(_.clone(selectedData),{ jobtype: 'delivery', })

        _.each(selectedData, async detail => {
          //  console.log('detail to add', detail);
          detail.dispatch_id = result.dispatch_id;
          dres = await dispatchJobDetailModel
            .create({
              order_reference_id: detail.job_id,
              dispatch_job_id: result.dispatch_job_id,
              order_id: detail.order_id,
              order_item_id: detail.job_id,
              shopify_order_name: detail.shopify_order_name,
              job_item_type: detail.jobtype || detail.type,
              created_at: Date.now(),
              status: 8
            })
            .catch(err => console.log(err.message, "r4"));
          if (!dres) {
            errors.push({
              order_reference_id: detail.order_reference_id,
              job_item_type: detail.job_item_type
            });
          } else {
            let upRest = null;
            if (["cash pick up","cash pickup"].includes(detail.jobtype) || ["cash pick up","cash pickup"].includes(detail.type) ) {
              upRest = await db.job_rider
                .update(
                  { status: 8 },
                  {
                    where: {
                      // job_rider_id: detail.job_id,
                      order_id: detail.order_id,
                      status: { [Op.ne]: [13,14] }
                    }
                  }
                )
                .catch(err => console.log(err.message, "r3"));

              if (!upRest) {
                console.log("err must delete dispatch job item");
              } else {
                console.log("job_rider should be updated");
                //Job for CPU has been assigned
                //orderHistoryModel.create();
                try {
                  await orderHistoryModel.create({
                    order_id: detail.order_id,
                    order_item_id: detail.job_id,
                    user_id: req.user.user_id,
                    action: `${detail.shopify_order_name}-CPU Job was assigned for dispatch to rider ${riderData.first_name} ${riderData.last_name} of ${riderData.rider_provider_name}. Tracking No.${tracking_no}`,
                    action_id : 19,
                    data_changed : JSON.stringify({order_id : detail.order_id, order_item_id : detail.job_id, order_status_id : 8})
                  });
                } catch (errorOHM) {
                  console.log("error in creating order history log", errorOHM);
                }
              }
            } else {
              //flower delivery

              upRest = await db.order_item
                .update(
                  { order_item_status_id: 8 },
                  {
                    where: {
                      order_id: detail.order_id,
                      // order_item_id: detail.job_id,
                      order_item_status_id: { [Op.ne]: [13,14,9,10] }
                    }
                  }
                )
                upRest = await db.order
                    .update(
                        { order_status_id: 8 },
                        {
                            where: {
                                order_id: detail.order_id,
                             //   order_status_id: 7
                            }
                        }
                    )
                .catch(err => console.log(err.message, "r1"));

              if (!upRest) {
                console.log("err must delete dispatch order item");
              } else {
                console.log("order item updated", {
                  where: {
                    order_id: detail.order_id,
                    order_item_id: detail.job_id,
                    order_item_status_id: 7
                  }
                });
                  try {
                      await orderHistoryModel.create({
                          order_id: detail.order_id,
                          user_id: req.user.user_id,
                          action: `Order: ${detail.title} was assigned for dispatch to rider ${riderData.first_name} ${riderData.last_name} of ${riderData.rider_provider_name}. Tracking No.${tracking_no}` ,
                          action_id : 14,
                        data_changed : JSON.stringify({order_id : detail.order_id, order_item_id : detail.job_id, order_status_id : 8})
                      });
                  } catch (errorOHM) {
                      console.log("error in creating order history log", errorOHM);
                  }



                // const headerUpdateRes = await db.sequelize
                //   .query(
                //     "CALL proc_update_order_status(:order_id, :new_order_status, :order_item_status_id)",
                //     {
                //       replacements: {
                //         order_id: detail.order_id,
                //         new_order_status: 8,
                //         order_item_status_id: 8
                //       }
                //     }
                //   )
                //   .catch(err => console.log(err.message, "r2"));
                // if (!headerUpdateRes) {
                //   console.log("update called false", headerUpdateRes);
                // } else {
                //   console.log("update called true", headerUpdateRes);
                // }
              }
            }
          }
        });

        if (errors.length > 0) {
          return Promise.resolve({
            status: 200,
            msg: `Dispatch Record created. ${errors.length} item(s) not added to dispatch. Please check dispatch details.`
          });
          //     res.status(200).json({msg:`Dispatch Record created. ${errors.length} item(s) not added to dispatch. Please check dispatch details.`});
        } else {
          return Promise.resolve({
            status: 200,
            msg: `Dispatch Record created. All item(s) were added to dispatch. Please check dispatch details.`
          });
          //   res.status(200).json({msg:`Dispatch Record created. All item(s) were added to dispatch. Please check dispatch details.`});
        }
      }
    } catch (err) {
      console.log("dispatch error", err);
      return Promise.reject({
        status: 400,
        msg: "Unable to create dispatch record"
      });
      //res.status(400).json({msg:'Unable to create dispatch record'});
    }
  },//done
  createAdvanceBooking: async (req, res) => {
    let riderData = req.body.riderForm;
    let tracking_no = req.body.tracking_no;
    const selectedData = req.body.selectedData;

      let default_hub_id=  1;
      if(req.body.hasOwnProperty('hub_id')){
          default_hub_id = req.body.hub_id;
      }

    let userData = {};


    console.log('user default hub', default_hub_id);
    console.log('riderData', selectedData)



      let order_names = [];
      let result = null;
      req.body.selectedData.forEach( async (item) => {

          //check if there are existing dispatch
          result = await dispatchJobDetailModel.findAll({
              where:{
                  shopify_order_name: item.shopify_order_name,
                  job_item_type: item.jobtype || item.type,
                  status: [8,9,10,15]
              },
              raw: true
          });

          if(result.length){
              return res.status(404).json({
                  msg: `The ${item.shopify_order_name} is already in dispatch process`
              });
          }
          //check order if delivery
          if(item.jobtype === 'delivery'  || item.type === "delivery"){
              result = await orderModel.findAll({
                  where:{
                      shopify_order_name: item.shopify_order_name,
                      order_status_id: [8,9,10,15]
                  }
              });

              if(result.length){
                  return res.status(404).json({
                      msg: `The ${item.shopify_order_name} is already in dispatch process`
                  });
              }

          }
          if(["cash pick up","cash pickup"].includes(item.jobtype) || ["cash pick up","cash pickup"].includes(item.type)  ){
              result= await jobRiderModel.findAll({
                  where:{
                      status: [8,9,10,15]
                  },
                  include:[
                      {
                          model: orderModel,
                          required: true,
                          where:{
                              order_status_id: [8,9,10,15],
                              shopify_order_name:item.shopify_order_name
                          }
                      }

                  ],
                  raw:true
              });
              if(result.length){
                  return res.status(404).json({
                      msg: `The ${item.shopify_order_name} is already in dispatch process`
                  });
              }
          }

      });


      //get user info

    try {
      const user_data = await userModel.findAll(
        {
          where: { user_id: req.user.user_id }
          // attributes: { exclude: ['password'] },
        },
        { raw: true }
      );
      if (!user_data) {
        res.status(404).json({ msg: "User information not found." });
      } else {
        console.log("userdata: ", user_data[0]);
        userData = user_data[0];
      }
    } catch (userErr) {
      res.status(404).json({ msg: "User information not found." });
    }

    try {
      // const headerData = dispatchData.header;

      const headerData = {
        rider_id: riderData.rider_id,
        rider_first_name: riderData.first_name,
        rider_last_name: riderData.last_name,
        rider_mobile_number: riderData.mobile_number,
        rider_provider_name: riderData.rider_provider_name,
        rider_provider_id: riderData.rider_provider_id,
        rider_mobile_id: riderData.rider_mobile_id,
        created_by_name: userData.first_name + " " + userData.last_name,
        created_by_id: userData.user_id,
        created_at: Date.now(),
        tracking_no: tracking_no,
        hub_id: default_hub_id,
        status: 15
      };
      const result = await dispatchJobModel.create(headerData);

      if (!result) {
        console.log("dispatch controller error: ", result);
        res.status(400).json({ msg: "Unable to create dispatch record" });
      } else {
        console.log("dispatch header ok: ", result);
        let dres = null;
        let errors = [];
        _.each(selectedData, async detail => {
          console.log("detail to add", detail);
          detail.dispatch_id = result.dispatch_id;
          dres = await dispatchJobDetailModel.create({
            order_reference_id: detail.job_id,
            dispatch_job_id: result.dispatch_job_id,
            order_id: detail.order_id,
            order_item_id: detail.job_id,
            shopify_order_name: detail.shopify_order_name,
            job_item_type: detail.jobtype || detail.type,
            created_at: Date.now(),
            status: 15
          });
          if (!dres) {
            errors.push({
              order_reference_id: detail.order_reference_id,
              job_item_type: detail.job_item_type
            });
          } else {
            
            let upRest = null;
            if (["cash pick up","cash pickup"].includes(detail.jobtype) || ["cash pick up","cash pickup"].includes(detail.type)  ) {
              upRest = await db.job_rider
                .update(
                  { status: 15 },
                  {
                    where: {
                      // job_rider_id: detail.job_id,
                      order_id: detail.order_id,
                   //   status: 7
                    }
                  }
                )
                .catch(err => console.log("rider update", err));

              if (!upRest) {
                console.log("err must delete dispatch job item");
              } else {
                console.log("job_rider ok");
                try {
                  await orderHistoryModel.create({
                    order_id: detail.order_id,
                    order_item_id: detail.job_id,
                    user_id: req.user.user_id,
                    action: `${detail.shopify_order_name}-CPU Job was booked in advance for dispatch.`,
                    action_id : 18,
                    data_changed : JSON.stringify({order_id : detail.order_id,order_item_id : detail.job_id, status : 15,})

                  });
                } catch (errorOHM) {
                  console.log("error in creating order history log", errorOHM);
                }
              }
            } else {

              upRest = await db.order_item.update(
                { order_item_status_id: 15 },
                {
                  where: {
                    order_id: detail.order_id,
                    // order_item_id: detail.job_id,
                    order_item_status_id: { [Op.notIn]:[15,9,10,13,14,12,11]}
                  }
                }
              );
                upRest = await db.order.update(
                        { order_status_id: 15 },
                        {
                            where: {
                                order_id: detail.order_id,
                                //   order_status_id: 7
                                order_status_id: { [Op.notIn]:[15,9,10,13,14,12,11]}
                            }
                        }
                    )
                    .catch(err => console.log(err.message, "r1"));

              if (!upRest) {
                console.log("err must delete dispatch order item");
              } else {
                console.log("order ok");
                try {
                  await orderHistoryModel.create({
                    order_id: detail.order_id,
                    order_item_id: detail.job_id,
                    user_id: req.user.user_id,
                    action: `Order Item: ${detail.title} was booked in advance for dispatch.`,
                    action_id: 13,
                    data_changed : JSON.stringify({order_id : detail.order_id,order_item_id: detail.job_id, order_status_id : 15,
                      order_item: detail.title})
                  });
                } catch (errorOHM) {
                  console.log("error in creating order history log", errorOHM);
                }
              }
            }
          }
        });

        if (errors.length) {
          //return Promise.resolve({status:200,msg:`Dispatch Record created. ${errors.length} item(s) not added to dispatch. Please check dispatch details.`})
          res.status(200).json({
            msg: `Dispatch Record created. ${errors.length} item(s) not added to dispatch. Please check dispatch details.`
          });
        } else {
          //      return Promise.resolve({status:200,msg:`Dispatch Record created. All item(s) were added to dispatch. Please check dispatch details.`})
          res.status(200).json({
            msg: `Dispatch Record created. All item(s) were added to dispatch. Please check dispatch details.`
          });
        }
      }

    } catch (err) {
      console.log("dispatch error", err);
      //return Promise.reject({status:400,msg:'Unable to create dispatch record'})
      res.status(400).json({ msg: "Unable to create dispatch record" });
    }
  },//done
  removeDispatchItem: async (req, res) => {
    const dispatch_job_detail_id = req.params.match.dispatch_job_detail_id;

    //13: cancelled internal
    //update dispatch job detail

    //update order_item if flower delivery

    //update job_rider if cash pickup
  },
  update: async (req, res) => {
    const dispatch_job_id = req.params.dispatch_job_id;

    let riderData = req.body.riderForm || {};
    let tracking_no = req.body.tracking_no || {};
    let dispatch_data = req.body.dispatch_data || {};

    const whereData = req.body.whereData || {};

    if (riderData) {
      try {
        //new provider
        if (
          riderData.rider_provider_id === 0 ||
          isNaN(riderData.rider_provider_id)
        ) {
          //new provider
          //create provider
          const riderProviderData = { name: riderData.rider_provider_name };
          const rpResult = await riderProviderModel.create(riderProviderData);
          if (!rpResult) {
            return res.status(400).json({
              msg: "Unable to create rider information for Dispatch Job."
            });
          } else {
            riderData.rider_provider_id = rpResult.rider_provider_id;
            console.log("provider ok", rpResult);
          }
        }
        console.log("provider ok");

        //new rider
        let db_rider = {};

        if (riderData.rider_id === 0 || isNaN(riderData.rider_id)) {
          // new rider
          const rData = {
            first_name: riderData.first_name,
            last_name: riderData.last_name,
            mobile_number: riderData.mobile_number,
            rider_provider_id: riderData.rider_provider_id,
            status: 1
          };
          const rResult = await riderModel.create(rData);
          if (!rResult) {
            return res
              .status(400)
              .json({ msg: "Unable to create rider for Dispatch Job." });
          } else {
            console.log("New Rider Data", rResult);
            riderData.rider_id = rResult.rider_id;
          }

          console.log("rider create ok");
        } else {
          //extisting rider
          //check if still available

          const riderStatus = await viewAvailableRiderModel.findAll({
            where: { rider_id: { [Op.eq]: riderData.rider_id } }
          });

          if (!riderStatus) {
            return res
              .status(400)
              .json({ msg: "Rider may have been assigned to other jobs" });
          }

          console.log("rider exists ok", riderData);
        }
        //insert normal with predefined data
      } catch (e) {
        console.log("error:", e);
        res.status(400).json({
          msg: "Unable to create rider and information for Dispatch Job."
        });
      }
      dispatch_data.rider_id = riderData.rider_id;
      dispatch_data.rider_provider_id = riderData.rider_provider_id;
      dispatch_data.rider_first_name = riderData.first_name;
      dispatch_data.rider_last_name = riderData.last_name;
      dispatch_data.rider_mobile_number = riderData.mobile_number;
      dispatch_data.rider_provider_name = riderData.rider_provider_name;
      dispatch_data.tracking_no = tracking_no;
    } else {
      if (tracking_no) {
        dispatch_data.tracking_no = tracking_no;
      }
    }

    whereData.dispatch_job_id = dispatch_job_id;

    try {
      const result = await dispatchJobModel.findAll(
        { where: whereData },
        { raw: true }
      );

      if (!result) {
        res.status(401).json({ msg: "Unable to find dispatch record" });
      } else {
        const update_res = await dispatchJobModel.update(dispatch_data, {
          where: whereData
        });

        if (!update_res) {
          res.status(401).json({ msg: "Unable to update record" });
        } else {
          const djdRes = await dispatchJobDetailModel.findAll({
            where: {
              dispatch_job_id,
              status: [7, 15]
            }
          });
          if (!update_res) {
            res.status(401).json({ msg: "Unable to update record" });
          } else {
            const djdRes = await dispatchJobDetailModel.findAll(
              {
                where: {
                  dispatch_job_id,
                  status: [8, 15]
                },
                include: [
                  {
                    model: db.order_item,
                    required: false
                  }
                ]
              },
              { raw: true }
            );

            if (!djdRes) {
              console.log("Error updating details", djdRes);
              res.status(400).json({ msg: "Unable to update dispatch record" });
            } else {
              let upRest = {};
              _.each(djdRes, async (djdrec, key) => {
                const itemObj = _.filter(djdrec.dataValues.order_items, {
                  order_item_id: djdrec.order_reference_id
                });
                let title = "";
                if (djdrec.job_item_type === "cash pickup") {
                  //update job rider
                  upRest = await db.job_rider.update(
                    { status: 8 },
                    {
                      where: {
                        job_rider_id: djdrec.order_reference_id,
                        order_id: djdrec.order_id,
                        status: { [Op.notIn]:[9,13,11,12,10]}
                      }
                    }
                  );

                  if (!upRest) {
                    console.log("err must delete dispatch job item");
                  } else {
                    console.log("job_rider ok");

                    try {
                      await orderHistoryModel.create({
                        order_id: djdrec.order_id,
                        order_item_id: djdrec.order_reference_id,
                        user_id: req.user.user_id,
                        action: `${djdrec.shopify_order_name}-CPU was assigned to a new rider ${riderData.first_name}
                         ${riderData.last_name} of ${riderData.rider_provider_name} with Tracking No:${tracking_no}`,
                        action_id : 19,
                        data_changed : JSON.stringify({order_id : djdrec.order_id, order_item_id : djdrec.order_reference_id})

                      });
                    } catch (errorOHM) {
                      console.log(
                        "error in creating order history log",
                        errorOHM
                      );
                    }
                  }
                }

                if (djdrec.job_item_type === "delivery") {
                  //update order_item
                  upRest = await db.order_item.update(
                    { order_item_status_id: 8 },
                    {
                      where: {
                        order_id: djdrec.order_id,
                        // order_item_id: djdrec.order_reference_id,
                          order_item_status_id: { [Op.notIn]:[9,13,14,11,12,10]}
                      }
                    }
                  );

                  letUpRestOrder = await db.order.update(
                    { order_status_id: 8 },
                    {
                      where: {
                        order_id: djdrec.order_id,
                    //    order_item_status_id: [7, 15]
                          order_status_id: { [Op.notIn]:[9,13,14,11,12,10]}
                      }
                    }
                  );

                  if (!upRest) {
                    console.log("err must delete dispatch order item");
                  } else {
                    console.log("order ok");
                    try {
                      await orderHistoryModel.create({
                        order_id: djdrec.order_id,
                        order_item_id: djdrec.order_reference_id,
                        user_id: req.user.user_id,
                        action: `Dispatch Job for Order Item: ${djdrec.dataValues.order_item.dataValues.title} was assigned to a new rider ${riderData.first_name} 
                        ${riderData.last_name} of ${riderData.rider_provider_name} with Tracking No:${tracking_no}`,
                        action_id : 14,
                        data_changed : JSON.stringify({order_id : djdrec.order_id, order_item_id : djdrec.order_reference_id, order_item_id : djdrec.dataValues.order_item.dataValues.title})
                      });
                    } catch (errorOHM) {
                      console.log(
                        "error in creating order history log",
                        errorOHM
                      );
                    }
                  }
                }
              });

              upRest = await dispatchJobDetailModel.update(
                { status: 8 },
                {
                  where: {
                    dispatch_job_id,
                    status: { [Op.notIn]:[9,13,14,11,12,10]}
                  }
                }
              );

              if (!upRest) {
                console.log("err in dipsatch job detail model");
              } else {
                console.log("dispatch job detail ok");
                res
                  .status(200)
                  .json({ msg: "Dispatch Job information updated." });
              }
            }
          }
        }
      }
    } catch (err) {
      res.status(400).json({ msg: "Unable to update dispatch record" });
    }
  },
  forassignment: async req => {
     console.log("REQ QUERY >>>>>",req.query,"\n\n")
     const qstring = queryStringToSQLQuery(req);
    let cpu_where = {
        ...qstring['where']
    }
    // //console.log('cpu where', cpu_where);

    if (cpu_where.hasOwnProperty('delivery_date')){
      delete cpu_where.delivery_date;
    }
    try {
      const qs = {
        where: {
         // order_item_status_id: { [Op.in]: [5, 6, 7] },
         // ...qstring['where'], //do not include cpu orders not delivered
            [Op.or]:[{
                // [Op.or]:[{
                    jobtype:'delivery',
                    order_status_id: { [Op.in]: [2,3,4, 5, 6, 7] },
                    ...qstring['where'], //do not include cpu orders not delivered
                // },
                //     {
                //     jobtype:'delivery',
                //     payment_method:{[Op.eq]:'CPU'},
                //     order_status_id: { [Op.in]: [2,3,4, 5, 6, 7] },
                //     ...qstring['where'], //do not include cpu orders not delivered
                //     order_id:{[Op.in]: db.sequelize.literal('(Select jr.order_id from job_rider jr where jr.order_id = `view_jobs_for_dispatch`.order_id and jr.status = 10 )')}
                // }]

            },{
              jobtype:'cash pickup',
              delivery_date: {[Op.lte]:qstring['where']['delivery_date']},
              // order_item_status_id: { [Op.in]: [2,3,4, 5, 6, 7] },
              ...cpu_where, //do not include cpu orders not delivered
            }
            ]

        },
        // attributes: [
        //   ...viewJobsForDispatchModel.selectable,
        //   [db.sequelize.literal("0"), "isSelected"],
        //     [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `view_jobs_for_dispatch`.order_id and ticket.status_id=1) '), 'open_ticket'],
        //   [db.sequelize.literal("if(view_jobs_for_dispatch.jobtype = 'cash pickup',0,(Select job_rider.status from job_rider where job_rider.order_id = view_jobs_for_dispatch.order_id order by job_rider.created_at DESC limit 1))"),'cpu_dispatch'],


        // ],
        order: [["delivery_date", "ASC"], ["delivery_time", "ASC"]]
      };

      if (req.query.delivery_date == ''){

        delete qs.where[Op.or][0].delivery_date
        delete qs.where[Op.or][1].delivery_date
      }
      // console.log('ahaha', qs.where[Op.or][1].delivery_date)

      //const finalQS = Object.assign(qs, reqQs)
        let finalQS =  { ...qs, limit:qstring['limit'],offset:qstring['offset']  }
        // console.log('here final')

      const result = await viewDispatchForAassignmentModel.findAndCountAll(finalQS, {
        raw: true
      });






      if (!result) {
        return Promise.resolve({ rows: [], count: 0 });
        // res.status(200).json({status:401,msg:'No records found', rows:[],count:0});
      } else {
     
          if (req.hasOwnProperty("query")) {
             // console.log("reqQs", req.query.hasOwnProperty("listCity"));
              if (req.query.hasOwnProperty("listCity")) {
              
                  if (parseInt(req.query.listCity)) {
             
                      try {
                          if (finalQS.where.hasOwnProperty("city")) {
                              delete finalQS.where.city;
                          }
                          let nfinalQS = Object.assign(finalQS, {
                              attributes: [db.sequelize.literal("distinct city"), "City"]
                          });

                          const city_result = await viewDispatchForAassignmentModel.findAll(
                              nfinalQS,
                              {
                                  raw: true
                              }
                          );
                          if (!city_result) {
                              console.log("error in distinct city", city_result);
                          } else {
                              result.cities = city_result;
                          }
                      } catch (cerror) {
                          console.log("error in distinct city", cerror);
                      }
                  }
              }
          }


        return Promise.resolve(result);
        // res.status(200).json(result);
      }
    } catch (err) {
      console.log("Dispatch Controller", err);
      return Promise.reject({ status: 400, msg: "Unable to process request" });
      // res.status(400).json({msg:'Unable to process request'});
    }
  },
  forCpuDone: async req => {
    const qstring = queryStringToSQLQuery(req);

    let filterWhere = {target_pickup_date: qstring['where']['delivery_date'],
      status: { [Op.in]: [9,10] },
      hub_id: {[Op.in] : qstring.where.hub_id },
      }

    if (qstring.where.hasOwnProperty('delivery_time')){
      filterWhere.target_pickup_time = qstring.where.delivery_time
    }

    try {

      const qs = {
          include: [{model: db.job_rider,
            where: filterWhere,
           include : [ {
             model: db.order,
             include: [{
               model: db.customer,
               required:true
             },{
               model: db.order_address,
               as: "addresses",
               attributes: db.order_address.selectable,
               required: true
             }
             ],
             required: true
           }],
          required: true},



    ],
      };

      if (qstring.where.hasOwnProperty('shopify_order_name')){
        qs.where ={shopify_order_name : qstring.where.shopify_order_name}
      }


      if (req.query.delivery_date == ''){

        delete qs.where[Op.or][0].delivery_date
        delete qs.where[Op.or][1].delivery_date
      }
      // console.log('ahaha', qs.where[Op.or][1].delivery_date)

      //const finalQS = Object.assign(qs, reqQs)
      let finalQS =  { ...qs, limit:qstring['limit'],offset:qstring['offset']  }
      // console.log('here final')

      const result = await db.dispatch_job_detail.findAndCountAll(finalQS, {
        raw: true
      });

      if (!result) {
        return Promise.resolve({ rows: [], count: 0 });
        // res.status(200).json({status:401,msg:'No records found', rows:[],count:0});
      } else {

        return Promise.resolve(result);
        // res.status(200).json(result);
      }
    } catch (err) {
      console.log("Dispatch Controller", err);
      return Promise.reject({ status: 400, msg: "Unable to process request" });
      // res.status(400).json({msg:'Unable to process request'});
    }
  },
  assignedjob: async (req, res) => {
    //console.clear()
    //console.log("REQ QUERY:",req.query,"\n \n \n \n");
      let reqQs = queryStringToSQLQuery(req);
      let qs = {

          order: [["created_at", "DESC"]]
      };
      let dispatch_details = null;
      let dj_list = [];
      //check filters
      let payment_method_where = '';
      if (req.query.payment_method) {
          let mop = orderModel.payment_method.filter( x => x.value === req.query.payment_method );
          if(mop){
              payment_method_where = ` and payment_id = ${mop[0].id}`;
          }

      }
      if (req.query.filterVal || req.query.payment_method) {
          //query details and filter

           dispatch_details = await db.sequelize.query(
              `Select dispatch_job_id from view_dispatch_rider_assigned where (shopify_order_name like ? or tracking_no like ? ) ${payment_method_where} and hub_id in (?) group by dispatch_job_id   order by created_at desc `,
              {replacements: [`%${req.query.filterVal}%`, `%${req.query.filterVal}%`, [req.query.hub_filter].toString().split(",")]})

              .catch(err => {

                  res.status(404).json({msg: "Error in checking dispatch."});
                  return false;

              });
      }else{ // filters applied
           // dispatch_details = await db.sequelize.query(
           //    `Select dispatch_job_id from view_dispatch_rider_assigned where  hub_id in (?) ${payment_method_where} group by dispatch_job_id   order by created_at desc `,
           //    {replacements: [[req.query.hub_filter].toString().split(",")]})
           //
           //    .catch(err => {
           //
           //        res.status(404).json({msg: "Error in checking dispatch."});
           //        return false;
           //
           //    });

          let finalQS = Object.assign({}, reqQs, qs);


          finalQS.where = {
              ...finalQS.where,
              hub_id: [[req.query.hub_filter].toString().split(",")]
          };
          finalQS.include = {
                      model: dispatchJobDetailModel,
                      required: true,
                      where: {
                          status:8
                      }
          };
          console.log('finalQS:',finalQS);

          const result = await dispatchJobModel.findAndCountAll(
              finalQS,
              {
                  raw: true
              });
          if (!result) {
              return res
                  .status(401)
                  .json({ msg: "No records found", rows: [], count: 0 });
          } else {

              console.log(' result', result);
              //push object to its detail

              result.rows.forEach(row => {
                  dj_list.push(row.dispatch_job_id);
              });

              qs.where = {
                  dispatch_job_id:dj_list
              };
              const result1 = await viewDispatchRiderAssignedModel.findAndCountAll({
                  where: {dispatch_job_id: dj_list},
                  order: [["created_at", "DESC"]]
              }, {
                  raw: true
              });
              if (!result1) {
                  return res
                      .status(401)
                      .json({msg: "No records found", rows: [], count: 0});
              }
              //console.log('dispatch_details result', result1);

              result.rows.forEach(row => {
                  row.dataValues['details'] = [];
                  result1.rows.forEach(d => {

                      if (row.dataValues.dispatch_job_id === d.dispatch_job_id) {
                          row.dataValues['details'].push(d);
                      }

                  });

              });


              return res.status(200).json(result);
          }








      }
      //get ids and select dispatch
     // console.log('dispatch_details', dispatch_details);

      dispatch_details.forEach(row => {
          row.forEach(item => {
              //  //("order ID:",row.order_id,item.product_id)
              dj_list.push(item.dispatch_job_id);
          });
      });

      qs.where = {
              dispatch_job_id:dj_list
      };


      //const finalQS = _.union({}, reqQs,qs);
      let finalQS = Object.assign({}, reqQs, qs);
      const result = await dispatchJobModel.findAndCountAll(
          finalQS,
          {
          raw: true
      });
      if (!result) {
          return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
      } else {

          //console.log('dispatch_details job result', result);
          //push object to its detail
          const result1 = await viewDispatchRiderAssignedModel.findAndCountAll({
              where: {dispatch_job_id: dj_list},
              order: [["created_at", "DESC"]]
          }, {
              raw: true
          });
          if (!result1) {
              return res
                  .status(401)
                  .json({msg: "No records found", rows: [], count: 0});
          }

          result.rows.forEach(row => {
              row.dataValues['details'] = [];
              result1.rows.forEach(d => {

                  if (row.dataValues.dispatch_job_id === d.dispatch_job_id) {
                      row.dataValues['details'].push(d);
                  }

              });

          });


          return res.status(200).json(result);
      }






  },
  assignedjobEx: async (req, res) => {




    console.log("REQ QUERY:",req.query,"\n \n \n \n")

    const reqQs = queryStringToSQLQuery(req);

    let qs = {
      where: { status: [8] },
      distinct: true,
      include: [
        {
          model: viewDispatchJobDetailModel,
          attributes: viewDispatchJobDetailModel.selectable,
          required: true,
          //duplicate:false,
          order: [["delivery_date", "ASC"], ["delivery_time", "ASC"]],
          where: { status: [8], hub_id:[req.query.hub_filter].toString().split(",") }
        }
      ],
      order:[["created_at","DESC"]]
    };

    try {
      if (req.query.filterVal) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        // console.log(req.query.filterVal);
        const filterRes = await viewDispatchJobDetailModel
          .findAll({
            where: {
              status: [8],
              [Op.or]: [
                {
                  shopify_order_name: { [Op.like]: `%${req.query.filterVal}%` }
                }
              ]
            },
            raw: true
          })
          .catch(err => console.log(err, "ERROR IN FINDING tracking no"));

        if (filterRes.length) {
          //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
          // console.log("SHOPIFY ORDER NAME", filterRes);
          let dispatchId = filterRes.map(item => item.dispatch_job_id);
          qs.where = { status: [8], dispatch_job_id: dispatchId };
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);

          // console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });

          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        } else {
          // console.log("TRACKING NO");
          qs.where = {
            status: [8],
            tracking_no: { [Op.like]: `%${req.query.filterVal}%` }
          };

          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);

          // console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });

          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        }
      }
      else if (req.query.payment_method) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        console.log(req.query.payment_method);
        const filterRes = await viewDispatchJobDetailModel
          .findAll({
            where: {
              status: [8],
              [Op.or]: [
                {
                  payment_method: { [Op.like]: `%${req.query.payment_method}%` }
                }
              ]
            },
            raw: true
          })
          .catch(err => console.log(err, "ERROR IN FINDING tracking no"));

          //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
          // console.log("SHOPIFY ORDER NAME", filterRes);
          let dispatchId = filterRes.map(item => item.dispatch_job_id);
          qs.where = { status: [8], dispatch_job_id: dispatchId };
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);

          // console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });

          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }

      }

      else if(req.query.providerFilter) {

        if(req.query.providerFilter){
          qs.where = { status: [8], rider_provider_name: {[Op.like]: `%${req.query.providerFilter}%`} };
        }

        const finalQS = Object.assign({}, reqQs, qs);

        //  console.log("finalQS filter:", finalQS.include[0],"\n\n\n\n\n\n");
        const result = await dispatchJobModel.findAndCountAll(finalQS, {
          raw: true
        });
        // console.log("FRES",result)
        if (!result) {
          return res
            .status(401)
            .json({ msg: "No records found", rows: [], count: 0 });
        } else {
          return res.status(200).json(result);
        }
      }

      else {

        if(req.query.riderFilter){
          qs.where = { status: [8], rider_id: req.query.riderFilter };
        }

        const finalQS = Object.assign({}, reqQs, qs);

        console.log("finalQS ^^^^^ filter:", finalQS.include[0],"\n\n\n\n\n\n");
        const result = await dispatchJobModel.findAndCountAll(finalQS, {
          raw: true
        });
        // console.log("FRES",result)
        if (!result) {
          return res
            .status(401)
            .json({ msg: "No records found", rows: [], count: 0 });
        } else {
          return res.status(200).json(result);
        }
      }
    } catch (err) {
      console.log("Dispatch Controller assigned job", err);
      res.status(400).json({ msg: "Unable to process request" });
    }
  },
  readyToShipJob: async (req, res) => {
    console.clear()
    console.log("REQ QUERY:",req.query,"\n \n \n \n")

    const reqQs = queryStringToSQLQuery(req);

    let qs = {
      where: { status: [8, 15] },
      distinct: true,
      include: [
        {
          model: viewDispatchJobDetailModel,
          attributes: viewDispatchJobDetailModel.selectable,
          required: true,
          //duplicate:false,
          order: [["delivery_date", "ASC"], ["delivery_time", "ASC"]],
          where: { hub_id:[req.query.hub_filter].toString().split(","), status: {[Op.ne]: 13} }
        }
      ],
      order:[["created_at","DESC"]]
    };
  
    try {
      if (req.query.filterVal) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        // console.log(req.query.filterVal);
        const filterRes = await viewDispatchJobDetailModel
          .findAll({
            where: {
              [Op.or]: [
                {
                  shopify_order_name: { [Op.like]: `%${req.query.filterVal}%` }
                }
              ]
            },
            raw: true
          })
          .catch(err => console.log(err, "ERROR IN FINDING tracking no"));
       
        if (filterRes.length) {
          //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
          // console.log("SHOPIFY ORDER NAME", filterRes);
          let dispatchId = filterRes.map(item => item.dispatch_job_id);
          qs.where = { status: [8, 15], dispatch_job_id: dispatchId };
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          // console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        } else {
          // console.log("TRACKING NO");
          qs.where = {
            status: [8, 15],
            tracking_no: { [Op.like]: `%${req.query.filterVal}%` }
          };
  
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          // console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        }
      }
      else if (req.query.payment_method) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        console.log(req.query.payment_method);
        const filterRes = await viewDispatchJobDetailModel
          .findAll({
            where: {
              [Op.or]: [
                {
                  payment_method: { [Op.like]: `%${req.query.payment_method}%` }
                }
              ]
            },
            raw: true
          })
          .catch(err => console.log(err, "ERROR IN FINDING tracking no"));
  
          //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
          // console.log("SHOPIFY ORDER NAME", filterRes);
          let dispatchId = filterRes.map(item => item.dispatch_job_id);
          qs.where = { status: [8, 15], dispatch_job_id: dispatchId };
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          // console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
      
      }

      else if(req.query.providerFilter) {
        
        if(req.query.providerFilter){
          qs.where = { status: [8, 15], rider_provider_name: {[Op.like]: `%${req.query.providerFilter}%`} };
        }

        const finalQS = Object.assign({}, reqQs, qs);

        //  console.log("finalQS filter:", finalQS.include[0],"\n\n\n\n\n\n");
        const result = await dispatchJobModel.findAndCountAll(finalQS, {
          raw: true
        });
        // console.log("FRES",result)
        if (!result) {
          return res
            .status(401)
            .json({ msg: "No records found", rows: [], count: 0 });
        } else {
          return res.status(200).json(result);
        }
      }

      else {
        
        if(req.query.riderFilter){
          qs.where = { status: [8, 15], rider_id: req.query.riderFilter };
        }

        const finalQS = Object.assign({}, reqQs, qs);

        console.log("finalQS ^^^^^ filter:", finalQS.include[0],"\n\n\n\n\n\n");
        const result = await dispatchJobModel.findAndCountAll(finalQS, {
          raw: true
        });
        // console.log("FRES",result)
        if (!result) {
          return res
            .status(401)
            .json({ msg: "No records found", rows: [], count: 0 });
        } else {
          return res.status(200).json(result);
        }
      }
    } catch (err) {
      console.log("Dispatch Controller assigned job", err);
      res.status(400).json({ msg: "Unable to process request" });
    }
  },
  assemblyGab: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req);

    let qs = {
      attributes: viewDispatchJobDetailModel.selectable,
      order: [["delivery_date", "ASC"], ["delivery_time", "ASC"]],
      where: {
        hub_id:[req.query.hub_filter.split(',')],
        status: [8],
        quality_check: 0,
        payment_method: { [Op.ne]: "CPU" }
      }
    };

    if(req.query.shopify_order_name){
      qs.where = {
        hub_id:[req.query.hub_filter.split(',')],
        status: [8],
        quality_check: 0,
        payment_method: { [Op.ne]: "CPU" },
        shopify_order_name: {[Op.like]: `%${req.query.shopify_order_name}%`}
      };
    }

    const finalQS = Object.assign({}, reqQs, qs);

    //console.log("FILTER", finalQS);

    let response = await viewDispatchJobDetailModel.findAndCountAll(finalQS, {
      raw: true
    });

    res.json(response);
   
  },
  advanceBooking: async (req, res) => {

      let reqQs = queryStringToSQLQuery(req);
      let qs = {

          order: [["created_at", "DESC"]]
      };
      let dispatch_details = null;
      //check filters

      let payment_method_where = '';
      if (req.query.payment_method) {
          let mop = orderModel.payment_method.filter( x => x.value === req.query.payment_method );
          if(mop){
              payment_method_where = ` and payment_id = ${mop[0].id}`;
          }

      }
      if (req.query.deliveryDate) {
              payment_method_where += ` and delivery_date = '${req.query.deliveryDate}'`;
      }
      if (req.query.deliveryTime) {
          payment_method_where += ` and delivery_time = '${req.query.deliveryTime}'`;
      }
      const dj_list = [];

      if (req.query.filterVal) {
          //query details and filter

          dispatch_details = await db.sequelize.query(
              `Select dispatch_job_id from view_dispatch_advance_book where (shopify_order_name like ? or tracking_no like ? ) ${payment_method_where} and hub_id in (?) group by dispatch_job_id   order by created_at desc `,
              {replacements: [`%${req.query.filterVal}%`, `%${req.query.filterVal}%`, [req.query.hub_filter].toString().split(",")]})

              .catch(err => {

                  res.status(404).json({msg: "Error in checking dispatch."});
                  return false;

              });
      }else{

          let finalQS = Object.assign({}, reqQs, qs);


          finalQS.where = {
              ...finalQS.where,
              hub_id: [[req.query.hub_filter].toString().split(",")]
          };
          finalQS.include = {
              model: dispatchJobDetailModel,
              required: true,
              where: {
                  status:15
              }
          };
          console.log('finalQS:',finalQS);

          const result = await dispatchJobModel.findAndCountAll(
              finalQS,
              {
                  raw: true
              });

          if (!result) {
              return res
                  .status(401)
                  .json({ msg: "No records found", rows: [], count: 0 });
          } else {

              console.log(' result', result);
              //push object to its detail

              result.rows.forEach(row => {
                  dj_list.push(row.dispatch_job_id);
              });

              qs.where = {
                  dispatch_job_id:dj_list
              };
              const result1 = await viewDispatchAdvanceBookModel.findAndCountAll({
                  where: {dispatch_job_id: dj_list},
                  order: [["created_at", "DESC"]]
              }, {
                  raw: true
              });
              if (!result1) {
                  return res
                      .status(401)
                      .json({msg: "No records found", rows: [], count: 0});
              }
              //console.log('dispatch_details result', result1);

              result.rows.forEach(row => {
                  row.dataValues['details'] = [];
                  result1.rows.forEach(d => {

                      if (row.dataValues.dispatch_job_id === d.dispatch_job_id) {
                          row.dataValues['details'].push(d);
                      }

                  });

              });


              return res.status(200).json(result);
          }


      }
      //get ids and select dispatch
      // console.log('dispatch_details', dispatch_details);

      dispatch_details.forEach(row => {
          row.forEach(item => {
              //  //("order ID:",row.order_id,item.product_id)
              dj_list.push(item.dispatch_job_id);
          });
      });

      qs.where = {
          dispatch_job_id:dj_list
      };


      //const finalQS = _.union({}, reqQs,qs);
      let finalQS = Object.assign({}, reqQs, qs);
      const result = await dispatchJobModel.findAndCountAll(
          finalQS,
          {
              raw: true
          });
      if (!result) {
          return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
      } else {

          //console.log('dispatch_details job result', result);
          //push object to its detail
          const result1 = await viewDispatchAdvanceBookModel.findAndCountAll({
              where: {dispatch_job_id: dj_list},
              order: [["created_at", "DESC"]]
          }, {
              raw: true
          });
          if (!result1) {
              return res
                  .status(401)
                  .json({msg: "No records found", rows: [], count: 0});
          }
          //console.log('dispatch_details result', result1);

          result.rows.forEach(row => {
              row.dataValues['details'] = [];
              result1.rows.forEach(d => {

                  if (row.dataValues.dispatch_job_id === d.dispatch_job_id) {
                      row.dataValues['details'].push(d);
                  }

              });

          });


          return res.status(200).json(result);
      }




    },
  advanceBookingEx: async (req, res) => {
    // console.log("\n\n\n\n\n\n\n\nREQ QUERY >>>",req.query,"\n\n\n\n\n\n\n\n\n\n\n")

    const reqQs = queryStringToSQLQuery(req);

    const filterDate = req.query.deliveryDate
    ? {
      status: [15],
        delivery_date: req.query.deliveryDate,
        hub_id:[req.query.hub_filter].toString().split(",")
      }
    : {status: [15], hub_id:[req.query.hub_filter].toString().split(",")};

    let qs = {
      where: { status: [15] },
      distinct: true,
      attributes: dispatchJobModel.selectable,
        // attributes: [ ...dispatchJobModel.selectable,
        //     [db.sequelize.literal('(select CONCAT(first_name,\' \',last_name) from user  where user.user_id =  dispatch_job.status_id=1)'), 'open_ticket']
        // ],
      include: [
        {
          model: viewDispatchJobDetailModel,
          //attributes: viewDispatchJobDetailModel.selectable,
            attributes: [ ...viewDispatchJobDetailModel.selectable,
                [db.sequelize.literal('(select count(ticket.ticket_id) from ticket  where ticket.order_id = `view_dispatch_job_detail`.order_id and ticket.status_id=1)'), 'open_ticket']
            ],
          required: true,
          separate: true,
          //duplicate:false,
          where: filterDate,
          order: [["delivery_date", "ASC"], ["delivery_time", "ASC"]]
        }
      ],
      order: [["created_at", "DESC"]]
    };

    try {
      if (req.query.filterVal) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        console.log(req.query.filterVal);
        const filterRes = await viewDispatchJobDetailModel
          .findAll({
            where: {
              status: [15],
              [Op.or]: [
                {
                  shopify_order_name: { [Op.like]: `%${req.query.filterVal}%` }
                }
              ]
            },
            raw: true
          })
          .catch(err => console.log(err, "ERROR IN FINDING tracking no"));
  
        if (filterRes.length) {
          //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
          console.log("SHOPIFY ORDER NAME", filterRes);
          let dispatchId = filterRes.map(item => item.dispatch_job_id);
          qs.where = { status: [15], dispatch_job_id: dispatchId };
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        } else {
          console.log("TRACKING NO");
          qs.where = {
            status: [15],
            tracking_no: { [Op.like]: `%${req.query.filterVal}%` }
          };
  
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        }
      } 

      else if (req.query.payment_method) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        console.log(req.query.payment_method);
        const filterRes = await viewDispatchJobDetailModel
          .findAll({
            where: {
              status: [15],
              [Op.or]: [
                {
                  payment_method: { [Op.like]: `%${req.query.payment_method}%` }
                }
              ]
            },
            raw: true
          })
          .catch(err => console.log(err, "ERROR IN FINDING tracking no"));
  
          //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
          console.log("SHOPIFY ORDER NAME", filterRes);
          let dispatchId = filterRes.map(item => item.dispatch_job_id);
          qs.where = { status: [15], dispatch_job_id: dispatchId };
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
      } 

      //const finalQS = _.union({}, reqQs,qs);
      const finalQS = Object.assign({}, reqQs, qs);

      if (req.query.hasOwnProperty("deliveryTime")) {
        if (req.query.deliveryTime) {
          finalQS.include[0]["where"] = _.merge(
            {
              delivery_time: { [Op.like]: `%${req.query.deliveryTime}%` }
            },
            filterDate
          );
        }
      }

      console.log("finalQS filter:", finalQS);

      // let noPatination = _.clone(finalQS);
      // //remarks do not use findAndCountAll
      // delete noPatination.page;
      // delete noPatination.pageSize;
      //
      //
      // const resCount = await dispatchJobModel.count({...qs, distinct:true});

      const result = await dispatchJobModel.findAndCountAll(finalQS, {
        raw: true
      });
      //const result = await dispatchJobModel.findAll(finalQS, {raw:true});

      if (!result) {
        res.status(401).json({ msg: "No records found", rows: [], count: 0 });
      } else {
        // res.status(200).json({count: resCount, rows:result});
        console.log("Dispatch Controller advance booking job", result);
        res.status(200).json(result);
      }
    } catch (err) {
      console.log("Dispatch Controller advance booking job", err);
      res.status(400).json({ msg: "Unable to process request" });
    }
  },
  history: async (req, res) => {

        let reqQs = queryStringToSQLQuery(req);
        let qs = {

            order: [["created_at", "DESC"]]
        };
        let dispatch_details = null;
        //check filters
        let payment_method_where = '';
        if (req.query.payment_method) {
            let mop = orderModel.payment_method.filter( x => x.value === req.query.payment_method );
            if(mop){
                payment_method_where = ` and payment_id = ${mop[0].id}`;
            }

        }


        if (req.query.filterVal) {
            //query details and filter

            dispatch_details = await db.sequelize.query(
                `Select dispatch_job_id from view_dispatch_history where (shopify_order_name like ? or tracking_no like ? ) ${payment_method_where} and hub_id in (?) group by dispatch_job_id   order by created_at desc limit 500 `,
                {replacements: [`%${req.query.filterVal}%`, `%${req.query.filterVal}%`, [req.query.hub_filter].toString().split(",")]})

                .catch(err => {

                    res.status(404).json({msg: "Error in checking dispatch."});
                    return false;

                });
        }else{
            dispatch_details = await db.sequelize.query(
                `Select dispatch_job_id from view_dispatch_history where  hub_id in (?)  ${payment_method_where}  group by dispatch_job_id  order by created_at desc limit 500`,
                {replacements: [[req.query.hub_filter].toString().split(",")]})

                .catch(err => {

                    res.status(404).json({msg: "Error in checking dispatch."});
                    return false;

                });

        }
        //get ids and select dispatch
        // console.log('dispatch_details', dispatch_details);
        const dj_list = [];
        dispatch_details.forEach(row => {
            row.forEach(item => {
                //  //("order ID:",row.order_id,item.product_id)
                dj_list.push(item.dispatch_job_id);
            });
        });

        qs.where = {
            dispatch_job_id:dj_list,

        };

        if (req.query.riderFilter) {
            qs.where = {
                ...qs.where,
                rider_id:req.query.riderFilter,

            };
        }


        //const finalQS = _.union({}, reqQs,qs);
        let finalQS = Object.assign({}, reqQs, qs);
        const result = await dispatchJobModel.findAndCountAll(
            finalQS,
            {
                raw: true
            });
        if (!result) {
            return res
                .status(401)
                .json({ msg: "No records found", rows: [], count: 0 });
        } else {

            //console.log('dispatch_details job result', result);
            //push object to its detail
            const result1 = await viewDispatchHistoryModel.findAndCountAll({
                where: {dispatch_job_id: dj_list},
                order: [["created_at", "DESC"]]
            }, {
                raw: true
            });
            if (!result1) {
                return res
                    .status(401)
                    .json({msg: "No records found", rows: [], count: 0});
            }
            //console.log('dispatch_details result', result1);

            result.rows.forEach(row => {
                row.dataValues['details'] = [];
                result1.rows.forEach(d => {

                    if (row.dataValues.dispatch_job_id === d.dispatch_job_id) {
                        row.dataValues['details'].push(d);
                    }

                });

            });


            return res.status(200).json(result);
        }




    },
  historyEx: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req);

    if(!req.query.hub_filter){
      return;
    }

    let qs = {
      where: { status: [10, 11, 13, 17] },
      distinct: true,
      //attributes: dispatchJobModel.selectable,
      include: [
        {
          model: viewDispatchJobDetailModel,
          attributes: viewDispatchJobDetailModel.selectable,
          required: true,
          //duplicate:false,
          order: [["updated_at", "DESC"]],
          where: { status: [10, 11, 13, 16, 17], hub_id:[req.query.hub_filter].toString().split(",") }
        }
      ],
        order: [

            ["updated_at","DESC"],
            ["created_at", "DESC"]
        ]

    };

    try {
      if (req.query.filterVal) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        console.log(req.query.filterVal);
        const filterRes = await viewDispatchJobDetailModel
          .findAll({
            where: {
              status: [10, 11, 13, 16, 17],
              [Op.or]: [
                {
                  shopify_order_name: { [Op.like]: `%${req.query.filterVal}%` }
                }
              ]
            },
            raw: true
          })
          .catch(err => console.log(err, "ERROR IN FINDING tracking no"));
  
        if (filterRes.length) {
          //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
          console.log("SHOPIFY ORDER NAME", filterRes);
          let dispatchId = filterRes.map(item => item.dispatch_job_id);
          qs.where = { status: [10, 11, 13, 16, 17], dispatch_job_id: dispatchId };
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        } else {
          console.log("TRACKING NO");
          qs.where = {
            status: [10, 11, 13, 16, 17],
            tracking_no: { [Op.like]: `%${req.query.filterVal}%` }
          };
  
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        }
      } 

      else if (req.query.payment_method) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        console.log(req.query.payment_method);
        const filterRes = await viewDispatchJobDetailModel
          .findAll({
            where: {
              status: [10, 11, 13, 16, 17],
              [Op.or]: [
                {
                  payment_method: { [Op.like]: `%${req.query.payment_method}%` }
                }
              ]
            },
            raw: true
          })
          .catch(err => console.log(err, "ERROR IN FINDING tracking no"));
  
        if (filterRes.length) {
          //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
          console.log("SHOPIFY ORDER NAME", filterRes);
          let dispatchId = filterRes.map(item => item.dispatch_job_id);
          qs.where = { status: [10, 11, 13, 16, 17], dispatch_job_id: dispatchId };
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        } else {
          console.log("TRACKING NO");
          qs.where = {
            status: [10, 11, 13, 16, 17],
            tracking_no: { [Op.like]: `%${req.query.filterVal}%` }
          };
  
          //const finalQS = _.union({}, reqQs,qs);
          const finalQS = Object.assign({}, reqQs, qs);
  
          console.log("finalQS filter:", finalQS);
          const result = await dispatchJobModel.findAndCountAll(finalQS, {
            raw: true
          });
  
          if (!result) {
            return res
              .status(401)
              .json({ msg: "No records found", rows: [], count: 0 });
          } else {
            return res.status(200).json(result);
          }
        }
      } 

      else{
        if(req.query.riderFilter){
          qs.where = { status: [10, 11, 13, 16, 17], rider_id: req.query.riderFilter };
        }

           //const finalQS = _.union({}, reqQs,qs);
      const finalQS = Object.assign(reqQs, qs);

      console.log("finalQS filter:", finalQS);

      // let noPatination = _.clone(finalQS);
      // //remarks do not use findAndCountAll
      // delete noPatination.page;
      // delete noPatination.pageSize;
      //
      //
      // const resCount = await dispatchJobModel.count({...qs, distinct:true});

      const result = await dispatchJobModel.findAndCountAll(finalQS, {
        raw: true
      });
      //const result = await dispatchJobModel.findAll(finalQS, {raw:true});

      if (!result) {
        res.status(401).json({ msg: "No records found", rows: [], count: 0 });
      } else {
        // res.status(200).json({count: resCount, rows:result});
        console.log("Dispatch Controller advance booking job", result);
        res.status(200).json(result);
      }
      }
    } catch (err) {
      console.log("Dispatch Controller advance booking job", err);
      res.status(400).json({ msg: "Unable to process request" });
    }
  },
  getAll: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req);

    try {
      const qs = {
        //   where:{ status:[10, 11, 13]},
        distinct: true,
        //attributes: dispatchJobModel.selectable,
        include: [
          {
            model: viewDispatchJobDetailModel,
            attributes: viewDispatchJobDetailModel.selectable,
            required: true,
            separate: true,
            //duplicate:false,
            order: [["updated_at", "DESC"]]
            //   where:{ status:[10, 11, 13]},
          }
        ]
      };

      //const finalQS = _.union({}, reqQs,qs);
      const finalQS = Object.assign({}, reqQs, qs);

      console.log("finalQS filter:", finalQS);

      // let noPatination = _.clone(finalQS);
      // //remarks do not use findAndCountAll
      // delete noPatination.page;
      // delete noPatination.pageSize;
      //
      //
      // const resCount = await dispatchJobModel.count({...qs, distinct:true});

      const result = await dispatchJobModel.findAndCountAll(finalQS, {
        raw: true
      });
      //const result = await dispatchJobModel.findAll(finalQS, {raw:true});

      if (!result) {
        res.status(401).json({ msg: "No records found", rows: [], count: 0 });
      } else {
        // res.status(200).json({count: resCount, rows:result});
        console.log("Dispatch Controller advance booking job", result);
        res.status(200).json(result);
      }
    } catch (err) {
      console.log("Dispatch Controller advance booking job", err);
      res.status(400).json({ msg: "Unable to process request" });
    }
  },
  intransitJob: async (req, res) => {

        let reqQs = queryStringToSQLQuery(req);
        let qs = {

            order: [["created_at", "DESC"]]
        };
        let dispatch_details = null;
        //check filters
      const dj_list = [];
      let payment_method_where = '';
      if (req.query.payment_method) {
          let mop = orderModel.payment_method.filter( x => x.value === req.query.payment_method );
          if(mop){
              payment_method_where = ` and payment_id = ${mop[0].id}`;
          }

      }


      if (req.query.filterVal) {
          //query details and filter

          dispatch_details = await db.sequelize.query(
              `Select dispatch_job_id from view_dispatch_for_delivery where (shopify_order_name like ? or tracking_no like ? ) ${payment_method_where} and hub_id in (?) group by dispatch_job_id   order by created_at desc limit 500`,
              {replacements: [`%${req.query.filterVal}%`, `%${req.query.filterVal}%`, [req.query.hub_filter].toString().split(",")]})

              .catch(err => {

                  res.status(404).json({msg: "Error in checking dispatch."});
                  return false;

              });
      }else{
          let finalQS = Object.assign({}, reqQs, qs);


          finalQS.where = {
              ...finalQS.where,
              hub_id: [[req.query.hub_filter].toString().split(",")]
          };
          console.log('finalQS:',finalQS);

          const result = await dispatchJobModel.findAndCountAll(
              finalQS,
              {
                  raw: true
              });
          if (!result) {
              return res
                  .status(401)
                  .json({ msg: "No records found", rows: [], count: 0 });
          } else {

              console.log(' result', result);
              //push object to its detail

              result.rows.forEach(row => {
                  dj_list.push(row.dispatch_job_id);
              });

              qs.where = {
                  dispatch_job_id:dj_list
              };
              const result1 = await viewDispatchForDeliveryModel.findAndCountAll({
                  where: {dispatch_job_id: dj_list},
                  order: [["created_at", "DESC"]]
              }, {
                  raw: true
              });
              if (!result1) {
                  return res
                      .status(401)
                      .json({msg: "No records found", rows: [], count: 0});
              }
              // console.log('dispatch_details result1', result);

              result.rows.forEach(row => {
                  row.dataValues['details'] = [];
                  result1.rows.forEach(d => {

                      if (row.dataValues.dispatch_job_id === d.dispatch_job_id) {
                          row.dataValues['details'].push(d);
                      }

                  });

              });
              // console.log("here is the result",result.rows)
              
              let filtered_result = {
                count:result.rows.filter(r=> r.dataValues.details.length > 0 ).length,
                rows: result.rows.filter(r=> r.dataValues.details.length > 0 )
              }
              
              console.log("here is the filtered result!:",filtered_result)

              return res.status(200).json(result);
          }

      }
        //get ids and select dispatch
        // console.log('dispatch_details', dispatch_details);

        dispatch_details.forEach(row => {
            row.forEach(item => {
                //  //("order ID:",row.order_id,item.product_id)
                dj_list.push(item.dispatch_job_id);
            });
        });

        qs.where = {
            dispatch_job_id:dj_list,

        };

      if (req.query.riderFilter) {
          qs.where = {
              ...qs.where,
              rider_id:req.query.riderFilter,

          };
      }


        //const finalQS = _.union({}, reqQs,qs);
        let finalQS = Object.assign({}, reqQs, qs);
        const result = await dispatchJobModel.findAndCountAll(
            finalQS,
            {
                raw: true
            });
        if (!result) {
            return res
                .status(401)
                .json({ msg: "No records found", rows: [], count: 0 });
        } else {

            //console.log('dispatch_details job result', result);
            //push object to its detail
            const result1 = await viewDispatchForDeliveryModel.findAndCountAll({
                where: {dispatch_job_id: dj_list},
                order: [["created_at", "DESC"]]
            }, {
                raw: true
            });
            if (!result1) {
                return res
                    .status(401)
                    .json({msg: "No records found", rows: [], count: 0});
            }
            
            // console.log('dispatch_details result1', result1);

            result.rows.forEach(row => {
                row.dataValues['details'] = [];
                result1.rows.forEach(d => {
               
                    if (row.dataValues.dispatch_job_id === d.dispatch_job_id) {
                      
                        row.dataValues['details'].push(d);
                    }

                });

            });

            let filtered_result = {
              count:result.rows.filter(r=> r.dataValues.details.length > 0 ).length,
              rows: result.rows.filter(r=> r.dataValues.details.length > 0 )
            }

            console.log("Filtered resul!!!!!!!!!",filtered_result);

            return res.status(200).json(result);
        }




    },
  intransitJobEx: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req);

    if(!req.query.hub_filter){
      return;
    }

    let qs = {
      where: { status: [9] },
      distinct: true,
      //attributes: dispatchJobModel.selectable,
      include: [
        {
          model: viewDispatchJobDetailModel,
          attributes: viewDispatchJobDetailModel.selectable,
          required: true,
          seperate: true,
          where:{
            hub_id:[req.query.hub_filter].toString().split(",")
          }
          //duplicate:false,
        }
      ],
      order: [["created_at", "desc"],["updated_at", "desc"]]
    };
    console.log('req.query',req.query);
    try {
      if (req.query.filterVal) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        console.log(req.query.filterVal);
        if(req.query.filterVal.length > 1){
            const filterRes = await viewDispatchJobDetailModel
                .findAll({
                    where: {
                        [Op.or]: [
                            {
                                shopify_order_name: { [Op.like]: `%${req.query.filterVal}%` }
                            }
                        ]
                    },
                    raw: true
                })
                .catch(err => console.log(err, "ERROR IN FINDING tracking no"));

            if (filterRes.length) {
                //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
                console.log("SHOPIFY ORDER NAME", filterRes);
                let dispatchId = filterRes.map(item => item.dispatch_job_id);
                qs.where = { status: [9], dispatch_job_id: dispatchId };
                //const finalQS = _.union({}, reqQs,qs);
                const finalQS = Object.assign({}, reqQs, qs);

                console.log("finalQS filter:", finalQS);
                const result1 = await dispatchJobModel.findAndCountAll(finalQS, {
                    raw: true
                });

                if (!result1) {
                    return res
                        .status(401)
                        .json({ msg: "No records found", rows: [], count: 0 });
                } else {
                    return res.status(200).json(result1);
                }
            } else {
                console.log("TRACKING NO");
                qs.where = {
                    status: [9],
                    tracking_no: { [Op.like]: `%${req.query.filterVal}%` }
                };

                //const finalQS = _.union({}, reqQs,qs);
                const finalQS = Object.assign({}, reqQs, qs);

                console.log("finalQS filter:", finalQS);
                const result = await dispatchJobModel.findAndCountAll(finalQS, {
                    raw: true
                });

                if (!result) {
                    return res
                        .status(401)
                        .json({ msg: "No records found", rows: [], count: 0 });
                } else {
                    return res.status(200).json(result);
                }
            }
        }
      } 

      else if (req.query.payment_method) {
        //CHECK IF FILTER VALUE MATCH SHOPIFY NUMBER IF NOT USE AS TRACKING NUMBER
        console.log(req.query.payment_method);
        const filterRes = await viewDispatchJobDetailModel
                .findAll({
                    where: {
                        [Op.or]: [
                            {
                                payment_method: { [Op.like]: `%${req.query.payment_method}%` }
                            }
                        ]
                    },
                    raw: true
                })
                .catch(err => console.log(err, "ERROR IN FINDING tracking no"));

                //NO FS NUMBER MATCHED SO WE WILL USE IT FOR TRACKING NO
                console.log("SHOPIFY ORDER NAME", filterRes);
                let dispatchId = filterRes.map(item => item.dispatch_job_id);
                qs.where = { status: [9], dispatch_job_id: dispatchId };
                //const finalQS = _.union({}, reqQs,qs);
                const finalQS = Object.assign({}, reqQs, qs);

                console.log("finalQS filter:", finalQS);
                const result1 = await dispatchJobModel.findAndCountAll(finalQS, {
                    raw: true
                });

                if (!result1) {
                    return res
                        .status(401)
                        .json({ msg: "No records found", rows: [], count: 0 });
                } else {
                    return res.status(200).json(result1);
                }
      }
      
      else{
  
        if(req.query.riderFilter){
          qs.where = { status: [9], rider_id: req.query.riderFilter };
        }
        //const finalQS = _.union({}, reqQs,qs);
        const finalQS = Object.assign({}, reqQs, qs);

        console.log("finalQS filter:", finalQS);

        // let noPatination = _.clone(finalQS);
        // //remarks do not use findAndCountAll
        // delete noPatination.page;
        // delete noPatination.pageSize;
        //
        //
        // const resCount = await dispatchJobModel.count({...qs, distinct:true});

        const result2 = await dispatchJobModel.findAndCountAll(finalQS, {
          raw: true
        });

        
        //const result = await dispatchJobModel.findAll(finalQS, {raw:true});

        if (!result2) {
          res.status(401).json({ msg: "No records found", rows: [], count: 0 });
        } else {
          // res.status(200).json({count: resCount, rows:result});
          console.log("Dispatch Controller advance booking job", result2);
          res.status(200).json(result2);
        }
      }

    } catch (err) {
      console.log("Dispatch Controller advance booking job", err);
      res.status(400).json({ msg: "Unable to process request" });
    }
  },
  shipJob: async (req, res) => {
    const dispatch_job_id = req.params.dispatch_job_id;

    console.log('shipJob dispatch_job_id', dispatch_job_id);

    if (!dispatch_job_id) {
      return res.status(404).json({ msg: "Unable find record for update" });
    }
    console.log("dispatch_job_id = ", dispatch_job_id);

    // check if CPU is not yet done, check if QC is not yet done

    const jobQuery = 'Select job_rider.job_rider_id from job_rider where job_rider.status <> 10 and job_rider.order_id in ' +
        '(Select djd.order_id from dispatch_job_detail djd inner join dispatch_job dj on djd.dispatch_job_id = dj.dispatch_job_id ' +
        ' inner join `order` o on djd.order_id = o.order_id and o.payment_id = 3 ' +
        ' where  djd.job_item_type =\'delivery\' and  djd.status = 8 and dj.dispatch_job_id = :dispatch_job_id )';
    let checking = await db.sequelize.query(jobQuery,
          {replacements: { dispatch_job_id:dispatch_job_id}, type: db.sequelize.QueryTypes.SELECT})
          .catch(err=>{

            console.log(err.message,`Error checking record ${dispatch_job_id}`);

              // return Promise.reject({
              //     status: 400,
              //     msg: "Error in checking CPU Job for this dispatch."
              // });


              res.status(404).json({ msg: "Error in checking CPU Job for this dispatch." });
              return false;

          });

    if (checking.length){

        // return Promise.reject({
        //     status: 400,
        //     msg: "Error, may be one of the Cash Pickup Order have not been collected. Please check the CPU Item.."
        // });
        res.status(404).json({ msg: "Error, may be one of the Cash Pickup Order have not been collected. Please check the CPU Item." });
        return false;

    }

      const QCQuery = 'Select `order`.order_id from `order` where `order`.quality_check = 0 and `order`.order_id in ' +
          '(Select djd.order_id from dispatch_job_detail djd inner join dispatch_job dj on djd.dispatch_job_id = dj.dispatch_job_id where djd.job_item_type =\'delivery\' and djd.status = 8 and dj.dispatch_job_id = :dispatch_job_id )';
       checking = await db.sequelize.query(QCQuery,
          {replacements: { dispatch_job_id:dispatch_job_id}, type: db.sequelize.QueryTypes.SELECT})
          .catch(err=>{

              console.log(err.message,`Error checking record ${dispatch_job_id}`);

              res.status(404).json({ msg: "Error in checking Quality status of this dispatch." });
              return false;

          });

      if (checking.length){

          res.status(400).json({ msg: "Error, may be one of the Order items have not passed Assembly or Quality check. Please check the dispatch Item." });
          return false;

      }






    // const dispatch_job_id = req.params.match.dispatch_job_id;
    const new_status = 9; //shipped

    try {
      //find
      const dj = await dispatchJobModel.findAll(
        {
          where: {
            dispatch_job_id: dispatch_job_id,
            status: { [Op.in]: [8] }
          }
        },
        { raw: true }
      );

      if (!dj) {
        return res.status(404).json({ msg: "Unable find record for update" });
      } else {
        console.log("dj result:", dj);

        if (!dj.length) {
          return res.status(404).json({ msg: "Unable find record for update" });
        }

        const djResult = await dispatchJobModel.update(
          { status: new_status },
          {
            where: {
              status: { [Op.ne]: new_status },
              dispatch_job_id
            }
          }
        );

        if (!djResult) {
          res.status(200).json({ msg: "No record was updated." });
        } else {
          const djd = await dispatchJobDetailModel.findAll({
            where: {
              dispatch_job_id,
              status:8
            }
          });

          if (!djd) {
            res.status(405).json({ msg: "No Job Details to update" });
          } else {
            let uResult = {};
            let jobids = [];
            let joblogs = [];
            let orderitemids = [];
            let orderitemlogs = [];
            let orderids = [];
            _.each(djd, (record, key) => {
              console.log("record:", record);



              if (record.job_item_type === "delivery") {
                  orderids.push(record.order_id);
                orderitemids.push(record.order_reference_id);
                orderitemlogs.push({
                  order_id: record.order_id,
                  order_item_id: record.order_reference_id,
                  user_id: req.user.user_id,
                  action: `Dispatch Job Tracking No: ${dj[0].tracking_no} was shipped.`,
                  action_id : 15,
                  data_changed : JSON.stringify({order_id : record.order_id, order_item_id : record.order_reference_id,
                    order_status_id : 9,tracking_no: dj[0].tracking_no})

                });
              } else if (record.job_item_type === "cash pickup") {
                jobids.push(record.order_reference_id);
                joblogs.push({
                  order_id: record.order_id,
                  order_item_id: record.order_reference_id,
                  user_id: req.user.user_id,
                  action: `CPU Job with Dispatch Job Tracking No: ${dj[0].tracking_no} was shipped.`,
                  action_id : 20,
                  data_changed : JSON.stringify({order_id : record.order_id, order_item_id : record.order_reference_id,
                    order_status_id : 9,tracking_no: dj[0].tracking_no})
                });
              }
            });
            // console.log('orderid', orderids);
            // console.log('orderiteid', orderitemids);
            // console.log('jobids', jobids);

            if (jobids.length) {
              const jrRes = await jobRiderModel.update(
                { status: 9 },
                {
                  where: {
                    job_rider_id: jobids
                  }
                }
              );
              if (!jrRes) {
                console.log("no job rider record updated");
              } else {
                console.log("job rider record updated", jrRes);
              }

              try {
                await orderHistoryModel.bulkCreate(joblogs);
              } catch (errorOHM) {
                console.log("error in creating order history log", errorOHM);
              }
            }
            if (orderitemids.length) {
              const oiRes = await orderItemModel.update(
                { order_item_status_id: 9 },
                {
                  where: {
                    order_id:   orderids,
                    order_item_status_id: { [Op.ne]: [13,14,16] }
                  }
                }
              );
              if (!oiRes) {
                console.log("no order item record updated");
              } else {
                console.log("order item record updated", oiRes);

                let orderRes = {};
                _.each(orderids, async (order_id, key) => {
                  orderRes = await db.sequelize.query(
                    " Update `order` set order_status_id=:new_status where order_id=:order_id and order_status_id=8 ",
                    {
                      replacements: {
                        order_id: order_id,
                        new_status: 9
                      }
                    }
                  );
                  if (!orderRes) {
                    console.log("update called false", orderRes);
                  } else {
                    console.log("update called true", orderRes);
                  }
                });
              }
              try {
                await orderHistoryModel.bulkCreate(orderitemlogs);
              } catch (errorOHM) {
                console.log("error in creating order history log", errorOHM);
              }
            }

            const djdRes = await dispatchJobDetailModel.update(
              { status: new_status },
              {
                where: {
                  dispatch_job_id,
                  status:8
                }
              }
            );
            if (!djdRes) {
              console.log("no dispatch job detail record updated");
            } else {
              console.log("dispatch job detail record updated", djdRes);
            }
          }

          //order
          //log result

          await req.body.dispatch_data.details.forEach( async (ship_order,key)=>{

            if(ship_order.job_item_type == 'delivery'){
              const order_address = await db.sequelize.query('select * from order_address where order_address_id = ? ',
                {replacements: [ship_order.order_address_id], type: db.sequelize.QueryTypes.SELECT})
                .catch(err=>{
      
    
                    // return Promise.reject({
                    //     status: 400,
                    //     msg: "Error in checking CPU Job for this dispatch."
                    // });
      
      
                    console.log({ msg: "Error in fetching address" });
      
                });

                const ship_city = order_address[0].shipping_city || "";
                const ship_brgy = order_address[0].shipping_address_1 || "";
                const ship_province = order_address[0].shipping_province || "";
                const ship_country = order_address[0].shipping_country || "";



              const delivery_address = `${ship_brgy} ${ship_city} ${ship_province} ${ship_country}`
             
              console.log('delivery', delivery_address );
              if(!req.body.dispatch_data.batch_type){
              axios.post('https://events.sendpulse.com/events/id/53ca775a2aee464480c1bfe2f01a27be/7065626', {
                email: process.env.EMAIL_ENV === 'production' ? ship_order.customer_email : process.env.EMAIL_TO_DEVELOPMENT,
                phone: process.env.EMAIL_ENV === 'production' ? ship_order.shipping_phone : process.env.EMAIL_TO_DEVELOPMENT,
                firstName: ship_order.shipping_name,
                orderNumber: ship_order.shopify_order_name,
                hub_id : ship_order.hub_id,
                rider_name : req.body.dispatch_data.rider_first_name + ' ' + req.body.dispatch_data.rider_last_name,
                rider_number : req.body.dispatch_data.rider_mobile_number,
                delivery_time : ship_order.delivery_time,
                delivery_address : delivery_address
              })
                .then(function (response) {
                  console.log('email supppose to be sent');
                  orderHistoryModel.create({
                    order_id: ship_order.order_id,
                    user_id: 1,
                    action_id: 40,
                    action: `Order message ("Your order has been shipped") has been sent`,

                  });

                  // order_sent.push(row.shopify_order_name);
                  // console.log(util.inspect(order_sent, { maxArrayLength: null }))
                })
                .catch(function (error) {
                  console.log('error encoutered');
                  if (retry < 5) {
                    retry++
                    setTimeout(() => {
                      console.log('Email retry', ship_order.shopify_order_name, retry);
                      sendMail(url, row, retry);
                    }, 2000)
                  } else {
                    orderHistoryModel.create({
                      order_id: ship_order.order_id,
                      user_id: 1,
                      action_id: 41,
                      action: `Order message ("Your order has been shipped") could not been sent`,

                    });

                    // order_not_sent.push(row.shopify_order_name);
                    // console.log(util.inspect(order_not_sent, { maxArrayLength: null }))
                    // console.log('not sent')

                  }

                });
              }else{
                if(req.body.dispatch_data.batch_type.toLowerCase() != "3pl"){
                  axios.post('https://events.sendpulse.com/events/id/53ca775a2aee464480c1bfe2f01a27be/7065626', {
                  email: process.env.EMAIL_ENV === 'production' ? ship_order.customer_email : process.env.EMAIL_TO_DEVELOPMENT,
                  phone: process.env.EMAIL_ENV === 'production' ? ship_order.shipping_phone : process.env.EMAIL_TO_DEVELOPMENT,
                  firstName: ship_order.shipping_name,
                  orderNumber: ship_order.shopify_order_name,
                  hub_id : ship_order.hub_id,
                  rider_name : req.body.dispatch_data.rider_first_name + ' ' + req.body.dispatch_data.rider_last_name,
                  rider_number : req.body.dispatch_data.rider_mobile_number,
                  delivery_time : ship_order.delivery_time,
                  delivery_address : delivery_address
                })
                  .then(function (response) {
                    console.log('email supppose to be sent');
                    orderHistoryModel.create({
                      order_id: ship_order.order_id,
                      user_id: 1,
                      action_id: 40,
                      action: `Order message ("Your order has been shipped") has been sent`,

                    });

                    // order_sent.push(row.shopify_order_name);
                    // console.log(util.inspect(order_sent, { maxArrayLength: null }))
                  })
                  .catch(function (error) {
                    console.log('error encoutered');
                    if (retry < 5) {
                      retry++
                      setTimeout(() => {
                        console.log('Email retry', ship_order.shopify_order_name, retry);
                        sendMail(url, row, retry);
                      }, 2000)
                    } else {
                      orderHistoryModel.create({
                        order_id: ship_order.order_id,
                        user_id: 1,
                        action_id: 41,
                        action: `Order message ("Your order has been shipped") could not been sent`,

                      });

                      // order_not_sent.push(row.shopify_order_name);
                      // console.log(util.inspect(order_not_sent, { maxArrayLength: null }))
                      // console.log('not sent')

                    }

                  });
                }else{
                  console.clear();
                  console.log("3PL ang batch type wag natin email");
                }
              }
            }

          })
          res.status(200).json({ msg: "Dispatch Job tag as shipped." });
        }
      }
      //update
    } catch (err) {
      //log result
      console.log("error on cancel dispatch", err);
      res.status(405).json({ msg: "Unable to process request." });
    }
  },
  shipJobVD: async (req, res) => {
    const dispatch_job_id = req.params.dispatch_job_id;


    if (!dispatch_job_id) {
      return res.status(404).json({ msg: "Unable find record for update" });
    }
    console.log("dispatch_job_id = ", dispatch_job_id);

    // check if CPU is not yet done, check if QC is not yet done

    const jobQuery = 'Select job_rider.job_rider_id from job_rider where job_rider.status <> 10 and job_rider.order_id in ' +
        '(Select djd.order_id from dispatch_job_detail djd inner join dispatch_job dj on djd.dispatch_job_id = dj.dispatch_job_id ' +
        ' inner join `order` o on djd.order_id = o.order_id and o.payment_id = 3 ' +
        ' where  djd.job_item_type =\'delivery\' and  djd.status IN (15, 8) and dj.dispatch_job_id = :dispatch_job_id )';
    let checking = await db.sequelize.query(jobQuery,
          {replacements: { dispatch_job_id:dispatch_job_id}, type: db.sequelize.QueryTypes.SELECT})
          .catch(err=>{

            console.log(err.message,`Error checking record ${dispatch_job_id}`);

              // return Promise.reject({
              //     status: 400,
              //     msg: "Error in checking CPU Job for this dispatch."
              // });


              res.status(404).json({ msg: "Error in checking CPU Job for this dispatch." });
              return false;

          });

    if (checking.length){

        // return Promise.reject({
        //     status: 400,
        //     msg: "Error, may be one of the Cash Pickup Order have not been collected. Please check the CPU Item.."
        // });
        res.status(404).json({ msg: "Error, may be one of the Cash Pickup Order have not been collected. Please check the CPU Item." });
        return false;

    }

      // const QCQuery = 'Select `order`.order_id from `order` where `order`.quality_check = 0 and `order`.order_id in ' +
      //     '(Select djd.order_id from dispatch_job_detail djd inner join dispatch_job dj on djd.dispatch_job_id = dj.dispatch_job_id where djd.job_item_type =\'delivery\' and djd.status = (15, 8) and dj.dispatch_job_id = :dispatch_job_id )';
      //  checking = await db.sequelize.query(QCQuery,
      //     {replacements: { dispatch_job_id:dispatch_job_id}, type: db.sequelize.QueryTypes.SELECT})
      //     .catch(err=>{

      //         console.log(err.message,`Error checking record ${dispatch_job_id}`);

      //         res.status(404).json({ msg: "Error in checking Quality status of this dispatch." });
      //         return false;

      //     });

      // if (checking.length){

      //     res.status(400).json({ msg: "Error, may be one of the Order items have not passed Assembly or Quality check. Please check the dispatch Item." });
      //     return false;

      // }






    // const dispatch_job_id = req.params.match.dispatch_job_id;
    const new_status = 9; //shipped

    try {
      //find
      const dj = await dispatchJobModel.findAll(
        {
          where: {
            dispatch_job_id: dispatch_job_id,
            status: { [Op.in]: [15, 8] }
          }
        },
        { raw: true }
      );

      if (!dj) {
        return res.status(404).json({ msg: "Unable find record for update" });
      } else {
        console.log("dj result:", dj);

        if (!dj.length) {
          return res.status(404).json({ msg: "Unable find record for update" });
        }

        const djResult = await dispatchJobModel.update(
          { status: new_status },
          {
            where: {
              status: { [Op.ne]: new_status },
              dispatch_job_id
            }
          }
        );

        if (!djResult) {
          res.status(200).json({ msg: "No record was updated." });
        } else {
          const djd = await dispatchJobDetailModel.findAll({
            where: {
              dispatch_job_id,
              status: [15,8]
            }
          });

          if (!djd) {
            res.status(405).json({ msg: "No Job Details to update" });
          } else {
            let uResult = {};
            let jobids = [];
            let joblogs = [];
            let orderitemids = [];
            let orderitemlogs = [];
            let orderids = [];
            _.each(djd, (record, key) => {
              console.log("record:", record);



              if (record.job_item_type === "delivery") {
                  orderids.push(record.order_id);
                orderitemids.push(record.order_reference_id);
                orderitemlogs.push({
                  order_id: record.order_id,
                  order_item_id: record.order_reference_id,
                  user_id: req.user.user_id,
                  action: `Dispatch Job Tracking No: ${dj[0].tracking_no} was shipped.`,
                  action_id : 15,
                  data_changed : JSON.stringify({order_id : record.order_id, order_item_id : record.order_reference_id,
                    order_status_id : 9,tracking_no: dj[0].tracking_no})

                });
              } else if (record.job_item_type === "cash pickup") {
                jobids.push(record.order_reference_id);
                joblogs.push({
                  order_id: record.order_id,
                  order_item_id: record.order_reference_id,
                  user_id: req.user.user_id,
                  action: `CPU Job with Dispatch Job Tracking No: ${dj[0].tracking_no} was shipped.`,
                  action_id : 20,
                  data_changed : JSON.stringify({order_id : record.order_id, order_item_id : record.order_reference_id,
                    order_status_id : 9,tracking_no: dj[0].tracking_no})
                });
              }
            });
            // console.log('orderid', orderids);
            // console.log('orderiteid', orderitemids);
            // console.log('jobids', jobids);

            if (jobids.length) {
              const jrRes = await jobRiderModel.update(
                { status: 9 },
                {
                  where: {
                    job_rider_id: jobids
                  }
                }
              );
              if (!jrRes) {
                console.log("no job rider record updated");
              } else {
                console.log("job rider record updated", jrRes);
              }

              try {
                await orderHistoryModel.bulkCreate(joblogs);
              } catch (errorOHM) {
                console.log("error in creating order history log", errorOHM);
              }
            }
            if (orderitemids.length) {
              const oiRes = await orderItemModel.update(
                { order_item_status_id: 9 },
                {
                  where: {
                    order_id: orderids,
                    order_item_status_id: { [Op.notIn]:[9,13,14,11,12,10]}
                  }
                }
              );
              if (!oiRes) {
                console.log("no order item record updated");
              } else {
                console.log("order item record updated", oiRes);

                let orderRes = {};
                _.each(orderids, async (order_id, key) => {
                  orderRes = await db.sequelize.query(
                    " Update `order` set order_status_id=:new_status where order_id=:order_id and order_status_id=8 ",
                    {
                      replacements: {
                        order_id: order_id,
                        new_status: 9
                      }
                    }
                  );
                  if (!orderRes) {
                    console.log("update called false", orderRes);
                  } else {
                    console.log("update called true", orderRes);
                  }
                });
              }
              try {
                await orderHistoryModel.bulkCreate(orderitemlogs);
              } catch (errorOHM) {
                console.log("error in creating order history log", errorOHM);
              }
            }

            const djdRes = await dispatchJobDetailModel.update(
              { status: new_status },
              {
                where: {
                  dispatch_job_id,
                  status:[15, 8]
                }
              }
            );
            if (!djdRes) {
              console.log("no dispatch job detail record updated");
            } else {
              console.log("dispatch job detail record updated", djdRes);
            }
          }

          //order
          //log result
          // console.log("BATCH TYPEEE!!!!!!", req.body.dispatch_data.batch_type, "3pl", req.body.dispatch_data.batch_type != "3pl");
         
            console.log("OKAY I EMAIL NATIN SI TROPA");
            await req.body.dispatch_data.view_dispatch_job_details.forEach(async (ship_order,key)=>{

              if(ship_order.jobtype == 'delivery'){
                const order_address = await db.sequelize.query('select * from order_address where order_address_id = ? ',
                  {replacements: [ship_order.order_address_id], type: db.sequelize.QueryTypes.SELECT})
                  .catch(err=>{
        
      
                      // return Promise.reject({
                      //     status: 400,
                      //     msg: "Error in checking CPU Job for this dispatch."
                      // });
        
        
                      console.log({ msg: "Error in fetching address" });
        
                  });
  
                  const ship_city = order_address[0].shipping_city || "";
                  const ship_brgy = order_address[0].shipping_address_1 || "";
                  const ship_province = order_address[0].shipping_province || "";
                  const ship_country = order_address[0].shipping_country || "";
  
  
  
                const delivery_address = `${ship_brgy} ${ship_city} ${ship_province} ${ship_country}`
               
                console.log('delivery', delivery_address )

                if(!req.body.dispatch_data.batch_type){
                  console.clear();
                  console.log("WALANG BATCH TYPE EMAIL NATIN");
                  axios.post('https://events.sendpulse.com/events/id/53ca775a2aee464480c1bfe2f01a27be/7065626', {
                  email: process.env.EMAIL_ENV === 'production' ? ship_order.customer_email : process.env.EMAIL_TO_DEVELOPMENT,
                  phone: process.env.EMAIL_ENV === 'production' ? ship_order.customer_phone : process.env.EMAIL_TO_DEVELOPMENT,
                  firstName: ship_order.first_name,
                  orderNumber: ship_order.shopify_order_name,
                  hub_id : ship_order.hub_id,
                  rider_name : req.body.dispatch_data.rider_first_name + ' ' + req.body.dispatch_data.rider_last_name,
                  rider_number : req.body.dispatch_data.rider_mobile_number,
                  delivery_time : ship_order.delivery_time,
                  delivery_address : delivery_address
                })
                  .then(function (response) {
                    console.log('email supppose to be sent');
                    orderHistoryModel.create({
                      order_id: ship_order.order_id,
                      user_id: 1,
                      action_id: 40,
                      action: `Order message ("Your order has been shipped") has been sent`,
  
                    });
  
                    // order_sent.push(row.shopify_order_name);
                    // console.log(util.inspect(order_sent, { maxArrayLength: null }))
                  })
                  .catch(function (error) {
                    console.log('error encoutered');
                    if (retry < 5) {
                      retry++
                      setTimeout(() => {
                        console.log('Email retry', ship_order.shopify_order_name, retry);
                        sendMail(url, row, retry);
                      }, 2000)
                    } else {
                      orderHistoryModel.create({
                        order_id: ship_order.order_id,
                        user_id: 1,
                        action_id: 41,
                        action: `Order message ("Your order has been shipped") could not been sent`,
  
                      });
  
                      // order_not_sent.push(row.shopify_order_name);
                      // console.log(util.inspect(order_not_sent, { maxArrayLength: null }))
                      // console.log('not sent')
  
                    }
  
                  });
                }
                else{
                  if(req.body.dispatch_data.batch_type.toLowerCase() != "3pl"){
                    axios.post('https://events.sendpulse.com/events/id/53ca775a2aee464480c1bfe2f01a27be/7065626', {
                  email: process.env.EMAIL_ENV === 'production' ? ship_order.customer_email : process.env.EMAIL_TO_DEVELOPMENT,
                  phone: process.env.EMAIL_ENV === 'production' ? ship_order.customer_phone : process.env.EMAIL_TO_DEVELOPMENT,
                  firstName: ship_order.first_name,
                  orderNumber: ship_order.shopify_order_name,
                  hub_id : ship_order.hub_id,
                  rider_name : req.body.dispatch_data.rider_first_name + ' ' + req.body.dispatch_data.rider_last_name,
                  rider_number : req.body.dispatch_data.rider_mobile_number,
                  delivery_time : ship_order.delivery_time,
                  delivery_address : delivery_address
                })
                  .then(function (response) {
                    console.log('email supppose to be sent');
                    orderHistoryModel.create({
                      order_id: ship_order.order_id,
                      user_id: 1,
                      action_id: 40,
                      action: `Order message ("Your order has been shipped") has been sent`,
  
                    });
  
                    // order_sent.push(row.shopify_order_name);
                    // console.log(util.inspect(order_sent, { maxArrayLength: null }))
                  })
                  .catch(function (error) {
                    console.log('error encoutered');
                    if (retry < 5) {
                      retry++
                      setTimeout(() => {
                        console.log('Email retry', ship_order.shopify_order_name, retry);
                        sendMail(url, row, retry);
                      }, 2000)
                    } else {
                      orderHistoryModel.create({
                        order_id: ship_order.order_id,
                        user_id: 1,
                        action_id: 41,
                        action: `Order message ("Your order has been shipped") could not been sent`,
  
                      });
  
                      // order_not_sent.push(row.shopify_order_name);
                      // console.log(util.inspect(order_not_sent, { maxArrayLength: null }))
                      // console.log('not sent')
  
                    }
  
                  });
                  }
                  else{
                    console.clear();
                    console.log("3PL ANG BATCH TYPE WAG NATIN EMAIL");
                  }
                }
                
              }
  
            });
          
          res.status(200).json({ msg: "Dispatch Job tag as shipped." });
        }
      }
      //update
    } catch (err) {
      //log result
      console.log("error on cancel dispatch", err);
      res.status(405).json({ msg: "Unable to process request." });
    }
  },
  cancelJob: async (req, res) => {
    const dispatch_job_id = req.params.dispatch_job_id;

    if (!dispatch_job_id) {
      return res.status(404).json({ msg: "Unable find record for update" });
    }
    console.log("dispatch_job_id = ", dispatch_job_id);

    // const dispatch_job_id = req.params.match.dispatch_job_id;
    const new_status = 13; //shipped

    try {
      //find
      const dj = await dispatchJobModel.findAll(
        {
          where: {
            dispatch_job_id: dispatch_job_id,
            status: { [Op.in]: [8,15] }
          }
        },
        { raw: true }
      );

      if (!dj) {
        return res.status(404).json({ msg: "Unable find record for update" });
      } else {
        console.log("dj result:", dj);

        if (!dj.length) {
          return res.status(404).json({ msg: "Unable find record for update" });
        }

        const djResult = await dispatchJobModel.update(
          { status: new_status },
          {
            where: {
              status: { [Op.ne]: new_status },
              dispatch_job_id
            }
          }
        );

        if (!djResult) {
          res.status(200).json({ msg: "No record was updated." });
        } else {
          const djd = await dispatchJobDetailModel.findAll({
            where: {
              dispatch_job_id,
              status: { [Op.in]: [8,15] }
            }
          });

          if (!djd) {
            res.status(405).json({ msg: "No Job Details to update" });
          } else {
            let uResult = {};
            let jobids = [];
            let joblogs = [];
            let orderitemids = [];
            let orderitemjobs = [];
            let orderids = [];
            _.each(djd, (record, key) => {
              console.log("record:", record);

              orderids.push(record.order_id);

              if (record.job_item_type === "delivery") {
                orderitemids.push(record.order_reference_id);
                orderitemjobs.push({
                  order_id: record.order_id,
                  order_item_id: record.order_reference_id,
                  user_id: req.user.user_id,

                  action: `Dispatch Job ${dj[0].tracking_no} was cancelled.`,
                  action_id: 28,
                  data_changed : JSON.stringify({order_id : record.order_id, order_item_id : record.order_reference_id,
                    order_status_id : 7,tracking_no: dj[0].tracking_no})

                });
              } else if (record.job_item_type === "cash pickup") {
                jobids.push(record.order_reference_id);
                joblogs.push({
                  order_id: record.order_id,
                  order_item_id: record.order_reference_id,
                  user_id: req.user.user_id,
                  action: `CPU Job with Dispatch Job ${dj[0].tracking_no} was cancelled.`,
                  action_id: 28,
                  data_changed : JSON.stringify({order_id : record.order_id, order_item_id : record.order_reference_id,
                    order_status_id : 7,tracking_no: dj[0].tracking_no})
                });
              }
            });
            console.log("orderid", orderids);
            console.log("orderiteid", orderitemids);
            console.log("jobids", jobids);

            if (jobids.length) {
              const jrRes = await jobRiderModel.update(
                { status: 7 },
                {
                  where: {
                    job_rider_id: jobids,
                    status: { [Op.in]: [8,15] }
                  }
                }
              );
              if (!jrRes) {
                console.log("no job rider record updated");
              } else {
                console.log("job rider record updated", jrRes);
              }
              try {
                await orderHistoryModel.bulkCreate(joblogs);
              } catch (errorOHM) {
                console.log("error in creating order history log", errorOHM);
              }
            }
            if (orderitemids.length) {
              const oiRes = await orderItemModel.update(
                { order_item_status_id: 7 },
                {
                  where: {
                    //order_item_id: orderitemids,
                    order_id: orderids,
                    order_item_status_id: { [Op.in]: [8,15] }
                  }
                }
              );
              if (!oiRes) {
                console.log("no order item record updated");
              } else {
                console.log("order item record updated", oiRes);

                let orderRes = {};
                // _.each(orderids, async (order_id, key) => {
                //   orderRes = await db.sequelize.query(
                //     "CALL proc_update_order_status(:order_id, :new_status, :item_status)",
                //     {
                //       replacements: {
                //         order_id: order_id,
                //         new_status: 7,
                //         item_status: 7
                //       }
                //     }
                //   );
                //   if (!orderRes) {
                //     console.log("update called false", orderRes);
                //   } else {
                //     console.log("update called true", orderRes);
                //   }
                // });
              }

              try {
                await orderHistoryModel.bulkCreate(orderitemjobs);
              } catch (errorOHM) {
                console.log("error in creating order history log", errorOHM);
              }
            }
            if (orderids.length) {
              const oiRes = await orderModel.update(
                { order_status_id: 7 },
                {
                  where: {
                    order_id: orderids,
                    order_status_id: { [Op.in]: [8,15] }
                  }
                }
              );
              if (!oiRes) {
                console.log("no order  record updated");
              } else {
                console.log("order  record updated", oiRes);
              }
            }

            const djdRes = await dispatchJobDetailModel.update(
              { status: new_status },
              {
                where: {
                  dispatch_job_id
                }
              }
            );
            if (!djdRes) {
              console.log("no dispatch job detail record updated");
            } else {
              console.log("dispatch job detail record updated", djdRes);
            }
          }
          //order
          //log result
          res
            .status(200)
            .json({ msg: "Dispatch Job was successfully cancelled." });
        }
      }
      //update
    } catch (err) {
      //log result
      console.log("error on cancel dispatch", err);
      res.status(405).json({ msg: "Unable to process request." });
    }
  },
  createBCAdvance: async (req, res) => {
    //creating dispatch_job_id variable this will get populated after saving
    //in dispatch_job table
    let dispatch_job_id;

    //Start Validating
    const errFields = () => {
      return res
        .status(405)
        .json({ msg: "Not Allowed! Required fields does not exist" });
    };

    if (!req.body.header_data || !req.body.detail_data) {
      return errFields();
    }

    const { rider_provider_id } = req.body.header_data;

    if (!rider_provider_id) {
      return errFields();
    }

    //End validating

    for (var i = 0; i < req.body.detail_data.length; i++) {
      console.log(req.body.detail_data[i]);

      const dispatch_job = {
        rider_provider_id: req.body.header_data.rider_provider_id,
        status: 15 //default status is 9
      };

      try {
        const createDispatchJob = await dispatchJobModel.create(dispatch_job, {
          logging: console.log
        });

        if (!createDispatchJob) {
          return res.status(400).json({ msg: "Cannot create dispatch Job" });
        }

        dispatch_job_id = createDispatchJob.dataValues.dispatch_job_id;

        const job_item_type = await viewJobsForDispatchModel
          .findAll({
            attributes: ["jobtype"],
            where: {
              order_id: req.body.detail_data[i].order_id,
              shopify_order_name: `FS-${req.body.detail_data[i].shopify_order_id}`
            }
          })
          .catch(err => {
            return res.status(400).json({ msg: "Error getting job type" });
          });

        const dispatchDetail = {
          dispatch_job_id,
          order_reference_id: req.body.detail_data[i].order_item_id,
          order_id: req.body.detail_data[i].order_id,
          order_item_id: req.body.detail_data[i].order_item_id,
          job_item_type: job_item_type[0].dataValues.jobtype,
          shopify_order_name: `FS-${req.body.detail_data[i].shopify_order_id}`, //STILL DEBATABLE
          status: 7
        };

        const createDispatchDetail = await dispatchJobDetailModel
          .create(dispatchDetail, { logging: console.log })
          .catch(err => {
            return res
              .status(400)
              .json({ msg: "Error creating dispatch detail" });
          });

        res.json({
          msg: "Job Item(s) booked",
          dispatch_job_id
        });
      } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: "Error inserting dispatch_job" });
      }
    }
  },
  createBCAssigned: async (req, res) => {
    //creating dispatch_job_id variable this will get populated after saving
    //in dispatch_job table
    let dispatch_job_id;

    //Start Validating
    const errFields = () => {
      return res
        .status(405)
        .json({ msg: "Not Allowed! Required fields does not exist" });
    };

    if (!req.body.rider_id || !req.body.tracking_no || !req.body.detail_data) {
      return errFields();
    }

    //End validating

    for (var i = 0; i < req.body.detail_data.length; i++) {
      console.log(req.body.detail_data[i]);

      //Getting all the data of rider from rider id
      const riderData = await riderModel
        .findAll({
          where: {
            rider_id: req.body.rider_id
          },
          include: [
            {
              model: riderProviderModel,
              required: true
            }
          ]
        })
        .catch(err => {
          return res.status(400).json({ msg: "Error getting rider data" });
        });

      console.log(
        "riderData",
        riderData[0].dataValues.rider_provider.dataValues.name
      );

      const dispatch_job = {
        rider_provider_id: req.body.rider_id,
        tracking_no: req.body.tracking_no,
        rider_id: req.body.rider_id,
        rider_first_name: riderData[0].first_name,
        rider_last_name: riderData[0].last_name,
        rider_mobile_number: riderData[0].mobile_number,
        rider_provider_name:
          riderData[0].dataValues.rider_provider.dataValues.name,
        status: 1 //default status is 9
      };

      try {
        const createDispatchJob = await dispatchJobModel.create(dispatch_job, {
          logging: console.log
        });

        if (!createDispatchJob) {
          return res.status(400).json({ msg: "Cannot create dispatch Job" });
        }

        dispatch_job_id = createDispatchJob.dataValues.dispatch_job_id;

        const job_item_type = await viewJobsForDispatchModel
          .findAll({
            attributes: ["jobtype"],
            where: {
              order_id: req.body.detail_data[i].order_id,
              shopify_order_name: `FS-${req.body.detail_data[i].shopify_order_id}`
            }
          })
          .catch(err => {
            return res.status(400).json({ msg: "Error getting job type" });
          });

        const dispatchDetail = {
          dispatch_job_id,
          order_reference_id: req.body.detail_data[i].order_item_id,
          order_id: req.body.detail_data[i].order_id,
          order_item_id: req.body.detail_data[i].order_item_id,
          job_item_type: job_item_type[0].dataValues.jobtype,
          shopify_order_name: `FS-${req.body.detail_data[i].shopify_order_id}`,
          status: 7
        };

        const createDispatchDetail = await dispatchJobDetailModel
          .create(dispatchDetail, { logging: console.log })
          .catch(err => {
            res.status(400).json({ msg: "Error creating dispatch detail" });
          });

        return res.json({
          msg: `Job Item(s) booked to Rider ${riderData[0].first_name} ${riderData[0].last_name} of ${riderData[0].dataValues.rider_provider.dataValues.name}!`,
          dispatch_job_id: createDispatchDetail.dataValues.dispatch_job_id
        });
      } catch (error) {
        return res.status(400).json({ msg: "Error inserting dispatch_job" });
      }
    }
  },
  advanceBCBookings: async (req, res) => {
    try {
      const result = await dispatchJobModel.findAndCountAll({
        where: {
          status: 15
        },
        include: [
          {
            model: viewDispatchJobDetailModel, //dispatchJobDetailModel OR viewJobsForDispatchModel STILL DEBATABLE
            required: true,
            attributes: viewDispatchJobDetailModel.selectable
          }
        ]
      });

      if (!result) {
        res.status(401).json({ msg: "No records found", rows: [], count: 0 });
      } else {
        res.status(200).json(result);
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ msg: "Error finding advance booking" });
    }
  },
  assignedBCBookings: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req);

    try {
      const qs = {
        where: { status: [1] },
        distinct: true,
        //attributes: dispatchJobModel.selectable,
        include: [
          {
            model: viewDispatchJobDetailModel,
            attributes: viewDispatchJobDetailModel.selectable,
            required: true,
            separate: true,
            //duplicate:false,
            where: { status: [1] }
          }
        ]
      };

      //const finalQS = _.union({}, reqQs,qs);
      const finalQS = Object.assign({}, reqQs, qs);

      console.log("finalQS filter:", finalQS);
      const result = await dispatchJobModel.findAndCountAll(finalQS, {
        raw: true
      });

      if (!result) {
        res.status(401).json({ msg: "No records found", rows: [], count: 0 });
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      console.log("Dispatch Controller assigned job", err);
      res.status(400).json({ msg: "Unable to process request" });
    }
  },
  cpuBadge: async (req, res) => {
    const { cpu_order_ids } = req.body;

    const response = await jobRiderModel.findAll({
      where: {
        [Op.and]: [
          { status: { [Op.ne]: 9 } },
          { status: { [Op.ne]: 10 } },
          { order_id: cpu_order_ids }
        ]
      }
    });

    let failedIds = [];
    _.map(response, obj => {
      failedIds.push(obj.dataValues.order_id);
    });

    res.json({ failedIds });
  },
  countNotes: async (req, res) => {
    const { order_ids } = req.body;

    const response = await orderNoteHistModel.findAll({
      where: { order_id: { [Op.in]: order_ids } },
      attributes: [
        "order_id",
        [
          db.sequelize.fn("count", db.sequelize.col("order_note_history_id")),
          "no_notes"
        ]
      ],
      group: ["order_id"]
    });

    res.json(response);
  },
  dashboardData: async (req, res) => {

  

    let today_date;
    let hub_id = 1; //Default hub
    let delivery_time = [""]; //Filters for delivery time
    let status = [""]; //Filters for status
    let payment_id; //Filters for payment method
    let category = "delivery_time"; //Category Switch


    if(req.body.hub_id){
      hub_id = req.body.hub_id
    }

    if(req.body.category){
      category = req.body.category;
    }

    if(req.body.params){

      if(req.body.params.delivery_time){
        delivery_time = req.body.params.delivery_time;
      }
  
      if(req.body.params.payment_id){
        payment_id = req.body.params.payment_id;
      }

      if(req.body.params.status){
        status = req.body.params.status;
      }

    }

    if (req.body.today_date) {
      today_date = moment(new Date(req.body.today_date)).format("YYYY-MM-DD");
    } else {
      today_date = moment().format("YYYY-MM-DD");
    }

    //Get Tomorrow/ next day
    let next_date = moment(new Date(today_date))
      .add(1, "days")
      .format("YYYY-MM-DD");

      //////// LET'S DO THIS ////////

  if(category === "delivery_time"){
    try {
      //Query for today
      const response = await orderModel
        .findAll({
          where: {
            hub_id: hub_id,
            delivery_time: {[Op.notIn]: delivery_time},
            [Op.or]: [
              { delivery_date: today_date },
              { delivery_date: next_date }
            ]
          },

          attributes: [
            "delivery_date",
            [
              db.sequelize.fn(
                "IFNULL",
                db.Sequelize.col("delivery_time"),
                "No Delivery Time"
              ),
              "delivery_time"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal(
                    "order_status_id = 13 OR order_status_id = 14, 1,0"
                  )
                )
              ),
              "cancelled"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal(
                    "order_status_id = 1 OR order_status_id = 2 OR order_status_id = 3 OR order_status_id = 4 OR order_status_id = 5 OR  order_status_id = 6 OR order_status_id = 7 OR order_status_id = 16, 1,0"
                  )
                )
              ),
              "pending"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal(
                    "order_status_id = 15, 1,0"
                  )
                )
              ),
              "booking"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 8, 1,0")
                )
              ),
              "rider_assigned"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 9, 1,0")
                )
              ),
              "shipped"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 12, 1,0")
                )
              ),
              "hold"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 10 OR order_status_id = 17, 1,0")
                )
              ),
              "delivered"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 11, 1,0")
                )
              ),
              "failed_delivery"
            ]
          ],

          group: ["delivery_date", "delivery_time"],
          order: [
            [
              db.sequelize.fn(
                "FIELD",
                db.sequelize.col("delivery_time"),
                "Anytime",
                "Morning: 9am - 1pm",
                "Afternoon: 1pm - 5pm",
                "Evening: 5pm - 8pm"
              )
            ]
          ],
          raw: true
        })
        .catch(err => {
          console.log("ERROR in finding today and tom query", err);
        });

      //Query for Orders with no date
      const noDateRes = await orderModel.findAll({
        where: {
          delivery_date: "" || null
        },
        raw: true
      });

      const noHubRes = await db.sequelize.query(`SELECT  
      COUNT(*) AS \`No Hub\`,
      DATE(delivery_date) AS delivery_date FROM \`order\` WHERE hub_id IS NULL 
      AND (\`order\`.\`delivery_date\` = ? OR \`order\`.\`delivery_date\` = ?)
      GROUP BY delivery_date`, {
        type: db.sequelize.QueryTypes.SELECT, 
        replacements:[today_date, next_date]
      });

      let obj = {
          today: response.filter(order => order.delivery_date === today_date),
          tomorrow: response.filter(order => order.delivery_date === next_date),
          orders_with_no_date: noDateRes.length,
          today_no_hub: noHubRes[0]['No Hub'],
          tomorrow_no_hub: noHubRes[1]['No Hub']
      };
      
      //req.body.params['status'] = ["cancelled", "pending", "booking", "rider_assigned", "shipped", "delivered"];
      //FILTERING STATUS TBD
      obj.today = _.map(obj.today, o => _.omit(o, status));
      obj.tomorrow = _.map(obj.tomorrow, o => _.omit(o, status));

      //FILTERING DELIVERY TIME TBD
      // obj.today = obj.today.filter(
      //   order =>
      //     order.delivery_time.includes(req.body.params["delivery_time"]) === false
      // );

      // obj.tomorrow = obj.tomorrow.filter(
      //   order =>
      //     order.delivery_time.includes(req.body.params["delivery_time"]) === false
      // );

      res.json([obj]);
    } catch (error) {
      console.log("ERROR dashboard query", error);
    }
  }

  else{
      
    try {
      //Query for today
      const response = await orderModel
        .findAll({
          where: {
            hub_id: hub_id,
            payment_id: {[Op.notIn]: payment_id},
            [Op.or]: [
              { delivery_date: today_date },
              { delivery_date: next_date }
            ]
          },

          attributes: [
            "delivery_date",
            "shopify_payment_gateway",
            [
              db.sequelize.fn(
                "IFNULL",
                db.Sequelize.col("payment_id"),
                "No Payment ID"
              ),
              "payment_id"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal(
                    "order_status_id = 13 OR order_status_id = 14, 1,0"
                  )
                )
              ),
              "cancelled"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal(
                    "order_status_id = 1 OR order_status_id = 2 OR order_status_id = 3 OR order_status_id = 4 OR order_status_id = 5 OR  order_status_id = 6 OR order_status_id = 7 OR order_status_id = 16, 1,0"
                  )
                )
              ),
              "pending"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal(
                    "order_status_id = 8 OR order_status_id = 15, 1,0"
                  )
                )
              ),
              "booking"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 8, 1,0")
                )
              ),
              "rider_assigned"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 12, 1,0")
                )
              ),
              "hold"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 9, 1,0")
                )
              ),
              "shipped"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 10 OR order_status_id = 17, 1,0")
                )
              ),
              "delivered"
            ],
            [
              db.sequelize.fn(
                "SUM",
                db.sequelize.fn(
                  "IF",
                  db.sequelize.literal("order_status_id = 11, 1,0")
                )
              ),
              "failed_delivery"
            ]
          ],

          group: ["payment_id", "delivery_date"],

          raw: true
        })
        .catch(err => {
          console.log("ERROR in finding today and tom query", err);
        });

      //Query for Orders with no date
      const noDateRes = await orderModel.findAll({
        where: {
          delivery_date: "" || null
        },
        raw: true
      });

      const noHubRes = await db.sequelize.query(`SELECT  
      COUNT(*) AS \`No Hub\`,
      DATE(delivery_date) AS delivery_date FROM \`order\` WHERE hub_id IS NULL 
      AND (\`order\`.\`delivery_date\` = ? OR \`order\`.\`delivery_date\` = ?)
      GROUP BY delivery_date`, {
        type: db.sequelize.QueryTypes.SELECT, 
        replacements:[today_date, next_date]
      });

      let obj = {
          today: response.filter(order => order.delivery_date === today_date),
          tomorrow: response.filter(order => order.delivery_date === next_date),
          orders_with_no_date: noDateRes.length,
          today_no_hub: noHubRes[0]['No Hub'],
          tomorrow_no_hub: noHubRes[1]['No Hub']
      };

      
      //req.body.filters = ["cancelled", "pending", "booking", "rider_assigned", "shipped", "delivered"];
      //FILTERING OBJECT TBD
      obj.today = _.map(obj.today, o => _.omit(o,req.body.params.status));
      obj.tomorrow = _.map(obj.tomorrow, o => _.omit(o,req.body.params.status));

      res.json([obj]);
    } catch (error) {
      console.log("ERROR dashboard query", error);
    }
  }

  },
  dispatchDashboardData: async (req, res) => {

    let today_date;
    let hub_id = [1,2,3,4]; //Default hub
    let delivery_time = [""];
    let status = [""];

    if(req.body.hub_id){
      hub_id = req.body.hub_id
    }

    if(req.body.params){

      if(req.body.params.delivery_time){
        delivery_time = req.body.params.delivery_time;
      }

      if(req.body.params.status){
        status = req.body.params.status;
      }

    }

    if (req.body.today_date) {
      today_date = moment(new Date(req.body.today_date)).format("YYYY-MM-DD");
    } else {
      today_date = moment().format("YYYY-MM-DD");
    }

    //Get Tomorrow/ next day
    let next_date = moment(new Date(today_date))
      .add(1, "days")
      .format("YYYY-MM-DD");

      let mainObj = {};

      for (var i = 0; i < hub_id.length; i++) {
        console.log("HUB ID", hub_id[i]);

          let manilaHub = hub_id[i] === 1 ? "or vds.hub_id is null" : "";
    
          try {
            const response = await db.sequelize.query(
              `SELECT 
              vds.delivery_date, vds.delivery_time, vds.order_count,
              SUM(vds.Cancelled) AS 'cancelled', SUM(vds.OnHold) AS 'hold',
              SUM(vds.Pending) AS 'pending',SUM(vds.Booking) AS 'booking',
              SUM(vds.RiderAssigned) AS 'rider_assigned', SUM(vds.Shipped) AS 'shipped',
              SUM(vds.Delivery) AS 'delivered', SUM(vds.FailedDelivery) AS 'failed_delivery', vds.hub_id
              FROM \`view_dispatch_stats\` vds WHERE (vds.delivery_date = ? OR vds.delivery_date = ?)
              AND (vds.hub_id IN (?) ${manilaHub}) AND vds.delivery_time NOT IN (?)
              GROUP BY vds.delivery_date, vds.delivery_time 
              ORDER BY FIELD(vds.delivery_time, 'Anytime', '12am - 3am', '6am - 8am', '9am - 1pm', 
              'Morning: 9am - 1pm', '1pm - 5pm',  'Afternoon: 1pm - 5pm', '5pm - 8pm', 'Evening: 5pm - 8pm',
              '9pm - 12am')`,
              {
                type: db.sequelize.QueryTypes.SELECT,
                replacements: [today_date, next_date, hub_id[i], delivery_time]
              }
            );
    
            let obj = {
              today: response.filter(
                order => order.delivery_date === today_date
              ),
              tomorrow: response.filter(
                order => order.delivery_date === next_date
              )
            };
    
            //req.body.filters = ["cancelled", "pending", "booking", "rider_assigned", "shipped", "delivered"];
            //FILTERING OBJECT TBD
            obj.today = _.map(obj.today, o => _.omit(o, status));
            obj.tomorrow = _.map(obj.tomorrow, o => _.omit(o, status));
    
            //res.json([obj]);
            if(hub_id[i] === 1){
              mainObj["Manila"] = obj;
            }
            else if(hub_id[i] === 2){
              mainObj["Cebu"] = obj;
            }
            else if(hub_id[i] === 3){
              mainObj["Davao"] = obj;
            }
            else if(hub_id[i] === 4){
              mainObj["Vietnam"] = obj;
            }
          } catch (error) {
            console.log("ERROR DISPATCH DASHBOARD", error);
          }
      };

      res.json(mainObj);
  },
  dispatchDashboardList: async (req, res) => {
    let {delivery_date, hub_id, delivery_time} = req.body; 
    let manilaHub = hub_id === 1 ? "or hub_id IS NULL" : "";

    try {
      const response = await db.sequelize.query(
        `SELECT shopify_order_name, order_id FROM view_dispatch_prep WHERE delivery_date= ? AND (hub_id = ? ${manilaHub}) AND
        order_status_id IN (1,2,3,4,5,6,7) AND delivery_time = ?;`,
        {
          type: db.sequelize.QueryTypes.SELECT,
          replacements: [delivery_date, hub_id, delivery_time]
        }
      );

      if(!response){
        console.log("CANNOT FIND ORDERS");
      }

      else{
        res.json(response);
      }

    }
    catch(err){
      console.log("CANNOT FIND ORDERS", err);
    }
  },
  getListCount: async (req) => {
   
       const qstring = queryStringToSQLQuery(req);

       let cpu_where = {
           ...qstring['where']
   
       };

       if (cpu_where.hasOwnProperty('delivery_date')){
        delete cpu_where.delivery_date;
      }
  
        try {
         const qs = {
           where: {
               [Op.or]:[{
                       jobtype:'delivery',
                       order_status_id: { [Op.in]: [2,3,4, 5, 6, 7] },
                       ...qstring['where'],
      
                  },{
                    jobtype:'cash pickup',
                    delivery_date: {[Op.lte]:qstring['where']['delivery_date']},
                    ...cpu_where,
                  }
               ]
           },
          order: [["delivery_date", "ASC"], ["delivery_time", "ASC"]]
         };

         const result = await viewJobsForDispatchModel.count(qs, {
           raw: true
         });

          return Promise.resolve(result)

    } catch (err) {
      console.log("Dispatch Controller advance booking job", err);
      return Promise.reject({ msg: "Unable to process request" });
    }
  },
  assignedjobCount: async (req, res) => {
    try {
      console.log("\n\n\nRUTHER",req.query, )
      const reqQs = queryStringToSQLQuery(req);
      let qs = {
        where: {
            //status: {[Op.eq]:8}
       //      order_status_id: {[Op.eq]:8},
        // delivery_date:db.sequelize.literal("CONVERT( view_dispatch_job_detail.delivery_date,DATE) >= CONVERT(NOW(),DATE)"), hub_id:[req.query.hub_filter].toString().split(",")
        }
      }
        const finalQS = Object.assign({}, reqQs, qs);
        const count = await viewDispatchRiderAssignedModel.count(finalQS, {
          raw: true
        });

        console.log("COUNT",count)

      
          return Promise.resolve(count)
     
    } catch (err) {
        console.log("Dispatch Controller assigned job", err);
      return Promise.reject({ msg: "Unable to process request" });
    }
  },
  advanceBookingCount: async (req, res) => {
    // console.log("REQ QUERY V2",req.query)
    try {
      let qs = {
        where: { status: [15], hub_id:[req.query.hub_filter].toString().split(",")}
      }
      const reqQs = queryStringToSQLQuery(req);
      // const reqQs = queryStringToSQLQuery(req);
      const finalQS = Object.assign({}, reqQs, qs)
  
      console.log("FINAL QS >>>>", finalQS)
      //const count = await viewDispatchJobDetailModel.count(finalQS, {
      const count = await viewDispatchAdvanceBookModel.count(finalQS, {
        raw: true
      })
  
     return Promise.resolve(count)
    } catch (error) {
      console.log("ERROR BOOK COUNT:",error)
      return Promise.reject(error)
    
    }

  },
  intransitCount: async (req, res) => {
    // console.log("REQ QUERY V2",req.query)
    try {
      let qs = {
        seperate: true,
        where: { 
         
          delivery_date:{[Op.eq]:moment(Date.now()).format('YYYY-MM-DD')},
          status: [9], hub_id:[req.query.hub_filter].toString().split(",")}
      }
      const reqQs = queryStringToSQLQuery(req);
      // const reqQs = queryStringToSQLQuery(req);
      const finalQS = Object.assign({}, reqQs, qs)
  
      console.log("FINAL QS >>>>", finalQS)
      const count = await viewDispatchJobDetailModel.count(finalQS, {
        raw: true
      })
  
     return Promise.resolve(count)
    } catch (error) {
      console.log("ERROR BOOK COUNT:",error)
      return Promise.reject(error)
    
    }

  },
  fetchNoteHistory: async (req,res)=>{


  try {

    const findNote = await orderNoteHistModel.findAll({
      where: {
        order_id: req.params.orderId
      }
    })

    if(!findNote){
      res.status(404).json([]);
    }else{

      return res.status(200).json(findNote);

    }

  }catch (err){
    console.log("Cant Fetch Note:",err)
    return Promise.reject(err)
  }



},
  fetchOrderStatus: async(req, res) => {

  let status = {
    0: "Job doesn't exist",
    8: "Rider Assigned",
    9: "Shipped",
    10: "Delivered",
    11: "Failed Delivery",
    12: "On Hold",
    13: "Cancelled Internal",
    14: "Cancelled by customer",
    15: "Dispatch Booked"
  };

  let {shopify_order_name} = req.body; 
  let jobType = 'delivery';

  if(!shopify_order_name){
    return;    
  }

  if(shopify_order_name.includes('-CPU')){
    jobType = 'cash pickup';
  }

  try {
    const response = await db.sequelize.query(
      `SELECT order_status_id FROM view_jobs WHERE shopify_order_name = ? AND jobtype = ?`,
      {
        type: db.sequelize.QueryTypes.SELECT,
        replacements: [shopify_order_name.replace("-CPU", ""), jobType]
      }
    );

    if(!response){
      console.log("CANNOT FIND ORDERS");
    }

    if(response.length <= 0){
      res.json({
        label: status[0],
        id: 0
      })
    }

    else{
      res.json({
        label: status[response[0]['order_status_id']],
        id: response[0]['order_status_id']
      })
    }
  } catch (error) {

  }

}

};
