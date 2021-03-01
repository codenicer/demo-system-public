const db = require('../models');
const Op = db.Sequelize.Op;
const riderModel = db.rider;
const viewAvaialbeRiderModel = db.view_available_rider;
const riderProviderModel = db.rider_provider;
const dispatchJobModel = db.dispatch_job;
const dispatchJobDetailModel = db.dispatch_job_detail;
const jobRiderModel = db.job_rider;
const { queryStringToSQLQuery } = require( '../helper/queryStringToSQLQuery');
const _ = require('lodash');

module.exports = {
  //get rider info of specified id
  getInfo: async (req, res) => {

    const rider_id = req.params.rider_id;
    try {
      const rider = await riderModel.findAll(
        {
          where: { rider_id: { [Op.eq]: rider_id } },
          include: [
            {
              model: db.rider_provider,
              required: true
            }
          ]
        },
        { raw: true }
      );
      if (!rider) {
        res.status(401).json({ msg: "Record not found." });
      } else {
        console.log("rider data :", rider);
        res.status(200).json(rider[0]);
      }
    } catch (err) {
      console.log("RiderController error:", err);
      res.status(500).json({ msg: "An error has occurred." });
    }
  },
  //insert rider record to db to db
  create: async (req, res) => {
    const riderData = req.body;

    try {
      const result = await riderModel.create(riderData);

      if (!result) {
        console.log("Rider controller error: ", result);
        res.status(400).json({ msg: "Unable to create rider record" });
      } else {
        res.status(200).json({ msg: "Rider successfully created." });
      }
    } catch (err) {
      res.status(400).json({ msg: "Unable to create rider record" });
    }
  },
  update: async (req, res) => {


    const ridersData = req.body;
    console.log('riderData', ridersData);
    console.log('rider___id:', req.params.rider_id);
    try {
      const result = await riderModel.findAll(
        {
          where: { rider_id: req.params.rider_id },
          include: [
            {
              model: db.rider_provider,
              required: true
            }
          ]
        },
        { raw: true }
      );
      if (!result) {
        res.status(401).json({ msg: "Unable to find rider record" });
      } else {
        const update_res = await riderModel.update({

          first_name:ridersData.first_name,
          last_name:ridersData.last_name,
          mobile_number:ridersData.mobile_number,
          rider_provider_id:ridersData.rider_provider_id,
          code:ridersData.code,

        }, {
          where: { rider_id: req.params.rider_id }
        });

        if (!update_res) {
          console.log('error', update_res);
          res.status(401).json({ msg: "Unable to update record" });
        } else {
          res.status(200).json({ msg: "Rider successfully updated" });
        }
      }
    } catch (err) {
      console.log('error', err);
      res.status(400).json({ msg: "Unable to update rider record" });
    }
  },
  getRiders: async (req, res) => {


    try {
      const qs = queryStringToSQLQuery(req);


      console.log('hahahahahaha', req.query.activate_status)
      if(req.query.activate_status){

        const update_res = await riderModel.update({

          status:req.query.activate_status,
          

        }, {
          where: { rider_id: req.query.activate_id }
        });
      }


      const initQs = {
        include: [
          {
            model: db.rider_provider,
            required: true
          }
        ]
      };
      const finalQS = _.merge(qs, initQs);

      const result = await riderModel.findAndCountAll(finalQS, { raw: true });
      if (!result) {
        res.status(200).json({ rows: [], count:0 });
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      console.log('error', err);
      res.status(400).json({ msg: "Unable to get rider records" });
    }
  },
  getAvailableRiders: async (req, res) => {
    try {
      const qs = queryStringToSQLQuery(req);

      const initQs = {};
      const finalQS = Object.assign(qs, initQs);


        const result = await viewAvaialbeRiderModel.findAll(finalQS,{raw:true});
        if(!result){
            return Promise.resolve([])
          //  res.status(200).json([]);
        }else{
            return Promise.resolve(result)
          //  res.status(200).json(result);
        }
    }catch(err){
        console.log('Error Rider Controller', err);
        return Promise.reject({status:400,msg:'Unable to fetch rider record'})
      //  res.status(400).json({msg:'Unable to fetch rider record'});
    }
},
  autoCreateRider: async (req, res) => {
    try {
      const riderProviderRes = await riderProviderModel.create(
        req.body.rider_provider
      );
      if (!riderProviderRes) {
        res.status(400).json({ msg: "Unable to create rider information" });
      } else {
        try {
          const riderData = req.body.rider_data;

          riderData.rider_provider_id = riderProviderRes;

          const result = await riderModel.create(riderData);
          if (!result) {
            console.log("Rider controller error: ", result);
            res.status(400).json({ msg: "Unable to create rider record" });
          } else {
            res.status(200).json({ msg: "Rider successfully created." });
          }
        } catch (err) {
          res.status(400).json({ msg: "Unable to create rider record" });
        }
      }
    } catch (e) {
      res.status(400).json({ msg: "Unable to create rider information" });
    }
  },
  getRiderProvider: async (req, res) => {
    try {
      const qs = queryStringToSQLQuery(req);

      const initQs = {};
      const finalQS = _.merge({}, qs, initQs);

      const result = await riderProviderModel.findAll(finalQS, { raw: true });
      if (!result) {
        res.status(200).json([]);
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(400).json({ msg: "Unable to get rider provider list." });
    }
  },

  //Get Available riders through Barcode
  getBCAvailableRiders: async (req, res) => {
    try {
      const qs = queryStringToSQLQuery(req);

      const initQs = {
        attributes: [
          "rider_id",
          "first_name",
          "mobile_number",
          "rider_provider_id",
          "rider_provider_name"
        ]
      };
      const finalQS = _.merge({}, qs, initQs);

      const result = await viewAvaialbeRiderModel.findAll(finalQS, {
        raw: true
      });
      if (!result) {
        res.status(200).json([]);
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      console.log("Error Rider Controller", err);
      res.status(400).json({ msg: "Unable to fetch rider record" });
    }
  },

  //Creating rider through barcode
  createBCRider: async (req, res) => {
    //creating provider variable this will get populated after checking
    //if provider id exists in database
    let providerName;

    //Start Validating
    const errFields = () => {
      return res
        .status(405)
        .json({ msg: "Not Allowed! Required fields does not exist" });
    };

    if (!req.body.riderData) {
      return errFields();
    }

    const { fullname, mobile_number, rider_provider_id } = req.body.riderData;
    if (!fullname || !mobile_number || !rider_provider_id) {
      return errFields();
    }

    try {
      const result = await riderProviderModel.findAll(
        {
          where: {
            rider_provider_id
          }
        },
        { logging: console.log }
      );
      if (result.length <= 0) {
        return res
          .status(406)
          .json({ msg: "Not Acceptable, Rider Provider not known" });
      } else {
        //populating provider variable
        providerName = result[0].dataValues.name;
      }
    } catch (err) {
      return res.status(406).json({ msg: "Error finding provider id" });
    }
    //End validating

    try {
      //Split fullname to fistname and lastname
      var first_name = fullname
        .split(" ")
        .slice(0, -1)
        .join(" ");
      var last_name = fullname
        .split(" ")
        .slice(-1)
        .join(" ");

      let newRiderData = {
        first_name,
        last_name,
        mobile_number,
        rider_provider_id,
        status: 1 //Default is 1 for status
      };

      const result = await riderModel.create(newRiderData, {
        logging: console.log
      });

      if (!result) {
        console.log("Rider controller error: ", result);
        res.status(400).json({ msg: "Unable to create rider record" });
      } else {
        //creating response removing the status and adding the provider name
        const response = {
          rider_id: result.rider_id,
          first_name: result.first_name,
          last_name: result.last_name,
          mobile_number: result.mobile_number,
          rider_provider_id: result.rider_provider_id,
          rider_provider_name: providerName
        };

        res
          .status(200)
          .json({ msg: "New Rider Created", rider_data: response });
      }
    } catch (err) {
      res.status(400).json({ msg: "Unable to create rider record" });
    }
  },

  getBCRiderProvider: async (req, res) => {
    try {
      const qs = queryStringToSQLQuery(req);

      const initQs = { attributes: ["rider_provider_id", "name"] };
      const finalQS = _.merge({}, qs, initQs);

      const result = await riderProviderModel.findAll(finalQS, { raw: true });
      if (!result) {
        res.status(200).json([]);
      } else {
        res.status(200).json(result);
      }
    } catch (err) {
      res.status(400).json({ msg: "Unable to get rider provider list." });
    }
  },

  createBCRiderProvider: async (req, res) => {
    //Start Validating
    const errFields = () => {
      return res
        .status(405)
        .json({ msg: "Not Allowed! Required fields does not exist" });
    };

    if (!req.body.provider_data) {
      return errFields();
    }

    const { name } = req.body.provider_data;

    if (!name) {
      return errFields();
    }

    try {
      const createRiderProvider = await riderProviderModel.create(
        req.body.provider_data
      );
      if (!createRiderProvider) {
        return res
          .status(400)
          .json({ msg: "Unable to create rider information" });
      }

      res.json({
        msg: "New provider created",
        rider_data: createRiderProvider
      });
    } catch (error) {
      res
        .status(400)
        .json({ msg: "Error creating new provider through barcode" });
    }
  },

  getRiderInfoToOrder: async (req, res) => {
    try {
      //console.log(req.body.shopify_order_name);
      const { shopify_order_name } = req.body;

      const dispatchStatus = await dispatchJobDetailModel.findAll({
        where: { shopify_order_name: shopify_order_name },
        order: [["dispatch_job_detail_id", "asc"]],
        attributes: ["dispatch_job_detail_id", "shopify_order_name", "job_item_type", "created_at", "status"],
        include: [
          {
            model: dispatchJobModel,
            required: true
          }
        ],
      });

      let ObjDelivery = null;
      let ObjCashPickup = null; 

      if(dispatchStatus){
        dispatchStatus.forEach(item => {
          //console.log(item['job_item_type']);
          if(item['job_item_type'] === "delivery"){
            ObjDelivery = item;
          }
          else  if(item['job_item_type'] === "cash pickup"){
            ObjCashPickup = item;
          }
        })
      }

      res.json({
        deliveryRiderInfo: ObjDelivery,
        CPURiderInfo: ObjCashPickup,
      });
     
    } catch (error) {
      console.log("CANNOT DISPATCH JOB DETAIL", error);
    }
  },
};
