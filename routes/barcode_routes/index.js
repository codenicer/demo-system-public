const express = require("express");
const router = express.Router();
const m_auth = require("../../middleware/mid_auth");
const RiderController = require("../../controllers/rider");
const UserController = require("../../controllers/user");
const DispatchController = require("../../controllers/dispatch");
const DispatchJobDetailController = require("../../controllers/dispatch_job_detail");
const {
  AnotherRider,
  Undelivered,
  Delivered
} = require("../../middleware/barcode_middleware");

router.get("/rider/available", RiderController.getBCAvailableRiders);
router.get("/user/dispatchers", UserController.getBCUsers);
router.post("/rider", RiderController.createBCRider);
router.get("/provider", RiderController.getBCRiderProvider);
router.post("/provider", RiderController.createBCRiderProvider);
router.get("/dispatch/forassignment", DispatchController.forassignment);
router.post("/dispatch/createBooking", DispatchController.createBCAdvance);
router.get("/dispatch/advance", DispatchController.advanceBCBookings);
router.get("/dispatch/assigned", DispatchController.assignedBCBookings);
router.patch("/dispatch/:dispatch_job_id", DispatchController.cancelJob);

router.post(
  "/dispatch/createRiderAssignment",
  DispatchController.createBCAssigned
);

router.patch(
  "/dispatch/shipJob",
  (req, res, next) => {
    req.params.dispatch_job_id = req.body.dispatch_job_id;
    console.log(req.body.dispatch_job_id);
    next();
  },
  DispatchController.shipJob
);

router.post(
  "/dispatch/dispatch_job_detail/:dispatch_job_id",
  DispatchJobDetailController.addremoveBCJobItem
);

router.delete("/deleteJob/:dispatch_job_id", DispatchController.cancelJob);
//router.delete('/dispatch_job_item/undelivered', DispatchJobDetailController.getUndelivered);
router.patch(
  "/dispatch/assigned/:dispatch_job_id",
  AnotherRider,
  DispatchController.update
);

router.patch(
  "/dispatch_job_item/undelivered",
  Undelivered,
  DispatchJobDetailController.updateStatus
);

router.patch(
  "/dispatch_job_item/delivered",
  Delivered,
  DispatchJobDetailController.updateStatus
);
module.exports = router;
