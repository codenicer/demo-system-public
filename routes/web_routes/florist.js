const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')

const db = require('../../models');
const {next,commands } = require('../../helper/dynamic_emitter')
const {pool,} = require('../../config/db')
const FloristController = require('../../controllers/florist')

// @END POINT  : /api/web/florist

router.get('/',m_auth, async (req,res)=>{
    try {
        const florists = await pool.query('SELECT u.user_id,u.first_name,u.last_name,u.status FROM `user` u WHERE u.role_id = 3')
        const injobs = await pool.query(qs.loadFloristInjob)
        
        let filteredFlorists =  []
        
        florists.forEach(f=>{
            const index = injobs.findIndex(x=>x['user_id'] === f['user_id'])
            if(index >= 0){
                filteredFlorists.push({
                    user_info:f,
                    job:injobs[index]
                })
            }else{
                filteredFlorists.push({
                    user_info:f,
                    job:null
                 })
            }
        })
        res.json(filteredFlorists)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})


// ************ NEXT LINE ************ //

router.get('/v2', async (req,res)=>{
    try {
        const florists = await db.sequelize.query('SELECT u.user_id,u.first_name,u.last_name,u.status FROM `user` u WHERE u.role_id = 3',{type: db.sequelize.QueryTypes.SELECT})
    
        const injobs = await  db.sequelize.query(qs.loadFloristInQueue,{ type: db.sequelize.QueryTypes.SELECT})

        console.log(injobs.length)

        let filteredFlorist = []
        if(injobs.length > 0){
            florists.map(f=>{
                    const jobs = []
                    injobs.map(i=>{
                        if(f.user_id === i.user_id ){
                            jobs.push(i)
                        }
                    })
                    filteredFlorist.push({
                        user_info:{...f},
                        jobs
                    })
            })
        }else{
            filteredFlorist = florists.map(f=>{
                return{
                    user_info:{...f},
                    jobs:[]
                }
            })
        }
        res.json(filteredFlorist)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //

router.get("/pending",  m_auth, FloristController.floristQeuePending)



module.exports = router