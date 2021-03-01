const db = require("../models");
const axios = require('axios')
const Op = db.Sequelize.Op;
const paymentRefundModel = db.payment_refund;

const { queryStringToSQLQuery } = require("../helper/queryStringToSQLQuery");
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Manila");

var payment_refund = {

    getPaymentDetails: async (req, res) => {
        try {
            console.log("getPaymentDetails")
            const {order_id} =req.query;
            let filter = {};
            if (order_id) filter = {...filter, order_id: { [Op.eq]:order_id}};
            const reqQs = queryStringToSQLQuery(req);

            
            const qs = {
                where:filter,
                order: [
                    ["updated_at", "DESC"],
                    ["created_at", "DESC"],
                ]
            };

            const finalQS = Object.assign(reqQs,qs);
          

            const [order] = await db.sequelize.query('SELECT * FROM  `order` where  order_id  = :order_id ',{
                replacements:{
                    order_id
                },
                type: db.sequelize.QueryTypes.SELECT
            })
            
            const [payment] = await db.sequelize.query('SELECT * FROM  `payments` where  order_id  = :order_id ORDER BY id DESC',{
                replacements:{
                    order_id
                },
                type: db.sequelize.QueryTypes.SELECT
            })
            


            const refund_list = await paymentRefundModel.findAndCountAll(finalQS, { raw: true });


            return res.json({
                order,
                payment,
                refund_list
            })

        } catch (err) {
            console.log(err.message);
            res.status(500).json({msg:"Server error."})
        }
    },
    getPaymentRefund: async (req, res) => {
        const {refund_type,date_requested,date_processed,status,order_number} =req.query;
        //console.log('req.query',req);
        try {



            let filter = {};
            if (refund_type) filter = {...filter, refund_type };
            if (date_requested) filter = {...filter, created_at:  { [Op.between]:[`${date_requested} 00:00:00`,`${date_requested} 23:59:59`] }};
            if (date_processed) filter = {...filter, approved_at: { [Op.between]:[`${date_processed} 00:00:00`,`${date_processed} 23:59:59`] }};
            if (status) filter = {...filter, status };
            if (order_number) filter = {...filter, shopify_order_name: { [Op.like]: `%${order_number}%`}};

            console.log('filter',filter);

            const reqQs = queryStringToSQLQuery(req);

            console.log('reqQs',reqQs);

            const qs = {

                where:filter,
                order: [
                    ["updated_at", "DESC"],
                    ["created_at", "DESC"],
                ]
            };

            const finalQS = Object.assign(reqQs,qs);

            console.log('finalQS', finalQS);

            const result = await paymentRefundModel.findAndCountAll(finalQS, { raw: true });




            // const refund_list = await db.sequelize.query('SELECT * FROM payment_refund ' +
            //     `${req_had_query ? 'WHERE 1=1' : ' ' } ` +
            //     `${refund_type ?  'AND refund_type like :refund_type ' : ' '}` +
            //     `${date_requested ?  'AND created_at like :date_requested ' : ' '}` +
            //     `${date_processed ?  'AND approved_at  like :date_processed ' : ' '}` +
            //     `${status ? 'AND status = :status ' : '' }`+
            //     `${order_number ? 'AND shopify_order_name like :order_number ' : ' '}`
            //     ,{
            //         replacements:{
            //             refund_type,
            //             date_requested:`%${date_requested}%`,
            //             date_processed:`%${date_processed}%`,
            //             status,
            //             order_number:`%${order_number}%`
            //         },
            //         type: db.sequelize.QueryTypes.SELECT
            //     })

            return res.json({
                count:result.count,
                rows:result.rows
            });

        } catch (err) {
            console.log(err.message)
            res.status(500).json({msg:"Server error."})
        }
    },
    createPaymentRefund: async (req, res) => {
            const {form} = req.body
            const {payment_id,shopify_order_name,order_id,amount,notes,refund_type}= form
            const {user_id} = req.user
            // let user_id = 4

            try {
                const [tableCount,affectedRows] = await db.sequelize.query('INSERT INTO payment_refund SET '+
                    'payment_id = :payment_id, '+
                    'shopify_order_name = :shopify_order_name , '+
                    'order_id = :order_id , '+
                    'payments_id = :payment_id, '+
                    'amount = :amount ,'+
                    'status = 0, '+
                    'created_by_id = :user_id,'+
                    'notes = :notes , '+
                    'refund_type = :refund_type ',
                    {replacements:{
                        payment_id,
                        shopify_order_name,
                        order_id,
                        amount,
                        user_id,
                        notes,
                        refund_type
                    },type: db.sequelize.QueryTypes.INSERT
                    });

                if(affectedRows>0){
                    return  res.json({
                        msg:"Refund request created successfully."
                    })

                }else{
                    return  res.status(400).json({msg:"Error on creating refund request."})
                }

            } catch (err) {
                console.log(err.message)
                return res.status(500).json({msg:"Server error."})
            }

    },
    approvePaymentRefund: async (req,res)=>{
        const {form} = req.body
        const {id,total_amount}= form
        // const {user_id} = req.user
        let user_id = 4;


        try {

            const [refund_details]  = await db.sequelize.query('SELECT  * FROM payment_refund where id = :id ',{
                replacements:{
                    id
                },
                type: db.sequelize.QueryTypes.SELECT
            })


           


            const [order_details]  = await db.sequelize.query('SELECT  * FROM `order` where order_id = :order_id ',{
                replacements:{
                    order_id:refund_details.order_id
                },
                type: db.sequelize.QueryTypes.SELECT
            })


            if(!refund_details){
                return res.status(404).json({
                    msg:"Refund request not found, please reload the page and retry again."
                })
            }

            if(refund_details && refund_details.refund_status === 'success'){

                await db.sequelize.query('UPDATE payment_refund SET '+
                'status = 1, '+
                'approved_by_id = :user_id , '+
                'approved_at = now() '+
                'WHERE id = :id',
                {replacements:{
                    user_id,
                    id
                },type: db.sequelize.QueryTypes.UPDATE
                })

                return res.status(400).json({
                    msg:"Refund request was already accepted, please reload the page."
                })
            }


            const {order_id,shopify_order_name,amount} = refund_details


            const req_body = {
                "user_id":user_id,
                "order_id":order_id,
                "shopify_order_number":shopify_order_name.substr(3),
                "shopify_order_name":shopify_order_name,
                "amount":order_details.total_price,
                "refund_amount":amount,
                "refund_request_id":id
            }

            console.log(req_body)

            const response = await axios.post(process.env.FS_GRABPAY_API,req_body,{
                    headers:{
                        'Content-Type' : 'application/json',
                        'Access-Control-Allow-Origin': true,
                    }
                }
            );


            if(response.data.result.txStatus === 'success'){
                const [tableCount,affectedRows]  = await db.sequelize.query('UPDATE payment_refund SET '+
                    'status = 1, '+
                    'approved_by_id = :user_id , '+
                        'approved_at = now() '+
                        'WHERE id = :id',
                        {replacements:{
                            user_id,
                            id
                        },type: db.sequelize.QueryTypes.UPDATE
                        })

                       if(Number(order_details.total_price) == Number(amount)) {
                                await db.sequelize.query('UPDATE `order` SET '+
                                'payment_status_id = 3, '+
                                'refund_amount = :amount, '+
                                    'refunded = true '+
                                    'WHERE order_id = :order_id',
                                    {replacements:{
                                        amount,
                                        order_id
                                    },type: db.sequelize.QueryTypes.UPDATE
                                    })
    
                       }else{
                                await db.sequelize.query('UPDATE `order` SET '+
                                     'refund_amount = :amount + refund_amount '+
                                    'WHERE order_id = :order_id',
                                    {replacements:{
                                        amount,
                                        order_id
                                    },type: db.sequelize.QueryTypes.UPDATE
                                    })

                       }
                    if(affectedRows>0){
                        return  res.json({
                            msg:"Refund request accept successfully."
                        })

                    }else{
                        return  res.status(400).json({msg:"Error on accepting refund request."})
                    }

            }else if(response.data.result.txStatus === 'failed' && response.data.result.description === 'refund_exceeds_charge_amount' ){
                return  res.status(400).json({msg:"Error in processing refund: Exceed refund payment amount."})
            }else{
                return  res.status(400).json({msg:"Error on accepting refund request."})
            }



        } catch (err) {
            console.log("ERROR ON REFUND REQUEST: ",err)
            
            await db.sequelize.query('UPDATE payment_refund SET '+
            'status = 2, '+
            'approved_by_id = :user_id , '+
            'approved_at = now() '+
            'WHERE id = :id',
            {replacements:{
                user_id,
                id
            },type: db.sequelize.QueryTypes.UPDATE
            })
            if(err.response && err.response.data && err.response.data.result && err.response.data.result.description && err.response.status){
                let msg = err.response.data.result.description.replace(/_/g, ' ')
                msg = msg.charAt(0).toUpperCase() + msg.slice(1) +'.'
                return res.status(err.response.status).json({msg:'Error in processing refund: '+ msg})
            }else if(err.response && err.response.data &&  err.response.data.message && err.response.status){
                return res.status(err.response.status).json({msg: 'Error in processing refund: ' + err.response.data.message})
            }else if (err.response.status === 409){
                return  res.status(409).json({msg:"Error in processing refund: Refund tranction already exist."})
            }

            
            return res.status(500).json({msg:"Server error."})
        }

    },
    disapprovePaymentRefund: async (req,res)=>{
        const {form} = req.body
        const {id}= form

        // const {user_id} = req.user
        let user_id = 2


        try {

            const [refund_details]  = await db.sequelize.query('SELECT  * FROM payment_refund where id = :id ',{
                replacements:{
                    id
                },
                type: db.sequelize.QueryTypes.SELECT
            })

            if(refund_details && refund_details.status === 2){
                return res.status(400).json({
                    msg:"Refund request was already declined, please reload the page."
                })
            }

            const [tableCount,affectedRows]  = await db.sequelize.query('UPDATE payment_refund SET '+
                'status = 2, '+
                'approved_by_id = :user_id , '+
                'approved_at = now() '+
                'WHERE id = :id',
                {replacements:{
                    user_id,
                    id
                },type: db.sequelize.QueryTypes.UPDATE
                })

            if(affectedRows>0){
                return  res.json({
                    msg:"Refund request declined successfully."
                })

            }else{
                return  res.status(400).json({msg:"Error on declining refund request."})
            }
        } catch (err) {
            console.log(err.message)
            return res.status(500).json({msg:"Server error."})
        }

    }


}

module.exports = payment_refund




