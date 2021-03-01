const express = require('express');
const router = express.Router();
const m_auth = require('../../middleware/mid_auth');
const hubController = require('./../../controllers/hub');

//@default route : /api/web/hub
router.get('/', m_auth,  async (req,res) =>{
    hubController.getAll(res,res);
});
router.get('/list', m_auth, hubController.getListAll);

router.get('/:hub_id', m_auth, async (req,res) =>{
    hubController.getInfo(res,res);
});

router.post('/',m_auth, async (req,res) =>{
    hubController.create(req,res);
});
router.put('/',m_auth, async (req,res) =>{
    hubController.update(req,res);
});

module.exports = router;
