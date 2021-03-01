const db = require('../models');
const Op = db.Sequelize.Op;
const orderModel = db.order;
const productModel = db.product;
const assemblyModel = db.job_assembler;
const orderItemModel = db.order_item;
const { queryStringToSQLQuery } = require( '../helper/queryStringToSQLQuery');


module.exports = {

    getJob: async (req) => {
            
        try{
            const qsBuilderParams = {
                orderstatus:[5],
                itemstatus:[5],
                // orderAttrib:{
                //     quality_check:{[Op.eq]:0},
                // },
                filters:req? req.query.filters : null
            }

            const resOrder = await assemblyModel.findAndCountAll(qsBuilder(qsBuilderParams),{raw:true});
            console.log(resOrder.count,"COUNT")
            return  Promise.resolve(resOrder) 
        }catch(err){
            console.log('assemblyController error:', err.message);
           return Promise.reject({status:500,msg:'An error has occurred.'});
        }

    },
    getQueue : async () =>{
        try{
            const qsBuilderParams = {
                orderstatus:[6],
                itemstatus:[6],
                orderAttrib:{
                    quality_check:{[Op.eq]:0},
                },
                newmodel:[{model: db.user, required: true,}]
            }

            const resOrder = await assemblyModel.findAll(qsBuilder(qsBuilderParams),{raw:true});
            return  Promise.resolve(resOrder) 
        }catch(err){
            console.log('assemblyController error:', err.message);
           return Promise.reject({status:500,msg:'An error has occurred.'});
        }

    },
    getInJob : async () =>{
        try{
            const qsBuilderParams = {
                orderstatus:[6],
                itemstatus:[6],
                orderAttrib:{
                    quality_check:{[Op.eq]:0},
                }
            }
            const resOrder = await assemblyModel.findAll(qsBuilder(qsBuilderParams),{raw:true});
            return  Promise.resolve(resOrder) 
        }catch(err){
            console.log('assemblyController error:', err.message);
           return Promise.reject({status:500,msg:'An error has occurred.'});
        }

    },
    getInJobSelected : async (user_id) =>{
        try{

            const qsBuilderParams = {
                orderstatus:[6],
                itemstatus:[6,7],
                where:{user_id:{[Op.eq]:user_id}}

            }

            const resOrder = await assemblyModel.findAll(qsBuilder(qsBuilderParams),{raw:true});
            return  Promise.resolve(resOrder) 
        }catch(err){
            console.log('assemblyController getInJobSelected error:', err.message);
           return Promise.reject({status:500,msg:'An error has occurred.'});
        }
    },
    create: async (req)=>{
            const data = req.body.form
        //    const test = {
        //         "order_id":1,
        //         "user_id":3
        //     }

            const result = await assemblyModel.create(data);
    },
    update: async (req) =>{
        
        const {job_assembler_id,toUpdate} = req.body.form.job_assembler
        let toUpdateShift = toUpdate

        
        
        console.log( req.body.form.job_assembler)

        if("completed_at" in toUpdateShift){
            if(toUpdateShift.completed_at === "toNull"){
                toUpdateShift.completed_at = null
            }else{
                console.log("HERE PLEASE")
                toUpdateShift.completed_at = db.sequelize.fn('NOW')
            }
        } 

        if("accepted_at" in toUpdateShift){
            if(toUpdateShift.accepted_at === "toNull"){
                toUpdateShift.accepted_at = null
            }else{
                toUpdateShift.accepted_at = db.sequelize.fn('NOW')
            }
        }
    
        try {
            let [numberOfAffectedRows ] = await assemblyModel.update(toUpdateShift,{where:{job_assembler_id}})
            return Promise.resolve({numberOfAffectedRows})
        } catch (err) {
            console.log(err.message)
            return Promise.reject({status:500,msg:"Server error"})
        }
    }


};


function qsBuilder(params){

    const {orderstatus,itemstatus,newmodel,where,filters,orderAttrib} = params

    const qs =   {
        include:[
            {
                where:{
                //    payment_status_id: {[Op.eq]:2},
                    order_status_id: {[Op.in]:orderstatus},
                },
                distinct:true,
                attributes: orderModel.selectable,
                model:db.order,
                require:true,
                    include:[

                        {
                            model: db.customer,
                            required: true,
                            
                        },
                        {
                            model: db.order_item,
                           where:{order_item_status_id:{[Op.in]:itemstatus}},
                            attributes:orderItemModel.selectable,
                            required: true,
                            include:[
                                        {    
                                            model:db.product,
                                            required:true                            
                                        }   
                                ]
                        },
                        {
                            model:db.payment,
                            attributes:['name'],
                            required:true,
    
                        },
                        {
                            model:db.order_address, as: 'addresses',
                            attributes:db.order_address.selectable,
                            required:true,
                        }
                ]
                },  
            ],
            distinct: true,
            order: [
                [db.sequelize.literal('order.priority'), 'DESC'],
                [db.sequelize.literal('order.delivery_date'), 'ASC'],
                [db.sequelize.literal('order.delivery_time'), 'ASC']
            ]
    };

    let altqs = qs
    if(newmodel){  
        newmodel.forEach(m=>{
            altqs.include.push(m)
        })

    }
    if(where){
        altqs.where = {...where}
    }
    if(orderAttrib){
        altqs.include[0].where = {
            ...altqs.include[0].where ,
            ...orderAttrib
        } 
    }
    if(filters){
        const _filters = JSON.parse(filters)
        if(_filters.hub_id)  altqs.include[0].where.hub_id = {[Op.in]:_filters.hub_id}

        if(_filters.delivery_time) altqs.include[0].where.delivery_time = {[Op.like]:`%${_filters.delivery_time}%`}

        if(_filters.delivery_date)  altqs.include[0].where.delivery_date = {[Op.eq]:_filters.delivery_date}

        if(_filters.shopify_order_name) altqs.include[0].where.shopify_order_name = {[Op.like]:`%${_filters.shopify_order_name}%`}
    }
    return altqs
}