import * as types from '../types/riderTypes'
import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'
import axios from 'axios'
import { queryStringHelper } from '../helpers/helper'
import { toast } from 'react-toastify'
import { config, domain } from './../helpers/config_helper'
import { dispatchError } from './../helpers/dispatch_helper'

// ************ SETTINGS ************ //

export const addRider = (form, callback) => async (dispatch) => {
  // @NOTE :  form {user_name,address}
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/rider/`, form, config)

    if (res) {
      await dispatch({ type: WEB_SUCCESS })
      callback(res.data.msg)
    }
  } catch (err) {
    if (err.response.data) {
      console.log('ERROR', err.response.data)

      await dispatch({ type: WEB_SUCCESS })
      return toast.warn(err.response.data.msg)
    }
  }
}

export const updateRider = (form, callback) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/rider/${form.rider_id}`,
      form,
      config
    )
    if (res) {
      await dispatch({ type: WEB_SUCCESS })
      callback(res.data.msg)
    }
  } catch (err) {
    if (err.response.data) {
      console.log('ERROR', err.response.data)
      await dispatch({ type: WEB_SUCCESS })
      return toast.warn(err.response.data.msg)
    }
  }
}

export const fetchAllRiders = (params) => async (dispatch) => {
  try {
    let queryString = queryStringHelper(params)
    //params will fetch other stuff for qs

    if (params.hasOwnProperty('search_name')) {
      if (params.shopify_order_name.length > 0) {
        queryString += `&filter[shopify_order_name][like]=${params.search_name}`
      }
    }

    console.log('rider', queryString)
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/rider/${queryString}`)
    console.log('RES', res)
    await dispatch({ type: types.LOAD_ALL_RIDERS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchSearchRider = (params) => async (dispatch) => {
  try {
    let queryString = queryStringHelper(params)

    console.log('hahaha', params)
    if (params.hasOwnProperty('search_name')) {
      queryString += `&filter[first_name][like]=${params.search_name}`
    } else if (params.hasOwnProperty('code')) {
      queryString += `&filter[code][like]=${params.code}`
    }

    console.log('search', queryString)
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/rider/${queryString}`)
    console.log('RES', res)
    await dispatch({ type: types.LOAD_ALL_RIDERS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const activatingRider = (params) => async (dispatch) => {
  try {
    let queryString = queryStringHelper(params)

    if (params.hasOwnProperty('search_name')) {
      queryString += `&filter[first_name][like]=${params.search_name}`
    } else if (params.hasOwnProperty('code')) {
      queryString += `&filter[code][like]=${params.code}`
    }
    if (params.hasOwnProperty('activate_status')) {
      queryString += `&=${params.activate_status}`
    }

    console.log(queryString)

    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/rider/${queryString}`)
    console.log('RES', res)
    await dispatch({ type: types.LOAD_ALL_RIDERS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchAvailableRiders = (params) => async (dispatch) => {
  try {
    //params will fetch other stuff for qs
    await dispatch({ type: types.RIDER_FETCH, payload: true })
    const res = await axios.get(`/api/web/rider/available_riders`)
    await dispatch({ type: types.LOAD_AVAILABLE_RIDERS, payload: res.data })
    dispatch({ type: types.RIDER_FETCH, payload: false })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchRider = (riderId) => async (dispatch) => {
  dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.get(`/api/web/rider/${riderId}`)
    await dispatch({ type: types.LOAD_RIDER, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchRiderProviders = (params) => async (dispatch) => {
  try {
    //params will fetch other stuff for qs
    await dispatch({ type: types.PROVIDER_FETCH, payload: true })
    const res = await axios.get(`/api/web/rider/providers`)
    console.log('RES', res)
    await dispatch({ type: types.LOAD_RIDER_PROVIDERS, payload: res.data })

    dispatch({ type: types.PROVIDER_FETCH, payload: false })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const updateRiderProviders = (data) => async (dispatch) => {
  dispatch({ type: types.UPDATE_AVAILABLE_RIDERS, payload: data })
}
