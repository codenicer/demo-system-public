import {
  LOAD_TICKET_HISTORY,
  UPDATE_TICKET_HISTORY,
  GET_NEW_TICKETS_COUNT,
  UPDATE_NEW_TICKETS_COUNT,
  LOAD_TICKETS,
  UPDATE_TICKETS,
  UPDATE_SEL_TICKET,
  CLEAR_SEL_TICKETS,
} from '../types/ticketTypes'
import { WEB_SETFETCH, WEB_SUCCESS, WEB_ERROR } from '../types/webfetchTypes'
import axios from 'axios'
import * as types from '../../scripts/types/ticketTypes'
import moment from 'moment-timezone'

import { config, domain } from './../helpers/config_helper'

moment.tz.setDefault('Asia/Manila')
// ************ SETTINGS ************ //

// const domain = process.env.REACT_APP_API_URL
const pagesize = 15
// const config = {
//     headers:{
//         'Content-Type' : 'application/json',
//         'Access-Control-Allow-Origin': true,
//     }
// }

const CancelToken = axios.CancelToken
let getID = null
let intervalHistory = null
let isFetch = false

// ************ NEXT LINE ************ //

export const getNewTicketsCount = (user_hubs) => async (dispatch) => {
  const hub_to_array = user_hubs.map((x) => x.user_hub.hub_id)
  try {
    const res = await axios.get(
      `/api/web/ticket/count_new?hub_id=${JSON.stringify({
        list: hub_to_array,
      })}`
    )
    // console.log(res)
    await dispatch({ type: GET_NEW_TICKETS_COUNT, payload: res.data })
  } catch (err) {
    displayErr(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

export const updateTicketsCount = (data) => async (dispatch) => {
  //   console.log(data,'from actions')
  await dispatch({ type: UPDATE_NEW_TICKETS_COUNT, payload: data.count })
}

// ************ NEXT LINE ************ //

export const handleLoadTickets = (p) => async (dispatch, getState) => {
  const { isFetching } = getState().webFetchData
  try {
    const filter = JSON.stringify(getFilter(p))
    console.log(filter, 'HERE')
    const pagination = JSON.stringify({ pagesize, page: 0 })
    if (isFetching === false) await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/ticket?pagination=${pagination}&filters=${filter}`,
      config
    )
    await dispatch({ type: LOAD_TICKETS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg
    if (err.response) {
      errMsg = err.response.data.msg
    } else {
      errMsg = err.message
    }
    alert('ALERT FROM: LOAD TICKETS\n', errMsg)
  }
  // const filter = JSON.stringify(getFilter(p))
  // console.log(filter,"HERE")
}

// ************ NEXT LINE ************ //

export const loadSinglePageTicket = (ticket_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/web/ticket/${ticket_id}`)
    console.log(res, 'result here please')
    dispatch({ type: types.LOAD_SINGLE_PAGE_TICKET, payload: res.data })
  } catch (err) {
    let errMsg
    if (err.response) {
      errMsg = err.response.data.msg
    } else {
      errMsg = err.message
    }
    console.log('ALERT FROM: LOAD SINGLE PAGE TICKET\n', errMsg)
  }
}

// ************ NEXT LINE ************ //

export const updateSilglePageTicket = (data) => async (dispatch, getState) => {
  const { single_page_ticket } = getState().ticketData
  console.log('DATA:', data, 'SINGEL:', single_page_ticket)
  if (Object.keys(data).length > 0 && single_page_ticket.length > 0) {
    if (Number(data.ticket_id) === Number(single_page_ticket[0].ticket_id))
      dispatch({ type: types.LOAD_SINGLE_PAGE_TICKET, payload: [{ ...data }] })
  }
}

// ************ NEXT LINE ************ //

export const changePageTicket = (page, params) => async (dispatch) => {
  try {
    const filter = JSON.stringify(getFilter(params))
    const offset = pagesize * (page - 1)
    dispatch({ type: WEB_SETFETCH })
    const pagination = JSON.stringify({ pagesize, page: offset })
    const res = await axios.get(
      `/api/web/ticket?pagination=${pagination}&filters=${filter}`
    )
    await dispatch({ type: LOAD_TICKETS, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    displayErr(err, dispatch)
  }
}

export const fitlerTextOnchange = (page, filters) => async (dispatch) => {
  console.log('page', filters)
  if (filters[3].length >= 2 || (filters[3].length === 0 && isFetch === true)) {
    reset2()
    intervalHistory = setTimeout(async () => {
      try {
        getID = CancelToken.source()
        const filter = JSON.stringify(getFilter(filters))
        const offset = pagesize * (page - 1)
        dispatch({ type: WEB_SETFETCH })
        const pagination = JSON.stringify({ pagesize, page: 0 })

        const res = await axios.get(
          `/api/web/ticket?pagination=${pagination}&filters=${filter}`,
          {
            cancelToken: getID.token,
          }
        )
        isFetch = true
        if (!filter.includes('shopify')) isFetch = false
        await dispatch({ type: LOAD_TICKETS, payload: res.data })
        await dispatch({ type: WEB_SUCCESS })
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

// ************ NEXT LINE ************ //

function reset2() {
  clearTimeout(intervalHistory)
  if (getID !== null) getID.cancel('Api is being canceled')
}

// ************ NEXT LINE ************ //

export const loadTicketHistory = (p) => async (dispatch) => {
  console.log('HISTORY HERE')
  try {
    const filter = JSON.stringify(getFilter(p))
    // const filter = [{status_id:p[0]},{created_at:p[1]},{hub_id:p[2]},{shopify_order_name:p[3]}]
    dispatch({ type: WEB_SETFETCH })
    const pagination = JSON.stringify({ pagesize, page: 0 })
    const res = await axios.get(
      `/api/web/ticket/closed?pagination=${pagination}&filters=${filter}`
    )
    await dispatch({ type: LOAD_TICKET_HISTORY, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    displayErr(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

export const changePageTicketHistory = (page, params) => async (dispatch) => {
  try {
    const filter = JSON.stringify(getFilter(params))
    const offset = pagesize * (page - 1)
    dispatch({ type: WEB_SETFETCH })
    const pagination = JSON.stringify({ pagesize, page: offset })
    const res = await axios.get(
      `/api/web/ticket/closed?pagination=${pagination}&filters=${filter}`
    )
    await dispatch({ type: LOAD_TICKET_HISTORY, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    displayErr(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

export const fitlerTextOnchangeOnHistory = (page, filters) => async (
  dispatch
) => {
  if (filters[3].length >= 4 || (filters[3].length === 0 && isFetch === true)) {
    reset()
    intervalHistory = setTimeout(async () => {
      try {
        getID = CancelToken.source()
        const filter = JSON.stringify(getFilter(filters))
        const offset = pagesize * (page - 1)
        dispatch({ type: WEB_SETFETCH })
        const pagination = JSON.stringify({ pagesize, page: offset })
        const res = await axios.get(
          `/api/web/ticket/closed?pagination=${pagination}&filters=${filter}`,
          {
            cancelToken: getID.token,
          }
        )
        isFetch = true
        if (!filter.includes('shopify')) isFetch = false
        await dispatch({ type: LOAD_TICKET_HISTORY, payload: res.data })
        await dispatch({ type: WEB_SUCCESS })
      } catch (err) {
        if (axios.isCancel(err)) return console.log('Fetch canceled')
        let errMsg = err.message
        if (err.response.data.msg) errMsg = err.response.data.msg
        alert(errMsg)
      }
    }, 500)
  } else {
    reset()
  }
}

// ************ NEXT LINE ************ //

function reset() {
  clearTimeout(intervalHistory)
  if (getID !== null) getID.cancel('Api is being canceled')
}

// // ************ NEXT LINE ************ //

// export const filterTicket = (filter) => async (dispatch) =>{
//     try {
//         const pagination = {
//             pagesize,
//             page:0
//         }
//         const res = await axios.get(`/api/web/ticket/closed?pagination=${pagination}&filter=${filter}`)
//         await dispatch({type:GET_NEW_TICKETS_COUNT,payload:res.data.count})
//     } catch (err) {
//         displayErr(err,dispatch)
//     }
// }

// ************ NEXT LINE ************ //

export const updateTickets = (data, filter) => async (dispatch, getState) => {
  const { sel_ticket } = getState().ticketData
  const { page, hub, textFilter } = filter
  //   if(page === 1){
  const num = (Number(page) - 1) * Number(pagesize)
  let filteredData = data
  if (hub && hub.length > 0)
    filteredData = data.filter((x) => hub.includes(x.hub_id))

  if (textFilter !== '')
    filteredData = filteredData.filter((x) =>
      x.shopify_order_name.toLowerCase().includes(textFilter.toLowerCase())
    )

  const rows = filteredData.slice(Number(num), Number(num) + Number(pagesize))
  const count = filteredData.length
  await dispatch({ type: UPDATE_TICKETS, payload: { rows, count } })

  //  }

  if (sel_ticket !== null) {
    const index = data.findIndex((x) => sel_ticket.ticket_id === x.ticket_id)
    if (index === -1) {
      await dispatch({ type: UPDATE_SEL_TICKET, payload: null })
    }
  }
  //    await dispatch({type:UPDATE_TICKETS,payload:data})
}

export const closeSelTicket = () => async (dispatch) => {
  await dispatch({ type: UPDATE_SEL_TICKET, payload: null })
}

export const updateTicketsHistory = (data, filter) => async (
  dispatch,
  getState
) => {
  const {
    page,
    status,
    dateFilter,
    hub,
    textFilter,
    dispositionFilter,
  } = filter

  const num = (Number(page) - 1) * Number(pagesize)

  let filteredData = data
  console.log(filteredData, 'filter here :D')
  if (hub && hub.length > 0) {
    console.log(1)
    filteredData = data.filter((x) => hub.includes(x.hub_id))
  }

  if (textFilter !== '') {
    console.log(2)
    filteredData = filteredData.filter((x) =>
      x.shopify_order_name.toLowerCase().includes(textFilter.toLowerCase())
    )
  }

  if (status !== '') {
    console.log(3)
    filteredData = filteredData.filter((x) => x.status_id === status)
  }

  if (dispositionFilter !== '') {
    console.log(4)
    filteredData = filteredData.filter(
      (x) => x.disposition_id === dispositionFilter
    )
  }

  if (dateFilter !== '') {
    console.log(5)
    filteredData = filteredData.filter(
      (x) =>
        moment(x.created_at).format('YYYY-MM-DD') ===
        moment(dateFilter).format('YYYY-MM-DD')
    )
  }

  const rows = filteredData.slice(Number(num), Number(num) + Number(pagesize))

  const count = filteredData.length
  await dispatch({ type: UPDATE_TICKET_HISTORY, payload: { rows, count } })
}

// ************ NEXT LINE ************ //

export const resolveTicket = (data, callback) => async (dispatch) => {
  await dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.put(`/api/web/ticket/resolve`, data, config)
    await dispatch({ type: WEB_SUCCESS })
    callback('success', res.data.msg)
  } catch (err) {
    displayErr(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const closeTicket = (form, item, callback) => async (dispatch) => {
  await dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.put(
      `/api/web/ticket/oi_close`,
      { form, item },
      config
    )
    await dispatch({ type: WEB_SUCCESS })
    callback('success', res.data.msg)
  } catch (err) {
    displayErr(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const loadSelTicket = (seldata) => async (dispatch, getState) => {
  const { sel_ticket } = getState().ticketData
  console.log(sel_ticket, seldata)
  if (sel_ticket !== null) {
    sel_ticket.ticket_id === seldata.ticket_id
      ? dispatch({ type: CLEAR_SEL_TICKETS })
      : dispatch({ type: UPDATE_SEL_TICKET, payload: seldata })
  } else {
    dispatch({ type: UPDATE_SEL_TICKET, payload: seldata })
  }
}

// ************ NEXT LINE ************ //

function displayErr(err, dispatch, callback) {
  let errMsg = err.message
  if (err.response) {
    errMsg = err.response.data.msg
  } else {
    errMsg = err.message
  }
  dispatch({ type: WEB_ERROR })
  if (callback) callback('error', errMsg)
}

// ************ NEXT LINE ************ //

function getFilter(params) {
  let filter = {}
  params.forEach((p, i) => {
    if (p !== '') {
      switch (i) {
        case 0:
          filter = {
            ...filter,
            status_id: p,
          }
          break
        case 1:
          filter = {
            ...filter,
            created_at: moment(p).format('YYYY-MM-DD'),
          }
          break
        case 2:
          filter = {
            ...filter,
            hub_id: p,
          }
          break
        case 3:
          filter = {
            ...filter,
            shopify_order_name: p,
          }
          break
        case 4:
          filter = {
            ...filter,
            [p.colname]: p.id,
          }
          break
        case 5:
          filter = {
            ...filter,
            delivery_time: p,
          }
          break
        case 6:
          filter = {
            ...filter,
            disposition_id: p.value,
          }
          break
        default:
          break
      }
    }
  })
  return filter
}
