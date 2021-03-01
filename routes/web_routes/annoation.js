const express = require('express')
const router = express.Router()
const m_auth = require('../../middleware/mid_auth')
const qs = require('../../helper/query_string')
// const {OrderHelper} = require('../../helper/helper_funtions')
const {pool} = require('../../config/db')
// const clientsock = require('socket.io-client')(sock_domain)
// const {tablerowResetEmit} = require('../../helper/socket_emitters')
// const {next,commands } = require('../../helper/dynamic_emitter')
// const {GETorders,GETholdjobs,GETforassignment,GETassemblerjob,GETtickets,GETassembler,GETassemblerInJob,GETclosedorder,GETtickets_counts} = commands


//@route : /api/web/ticket

// ************ NEXT LINE ************ //
// /ticket/annotations'
// @decs : filter annotation
router.get('/:ticket_id',m_auth,async (req,res)=>{
    const {ticket_id} = req.params
    try {
        const result =  await pool.query("UPDATE `ticket` SET viewed = 1 WHERE ticket_id = ? AND viewed = 0 ",[ticket_id])
        const anno = await pool.query(`${qs.loadTicketAnnotation} WHERE ta.ticket_id = ? ORDER BY ta.\`timestamp\` DESC  `,[ticket_id])
        // if(result.affectedRows  > 0){
        //     {[GETtickets]:true},{[GETtickets_counts]:true}])
        // }
        res.json(anno)
    } catch (err) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //
// /ticket/add_annotation
// @decs : add annotation

router.post('/',m_auth, async (req,res) =>{
    const {user_id} = req.user
    const {ticket_id,note} = req.body.form
    try {
        await pool.query("INSERT INTO ticket_annotation SET ticket_id = ? ,note = ? ,user_id = ?",[ticket_id,note,user_id])
        const anno = await pool.query(`${qs.loadTicketAnnotation} WHERE ta.ticket_id = ? ORDER BY ta.\`timestamp\` DESC `, [ticket_id])
        // clientsock.emit('SOMETHING_WILL_CHANGE',{
        //         ticket_annotations:anno
        // })
        res.json({msg:'Added new annotation'})  
    } catch (error) {
        console.log(err.message)
        res.status(500).json({msg:"Server error."})
    }
})

// ************ NEXT LINE ************ //




module.exports = router