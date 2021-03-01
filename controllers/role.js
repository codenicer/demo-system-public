const db = require('../models');
const Op = db.Sequelize.Op;
const roleModel = db.role;
const moduleModel = db.module;
const moduleItemModel = db.module_item;
const { queryStringToSQLQuery } = require( '../helper/queryStringToSQLQuery');
const _ = require('lodash');

module.exports = {
    //get role info of specified id
    getInfo: async (req,res) => {

        const role_id = req.params.role_id;

        try{
            const role = await roleModel.findAll({
                where: { role_id: role_id},
                include: [
                    {
                        model: db.hub,
                        required: true
                    },
                  {
                      model: db.module_item,
                      required:false
                  }

                ]
            }, {raw: true});
            if (!role) {
                res.status(401).json({msg: 'Record not found.'});
            } else {
                res.json(role);
            }
        }catch(err){
           console.log('RoleController error:', err);
           res.status(500).json({msg: 'An error has occurred.'});
        }
    },
    //insert role record to db to db
    create: async(req,res) => {

        const formData= req.body.formData;
        const hubs= req.body.hubs;
        try{
            const result = await roleModel.create(formData);

            if(!result){
                console.log('Role controller error: ',result);
                res.status(400).json({msg:'Unable to create role record'});
            }else{


                const new_hubs = _.map(hubs, (rec, key) => {
                    return {role_id:parseInt(result.role_id), hub_id: parseInt(rec)}
                });

                const bRes = await db.role_hub.bulkCreate(new_hubs);


                if(!bRes){
                  console.log('unable to create hubs for role')
                };



                res.status(200).json({msg:'Role successfully created.'});
            }
        }catch(err){
            res.status(400).json({msg:'Unable to create role record'});
        }
    },
    update: async(req,res) => {

        const role_id = req.body.role_id;

        console.log('role ide udapte', role_id);
        const formData= req.body.formData;
        const hubs= req.body.hubs;

        console.log('formData', formData);

        try{
            const result = await roleModel.update(formData, {where: {role_id: parseInt(role_id)}});

            if(!result){
                console.log('Role controller error: ',result);
                res.status(400).json({msg:'Unable to update role record'});
            }else{


              const module_res = await db.role_hub.destroy({
                where: {role_id}
              }, {raw:true});



              const new_hubs = _.map(hubs, (rec, key) => {
                    return {role_id:parseInt(role_id), hub_id: parseInt(rec)}
                });

                const bRes = await db.role_hub.bulkCreate(new_hubs);

                console.log('new_hubs', new_hubs);

                if(!bRes){
                  console.log('unable to update hubs for role')
                };



                res.status(200).json({msg:'Role successfully updated.'});
            }
        }catch(err){
            res.status(400).json({msg:'Unable to update role record'});
        }
    },
    updateStatus: async(req,res) => {

        const role_id = req.body.role_id;

        console.log('role ide udapte', role_id);
        const formData= req.body.formData;

        console.log('formData', formData);

        try{
            const result = await roleModel.update({
                active: formData.active
            }, {where: {role_id: parseInt(role_id)}});

            if(!result){
                console.log('Role controller error: ',result);
                res.status(400).json({msg:'Unable to update role record'});
            }else{
                res.status(200).json({msg:'Role status successfully updated.'});
            }
        }catch(err){
            res.status(400).json({msg:'Unable to update role record'});
        }
    },
    getRoles: async (req,res) => {

        try{
            const qs = queryStringToSQLQuery(req);

            const initQs = {
                where: {active:[1,0]}
            };
            const finalQS = Object.assign(qs, initQs);


            const result = await roleModel.findAndCountAll(finalQS,{raw:true});
            if(!result){
                res.status(200).json({ rows:[], count:0});
            }else{
                res.status(200).json(result);
            }
        }catch(err){
            res.status(400).json({msg:'Unable to get role records'});
        }
    },
    showList: async (req,res) => {

        try{
            const qs = queryStringToSQLQuery(req);

            const initQs = {};
            const finalQS =_.merge({}, qs, initQs);


            const result = await viewAvaialbeRoleModel.findAll(finalQS,{raw:true});
            if(!result){
                res.status(200).json([]);
            }else{
                res.status(200).json(result);
            }
        }catch(err){
            console.log('Error Role Controller', err);
            res.status(400).json({msg:'Unable to fetch role record'});
        }
    },
    getAllModuleItems: async (req,res) => {

        try{

            const role_id = req.params.role_id;

            const module_res = await moduleModel.findAll({

            include: [
              {
                model: db.module_item,
                attributes:{ include:['active']},
                required: true,
                include:[
                  {
                    model: moduleModel,
                    required: true,

                  }
                ]
              }
            ],
            order: [[db.Sequelize.literal('module.priority'), 'ASC']]

          }, {raw:true});
          if(module_res){
            if(module_res.length){
              res.status(200).json(module_res);
            }else{
              res.status(200).json([]);
            }
          }

        }catch(err){
            console.log('Error Role Controller', err);
            res.status(400).json({msg:'Unable to fetch module list'});
        }
    },
    setPermission: async (req,res) => {

        try{
            console.log(req.params);

            const role_id = req.params.role_id;
            const permissions = req.body.role_module_item_id;

            const role_module_items = _.map(permissions, (rec, i)=> {
                    return { role_id: parseInt(role_id), module_item_id: parseInt(rec)}
            });

            const module_res = await db.role_module_item.destroy({
                    where: {role_id}
          }, {raw:true});


          const rolePerms = await db.role_module_item.bulkCreate(role_module_items);

          if(!rolePerms){
              console.log('no inserted permission')
          }else{
            res.status(200).json({msg:'Role permission successfully updated.'});
          }




        }catch(err){
            console.log('Error Role Controller', err);
            res.status(400).json({msg:'Unable to role permission'});
        }
    },


};
