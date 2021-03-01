import axios from 'axios'
import * as hubtypes from '../types/hubTypes'
import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'
import { config, domain } from './../helpers/config_helper'
import { dispatchSuccess, dispatchError } from './../helpers/dispatch_helper'
import { queryStringHelper } from '../helpers/helper'

export const handleLoadHubs = () => async (dispatch) => {
  await dispatch({ type: WEB_SETFETCH })
  loadHubs(dispatch)
}

// ************ NEXT LINE ************ //

export const addHub = (form, callback) => async (dispatch) => {
  // @NOTE :  form {hub_name,address}
  dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.post(`/api/web/hub/`, form, config)
    loadHubs(dispatch)
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const updateHub = (form, callback) => async (dispatch) => {
  console.log('fomrinings', form)
  dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.put(`/api/web/hub/`, form, config)
    loadHubs(dispatch)
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

// NOTE : method replace on placing promise so we can put it on exported actions
async function loadHubs(dispatch) {
  try {
    const res = await axios.get(`/api/web/hub/`, config)

    await dispatch({ type: hubtypes.LOAD_HUBS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchHubs = (params) => async (dispatch) => {
  try {
    let queryString = queryStringHelper(params)
    const res = await axios.get(`/api/web/hub/list${queryString}`, config)

    await dispatch({ type: hubtypes.LOAD_HUB_LIST, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}
