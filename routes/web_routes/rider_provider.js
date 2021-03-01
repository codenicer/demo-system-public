const express = require('express');
const router = express.Router();
const m_auth = require('../../middleware/mid_auth');
const ProviderController = require('../../controllers/rider_provider');

router.get('/:id',  m_auth, (req, res)=>{
    const {id} = req.params;
    ProviderController.getProvider(id, req, res);
});

router.get('/',  m_auth, (req, res)=>{
    ProviderController.getProviders(req, res);
});

router.post('/', m_auth, (req, res)=>{
    ProviderController.createProvider(req, res);
});

router.patch('/:providerId',  m_auth, (req, res) => {
    const {providerId} = req.params;
    ProviderController.updateProvider(providerId ,req, res);
})


module.exports = router