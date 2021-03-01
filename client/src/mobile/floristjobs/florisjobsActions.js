//import {DOMAIN} from "../reducers/Login-Reducer"
import {
  LOAD_MFLORISTJOBS,
  SET_FETCH,
  LOAD_MOBILE_FLORISTJOBS,
  LOAD_MINJOB,
  LOAD_MHOLDJOB,
  UPDATE_MHOLDJOB,
  LOADING_PENDING_FLORIST,
} from './floristjobsTypes'
import axios from 'axios'
import { WEB_SETFETCH, WEB_SUCCESS } from '../../scripts/types/webfetchTypes'
import { queryStringHelper } from '../../scripts/helpers/helper'
import { config, domain } from '../../scripts/helpers/config_helper'
const pagesize = 15

const CancelToken = axios.CancelToken
let getID = null
let intervalHistory = null
let isFetch = false

export const loadJobs = () => async (dispatch) => {
  try {
    dispatch({ type: WEB_SETFETCH })
    const results = await axios.get(`/api/mobile/orderitem`)
    await dispatch({
      type: LOAD_MOBILE_FLORISTJOBS,
      payload: results.data.rows,
    })
    console.log({ results })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const socketUpdate = (filters) => async (dispatch) => {
  const sFilters = JSON.stringify(filters)
  const pagination = JSON.stringify({ limit: pagesize, offset: 0 })
  try {
    const { data } = await axios.get(
      `/api/mobile/orderitem?pagination=${pagination}&filters=${sFilters}`
    )
    await dispatch({ type: LOAD_MFLORISTJOBS, payload: data })
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const loadJobsTablet = (filters) => async (dispatch) => {
  const sFilters = JSON.stringify(filters)
  console.log({ sFilters })
  //const offset = pagesize * (page - 1)
  const pagination = JSON.stringify({ limit: pagesize, offset: 0 })
  try {
    dispatch({ type: WEB_SETFETCH })
    const { data } = await axios.get(
      `/api/mobile/orderitem?pagination=${pagination}&filters=${sFilters}`
    )
    await dispatch({ type: LOAD_MFLORISTJOBS, payload: data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const handleLoadJobChangePage = (filters, callback) => async (
  dispatch,
  getState
) => {
  const { florist_job } = getState().m_floristjobData
  const sFilters = JSON.stringify(filters)

  const { page } = filters
  const offset = pagesize * (page - 1)
  const pagination = JSON.stringify({ limit: pagesize, offset })
  try {
    const { data } = await axios.get(
      `/api/mobile/orderitem?pagination=${pagination}&filters=${sFilters}`
    )
    const newData = [...florist_job.rows, ...data.rows]
    await dispatch({
      type: LOAD_MFLORISTJOBS,
      payload: { rows: newData, count: data.count },
    })

    callback && callback(page)
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const loadJobsTabletAll = (filters, callback) => async (dispatch) => {
  const sFilters = JSON.stringify(filters)
  const pagination = JSON.stringify({ limit: pagesize, offset: 0 })
  try {
    dispatch({ type: WEB_SETFETCH })
    const { data } = await axios.get(
      `/api/mobile/orderitem/all?pagination=${pagination}&filters=${sFilters}`
    )
    await dispatch({ type: LOAD_MFLORISTJOBS, payload: data })

    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const updateFromSocketAll = (filters, callback) => async (dispatch) => {
  const sFilters = JSON.stringify(filters)
  const pagination = JSON.stringify({ limit: pagesize, offset: 0 })
  try {
    const { data } = await axios.get(
      `/api/mobile/orderitem/all?pagination=${pagination}&filters=${sFilters}`
    )
    await dispatch({ type: LOAD_MFLORISTJOBS, payload: data })
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const jobsTabletAllChangePAge = (filters, callback) => async (
  dispatch,
  getState
) => {
  const { florist_job } = getState().m_floristjobData
  const sFilters = JSON.stringify(filters)
  const { page } = filters
  const offset = pagesize * (page - 1)
  const pagination = JSON.stringify({ limit: pagesize, offset })
  try {
    const { data } = await axios.get(
      `/api/mobile/orderitem/all?pagination=${pagination}&filters=${sFilters}`
    )
    const newData = [...florist_job.rows, ...data.rows]
    await dispatch({
      type: LOAD_MFLORISTJOBS,
      payload: { rows: newData, count: data.count },
    })
    callback && callback(page)
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const loadJobsTabletHistry = (filters) => async (dispatch) => {
  console.log('load history list')
  const sFilters = JSON.stringify(filters)
  const pagination = JSON.stringify({ limit: pagesize, offset: 0 })
  try {
    dispatch({ type: WEB_SETFETCH })
    const { data } = await axios.get(
      `/api/mobile/orderitem/history?pagination=${pagination}&filters=${sFilters}`
    )
    await dispatch({ type: LOAD_MFLORISTJOBS, payload: data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const jobsTabletHistoryChangePAge = (filters, callback) => async (
  dispatch,
  getState
) => {
  console.log('history change page')
  const { florist_job } = getState().m_floristjobData
  const sFilters = JSON.stringify(filters)
  const { page } = filters
  const offset = pagesize * (page - 1)
  const pagination = JSON.stringify({ limit: pagesize, offset })
  try {
    const { data } = await axios.get(
      `/api/mobile/orderitem/history?pagination=${pagination}&filters=${sFilters}`
    )
    const newData = [...florist_job.rows, ...data.rows]
    await dispatch({
      type: LOAD_MFLORISTJOBS,
      payload: { rows: newData, count: data.count },
    })
    callback && callback(page)
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(err)
  }
}

export const handleLoadInJob = () => async (dispatch) => {
  loadInjob(dispatch)
}

export const handleLoadHoldJob = () => async (dispatch) => {
  loadHoldJob(dispatch)
}

export const updateJobs = (jobs) => async (dispatch) => {
  await dispatch({ type: LOAD_MOBILE_FLORISTJOBS, payload: jobs })
}

export const updateJobsFromTablet = (jobs, filters, sort, page) => async (
  dispatch,
  getState
) => {
  const { florist_job } = getState().m_floristjobData

  let filteredJob = []
  if (page === 1) {
    if (sort.state === 0 && jobs !== null) {
      switch (filters.length) {
        case 1:
          console.log('CASE 1')
          filteredJob = jobs.filter(
            (f) => f.delivery_time && f.delivery_time.includes(filters[0].name)
          )
          break
        case 2:
          console.log('CASE 2')
          filteredJob = jobs.filter(
            (f) =>
              f.delivery_time &&
              (f.delivery_time.includes(filters[0].name) ||
                f.delivery_time.includes(filters[1].name))
          )
          break
        case 3:
          console.log('CASE 3')
          filteredJob = jobs.filter(
            (f) =>
              f.delivery_time &&
              (f.delivery_time.includes(filters[0].name) ||
                f.delivery_time.includes(filters[1].name) ||
                f.delivery_time.includes(filters[2].name))
          )
          break
        case 4:
          console.log('CASE 4')
          filteredJob = jobs.filter(
            (f) =>
              f.delivery_time &&
              (f.delivery_time.includes(filters[0].name) ||
                f.delivery_time.includes(filters[1].name) ||
                f.delivery_time.includes(filters[2].name) ||
                f.delivery_time.includes(filters[3].name))
          )
          break
        default:
          console.log('CASE default')
          filteredJob = jobs
          break
      }

      const rows = filteredJob.slice(0, florist_job.length)
      const count = jobs.length
      await dispatch({
        type: LOAD_MFLORISTJOBS,
        payload: { rows: rows.slice(0, pagesize), count },
      })
      // fj.delivery_time.includes(f.delivery_time.name)
    }
  }
}

export const updateHoldJob = (job) => async (dispatch, getState) => {
  const { florist_holdjob } = getState()['m_floristjobData']
  if (florist_holdjob !== null) {
    if (job.length < 1) {
      dispatch({ type: UPDATE_MHOLDJOB, payload: null })
    } else {
      if (job[0]['order_item_id'] === florist_holdjob['order_item_id']) {
        dispatch({ type: UPDATE_MHOLDJOB, payload: job[0] })
      }
    }
  }
}

export const updateTableJobListv3 = (data) => async (dispatch, getState) => {
  let rows = getState().m_floristjobData.florist_job.rows
  let count = getState().m_floristjobData.florist_job.count

  console.log('HERE', { data })
  data.forEach((x) => {
    console.log(x)
    if (x.user_id !== 1) {
      console.log(1)
      count--
      rows = rows.filter((row) => row.job_florist_id !== x.job_florist_id)
    } else {
      console.log(2)
      const index = rows.findIndex(
        (row) => row.job_florist_id === x.job_florist_id
      )
      if (index !== -1) {
        rows[index] = x
      } else {
        rows = [x, ...rows]
        count++
      }
    }
  })
  await dispatch({ type: LOAD_MFLORISTJOBS, payload: { rows, count } })
}

export const fitlerTextOnchange = (value) => async (dispatch) => {
  if (value.length >= 4 || (value.length === 0 && isFetch === true)) {
    reset()
    intervalHistory = setTimeout(async () => {
      try {
        getID = CancelToken.source()
        const filter = JSON.stringify({ shopify_order_name: value })
        dispatch({ type: WEB_SETFETCH })
        const res = await axios.get(`/api/mobile/orderitem?filters=${filter}`, {
          cancelToken: getID.token,
        })
        isFetch = true
        await dispatch({
          type: LOAD_MOBILE_FLORISTJOBS,
          payload: res.data.rows,
        })
        await dispatch({ type: WEB_SUCCESS })
      } catch (err) {
        if (axios.isCancel(err)) return console.log('Fetch canceled')
        let errMsg = err.message
        if (err.response.data.msg) errMsg = err.response.data.msg
        alert(errMsg)
      }
    }, 800)
  } else {
    reset()
  }
}

// assigned job from tablet
export const assignJobTablet = (
  order_item_id_list,
  florist_id,
  callback
) => async (dispatch) => {
  try {
    //    console.log("JOBLIST:",job_id_list,"FLORIST_ID:",florist_id)
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(
      `/api/mobile/orderitem/tablet/assignjob`,
      { order_item_id_list, florist_id },
      config
    )
    console.log('RES:', res)
    await dispatch({ type: WEB_SUCCESS })
    callback && callback('success', res.data.msg)
  } catch (err) {
    let errMsg = err.message
    if (err.response) {
      errMsg = err.response.data.msg
    }
    callback && callback('error', errMsg)
  }
}

// cancel assigned job from tablet
export const cancelAssignedTablet = (
  order_item_id,
  florist_id,
  callback
) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(
      `/api/mobile/orderitem/tablet/assignjob/cancel`,
      { order_item_id, florist_id },
      config
    )
    console.log('RES:', res)
    await dispatch({ type: WEB_SUCCESS })
    callback && callback('success', res.data.msg)
  } catch (err) {
    let errMsg = err.message
    if (err.response) {
      errMsg = err.response.data.msg
    }
    callback && callback('error', errMsg)
  }
}

// done florist job from tablet
export const completeJobTablet = (
  order_item_id,
  florist_id,
  callback
) => async (dispatch) => {
  try {
    dispatch({ type: WEB_SETFETCH })

    const res = await axios.put(
      `/api/mobile/orderitem/tablet/complete`,
      { order_item_id, florist_id },
      config
    )

    await dispatch({ type: WEB_SUCCESS })
    callback && callback('success', res.data.msg)
  } catch (err) {
    let errMsg = err.message
    if (err.response) {
      errMsg = err.response.data.msg
    }
    callback && callback('error', errMsg)
  }
}

// hold florist job from tablet
export const holdJobTablet = (params, callback) => async (dispatch) => {
  const { order_item_id_list, hold_info } = params

  try {
    console.log(
      'order_item_id_list',
      order_item_id_list,
      'hold_info',
      hold_info
    )
    //    console.log("JOBLIST:",job_id_list,"FLORIST_ID:",florist_id)
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(
      `/api/mobile/orderitem/tablet/hold`,
      { order_item_id_list, hold_info },
      config
    )
    console.log({ res })
    await dispatch({ type: WEB_SUCCESS })
    callback && callback('success', res.data.msg)
  } catch (err) {
    let errMsg = err.message
    if (err.response) {
      errMsg = err.response.data.msg
    }
    callback && callback('error', errMsg)
  }
}

// ************ NEXT LINE ************ //

function reset() {
  clearTimeout(intervalHistory)
  if (getID !== null) getID.cancel('Api is being canceled')
}

export const acceptJob = (item) => async (dispatch) => {
  const { order_id } = item
  // rowWillChange(order_id)
  try {
    dispatch({ type: WEB_SETFETCH })
    await axios.put(`/api/mobile/orderitem/faccept`, { item }, config)

    loadInjob(dispatch)
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const completeJob = (item) => async (dispatch) => {
  const { order_id } = item
  try {
    dispatch({ type: WEB_SETFETCH })
    // rowWillChange(order_id)
    const res = await axios.put(
      `/api/mobile/orderitem/fcompleted`,
      { item },
      config
    )
    console.log(res.data.msg)
    loadInjob(dispatch)
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const holdJob = (item, form) => async (dispatch) => {
  const { order_id } = item
  try {
    dispatch({ type: SET_FETCH })
    //    rowWillChange(order_id)
    const res = await axios.put(
      `/api/mobile/orderitem/fhold`,
      { item, form },
      config
    )
    console.log(res.data.msg)
    loadInjob(dispatch)
    loadHoldJob(dispatch)
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const cancelAccept = (item) => async (dispatch) => {
  const { order_id } = item
  try {
    dispatch({ type: SET_FETCH })
    //    rowWillChange(order_id)
    const res = await axios.put(
      `/api/mobile/orderitem/cancelaccept`,
      { item },
      config
    )
    console.log(res.data.msg)
    loadInjob(dispatch)
    loadHoldJob(dispatch)
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const resumeJob = (item) => async (dispatch) => {
  const { order_id } = item
  try {
    //    rowWillChange(order_id)
    dispatch({ type: WEB_SETFETCH })
    const res = await axios.put(
      `/api/mobile/orderitem/fresumed`,
      { item },
      config
    )
    console.log(res.data.msg)
    loadInjob(dispatch)
    loadHoldJob(dispatch)
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

export const loadFloristPending = (params) => async (dispatch) => {
  console.log('fetching')
  let queryString = queryStringHelper(params)

  try {
    dispatch({ type: WEB_SETFETCH })
    const results = await axios.get(`/api/web/florist/pending/${queryString}`)
    await dispatch({ type: LOADING_PENDING_FLORIST, payload: results.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

async function loadHoldJob(dispatch) {
  try {
    dispatch({ type: WEB_SETFETCH })
    const results = await axios.get(`/api/mobile/orderitem/holdjob`)
    let holdjob
    if (results.data.length > 0) {
      holdjob = results.data[0]
    } else {
      holdjob = null
    }
    await dispatch({ type: LOAD_MHOLDJOB, payload: holdjob })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log(errMsg)
  }
}

async function loadInjob(dispatch) {
  try {
    dispatch({ type: WEB_SETFETCH })
    const results = await axios.get(`/api/mobile/orderitem/injob`)
    await dispatch({ type: LOAD_MINJOB, payload: results.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    //  let errMsg = err.message
    // if(err.response.data.msg) errMsg = err.response.data.msg
    console.log(err.message)
  }
}

// function dispatchError(err,dispatch,callback){
//     let errMsg = err.message
//         if(err.response.data.msg) errMsg = err.response.data.msg
//         dispatch({type:SET_ERROR,payload:{type:"warning",text:errMsg}})
//        if(callback) callback('error',errMsg)
//     }

// function dispatchSuccess(res,dispatch,callback){
//     dispatch({type:SET_OSUCCESS,payload:{type:"success",text:res.data.msg}})
//     if(callback)callback('success',res.data.msg)
//     console.log(res.data.msg)
// }
