const db = require('../models');
const Op = db.Sequelize.Op;
const orderModel = db.order;
const assemblyModel = db.job_assembler;
const moduleModel = db.module;
const orderitemModel = db.order_item


module.exports = {
    updateStatus: async (status,where) => {
        const riderData = req.body.riderData
        try{
                const update_res = await riderModel.update(riderData,where);

                if(!update_res){
                    res.status(401).json({msg:'Unable to update record'});
                }else{
                    res.status(200).json({msg:'Rider successfully created'});
                }
        }catch(err){
            res.status(400).json({msg:'Unable to update rider record'});
        }
    },
    update:async (req) =>{
        
        
        try {
            const {toUpdate,where} = req.body.form.order_item
            // console.log("TOUPDATERUTHER>>>",where)
            let [numberOfAffectedRows ]  = await orderitemModel.update(toUpdate,{where:{...where,
                order_item_status_id:{[Op.lte]:7}
            }})
                return Promise.resolve({numberOfAffectedRows})
        } catch (err) {
            console.log(err.message)
            return Promise.reject({status:500,msg:"Server error"})
        }
    }
};
