const db = require('../models')
const bcrypt = require('bcryptjs')
const Op = db.Sequelize.Op
const userModel = db.user
const hubModel = db.hub
const roleHubModel = db.role_hub
const userHubModel = db.user_hub
const moduleModel = db.module
const _ = require('lodash')
const { queryStringToSQLQuery } = require('../helper/queryStringToSQLQuery')
const { userFileUpload } = require('../helper/aws_file_upload')
const singleUpload = userFileUpload.single('image')

module.exports = {
  //get all users
  getUsers: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req, [
      'first_name',
      'last_name',
      'email',
    ])

    console.log('original', reqQs)

    try {
      const qs = {
        attributes: { exclude: ['password'], include: ['role_id'] },
        include: [
          {
            model: db.role,
            required: true,
          },
        ],
      }

      const finalQS = _.merge(reqQs, qs)

      console.log('final', finalQS)

      const result = await userModel.findAndCountAll(finalQS, { raw: true })

      if (!result) {
        res.status(401).json({ msg: 'No records found' })
      } else {
        //
        console.log('resutl', result)
        res.status(200).json(result)
      }
    } catch (err) {
      console.log('User Controller', err)
      res.status(400).json({ msg: 'Unable to process request' })
    }
  },
  //get user info of specified id
  getInfo: async (user_id, req, res, extended = false) => {
    try {
      const user = await userModel.findAll(
        {
          where: { user_id: { [Op.eq]: user_id } },
          attributes: { exclude: ['password'], include: ['role_id'] },
          include: [
            {
              model: db.role,
              required: true,
            },
            {
              model: db.hub,
              attributes: ['name'],
              required: true,
            },
          ],
        },
        { raw: true }
      )
      if (!user) {
        res.status(401).json({ msg: 'Record not found.' })
      } else {
        const return_data = {
          user_info: user[0],
        }
        if (extended) {
          const module_res = await moduleModel.findAll(
            {
              where: { active: 1 },
              include: [
                {
                  model: db.module_item,
                  //attributes:{ include:['active']},
                  required: true,
                  include: [
                    {
                      model: db.role_module_item,
                      required: false,
                      where: { role_id: { [Op.eq]: user[0].role_id } },
                    },
                  ],
                },
              ],
            },
            { raw: true }
          )
          if (module_res) {
            return_data.modules = module_res
          }
        }

        res.json(return_data)
      }
    } catch (err) {
      console.log('UserController error:', err)
      res.status(500).json({ msg: 'An error has occurred.' })
    }
  },

  getInfoV2: async (req, res, next) => {
    let extended = true
    try {
      const user = await userModel.findAll(
        {
          where: { user_id: { [Op.eq]: req.params.user_id } },
          attributes: { exclude: ['password'], include: ['role_id'] },
          include: [
            {
              model: db.role,
              required: true,
            },
            {
              model: db.hub,
              attributes: ['name'],
            },
          ],
        },
        { raw: true }
      )

      let jsonString = JSON.stringify(user)
      let obj = JSON.parse(jsonString)

      if (!user) {
        res.status(401).json({ msg: 'Record not found.' })
      } else {
        let return_data = {
          user_info: {
            user_id: obj[0].user_id,
            email: obj[0].email,
            first_name: obj[0].first_name,
            last_name: obj[0].last_name,
            img_src: obj[0].img_src,
            status: obj[0].status,
            role_id: obj[0].role_id,
            role: obj[0].role,
            hubs: obj[0].hubs,
            availableHubs: [],
          },
        }

        //Make a new property of availableHub to response

        //push all user_hubs to available hubs
        return_data.user_info.availableHubs.push(...obj[0].hubs)

        const availableHubs = await roleHubModel
          .findAll({
            where: {
              role_id: user[0].role_id,
            },
            attributes: ['role_id', 'hub_id'],
          })
          .catch((err) => {
            console.log('Cannot find available hubs', err)
          })

        for (hub in availableHubs) {
          console.log(availableHubs[hub].hub_id)

          let hubRes = await hubModel.findAll({
            where: {
              hub_id: availableHubs[hub].hub_id,
            },
          })

          let newHub = {
            name: hubRes[0].dataValues.name,
            user_hub: {
              user_id: user[0].user_id,
              hub_id: availableHubs[hub].hub_id,
            },
          }

          // push to availabehubs the role_hubs
          return_data.user_info.availableHubs.push(newHub)
        }

        console.log('FINISHHHH')

        //REMOVE ALL DUPLICATE VALUES IN AVAILABLE HUBS
        return_data.user_info.availableHubs = _.uniqWith(
          return_data.user_info.availableHubs,
          _.isEqual
        )

        res.json(return_data)
      }
    } catch (err) {
      console.log('UserController error:', err)
      res.status(500).json({ msg: 'An error has occurred.' })
    }
  },
  //insert user record to db to db
  createUser: async (req, res) => {
    const userData = req.body.user_form
    try {
      const result = await userModel.create(userData)

      if (!result) {
        console.log('User controller error: ', result)
        res.status(400).json({ msg: 'Unable to create user record' })
      } else {
        const hubs = _.each(req.body.hubs, (value) => {
          return { user_id: result.user_id }
        })
        const hub_result = await hubModel.bulkCreate(hubs)
        if (!hub_result) {
          console.log('User controller creating hub error: ', result)
          res
            .status(200)
            .json({ msg: 'User created. Unable to set user to hub' })
        } else {
          res.status(200).json({ msg: 'User successfully created.' })
        }
      }
    } catch (err) {
      console.log(err)
      res.status(400).json({ msg: 'Unable to create user record' })
    }
  },

  createUserV2: async (req, res) => {
    const userData = req.body.user_form
    const userHubs = req.body.hubs
    //START VALIDATION
    console.log(userData)
    if (
      !userData.email ||
      !userData.password ||
      !userData.first_name ||
      !userData.last_name ||
      !userData.role_id
    ) {
      return res.status(405).json({ msg: 'Please input all fields' })
    }

    //Check if valid email
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegexp.test(userData.email)) {
      return res.status(405).json({ msg: 'Please input valid email' })
    }

    //Check if email is already in database
    const checkEmail = await userModel
      .findAndCountAll({
        where: {
          email: userData.email,
        },
      })
      .catch((err) => {
        console.log('Cannot check email ', err)
      })

    console.log('COUNT', checkEmail.count)

    if (checkEmail.count >= 1) {
      //Already in the database
      return res.status(405).json({
        msg: 'Email is already in the database',
      })
    } else {
      try {
        bcrypt.hash(userData.password, 10, async (err, hash) => {
          // Store hash in your password DB.
          userData.password = hash
          userData.hub_id = 1
          userData.status = 1

          const createUser = await userModel.create(userData).catch((err) => {
            console.log('Error inserting user in database', err)
          })

          if (!createUser) {
            console.log('Error inserting user', err)
          } else {
            console.log('inserted id', createUser.dataValues.user_id)

            userHubs.forEach(async (e, i) => {
              console.log('HUB_ID', e.hub_id)

              let saveHub = await userHubModel
                .create({
                  user_id: createUser.dataValues.user_id,
                  hub_id: e.hub_id,
                })
                .catch((err) => {
                  console.log('Error inserting User hubs', err)
                })

              if (!saveHub) {
                console.log('Error inserting hubs')
              }
            })

            res.json({
              msg: 'User successfully saved in database',
              fileName: `${createUser.dataValues.last_name}_${createUser.dataValues.user_id}`,
              userEmail: createUser.dataValues.email,
            })
          }
        })
      } catch (err) {
        console.log(err)
        res.status(400).json({ msg: 'Unable to create user record' })
      }
    }
  },

  updateUser: async (id, req, res) => {
    const userData = req.userData

    try {
      const result = await userModel.find(id)

      if (!result) {
        res.status(401).json({ msg: 'Unable to find user record' })
      } else {
        const hubs = _.each(req.userHubs, (value) => {
          return { user_id: result.user_id }
        })

        const update_res = await userModel.update(userData)

        if (!update_res) {
        } else {
          //update hub if any
          if (req.userHubs) {
            const hub_result = await hubModel.findAll(
              { where: { user_id: result.user_id } },
              { raw: true }
            )
            if (!hub_result) {
              res.status(200).json({
                msg: 'User successfully update. User hubs was not updated.',
              })
            } else {
              //for delete
              const hub_exclude = _.filter(hub_result, (value) => {
                if (_.indexOf(req.userHubs, value.hub_id) === -1) {
                  return value.hub_id
                }
              })
              //ok
              const hub_update = _.filter(hub_result, (value) => {
                return _.indexOf(req.userHubs, value.hub_id) !== -1
              })
              //new but filtered from hub_update
              const new_hubs = _.filter(
                req.userHubs,
                (v) => !_.includes(hub_update, (rec) => rec.hub_id === v)
              )

              await hubModel.destroy({
                where: {
                  user_id: result.user_id,
                  [Op.in]: hub_exclude,
                },
              })
              await hubModel.bulkCreate(
                _.each(new_hub, (v) => {
                  return { user_id: result.user_id, hub_id: v }
                })
              )

              console.log('Error creating hubs for user:' + result.user_id)
              res
                .status(200)
                .json({ msg: 'User created. Unable to set user to hub' })
            }
          }
        }
      }
    } catch (err) {
      res.status(400).json({ msg: 'Unable to update user record' })
    }
  },

  updateUserV2: async (req, res) => {
    const userId = req.params.userId
    const userData = req.body.user_form
    const userHubs = req.body.hubs

    //START VALIDATION
    console.log(userData)
    if (
      !userData.email ||
      !userData.first_name ||
      !userData.last_name ||
      !userData.role_id
    ) {
      return res.status(405).json({ msg: 'Please input all fields' })
    }

    //Check if valid email
    const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

    if (!emailRegexp.test(userData.email)) {
      return res.status(405).json({ msg: 'Please input valid email' })
    }

    //Check if email is already in database
    const checkEmail = await userModel
      .findAndCountAll({
        where: {
          email: userData.email,
          user_id: { [Op.ne]: userId },
        },
      })
      .catch((err) => {
        console.log('Cannot check email ', err)
      })

    console.log('COUNT', checkEmail.count)

    if (checkEmail.count >= 1) {
      //Already in the database
      return res.status(405).json({
        msg: 'Email is already in the database',
      })
    }
    //END VALIDATION
    else {
      const findUser = await userModel
        .findAll({
          where: {
            user_id: userId,
          },
        })
        .catch((err) => {
          console.log('Cannot find User for Update', err)
        })

      if (!findUser) {
        console.log('Cannot find User for Update', err)
      } else {
        const updateU = await userModel
          .update(userData, {
            where: {
              user_id: userId,
            },
          })
          .catch((err) => {
            console.log('CANNOT UPDATE USER', err)
          })

        if (!updateU) {
          console.log('USER WONT UPDATE')
        } else {
          try {
            const delAll = await userHubModel.destroy({
              where: {
                user_id: userId,
              },
            })

            {
              console.log('DEL ROW', delAll)
              const hub_result = await userHubModel
                .bulkCreate(
                  _.map(userHubs, (v) => {
                    console.log('USERHUBS', userId)
                    return { user_id: userId, hub_id: v.hub_id }
                  })
                )
                .catch((err) => {
                  console.log('ERROR UPDATING USER HUBS', err)
                })

              if (!hub_result) {
                console.log('ERROR UPDATING USER HUBS')
              } else {
                res.json({
                  msg: 'User updated successfully',
                })
              }
            }
          } catch (error) {
            console.log('Error deleting user hubs', error)
          }
        }
      }
    }
  },

  getInfoOnLog: async (user_id, extended = false) => {
    try {
      const user = await userModel.findAll(
        {
          where: { user_id: { [Op.eq]: user_id } },
          attributes: { exclude: ['password'], include: ['role_id'] },
          include: [
            {
              model: db.role,
              required: true,
              seperate: true,
            },
            {
              model: db.hub,
              attributes: ['name'],
              required: false,
              seperate: true,
            },
          ],
        },
        { raw: true }
      )

      console.log('USER HERE', user)

      if (!user) {
        //res.status(401).json({msg: 'Record not found.'});
        return Promise.reject({ msg: 'An error has occurred.', status: 400 })
      } else {
        // console.log('user data :',user);
        const return_data = {
          user_info: user[0],
        }
        if (extended) {
          const module_res = await moduleModel.findAll(
            {
              where: { active: 1 },
              include: [
                {
                  model: db.module_item,
                  attributes: { include: ['active'] },
                  required: true,
                  include: [
                    {
                      model: moduleModel,
                      required: true,
                    },
                    {
                      model: db.role_module_item,
                      required: false, //@todo make sure to make it true to inforce permission list
                      where: { role_id: { [Op.eq]: user[0].role_id } },
                    },
                  ],
                },
              ],
              order: [[db.Sequelize.literal('module.priority'), 'ASC']],
            },
            { raw: true }
          )
          if (module_res) {
            return_data.modules = module_res
          }
        }
        return Promise.resolve(return_data)
      }
    } catch (err) {
      console.log('UserController error:', err)
      // res.status(500).json({msg: 'An error has occurred.'});
      return Promise.reject({ msg: 'An error has occurred.', status: 500 })
    }
  },
  simpleUpdate: async (req) => {
    const { toUpdate, user_id } = req.body.form.user
    try {
      let [numberOfAffectedRows] = await userModel.update(toUpdate, {
        where: { user_id },
      })
      return Promise.resolve({ numberOfAffectedRows })
    } catch (err) {
      console.log(err.message)
      return Promise.reject({ status: 500, msg: 'Server error' })
    }
  },

  //get all users
  getBCUsers: async (req, res) => {
    const reqQs = queryStringToSQLQuery(req, [
      'first_name',
      'last_name',
      'email',
    ])

    try {
      const qs = {
        attributes: ['user_id', 'first_name', 'last_name', 'email'],
      }

      const finalQS = _.merge(reqQs, qs)

      console.log('final', finalQS)

      const result = await userModel.findAndCountAll(finalQS, { raw: true })

      if (!result) {
        res.status(401).json({ msg: 'No records found' })
      } else {
        //
        console.log('resutl', result)
        res.status(200).json(result.rows)
      }
    } catch (err) {
      console.log('User Controller', err)
      res.status(400).json({ msg: 'Unable to process request' })
    }
  },

  changePassword: async (req, res) => {
    const email = req.body.email
    const passwordData = req.body.password_form

    //START VALIDATION
    console.log(email, passwordData)
    if (!email || !passwordData.old_password || !passwordData.new_password) {
      return res.status(405).json({ msg: 'Please input all fields' })
    }

    if (passwordData.old_password === passwordData.new_password) {
      return res
        .status(405)
        .json({ msg: 'Password must differ from old password.' })
    }

    try {
      //validate user
      const user = await userModel.findAll({
        where: {
          email,
        },
      })

      if (!user) {
        console.log('CANNOT FIND USER')
      }

      let isMatch = await bcrypt.compare(
        passwordData.old_password,
        user[0].dataValues.password
      )

      if (!isMatch) {
        res.status(406).json({ msg: 'Incorrect current password' })
      } else {
        //Hash the new password
        try {
          bcrypt.hash(passwordData.new_password, 10, async (err, hash) => {
            // Store hash in your password DB.
            passwordData.new_password = hash

            const updatePass = await userModel.update(
              {
                password: passwordData.new_password,
              },
              {
                where: {
                  email,
                },
              }
            )

            if (!updatePass) {
              console.log('Error updating user password')
            } else {
              res.json({ msg: 'Password updated successfully' })
            }
          })
        } catch (err) {
          console.log(err)
          res.status(400).json({ msg: 'Unable to create user record' })
        }
      }
    } catch (error) {
      console.log('CANNOT FIND USER IN THE DATABASE', error)
    }
  },

  userProfileUpload: async (req, res) => {
    singleUpload(req, res, async (err) => {
      if (err) return res.json(err)
      if (req.file) {
        console.log(req.file.location)
        //Insert the profile pic
        const saveProfileLink = await userModel.update(
          {
            img_src: req.file.location,
          },
          {
            where: {
              email: req.cEmail,
            },
          }
        )

        if (!saveProfileLink) {
          console.log('Error Inserting profile image')
        } else {
          return res.json({ imageUrl: req.file.location })
        }
      }
    })
  },
}
