const express = require('express')
const router = express.Router()
const qs = require('../../helper/query_string')
const { pool, sock_domain } = require('../../config/db')
const clientsock = require('socket.io-client')(sock_domain)
const bcrypt = require('bcryptjs')
const m_auth = require('../../middleware/mid_auth')
const jwt = require('jsonwebtoken')

// @route   : /api/web/auth

router.post('/', async (req, res) => {
  const { email, password } = req.body
  try {
    let users = await pool.query(qs.loginQuery, [email])
    // console.log(users)
    if (users.length > 0) {
      let user = users[0]
      const isMatch = await bcrypt.compare(password, user.password)

      if (isMatch) {
        // await  pool.query('Update `user` set status =  where user_id = ?',[user.user_id])
        const payload = { user: { user_id: user.user_id } }

        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '12h' },
          (err, token) => {
            // console.log('TOKEN HERE', token)
            if (err) throw err
            res.json({ token })
          }
        )
      } else {
        res.status(400).json({ msg: 'Invalid Credentials' })
      }
    } else {
      res.status(400).json({ msg: 'Invalid Credentials' })
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ msg: 'Server Error' })
  }
})

// ************ NEXT LINE ************ //

router.put('/logout', m_auth, async (req, res) => {
  const { user_info } = req.body
  try {
    switch (user_info.role_id) {
      case 3:
        floristOnLog_Emit(user_info['user_id'])
        break

      default:
        break
    }
    res.json({ msg: 'Logout' })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ msg: 'Server error.' })
  }
})

// ************ NEXT LINE ************ //

async function floristOnLog_Emit(user_id) {
  try {
    const injobs = await pool.query(qs.loadFloristInjob)
    const index = injobs.findIndex((x) => x['user_id'] === user_id)
    if (index < 0)
      await pool.query('UPDATE `user` set status = 1 WHERE user_id = ?', [
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
    res.status(500).json({ msg: 'Server error.' })
  }
}

//@todo

// modify auth to use models
// verify user and token upon hoc RequiredAuth
// save jwt to login users upon login
// jwt_users

module.exports = router
