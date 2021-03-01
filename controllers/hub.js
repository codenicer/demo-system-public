const url = require('url');
const { queryStringToSQLQuery } = require('../helper/queryStringToSQLQuery');
const db = require('../models');
const Op = db.Sequelize.Op;
const HubModel = db.hub;

module.exports = {

    getInfo:async (req,res) => {

        //manage query string here
        const {hub_id} = req.body;
        try{
            const qs = {
                where: {
                    hub_id: {[Op.eq]: hub_id}
                },
                attributes: [...HubModel.selectable,
                    [db.sequelize.literal("IF(is_active,'Active', 'Inactive')"), 'status']
                ]

            }

            const resHub = await HubModel.findAll(qs,{raw:true});
            if (!resHub) {
                // console.log('no data');
                res.status(200).json([]);
            }else{
                // console.log('data', resHub);
                res.status(200).json(resHub[0]);
            }
        }catch(err){
            // console.log('HubController error:', err);
            res.status(500).json({msg: 'An error has occurred.'});
        }


    },
    getAll:async (req,res) => {

        //manage query string here
        let queryData = queryStringToSQLQuery(req);
        try{
            const qs = {
                where:{},
                attributes: [ ...HubModel.selectable,
                    [db.sequelize.literal("IF(is_active,'Active', 'Inactive')"), 'status']
                ],
            };
            const resHub = await HubModel.findAll(qs,{raw:true});
            if (!resHub) {
                // console.log('no data');
                res.status(200).json([]);
            }else{
                // console.log('data', resHub);
                res.status(200).json(resHub);
            }
        }catch(err){
            // console.log('HubController error:', err);
            res.status(500).json({msg: 'An error has occurred.'});
        }


    },
    getListAll:async (req,res) => {

        //manage query string here
        const reqQs = queryStringToSQLQuery(req);
        try{
            const qs = {
                where:{},
                attributes: [ ...HubModel.selectable,
                    [db.sequelize.literal("IF(is_active,'Active', 'Inactive')"), 'status']
                ],
            };

            const finalQS = Object.assign(qs, reqQs);
            const resHub = await HubModel.findAndCountAll(finalQS,{raw:true});
            if (!resHub) {
                // console.log('no data');
                res.status(200).json({rows:[], count:0});
            }else{
                // console.log('data', resHub);
                res.status(200).json(resHub);
            }
        }catch(err){
            // console.log('HubController error:', err);
            res.status(500).json({msg: 'An error has occurred.'});
        }


    },

    update: async (req,res) => {
        const {hub_name ,address,status,hub_id} = req.body
        try {

            const data = {
                'name': hub_name,
                'address': address,
                'is_active': status
            }
            const result = await HubModel.update(data, {where: {hub_id:{ [Op.eq] :parseInt(hub_id)}}});
            if (!result){
                return res.status(400).json({msg:"Update hub failed."})
            } else{
                res.json({msg:"Update hub success."})
            }
        } catch (err) {
            // console.log(err.message)
            res.status(500).json({msg:"Server error."})
        }
    },

    create: async (req,res) => {
        const {hub_name ,address,} = req.body
        try {

            const data = {
                'name': hub_name,
                'address': address,
                'is_active': 1
            }
            const result = await HubModel.create(data);
            if (!result){
                return res.status(400).json({msg:"Create hub record failed."})
            } else{
                res.json({msg:"Hub successfully created."})
            }
        } catch (err) {
            // console.log(err.message)
            res.status(500).json({msg:"Server error."})
        }
    },


};
