const express = require("express");
const router = express.Router();
const m_auth = require('../../middleware/mid_auth');
const RiderController = require('../../controllers/rider');
//default route /api/web/rider

router.get('/available_riders',m_auth,async (req,res)=>{
    try {
        const result = await  RiderController.getAvailableRiders(req)
        res.status(200).json(result)
    } catch (err) {
        res.status(err.status).json({msg:err.msg})
    }

});

//expects provider data
router.post("/autocreate", m_auth, RiderController.autoCreateRider);
router.get("/providers", m_auth, RiderController.getRiderProvider);
router.get("/:rider_id", m_auth, RiderController.getInfo);
router.get("/", m_auth, RiderController.getRiders);
router.patch("/:rider_id", m_auth, RiderController.update);
router.post("/", m_auth, RiderController.create);
router.post("/riderInfo", m_auth, RiderController.getRiderInfoToOrder);

module.exports = router;
