import {
  LOAD_ASSEMBLYJOB,
  LOAD_MY_ASSEMBLYJOB,
  UPDATE_ASSEMBLYJOB,
  LOAD_ASSEMBLYJOBTWO,
} from '../types/assemblyTypes'
import { WEB_SETFETCH, WEB_SUCCESS, WEB_ERROR } from '../types/webfetchTypes'
import axios from 'axios'
// import {rowWillChange} from '../helpers/helper'
import moment from 'moment-timezone'
import { queryStringHelper } from './../helpers/helper'
// ************ SETTINGS ************ //

import { config, domain } from './../helpers/config_helper'
const pagesize = 15

const CancelToken = axios.CancelToken
let getID = null
let intervalHistory = null
let isFetch = false
moment.tz.setDefault('Asia/Manila')

export const handleLoadAssemblyJob = (p) => async (dispatch) => {
  const filter = JSON.stringify(getFilter(p))
  console.log({ filter }, 'nag fetch')
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/assemblyjob?filters=${filter}`)
    await dispatch({ type: LOAD_ASSEMBLYJOB, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err)
  }
}

// ************ NEXT LINE ************ //

export const updateAssemblyJob = (data) => async (dispatch) => {
  dispatch({ type: UPDATE_ASSEMBLYJOB, payload: data })
}

// ************ NEXT LINE ************ //

export const acceptAssemblyJob = (form, callback) => async (dispatch) => {
  console.log(form)
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(`/api/web/assemblyjob/accept`, { form }, config)
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const cancelAssemblyJob = (form, callback) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(`/api/web/assemblyjob/cancel`, { form }, config)
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const submitAsseblyJob = (form, callback) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(
      `/api/web/assemblyjob/completed`,
      { form },
      config
    )
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const updateAssemblyJobPrinted = (form, callback) => async (
  dispatch
) => {
  console.log('PRINTED !!!!')
  const { order_id, ...toupdate } = form
  const _form = {
    order: {
      toUpdate: {
        ...toupdate,
      },
      where: {
        order_id,
      },
    },
  }
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(
      `/api/web/assemblyjob/printed`,
      {
        form: _form,
      },
      config
    )
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const handleLoadMyJob = () => async (dispatch) => {
  loadMyJob(dispatch)
}

// ************ NEXT LINE ************ //

// ************ NEXT LINE ************ //

async function loadMyJob(dispatch) {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/assemblyjob/myjob`)
    await dispatch({ type: LOAD_MY_ASSEMBLYJOB, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err)
  }
}

// ************ NEXT LINE ************ //

function dispatchError(err, dispatch, callback) {
  dispatch({ type: WEB_ERROR })
  const msg = filterMsg(err)
  callback ? callback('error', msg) : alert(msg)
  console.log(msg)
}

// ************ NEXT LINE ************ //

async function dispatchSuccess(res, dispatch, callback) {
  await dispatch({ type: WEB_SUCCESS })
  callback ? callback('success', res.data.msg) : alert(res.data.msg)
}

// ************ NEXT LINE ************ //

function filterMsg(err) {
  let filterMsg
  if (err.response.data) {
    filterMsg = err.response.data.msg
  } else {
    filterMsg = err.message
  }
  return filterMsg
}

// ************ SAMPLE DISPATCH ACTIONS RETURN ************ //

export const cancelOrder = (form, order, callback) => async (dispatch) => {
  const { order_id } = order
  const { cancel_status, cancel_reason } = form
  try {
    // rowWillChange(order_id)
    dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(
      `/api/web/order/cancel`,
      {
        order_id,
        cancel_status,
        cancel_reason,
      },
      config
    )
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

export const reDispatch = (data, callback) => async (dispatch) => {
  const { order_id } = data
  try {
    // rowWillChange(order_id);
    dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(`/api/web/order/cancel`, { order_id }, config)
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

export const rePrint = (type, shopify_order_name, callback) => async (
  dispatch
) => {
  dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.post(`/reprint`, {
      type,
      order_no: shopify_order_name,
    })

    if (res.data.msg === 'REDIRECTED') {
      window.open(res.data.url, '_blank')
      dispatch({ type: WEB_SUCCESS })
      callback('Successfully generated PDF.')
    } else {
      dispatch({ type: WEB_SUCCESS })
      callback(res.data.msg)
    }
  } catch (err) {
    console.log(err)
    dispatchError(err, dispatch, callback)
  }
}

export const fitlerTextOnchange = (filters) => async (dispatch) => {
  if (filters[3].length >= 2 || (filters[3].length === 0 && isFetch === true)) {
    reset2()
    intervalHistory = setTimeout(async () => {
      try {
        getID = CancelToken.source()
        const filter = JSON.stringify(getFilter(filters))
        console.log(filter)
        dispatch({ type: WEB_SETFETCH })
        await dispatch({ type: WEB_SETFETCH })
        const res = await axios.get(`/api/web/assemblyjob?filters=${filter}`, {
          cancelToken: getID.token,
        })
        isFetch = true
        if (!filter.includes('shopify')) isFetch = false
        await dispatch({ type: LOAD_ASSEMBLYJOB, payload: res.data })
        dispatch({ type: WEB_SUCCESS })
      } catch (err) {
        if (axios.isCancel(err)) return console.log('Fetch canceled')
        let errMsg = err.message
        if (err.response.data.msg) errMsg = err.response.data.msg
        alert(errMsg)
      }
    }, 800)
  } else {
    reset2()
  }
}

//@description: fetch all jobs with assigned riders
export const fetchAssemblyJobsTwo = (params) => async (dispatch) => {
  try {
    let queryString = queryStringHelper(params)
    queryString += `&filter[status][eq]=8&cache=` + Date.now()

    //final query Options: { limit: 30, offset: 0, where: { status: [String: '9'] } }
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch/assemblygab${queryString}`,
      config
    )
    await dispatch({ type: LOAD_ASSEMBLYJOBTWO, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

function reset2() {
  clearTimeout(intervalHistory)
  if (getID !== null) getID.cancel('Api is being canceled')
}

function getFilter(params) {
  let filter = {}
  if (params && params.length > 0) {
    params.forEach((p, i) => {
      if (p !== '') {
        switch (i) {
          case 0:
            return (filter = {
              ...filter,
              status_id: p,
            })
          case 1:
            return (filter = {
              ...filter,
              delivery_date: moment(p).format('YYYY-MM-DD'),
            })
          case 2:
            return (filter = {
              ...filter,
              hub_id: p,
            })
          case 3:
            return (filter = {
              ...filter,
              shopify_order_name: p,
            })
          case 4:
            return (filter = {
              ...filter,
              [p.colname]: p.id,
            })
          case 5:
            return (filter = {
              ...filter,
              delivery_time: p,
            })
          case 6:
            return (filter = {
              ...filter,
              disposition_id: p.value,
            })
          default:
            break
        }
      }
    })
  }
  return filter
}
