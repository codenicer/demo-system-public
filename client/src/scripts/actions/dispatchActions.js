import * as types from '../types/dispatchTypes'
import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'
import axios from 'axios'
import { config, domain } from './../helpers/config_helper'
import { dispatchError } from './../helpers/dispatch_helper'
import { queryStringHelper } from './../helpers/helper'
import _ from 'lodash'
import moment from 'moment-timezone'
moment.tz.setDefault('Asia/Manila')
// ************ SETTINGS ************ //

//@description: fetch jobs for rider assignement
export const fetchHistoryJobs = (params) => async (dispatch) => {
  try {
    console.log('called fetchJobsForAssignment')
    //params will fetch other stuff for qs
    let queryString = queryStringHelper(params)

    //?page=1&pageSize=30
    // if(parseInt(order_status_id) > 0){
    //   queryString+= `&filter[order_status_id][eq]=${params.order_status_id}`
    // }

    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch/history${queryString}`,
      config
    )
    await dispatch({ type: types.LOAD_FOR_HISTORY_JOBS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
//@description: fetch jobs for rider assignement
export const fetchJobsForAssignment = (params) => async (dispatch) => {
  console.log('FETCH JOBS FOR ASSIGNMENT')
  let queryString = queryStringHelper(params)
  try {
    // console.log("called fetchJobsForAssignment",params);
    //params will fetch other stuff for qs

    if (params.hasOwnProperty('shopify_order_name')) {
      if (params.shopify_order_name.length > 0) {
        queryString += `&filter[shopify_order_name][like]=${params.shopify_order_name}`
      }
    }

    if (params.hasOwnProperty('delivery_date')) {
      if (params.delivery_date.length > 0) {
        queryString += `&filter[delivery_date][eq]=${moment(
          params.delivery_date
        ).format('YYYY-MM-DD')}`
      }
    }

    if (params.hasOwnProperty('hub_filter')) {
      if (params.hub_filter.length > 0 && params.hub_filter !== '-1') {
        queryString += `&filter[hub_id][in]=${params.hub_filter}`
      }
    }

    if (params.hasOwnProperty('delivery_time')) {
      if (params.delivery_time.length > 0) {
        queryString += `&filter[delivery_time][like]=${params.delivery_time}`
      }
    }

    if (params.hasOwnProperty('city_filter')) {
      if (params.city_filter.length > 0) {
        queryString += `&filter[city][like]=${params.city_filter.toLowerCase()}`
      }
    }
    if (params.hasOwnProperty('payment_method')) {
      if (params.payment_method.length > 0) {
        queryString += `&filter[payment_method][like]=${params.payment_method.toLowerCase()}`
      }
    }

    //   if (params.hasOwnProperty("city_filter")) {
    //     if(params.city_filter.length > 0){
    //         queryString += `&filter[city][like]=${params.city_filter.toLowerCase()}`;
    //     }

    // }

    if (params.hasOwnProperty('listCity')) {
      if (params.listCity) {
        queryString += '&listCity=1'
      }
    }

    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch/forassignment${queryString}`,
      config
    )

    console.log({ res })
    await dispatch({ type: types.LOAD_FOR_ASSINGMENT_JOBS, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
  queryString = null
}

export const fetchJobsForCpuDone = (args) => async (dispatch) => {
  //list of key thats not include on params for each
  let arrKey = ['page', 'pageSize']

  let queryString = `?page=${args.page}&pageSize=${args.pageSize}`

  //convert object param into array of arrays of key value pair
  Object.entries(args).forEach((param) => {
    //object key the equal to page and page size will be ignored
    //check arrkey variable
    if (!arrKey.includes(param[0]) && param[1]) {
      //if the value of an object is an array
      //use in operator
      if (Object.prototype.toString.call(param[1]) === '[object Array]') {
        queryString += `&filter[${param[0]}][in]=${param[1].toString()}`
      } else if (typeof param[1] === 'string') {
        queryString += `&filter[${param[0]}][like]=${param[1]}`
      } else {
        queryString += `&filter[${param[0]}][eq]=${param[1]}`
      }
    }
  })
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/dispatch/forcpudone${queryString}`)
    console.log('res', res.data)
    await dispatch({ type: types.LOAD_CPU_ORDERS, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
  queryString = null
}
//@description: create assignement for selected rider
export const createRiderAssignment = (data, callback) => async (dispatch) => {
  try {
    await dispatch({ type: types.PROCESS_FETCH, payload: true })
    const default_hub = localStorage.getItem('default_hub')
      ? localStorage.getItem('default_hub')
      : 1
    const res = await axios.post(
      `/api/web/dispatch/assignment`,
      { ...data, hub_id: default_hub },
      config
    )
    await dispatch({ type: types.CREATE_RIDER_ASSIGNEMENT })
    await dispatch({ type: types.PROCESS_FETCH, payload: false })
    callback(res.data.msg)
  } catch (err) {
    await dispatchError(err, dispatch)
  }
} //@description: create advance booking if job for dispatch
export const createAdvanceBooking = (data, callback) => async (dispatch) => {
  try {
    console.log('create called')
    await dispatch({ type: types.PROCESS_FETCH, payload: true })
    const default_hub = localStorage.getItem('default_hub')
      ? localStorage.getItem('default_hub')
      : 1
    const res = await axios.post(
      `/api/web/dispatch/advancebooking`,
      { ...data, hub_id: default_hub },
      config
    )
    await dispatch({ type: types.PROCESS_FETCH, payload: false })
    callback(res.data.msg)
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
//@description: fetch all jobs with assigned riders
export const fetchAssignedJobs = (params) => async (dispatch) => {
  try {
    let queryString = queryStringHelper(params)
    queryString += `&filter[status][eq]=8&cache=` + Date.now()

    //final query Options: { limit: 30, offset: 0, where: { status: [String: '9'] } }
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch/assigned${queryString}`,
      config
    )
    console.log('res.data', res.data)
    await dispatch({ type: types.LOAD_ASSIGNED_JOBS, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const fetchReadyToShipJobs = (params) => async (dispatch) => {
  try {
    let queryString = queryStringHelper(params)
    queryString += `&filter[status][eq]=8&cache=` + Date.now()

    //final query Options: { limit: 30, offset: 0, where: { status: [String: '9'] } }
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch/readytoship${queryString}`,
      config
    )
    await dispatch({ type: types.LOAD_READY_TO_SHIP, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

//@description:  update jobs for rider assignement will put on listener
export const updateJobsForAssignment = (data, params) => async (
  dispatch,
  getState
) => {
  console.log('updateJobsForAssignment', { data, params })
  const { for_assignment } = getState().dispatchData
  const { page, pageSize } = params
  console.log(params, 'update job for assignment params')
  if (data.count > pageSize) {
    const first_index = page * pageSize - 1
    const last_index = first_index + pageSize - 1
    const toUpdate = data.rows.slice(first_index, last_index + 1)
    dispatch({
      type: types.UPDATE_FOR_ASSINGMENT_JOBS,
      payload: {
        rows: toUpdate,
        count: toUpdate.length,
      },
    })
  } else {
    const filterRows = data.rows
    for_assignment.rows.forEach((row) => {
      const index = data.rows.findIndex((x) => x['job_id'] === row['job_id'])
      if (index !== -1) {
        filterRows.splice(index, 1)
      }
    })
    const newData = {
      count: data.count,
      rows: filterRows.concat(for_assignment.rows),
    }
    console.log(newData, 'socket io')
    dispatch({ type: types.UPDATE_FOR_ASSINGMENT_JOBS, payload: newData })
    //{oldData:for_assignment,newData:data}
  }
}
// ************ NEXT LINE ************ //
export const removeJobsForAssignment = (data) => async (dispatch, getState) => {
  const { for_assignment } = getState().dispatchData
  const { rows, count } = for_assignment
  let filteredData = []

  if (data && data.length > 0) {
    data.forEach((x) => {
      rows.forEach((y) => {
        x.job_id !== y.job_id && filteredData.push(y)
      })
    })
  }

  const newData = {
    count: count - data.length,
    rows: filteredData,
  }
  console.log(rows, "<';......;'>", filteredData)
  dispatch({ type: types.UPDATE_FOR_ASSINGMENT_JOBS, payload: newData })
  filteredData = null
}
// ************ NEXT LINE ************ //
//@description: fetch advance booking
export const fetchAdvanceJobs = (params) => async (dispatch) => {
  try {
    let queryString = queryStringHelper(params)
    queryString += `&filter[status][eq]=15` //advance booking status

    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch/advancebooking${queryString}`,
      config
    )
    await dispatch({ type: types.LOAD_ADVANCE_JOBS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

//@description: fetch intransit jobs
export const fetchIntransitJobs = (params) => async (dispatch) => {
  try {
    let queryString = queryStringHelper(params)
    queryString += `&filter[status][eq]=9` //advance booking status

    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch/intransit${queryString}`,
      config
    )
    await dispatch({ type: types.LOAD_INTRANSIT_JOBS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

//@description: get new tracking no
export const getTrackingNo = (params) => async (dispatch) => {
  try {
    //params will fetch other stuff for qs
    const default_hub = localStorage.getItem('default_hub')
      ? localStorage.getItem('default_hub')
      : 1
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch/generatetrackingno/${default_hub}`,
      config
    )
    await dispatch({ type: types.GET_TRACKING_NO, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
export const deleteJob = (params, callback = null) => async (dispatch) => {
  try {
    console.log('delete job called')
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/dispatch/deleteJob/${params.dispatch_job_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    if (_.isFunction(callback)) {
      callback(res.data.msg)
    }
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
export const deleteJobItem = (params, callback = null) => async (dispatch) => {
  try {
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.delete(
      `/api/web/dispatch_job_detail/${params.dispatch_job_detail_id}`,
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    if (_.isFunction(callback)) {
      console.log('calling callback deleteJobItem')
      callback(res.data.msg)
    }
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
export const shipDispatchJob = (params, callback = null) => async (
  dispatch
) => {
  try {
    console.log('ship job called')
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/dispatch/shipJob/${params.dispatch_data.dispatch_job_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })

    callback(res.data.msg)
  } catch (err) {
    console.log('error', err)
    await dispatchError(err, dispatch)
  }
}

export const shipDispatchJobVD = (params, callback = null) => async (
  dispatch
) => {
  try {
    console.log('ship job called')
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/dispatch/shipJobVD/${params.dispatch_data.dispatch_job_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })

    callback(res.data.msg)
  } catch (err) {
    console.log('error', err)
    await dispatchError(err, dispatch)
  }
}

export const addJobItem = (params, callback = null) => async (dispatch) => {
  try {
    console.log(params)

    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(
      `/api/web/dispatch_job_detail/${params.dispatch_job_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    if (_.isFunction(callback)) {
      callback(res.data.msg)
    }
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
export const setDispatchJobDetailStatus = (params, callback = null) => async (
  dispatch
) => {
  try {
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/dispatch_job_detail/updateStatus/${params.dispatch_job_detail_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    if (_.isFunction(callback)) {
      callback(res.data.msg)
    }
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const redispatchDetailJobItem = (params, callback = null) => async (
  dispatch
) => {
  try {
    console.log('params', params)
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/dispatch_job_detail/redispatch/${params.requestRedispatchForm.redispatchData.dispatch_job_detail_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    if (_.isFunction(callback)) {
      callback(res.data.msg)
    }
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const redispatchDetailJobItemCpu = (params, callback = null) => async (
  dispatch
) => {
  try {
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/dispatch_job_detail/redispatchCpu/${params.reqform.redispatchData.view_dispatch_job_detail_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    if (_.isFunction(callback)) {
      callback(res.data.msg)
    }
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const setRiderDetails = (params, callback = null) => async (
  dispatch
) => {
  try {
    console.log('params', params)

    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/dispatch/${params.dispatch_job_id}`,
      params,
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    if (_.isFunction(callback)) {
      callback(res.data.msg)
    }
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const fetchUndeliveredItems = (params, callback = null) => async (
  dispatch
) => {
  try {
    let queryString = queryStringHelper(params)
    queryString += `&filter[status][in]=11,16` //advance booking status

    //console.log('queryString', queryString);
    console.log({ queryString })
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch_job_detail/${queryString}`,
      config
    )
    await dispatch({ type: types.LOAD_UNDELIVERED_JOBS, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
    if (_.isFunction(callback)) {
      callback(res.data.msg)
    }
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const checkCPUDelivery = (cpu_order_ids) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/dispatch/cpubadge`, {
      cpu_order_ids,
    })

    await dispatch({ type: types.LOAD_FAIL_CPU, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const countNotes = (order_ids) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })

    const res = await axios.post(
      `/api/web/dispatch/notescount`,
      {
        order_ids,
      },
      config
    )

    await dispatch({ type: types.LOAD_NOTES_COUNT, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const fetchDashboard = (params) => async (dispatch) => {
  console.log('FETCH FETCH FETCH FETCH FETCH')
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/dispatch/orderDashboard`, params)
    await dispatch({ type: types.LOAD_DASHBOARD_DATA, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const getDispatchCount = (user_hubs) => async (dispatch) => {
  const hub_to_array = user_hubs.map((x) => x.user_hub.hub_id)
  try {
    const res = await axios.get(
      `/api/web/dispatch/count?hub_id=${hub_to_array}`
    )
    await dispatch({ type: types.UPDATE_DISPATCH_COUNT, payload: res.data })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
export const fetchNoteHistory = (params) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/dispatch/noteHistory/${params.order_id}`
    )

    // await dispatch({ type: orderReinstatementTypes.LOAD_REINSTATEMENT_ORDERS, payload: res.data});
    dispatch({ type: WEB_SUCCESS })
    return res.data
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchOrderStatus = (shopify_order_name, cb) => async (
  dispatch
) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/dispatch/order_status`, {
      shopify_order_name,
    })

    cb(res.data)
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
