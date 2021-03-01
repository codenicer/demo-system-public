const express = require('express')
const router = express.Router()
const {sock_domain} = require('../../config/db')
const clientsock = require('socket.io-client')(sock_domain)


router.get('/:key',async  (req,res)=>{
    const {key} = req.params 
       if(key ===  process.env.INTEGROMAT_SECRETE_KEY){
            clientsock.emit('SIGNAL_FROM_INTEGROMAT')
            res.json("Successful")
       }else{
          res.status(403).json("Access denied.")
       }
});


module.exports = router