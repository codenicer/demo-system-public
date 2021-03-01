const express = require('express');
const router = express.Router();
const m_auth = require('../../middleware/mid_auth');
const RoleController = require('../../controllers/role');

//default route /api/web/role


//expects the provider data
router.patch('/permission/:role_id',m_auth,RoleController.setPermission);
router.get('/getAllModuleItems',m_auth, RoleController.getAllModuleItems);
router.get('/list',m_auth, RoleController.showList);
router.get('/:role_id',m_auth,RoleController.getInfo);

router.patch('/updateStatus/:role_id',m_auth,RoleController.updateStatus);
router.patch('/:role_id',m_auth,RoleController.update);
router.get('/',m_auth, RoleController.getRoles);
router.post('/',m_auth, RoleController.create);



module.exports = router