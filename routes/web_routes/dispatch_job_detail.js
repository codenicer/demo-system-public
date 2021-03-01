const express = require('express');
const router = express.Router();
const m_auth = require('../../middleware/mid_auth');

const DispatchJobDetailController = require('../../controllers/dispatch_job_detail');

//default route /api/web/dispatch_job_detail
router.post('/tagDeliveredCpu/',DispatchJobDetailController.tagAsDeliveredCpu);
router.post('/tagDeliveredDelivery/',DispatchJobDetailController.tagAsDeliveredDelivery);

router.delete('/:dispatch_job_detail_id',m_auth, DispatchJobDetailController.cancelJobItem);
router.post('/:dispatch_job_id',m_auth, DispatchJobDetailController.addJobItem);
router.post('/undelivered',m_auth, DispatchJobDetailController.getUndelivered);
router.patch('/updateStatus/:dispatch_job_detail_id',m_auth, DispatchJobDetailController.updateStatus);

router.get('/',m_auth, DispatchJobDetailController.getAll);
router.patch('/redispatch/:dispatch_job_detail_id',m_auth, DispatchJobDetailController.redispatch);
router.patch('/redispatchCpu/:dispatch_job_detail_id',m_auth, DispatchJobDetailController.redispatchCpu);






module.exports = router;