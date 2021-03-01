import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Container from '../../../atoms/Container/Container'
import Paper from '../../../atoms/Paper/Paper'
import Input from '../../../atoms/Input/Input'
import Select from '../../../atoms/Select/Select'
import Checkbox from '../../../atoms/Checkbox/Checkbox'
import Button from '../../../atoms/Button/Button'
import Upload from '../../../components/Upload/Upload'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { toast } from 'react-toastify'
import _ from 'lodash'
import { connect } from 'react-redux'
import './UpdateUser.css'
import { config, domain } from './../../../scripts/helpers/config_helper'

//actions
import { updateUser, fetchUser } from '../../../scripts/actions/users'
import { handleLoadHubs } from '../../../scripts/actions/hubActions'

function UpdateUser(props) {
  const {
    userData: { user },
    hubData: { hubs },
  } = props
  const { handleLoadHubs } = props

  const [file, setFile] = useState()
  const [roles, setRoles] = useState([])
  const [newHubs, setNewHubs] = useState([])
  const [thumbnail, setThumbnail] = useState('')
  const [userData, setUserData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    role_id: '',
  })

  function fetchData() {
    const { userId } = props.match.params
    props.handleLoadHubs()
    props.fetchUser(userId)
  }

  //Fetch the user
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (user) {
      if (user.img_src) {
        setThumbnail(`${user.img_src}?${new Date().getTime()}`)
      } else {
        setThumbnail('')
      }
      setUserData(user)

      const ew = _.map(user.hubs, (req, i) => {
        console.log('REC ID', req.user_hub.hub_id)

        return {
          hub_id: req.user_hub.hub_id,
        }
      })
      console.log('NEW HUBS', ew)
      setNewHubs(ew)
    }
  }, [user])

  useEffect(() => {
    axios
      .get(`/api/web/role/`)
      .then((res) => {
        setRoles(res.data.rows)
      })
      .catch((err) => {
        console.log(err)
      })

    handleLoadHubs()
  }, [])

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const isValid = () => {
    if (
      !userData.email ||
      !userData.first_name ||
      !userData.last_name ||
      !userData.role_id
    ) {
      toast.warn('Please input all fields')
      return false
    }

    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (window.confirm('Do you want to proceed?')) {
      if (isValid()) {
        let userForm = {
          user_form: userData,
          hubs: newHubs,
        }

        let fileName = `${userData.last_name}_${props.match.params.userId}`

        props.updateUser(
          userForm,
          userData.email,
          props.match.params.userId,
          file,
          fileName,
          (msg) => {
            toast.success(msg)
            fetchData()
            props.history.push('/system/user/list')
          }
        )

        console.log('HANDLE SUBMIT')
      }
    } else {
      return false
    }
  }

  const handleHubs = (hub_id) => {
    console.log('HANDLE_HUBS', hub_id)

    //{"hub_id": 4}
    let hubObj = {
      hub_id,
    }

    if (_.find(newHubs, hubObj)) {
      let someArray = newHubs.filter((hub) => hub.hub_id !== hubObj.hub_id)

      setNewHubs(someArray)
    } else {
      setNewHubs([...newHubs, hubObj])
    }
  }

  const handleCheckBox = () => {
    return (
      user &&
      hubs.map((value, key) => {
        const x = _.filter(newHubs, (rec, i) => {
          return parseInt(rec.hub_id) === parseInt(value.hub_id)
        })
        return (
          <Checkbox
            label={value.name}
            onClick={() => handleHubs(value.hub_id)}
            key={key}
            checked={x.length > 0 ? true : false}
            color="secondary"
          />
        )
      })
    )
  }

  const onChangeImage = (e) => {
    if (e.target.files[0]) {
      setThumbnail(URL.createObjectURL(e.target.files[0]))
      setFile(e.target.files[0])
    }
  }

  return (
    <Container css="pad-1 grd grd-gp-1 gtr-af over-hid">
      {console.log('NEWHUBS', newHubs)}
      <span className="header">Update User</span>
      <Paper css="grd grd-gp-1 create_user-wrap over-hid over-y-auto scroll">
        <form>
          <div className="grd grd-col asc">
            <div className="grd grd-col aic jic user-wrap">
              {!thumbnail ? (
                <div
                  className="round grd aic jic"
                  style={{
                    background: '#929292',
                    height: '200px',
                    width: '200px',
                    fontSize: '120px',
                  }}
                >
                  <FontAwesomeIcon icon={faUser} color="white" />
                </div>
              ) : (
                <img
                  src={thumbnail}
                  alt=""
                  width="200px"
                  height="200px"
                  className="round over-hid"
                  style={{ objectFit: 'cover' }}
                  accept="image/x-png,image/gif,image/jpeg"
                />
              )}
              <Upload
                css="ase point"
                onChange={(e) => {
                  onChangeImage(e)
                }}
              />
            </div>
            <div className="grd grd-gp-1 pad-2">
              <span className="label">Email:</span>
              <Input
                type="email"
                css="pad-1"
                name="email"
                value={userData.email}
                onChange={(e) => handleChange(e)}
              />
              <span className="label">Firstname:</span>
              <Input
                css="pad-1"
                name="first_name"
                value={userData.first_name}
                onChange={(e) => handleChange(e)}
              />
              <span className="label">Lastname:</span>
              <Input
                css="pad-1"
                name="last_name"
                value={userData.last_name}
                onChange={(e) => handleChange(e)}
              />
              <span className="label">Role:</span>
              <Select
                css="pad-1"
                name="role_id"
                value={userData.role_id}
                onChange={(e) => handleChange(e)}
              >
                <option value="" />
                {roles.map((value, key) => {
                  return (
                    <option key={key} value={value.role_id}>
                      {value.title}
                    </option>
                  )
                })}
              </Select>
            </div>
          </div>
          <div className="grd hub-wrap">
            <hr style={{ border: '1px solid black', width: '100%' }} />
            <span className="header-3">Hubs:</span>
            <div
              className="grd pad-2 grd-gp-2"
              style={{ gridTemplateColumns: '1fr 1fr' }}
            >
              {handleCheckBox()}
            </div>
          </div>

          <Button color="success" onClick={handleSubmit}>
            Update User
          </Button>
          <Button
            color="warning"
            css="mar-1"
            onClick={() => props.history.push('/system/user/list')}
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </Container>
  )
}

const MapStateToProps = (state) => {
  console.log('STATE FROM REDUCERS', state)

  return {
    userData: state.userData,
    hubData: state.hubData,
    isFetching: state.webFetchData.isFetching,
  }
}

export default connect(MapStateToProps, {
  updateUser,
  fetchUser,
  handleLoadHubs,
})(UpdateUser)
