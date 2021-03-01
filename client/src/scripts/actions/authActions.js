import {
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOAD_USER,
  USER_LOGOUT,
} from '../types/auth'
import { WEB_SETFETCH, WEB_ERROR } from '../types/webfetchTypes'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'
import socket from '../utils/socketConnect'

import { toast } from 'react-toastify'
import _ from 'lodash'

// ************ SETTINGS ************ //
// const domain = process.env.REACT_APP_API_URL
// const config = {
//     headers:{
//         'Content-Type' : 'application/json',
//         'Access-Control-Allow-Origin': true,
//     }
// }

import { config, domain } from './../helpers/config_helper'

// ************ NEXT LINE ************ //

export const handleLoadUser = (callback) => async (dispatch) => {
  try {
    dispatch({ type: WEB_SETFETCH })
    const res = await loadUser(dispatch)
    dispatch({ type: LOAD_USER, payload: res.data })
    callback && callback(res.data)
  } catch (err) {
    let errMsg = err.message
    if (err.response) {
      errMsg = err.response.data.msg
    } else {
      errMsg = err.message
    }
    console.log(errMsg, 'from load user')
  }
}

// ************ NEXT LINE ************ //

export const submitLogin = (user, callback, errorCallback) => async (
  dispatch,
  getState
) => {
  const { email, password } = user
  if (email === '' || password === '' || email === null || password === null) {
    errorCallback('Incomplete information.')
  } else {
    dispatch({ type: WEB_SETFETCH })
    try {
      const res = await axios.post(`/api/web/auth`, { email, password }, config)

      // console.log(res.data)

      await dispatch({ type: LOGIN_SUCCESS, payload: res.data.token })
      const { user } = getState().authData
      const _res = await loadUser(dispatch, user)

      dispatch({ type: LOAD_USER, payload: _res.data })
      socket.connect()
      callback()
    } catch (err) {
      let errMsg = err.message
      if (err.response) {
        errMsg = err.response.data.msg
      }

      if (_.isFunction(errorCallback)) {
        errorCallback(errMsg)
      } else {
        callback()
        alert(errMsg)
      }
    }
  }
}

// ************ NEXT LINE ************ //

export const userLogout = (user) => async (dispatch, getState) => {
  //logout
  try {
    dispatch({ type: WEB_SETFETCH })
    const {
      user: { user_info },
    } = getState().authData
    await axios.put(`/api/web/auth/logout`, { user_info }, config)
    //dispatch({type:WEB_SUCCESS})
    await dispatch({ type: USER_LOGOUT })
  } catch (err) {
    dispatch({ type: WEB_ERROR })
    let errMsg
    if (err.response.data.msg) {
      errMsg = err.response.data.msg
    } else {
      errMsg = err.message
    }
    alert(errMsg)
  }
}

// ************ NEXT LINE ************ //

async function loadUser(dispatch, user, callback) {
  if (user === null || user === undefined) {
    if (localStorage.token) setAuthToken(localStorage.token)
    try {
      const res = await axios.get(`/api/web/user/me`)

      if (res) {
        if (res.hasOwnProperty('data')) {
          //console.log('here')
          if (res.data.hasOwnProperty('user_info')) {
            //console.log('here1')
            if (res.data.user_info.hasOwnProperty('hubs')) {
              //console.log('here2')
              const hubs = res.data.user_info.hubs
              if (hubs[0].hasOwnProperty('user_hub')) {
                //console.log('here3')
                try {
                  localStorage.setItem(
                    'default_hub',
                    hubs[0]['user_hub']['hub_id']
                  )
                  //console.log('here4')
                } catch (e) {}
              }
            }
          }
        }
      }

      return Promise.resolve(res)
    } catch (err) {
      localStorage.clear()
      delete axios.defaults.headers.common['x-auth-token']
      let errMsg = err.message
      if (err.response.data.msg) {
        errMsg = err.response.data.msg
      } else {
        errMsg = err.message
      }
      dispatch({ type: LOGIN_FAILED, payload: errMsg })
      try {
        if (_.isFunction(callback)) {
          callback(errMsg)
        } else {
          toast.error(errMsg)
        }
      } catch (e) {
        alert(errMsg)
      }
    }
  }
}
