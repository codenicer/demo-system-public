const db = require('../models');
const Op = db.Sequelize.Op;
const providerModel = db.rider_provider;
const { queryStringToSQLQuery } = require( '../helper/queryStringToSQLQuery');
const _ = require('lodash');

module.exports = {
  //create a provider
  createProvider: async (req, res) => {
    const providerData = req.body;
    console.log(providerData)
    try {
      const result = await providerModel.create(providerData);
      if(!result){
        res.status(400).json({ msg: "Unable to create provider record" });
      }
      res.status(200).json({ msg: 'Rider provider created'});
    }
    catch(e){
      console.log('error rider get providers', e);
      res.status(400).json({ msg: "Unable to create rider provider record" });
    }
  },

  //get all provider
  getProviders: async (req, res) => {
    try {
      const qs = queryStringToSQLQuery(req)

      const result = await providerModel.findAll(qs, { raw: true });
      if (!result) {
        res.status(200).json({ providers: [] });
      } else {
        res.status(200).json({ providers: result });
      }
    }
    catch (e){
      console.log('error rider get providers', e);
      res.status(400).json({ msg: "An error has occurred." });
    }
  },

    //get specific provider
    getProvider: async (provider_id, req, res) => {
        try {
          const provider = await providerModel.findAll({
            where: { rider_provider_id:{ [Op.eq]: provider_id}}
        }, {raw: true});
          if (!provider) {
            res.status(401).json({ msg: "Rider provider not found." });
          } else {
            res.json(provider[0]);
          }
        } catch (err) {
          res.status(500).json({ msg: "An error has occurred." });
        }
      },

      // update provider
      updateProvider: async (provider_id, req, res) => {
        
        console.log(req.body)
        try {
          const result = await providerModel.findAll({
            where: { rider_provider_id:{ [Op.eq]: provider_id}}
        }, {raw: true});
    
          if (!result) {
            res.status(401).json({ msg: "Unable to find rider provider" });
          } else {

            const update_res = await providerModel.update(req.body, {where: { rider_provider_id: {[Op.eq]: provider_id}}});

            if (!update_res) {
              res.status(401).json({ msg: "Unable to update rider provider" });
            } else {
              res.status(200).json({ msg: "Provider updated" });
            }
          }
        } catch (err) {
          res.status(400).json({ msg: "Unable to update rider provider" });
        }
      },
}