import axios from 'axios'
import * as types from '../types/roleTypes'
import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'
import { config, domain } from './../helpers/config_helper'
import { dispatchError } from './../helpers/dispatch_helper'
import { queryStringHelper } from '../helpers/helper'

// ************ NEXT LINE ************ //
//@description fetch permissions of a specific role
//@params role_id - int
export const fetchRoleInfo = (role_id, callback) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/role/${role_id}`, config)
    await dispatch({ type: types.LOAD_ROLE_INFO, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
export const setRolePermissions = (params, callback) => async (dispatch) => {
  try {
    console.log('params', params)

    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/role/permission/${params.role_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    callback(res.data.msg)
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
export const getModuleItems = (callback) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/role/getAllModuleItems`, config)
    await dispatch({ type: types.LOAD_MODULE_ITEMS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
export const createRole = (form, callback) => async (dispatch) => {
  // @NOTE :  form {hub_name,address}
  dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.post(`/api/web/role/`, form, config)
    await dispatch({ type: WEB_SUCCESS })
    callback(res.data.msg)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const updateRole = (params, callback) => async (dispatch) => {
  dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.patch(
      `/api/web/role/${params.role_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    callback(res.data.msg)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}
export const updateRoleStatus = (params, callback) => async (dispatch) => {
  dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.patch(
      `/api/web/role/updateStatus/${params.role_id}`,
      params,
      config
    )
    // loadRoles(dispatch)
    await dispatch({ type: WEB_SUCCESS })
    callback(res.data.msg)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

// NOTE : method replace on placing promise so we can put it on exported actions
export const fetchRoles = (params) => async (dispatch) => {
  try {
    //params will fetch other stuff for qs
    let queryString = queryStringHelper(params)
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/role/${queryString}`, config)
    await dispatch({ type: types.LOAD_ROLES, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
