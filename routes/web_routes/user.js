const express = require('express')
const router = express.Router()
const qs = require('../../helper/query_string')
const m_auth = require('../../middleware/mid_auth')
const { pool, sock_domain } = require('../../config/db')
const clientsock = require('socket.io-client')(sock_domain)
const UserController = require('../../controllers/user')

// base path /api/user

router.get('/', async (req, res) => {
  UserController.getUsers(req, res)
})

router.post('/create', m_auth, UserController.createUserV2)
router.patch('/update/:userId', m_auth, UserController.updateUserV2)

router.get('/me', m_auth, async (req, res) => {
  const { user_id } = req.user
  try {
    const return_data = await UserController.getInfoOnLog(user_id, true)
    switch (return_data.user_info.role_id) {
      case 3:
        floristOnLog_Emit(user_id, false)
        break

      default:
        break
    }
    res.json(return_data)
  } catch (err) {
    console.log(err)
    res.status(err.status).json(err.msg)
  }
})

router.patch('/password', m_auth, UserController.changePassword)
router.get('/:user_id', m_auth, UserController.getInfoV2)
router.post('/user_file_upload', UserController.userProfileUpload)

// ************ NEXT LINE ************ //

async function floristOnLog_Emit(user_id) {
  try {
    const injobs = await pool.query(qs.loadFloristInjob)
    const index = injobs.findIndex((x) => x['user_id'] === user_id)
    if (index < 0)
      await pool.query('UPDATE `user` set status =2 WHERE user_id = ?', [
        user_id,
      ])
    const florists = await pool.query(
      'SELECT u.user_id,u.first_name,u.last_name,u.status FROM `user` u WHERE u.role_id = 3'
    )
    let filteredFlorists = []
    florists.forEach((f) => {
      const _index = injobs.findIndex((x) => x['user_id'] === f['user_id'])
      if (_index >= 0) {
        filteredFlorists.push({
          user_info: f,
          job: injobs[_index],
        })
      } else {
        filteredFlorists.push({
          user_info: f,
          job: null,
        })
      }
    })

    clientsock.emit('SOMETHING_WILL_CHANGE', {
      florists: filteredFlorists,
    })
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = router

/*
  INFORMATIONS :
    1. Url end point (?url here)

    2. Private route

    3. It runs independently meaning there`s need to finish emitting last data to send a response back

  PROCESS :
    1.INTEGROMAT send a REQUEST to E2E API SERVER
            req. details [
                    >with key on its body
                    >PUT method

                    ex.
                        put(url,{
                            key:examplekeyhere123
                        },config)
            ]
    2.API will send back RESPONSE immediately if KEY of the req.body recognized then Emmit a signal to socket

    3.Socket server will then GET all the new data based on table column (created_at) (WHERE created_at > last_push_data_create_at)
            NOTE: last_push_data_create_at is from config table that are inserted on Process no.5

    4.After getting all new records it will push only to the user who is listening on it.
            NOTE: that socket is responsible of managing the records on how ,who and what are
                  the records to be emmit depends on user Pages and States

    5.Then save the emmit logs to Mysql Database and the last_push_data_create_at
*/
