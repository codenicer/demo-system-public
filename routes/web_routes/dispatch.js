const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const DispatchController = require('../../controllers/dispatch')
const DispatchCountController = require('../../controllers/dispatch_count')
const RiderController = require('../../controllers/rider')
const MailController = require('../../controllers/mailer')

const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Manila");

const db = require("../../models");
const dispatchJobDetailModel = db.dispatch_job_detail;
const orderHistoryModel = db.order_history;
const axios = require("axios");

const {sock_domain} = require('../../config/db')
const clientsock = require('socket.io-client')(sock_domain);


//default route /api/web/dispatch

router.get('/forassignment', async (req, res) => {
  try {
    const result = await DispatchController.forassignment(req)
    res.status(200).json(result)
  } catch (err) {
    res.status(err.status).json({msg: err.msg})
  }
})

router.get('/forcpudone', m_auth, async (req, res) => {
  try {
    const result = await DispatchController.forCpuDone(req)
    res.status(200).json(result)
  } catch (err) {
    res.status(err.status).json({msg: err.msg})
  }
})

router.post('/cpubadge', m_auth, DispatchController.cpuBadge)
router.post('/notescount', m_auth, DispatchController.countNotes)
router.post('/orderDashboard', m_auth, DispatchController.dashboardData);
router.post('/dispatchDashboard', m_auth, DispatchController.dispatchDashboardData);
router.post('/dispatchDashboardList', m_auth, DispatchController.dispatchDashboardList);

// ************ NEXT LINE ************ //

// async function asyncForEach(array, callback) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array);
//   }
// }



router.post('/assignment', m_auth, async (req, res) => {

   //Validation
    
   let order_names = [];
   console.clear();

  console.log(req.body,"WEEEEE")  
   


   req.body.selectedData.forEach((item) => {
     order_names.push(item.shopify_order_name);
   });

   
   

   let checkAR = await dispatchJobDetailModel.findAll({
     where:{
       shopify_order_name: order_names,
       status: [8, 15]
     },
     raw: true
   })
   .catch(error => {
     {
       console.log("THERE's A PROBLEM DOING VALIDATION IN DISPATCH", error);
     }
   }) 

   if(checkAR.length){
     let alreadyAssFS = [];
    checkAR.forEach((item) => {
      alreadyAssFS.push(item.shopify_order_name);
    });
    

    //  console.log(alreadyAssFS,'HERE RUTHER');
     return res.status(404).json({
       msg: `The ${alreadyAssFS.join(", ")} is already book or assigned`
     })
   }

  try {
    const result = await DispatchController.create(req)
    

  //   await asyncForEach(req.body.selectedData, async(data)=>{

  //     try {
  //       if (data.type === "cash pickup" || data.type === "cash pick up"){
  //               await db.sequelize.query("UPDATE `job_rider` set status = 8 WHERE order_id = ?",{replacements:[data.order_id]})
  //       }else{
  //               await db.sequelize.query("UPDATE `order` set order_status_id = 8 WHERE order_id = ?",{replacements:[data.order_id]})
  // }
  //     } catch (err) {
  //       console.log({ERROR_HERE:err})
  //     }

     
        
  //   }); 
    

   

    const riders = await new Promise(resolve => {
      setTimeout(async () => {
        const riders = await RiderController.getAvailableRiders(req)
        return resolve(riders)
      }, 1000)
    })
    clientsock.emit('SOMETHING_WILL_CHANGE', {
      forassignment: {
        method: 'remove',
        rows: req.body.selectedData
      },

      riders
    })
    res.status(200).json({msg: result.msg})
  } catch (err) {
  
    res.status(err.status).json({msg: err.msg})
  }
})
router.post('/mail', m_auth, async (req, res, retry=0) => {

  if(req.body.mail.jobtype == 'delivery') {

    axios.post('https://events.sendpulse.com/events/id/53ca775a2aee464480c1bfe2f01a27be/7065626', {
      email: process.env.EMAIL_ENV === 'production' ? req.body.mail.customer_email : process.env.EMAIL_TO_DEVELOPMENT,
      phone: process.env.EMAIL_ENV === 'production' ? req.body.mail.customer_phone : process.env.EMAIL_TO_DEVELOPMENT,
      firstName: req.body.mail.first_name,
      orderNumber: req.body.shopify_order_name,
    })
      .then(function (response) {
        console.log('email supppose to be sent');

        orderHistoryModel.create({
          order_id: req.body.mail.order_id,
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
            console.log('Email retry', req.body.mail.shopify_order_name, retry);
            sendMail(url, row, retry);
          }, 2000)
        } else {
          orderHistoryModel.create({
            order_id: req.body.mail.order_id,
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
})

// ************ NEXT LINE ************ //

router.get('/assigned', m_auth, (req, res) => {
  DispatchController.assignedjob(req, res)
});

router.get('/readytoship', m_auth,  DispatchController.readyToShipJob);

router.get('/assemblygab', m_auth, DispatchController.assemblyGab);
router.get('/intransit', DispatchController.intransitJob)
router.get('/history', m_auth, DispatchController.history)
router.get('/advancebooking', m_auth, DispatchController.advanceBooking)
router.post('/advancebooking', m_auth, DispatchController.createAdvanceBooking)
router.get('/generatetrackingno', m_auth, DispatchController.generateTracking)
router.get('/generatetrackingno/:hub_id', m_auth, DispatchController.generateTracking)
router.post('/cpubadge', m_auth, DispatchController.cpuBadge)
router.post('/notescount', m_auth, DispatchController.countNotes)
router.patch('/deleteJob/:dispatch_job_id', m_auth, DispatchController.cancelJob)
router.patch('/shipJob/:dispatch_job_id', m_auth, DispatchController.shipJob)
router.patch('/shipJobVD/:dispatch_job_id', m_auth, DispatchController.shipJobVD)
router.patch('/deleteJobItem/:dispatch_job_detail_id', m_auth, DispatchController.removeDispatchItem)
router.get('/', m_auth, DispatchController.getAll)
router.patch('/:dispatch_job_id', m_auth, DispatchController.update)
router.get("/noteHistory/:orderId", DispatchController.fetchNoteHistory)
router.post("/order_status", m_auth, DispatchController.fetchOrderStatus)

router.get('/count',async (req,res) =>{
  
  const list_count = await DispatchCountController.forassignment_count(req);
  
  const jobAssigned_count = await DispatchCountController.assignedjob_count(req);

  const advance_count = await DispatchCountController.advancebooking_count(req);

  res.json({
    list_count,
    jobAssigned_count,
    advance_count
  })
})


module.exports = router
