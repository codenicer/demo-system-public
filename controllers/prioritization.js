const db = require('../models');
const Op = db.Sequelize.Op;
const orderModel = db.order;
const orderItemModel = db.order_item;
const productModel = db.product
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Manila");
module.exports = {
    getAllPrio: async (req) => { 
        const {pagesize,page} = JSON.parse(req.query.pagination) 
        try{
            const qs = {
                where:{
                    [Op.or]:[
                        {order_status_id:{[Op.lte]:9}},
                        {order_status_id:{[Op.in]:[11,12,15]}}
                     ]
                },
              
                offset:Number(page),
                limit:Number(pagesize),
                attributes: orderModel.selectable,
                include:[
                    {
                       
                        model: db.customer,
                        required: true,
                    },
                    {
                      
                        model: db.order_item,
                        attributes:orderItemModel.selectable,
                        required: true,
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
                    ],
                    distinct:true,
                order: [
                    ['priority', 'DESC'],
                    ['delivery_date', 'DESC'],
                    ['delivery_time', 'ASC'],
                ],
               
            };

    if(req.query.filters && Object.keys(req.query.filters).length > 0){
                const querytoArray = Object.entries(JSON.parse(req.query.filters))
                querytoArray.forEach(filter=>{
                    qs.where = {
                        ...qs.where,
                        [filter[0]]:{[Op.like]: filter[0] === "shopify_order_name" ? `%${filter[1]}%` : filter[1]}
                    }
            })
        }
       
         
            const result = await orderModel.findAndCountAll(qs,{raw:true});   
            const prod_list = []
            result.rows.forEach(row=>{
                    row.order_items.forEach(item=>{
                     //  console.log("order ID:",row.order_id,item.product_id)
                     prod_list.push(item.product_id)
                    })
                  
            })

            const products = await productModel.findAll({where:{product_id:{[Op.in]:prod_list}}},{raw:true})

            let filteredResult = [] 
            //console.log(prod_list,"LIST HERE")
                result.rows.forEach((_row)=>{
                    const row = _row.toJSON()
                    let newRow = row
                    row.order_items.forEach((item,i)=>{
                        products.forEach(p=>{
                                if(item.product_id === p.product_id){
                                    newRow.order_items[i] ={
                                        ...item,
                                        product:p
                                    }
                                }
                        })
                    })
                    filteredResult = filteredResult.concat(newRow)
               })
           
                
           //  console.log(filteredResult.rows[0])
          // const count = await orderModel.(qs2,{raw:true});
                  
                return Promise.resolve({count:result.count,rows:filteredResult})

        }catch(err){
            console.log('orderController error:', err);
            return Promise.reject({
                status:500,
                msg:'An error has occurred.'
            })
          // res.status(500).json({msg: 'An error has occurred.'});
        }

    }
}