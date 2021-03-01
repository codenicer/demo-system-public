import * as orderTypes from '../types/ordersTypes'
import * as webTypes from '../types/webfetchTypes'
import * as logtypes from '../types/order_logTypes'
import * as notetypes from '../types/order_notesTypes'
import * as orderReinstatementTypes from '../types/order_reinstatementTypes'
import axios from 'axios'
import moment from 'moment-timezone'
import _ from 'lodash'
// import { rowWillChange } from '../helpers/helper'
import { config, domain } from './../helpers/config_helper'

const pagesize = 15
const CancelToken = axios.CancelToken
let getID = null
let gSearchCounter = 0
let interval
let isFetch = false
moment.tz.setDefault('Asia/Manila')

// ************ NEXT LINE ************ //

export const handleLoadOrders = () => async (dispatch) => {
  dispatch({ type: webTypes.WEB_SETFETCH })
  loadOrders(dispatch)
}

// ************ NEXT LINE ************ //

export const handleLoadOrderByPrio = () => async (dispatch) => {
  loadOrderByPrio(dispatch)
}

// ************ NEXT LINE ************ //

export const hadleLoadClosedOrder = (params) => async (dispatch) => {
  try {
    const pagination = {
      pagesize,
      page: params || 0,
    }

    // const res = await axios.get(`/api/web/order?pagination=${JSON.stringify(pagination)}`)

    // await  dispatch({type:LOAD_ORDERS,payload:res.data.rows})
    // dispatch({type:WEB_SUCCESS})

    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/closed?pagination=${JSON.stringify(pagination)}`
    )

    await dispatch({
      type: orderTypes.ORDER_CLOSED_CHANGE_COUNT,
      payload: res.data.count,
    })
    await dispatch({
      type: orderTypes.LOAD_CLOSED_ORDERS,
      payload: res.data.rows,
    })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const loadNewOrders = (arr, data, page) => async (
  dispatch,
  getState
) => {
  const { orders } = getState().orderData
  const oldIdList = orders.rows.map((x) => x.order_id)
  let newFilteredData = data.filter((x) => !oldIdList.includes(x.order_id))

  if (page === 1) {
    console.log(newFilteredData, 'filteredData')

    if (arr[0] !== '') {
      console.log(1)
      newFilteredData = newFilteredData.filter((data) =>
        data['shopify_order_name'].includes(arr[0])
      )
    }

    if (arr[1] !== '') {
      console.log(2)
      newFilteredData = newFilteredData.filter(
        (data) =>
          moment(data['delivery_date']).format('YYYY-MM-DD') ===
          moment(arr[1]).format('YYYY-MM-DD')
      )
    }

    if (arr[2] !== '') {
      newFilteredData = newFilteredData.filter(
        (data) => data['payment_status_id'] === arr[2].id
      )
      console.log(3)
    }

    if (arr[3] !== '') {
      console.log(4)
      newFilteredData = newFilteredData.filter(
        (data) => data['payment_id'] === arr[3].id
      )
    }

    if (arr[4] !== '') {
      console.log(5)
      newFilteredData = newFilteredData.filter(
        (data) => data['order_status_id'] === arr[4].id
      )
    }
    console.log(newFilteredData, 'filterData')

    let sliceStartAt = orders.rows.length - newFilteredData.length
    const newCount = orders.count + newFilteredData.length
    let newOrderData = orders.rows.slice(0, sliceStartAt)
    newOrderData = newFilteredData.concat(newOrderData)
    dispatch({
      type: orderTypes.UPDATE_ORDERS,
      payload: { rows: newOrderData, count: newCount },
    })
  }
}

// ************ NEXT LINE ************ //

export const sentToFloristJob = (order_id, callback) => async (dispatch) => {
  try {
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.put(`/api/web/order/advance`, { order_id }, config)
    dispatch({ type: webTypes.WEB_SUCCESS })
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const loadOrderTickets = (order_id) => async (dispatch) => {
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/ticket/all/${order_id}`)
    await dispatch({
      type: orderTypes.LOAD_SEL_ORDER_TICKETS,
      payload: res.data,
    })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const updateOrdetTicket = (data) => async (dispatch, getState) => {
  const { sel_order_tickets } = getState().orderData
  const index = sel_order_tickets.findIndex(
    (x) => x.ticket_id === data[0].ticket_id
  )
  if (index !== -1) {
    let updated_sel_ticket = sel_order_tickets.map((x, i) => {
      if (i === index) {
        return data[0]
      }
      return x
    })
    await dispatch({
      type: orderTypes.LOAD_SEL_ORDER_TICKETS,
      payload: updated_sel_ticket,
    })
  }
}

// ************ NEXT LINE ************ //

export const loadSelOrder = (
  order_id,
  issueID,
  ticket_id,
  from,
  callback
) => async (dispatch) => {
  try {
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/order/${order_id}`, config)
    let data = res.data[0]
    if (issueID) {
      data.issueID = issueID
      data.ticket_id = ticket_id
    }
    if (from) data.from = from
    await dispatch({ type: orderTypes.LOAD_SEL_ORDER, payload: data })
    await dispatch({ type: webTypes.WEB_SUCCESS })
    callback && callback()
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

function arrToQuery(arr) {
  let filter = ''
  arr.forEach((x, i) => {
    if (x !== '' && x !== null) {
      if (i === 1) {
        filter.length > 0
          ? (filter = filter.concat(`&delivery_date=${x}`))
          : (filter = filter.concat(`delivery_date=${x}`))
      } else if (i === 0) {
        filter.length > 0
          ? (filter = filter.concat(`&shopify_order_name=${x}`))
          : (filter = filter.concat(`shopify_order_name=${x}`))
      } else {
        filter.length > 0
          ? (filter = filter.concat(`&${x.tbname}=${x.id}`))
          : (filter = filter.concat(`${x.tbname}=${x.id}`))
      }
    }
  })
  return filter
}

// ************ NEXT LINE ************ //
// will be depricate in future , used as reference for the meantime
export const filterOrder = (arr) => async (dispatch) => {
  const filter = arrToQuery(arr)
  if (
    arr[0] !== '' &&
    (arr[1] !== '' || arr[2] !== '' || arr[3] !== '' || arr[4] !== '')
  ) {
    arr[0].length >= 4
      ? fetchFilter(filter, dispatch)
      : alert(
          'Invalid character length on searchbar. Please provide atleast 4 letters'
        )
  } else {
    fetchFilter(filter, dispatch)
  }
}

// ************ NEXT LINE ************ //
export const fitlerTextOnchange = (params) => async (dispatch) => {
  reset()
  if (
    params.search.length >= 4 ||
    (params.search.length === 0 && isFetch === true)
  ) {
    interval = setInterval(async () => {
      try {
        gSearchCounter++
        if (gSearchCounter === 1) {
          getID = CancelToken.source()
          console.log('params', params)
          fetchOrders(params, dispatch)
        }
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

function reset() {
  clearInterval(interval)
  gSearchCounter = 0
  if (getID !== null) getID.cancel('Api is being canceled')
}

// ************ NEXT LINE ************ //
async function fetchFilter(filter, dispatch) {
  try {
    const pagination = JSON.stringify({
      pagesize,
      page: 0,
    })
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/filter?${filter}&pagination=${pagination}`
    )
    isFetch = true
    if (!filter.includes('shopify')) isFetch = false
    await dispatch({
      type: orderTypes.ORDER_CHANGE_COUNT,
      payload: res.data.count,
    })
    await dispatch({ type: orderTypes.UPDATE_ORDERS, payload: res.data.rows })
    await dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

export const updateOrder = (order, resolve, callback) => async (dispatch) => {
  const { order_id } = order
  try {
    dispatch({ type: webTypes.WEB_SETFETCH })
    // rowWillChange(order_id)
    const res = await axios.patch(`/api/web/order`, { order, resolve })
    console.log('RUTHER', res)
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const confirmPaid = (form, image, order, callback) => async (
  dispatch
) => {
  const { ref, details } = form
  const {
    order_id,
    allow_prod_b4_payment,
    delivery_date,
    shopify_order_name,
    customer,
    contact_email,
  } = order

  console.log('order', order)

  try {
    // rowWillChange(order_id)
    dispatch({ type: webTypes.WEB_SETFETCH })

    if (image) {
      const data = new FormData()
      data.append('image', image, shopify_order_name)

      axios
        .post(`/api/web/order/file_upload`, data, {
          headers: {
            'Content-Type': `multipart/form-data`,
          },
        })
        .then(async (response) => {
          console.log(response.data.imageUrl)
          const res = await axios.put(
            `/api/web/order/payment`,
            {
              order_id,
              order_name: shopify_order_name,
              allowed: allow_prod_b4_payment,
              deliver_date: delivery_date,
              reference: ref,
              note: details,
              contact: contact_email,
              customer: customer.first_name + ' ' + customer.last_name,
              imageUrl: response.data.imageUrl,
            },
            config
          )

          if (res) {
            dispatchSuccess(res, dispatch, callback)
          }
        })
    } else {
      //if no image file
      //dispatchSuccess(res,dispatch,callback)
    }
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const holdOrder = (form, order, callback) => async (dispatch) => {
  const {
    disposition_id,
    name,
    comment,
    onhold,
    payment_status_id,
    payment_id,
  } = form

  const { order_id } = order
  try {
    // rowWillChange(order_id)
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.put(
      `/api/web/order/hold`,
      {
        payment_id,
        comment,
        order_id,
        notes: name,
        onhold: onhold,
        payment_status_id,
        disposition_id,
      },
      config
    )
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const cancelOrder = (form, order, callback) => async (dispatch) => {
  const {
    order_id,
    customer,
    contact_email,
    payment_id,
    payment_status_id,
  } = order
  const { cancel_status, cancel_reason } = form

  try {
    // rowWillChange(order_id)
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.put(
      `/api/web/order/cancel`,
      {
        order_id,
        cancel_status,
        cancel_reason,
        contact: contact_email,
        payment_id: payment_id,
        payment_status_id,
        customer: customer.first_name + ' ' + customer.last_name,
      },
      config
    )
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

export const cancelNoHubOrder = (form, order, callback) => async (dispatch) => {
  const {
    order_id,
    customer_first_name,
    customer_last_name,
    customer_email,
    order: { payment_id },
  } = order
  const { cancel_status, cancel_reason } = form

  try {
    // rowWillChange(order_id)
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.put(
      `/api/web/order/cancel`,
      {
        order_id,
        cancel_status,
        cancel_reason,
        contact: customer_email,
        payment_id: payment_id,
        customer: customer_first_name + ' ' + customer_last_name,
      },
      config
    )
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const updateLognNotes = (data) => async (dispatch, getState) => {
  const { sel_order } = getState().orderData
  const { logs, notes } = data
  if (sel_order !== null) {
    if (logs.length > 0) {
      if (sel_order['order_id'].toString() === logs[0].order_id.toString()) {
        dispatch({ type: notetypes.UPDATE_ORDERNOTES, payload: notes })
        dispatch({ type: logtypes.UPDATE_ORDERLOGS, payload: logs })
      }
    } else if (notes.length > 0) {
      if (sel_order['order_id'].toString() === notes[0].order_id.toString())
        dispatch({ type: notetypes.UPDATE_ORDERNOTES, payload: notes })
      dispatch({ type: logtypes.UPDATE_ORDERLOGS, payload: logs })
    }
  }
}

// ************ NEXT LINE ************ //
export const holdMultiOrder = (form, orders, callback) => async (dispatch) => {
  const { disposition_id, name, comment } = form

  try {
    // orders.forEach(x=> rowWillChange(x))
    // will add new row will change of array
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.put(
      `/api/web/order/holdmany`,
      {
        comment,
        orders,
        notes: name,
        disposition_id,
      },
      config
    )
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const updetedOrderListener = (order) => async (dispatch, getState) => {
  const { orders, sel_order } = getState().orderData
  if (order.hasOwnProperty('table_state')) {
    if (order.table_state !== 1) {
      const orderExisted = orders.rows.filter(
        (x) => x.order_id === order.order_id
      )

      if (orderExisted.length) {
        let filteredOrders = []

        //check if cancel then pluck
        if ([13, 14].indexOf(order.order_status_id) >= 0) {
          filteredOrders = _.filter(orders.rows, (v) => {
            return parseInt(v.order_id) !== parseInt(order.order_id)
          })

          const payload = {
            count: parseInt(orders.count) - 1,
            rows: filteredOrders,
          }

          console.log(payload)

          dispatch({
            type: orderTypes.UPDATE_ORDERS,
            payload: {
              count: parseInt(orders.count) - 1,
              rows: filteredOrders,
            },
          })
        } else {
          const index = _.indexOf(
            orders.rows,
            _.find(orders.rows, { order_id: order.order_id })
          )
          orders.rows.splice(index, 1, order)
          filteredOrders = orders.rows
          dispatch({
            type: orderTypes.UPDATE_ORDERS,
            payload: { count: orders.count, rows: filteredOrders },
          })
        }
      }

      if (sel_order) {
        if (parseInt(sel_order.order_id) === parseInt(order.order_id)) {
          dispatch({ type: orderTypes.UPDATE_SORDER, payload: order })
        }
      }
    }
  }
}

export const updeteClosedOrder = (data) => async (dispatch) => {
  dispatch({ type: orderTypes.LOAD_CLOSED_ORDERS, payload: data })
}

// ************ NEXT LINE ************ //

export const clearSelected = () => async (dispatch) => {
  dispatch({ type: orderTypes.CLEAR_SELEDTED })
}

// ************ NEXT LINE ************ //

export const updaTeOrderPrio = (form, callback) => async (dispatch) => {
  const { list, selected_index, selected_order } = form
  let prioOrderList = list
  const order_index = selected_index
  let order_ontop = []
  let order_onbot = null

  if (order_index !== 0) {
    order_ontop = prioOrderList.filter((o, i) => i < order_index)
    order_onbot = prioOrderList[order_index + 1]
  } else {
    order_onbot = prioOrderList[order_index + 1]
  }
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.put(`/api/web/order/priority`, {
      orders_ontop: order_ontop,
      selectedorder_id: selected_order['order_id'],
      order_onbot: order_onbot,
    })
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

export const updatePrioritization = (data, page) => async (
  dispatch,
  getState
) => {
  // const prio = getState().orderData.prioritization
  const start = page * pagesize - pagesize
  const end = page * pagesize
  const filteredData = data.slice(Number(start), Number(end))
  const length = data.length
  dispatch({
    type: orderTypes.UPDATE_PRIORITIZATION,
    payload: { rows: filteredData, count: length },
  })
}

// ************ NEXT LINE ************ //

export const orderChangePage = (page, filters) => async (dispatch) => {
  fetchPagination(page, filters, dispatch)
}

async function fetchPagination(page, filters, dispatch) {
  const offset = pagesize * (page - 1)
  const pagination = {
    pagesize,
    page: offset,
  }
  let filter = {}

  filters.forEach((x, i) => {
    if (x !== '')
      switch (i) {
        case 0:
          filter = {
            ...filter,
            shopify_order_name: x,
          }
          break
        case 1:
          filter = {
            ...filter,
            delivery_date: x,
          }
          break
        default:
          filter = {
            ...filter,
            [x.tbname]: x.id,
          }
      }
  })

  try {
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order?pagination=${JSON.stringify(
        pagination
      )}&filters=${JSON.stringify(filter)}`
    )
    await dispatch({
      type: orderTypes.ORDER_CHANGE_COUNT,
      payload: res.data.count,
    })
    await dispatch({ type: orderTypes.LOAD_ORDERS, payload: res.data.rows })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

export const prioChangePage = (page) => async (dispatch) => {
  const offset = pagesize * (page - 1)
  const pagination = {
    pagesize,
    page: offset,
  }

  try {
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/sort/priority?pagination=${JSON.stringify(pagination)}`
    )
    await dispatch({ type: orderTypes.LOAD_PRIORITIZATION, payload: res.data })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

async function loadOrderByPrio(dispatch) {
  try {
    const pagination = {
      pagesize,
      page: 0,
    }

    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/sort/priority?pagination=${JSON.stringify(pagination)}`
    )
    await dispatch({ type: orderTypes.LOAD_PRIORITIZATION, payload: res.data })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

// ************ NEXT LINE ************ //

// NOTE : method replace on placing promise so we can put it on exported actions
async function loadOrders(dispatch) {
  try {
    const pagination = {
      pagesize,
      page: 0,
    }

    const res = await axios.get(
      `/api/web/order?pagination=${JSON.stringify(pagination)}`
    )

    await dispatch({
      type: orderTypes.ORDER_CHANGE_COUNT,
      payload: res.data.count,
    })
    await dispatch({ type: orderTypes.LOAD_ORDERS, payload: res.data.rows })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

//?filterall=textboxtval&filter[payment][eq]=paymentval$fitler[payment_id][eq]=paymentid&filter[order_status_id][eq]=status_id?filterall=textboxtval&filter[payment][eq]=paymentval$fitler[payment_id][eq]=paymentid&filter[order_status_id][eq]=status_id

// ************ NEXT LINE ************ //

//NOTE : for the meantime DRY approach for dispatching error
function dispatchError(err, dispatch, callback) {
  dispatch({ type: webTypes.WEB_ERROR })
  let errMsg
  if (err.response) {
    errMsg = err.response.data.msg
  } else {
    errMsg = err.message
  }
  if (callback) callback('error', errMsg)
}

// ************ NEXT LINE ************ //

function dispatchSuccess(res, dispatch, callback) {
  console.log('whahaha', res)
  dispatch({ type: webTypes.WEB_SUCCESS })
  if (callback) callback('success', res.data.msg)
  console.log(res.data.msg)
}
export const fetchOrderTicket = (orderId) => async (dispatch) => {
  try {
    //params will fetch other stuff for qs
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/order/orderTicket/${orderId}`)
    await dispatch({ type: orderTypes.LOAD_ORDER_TICKET, payload: res.data })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchOrderByOrderName = (param) => async (dispatch) => {
  console.log('called fetchOrderByOrderName')
  const query_string = `?filter[shopify_order_name][eq]=${param}`

  try {
    //params will fetch other stuff for qs
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/order/vieworder/${query_string}`)
    await dispatch({ type: orderTypes.VIEW_ORDER, payload: res.data })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchOrders = (params) => async (dispatch) => {
  let queryString = `?page=${params.page}&pageSize=${params.pageSize}` //queryStringHelper(params);

  if (params.hasOwnProperty('payment_id')) {
    if (parseInt(params.payment_id) > 0) {
      queryString += `&filter[payment_id][eq]=${params.payment_id}`
    }
  }

  if (params.hasOwnProperty('order_status_id')) {
    if (parseInt(params.order_status_id) > 0) {
      queryString += `&filter[order_status_id][eq]=${params.order_status_id}`
    }
  }
  if (params.hasOwnProperty('payment_status_id') && params.payment_status_id) {
    if (typeof params.payment_status_id !== 'number') {
      queryString += `&filter[payment_status_id][in]=${params.payment_status_id.toString()}`
    } else if (parseInt(params.payment_status_id) > 0) {
      queryString += `&filter[payment_status_id][eq]=${params.payment_status_id}`
    }
  }
  if (params.hasOwnProperty('delivery_date')) {
    if (params.delivery_date.length > 0) {
      queryString += `&filter[delivery_date][eq]=${moment(
        params.delivery_date
      ).format('YYYY-MM-DD')}`
    }
  }
  if (params.hasOwnProperty('shopify_order_name')) {
    if (params.shopify_order_name.length > 0) {
      queryString += `&filter[shopify_order_name][like]=${params.shopify_order_name}`
    }
  }
  if (params.hasOwnProperty('hub_filter')) {
    if (params.hub_filter.length > 0 && params.hub_filter !== '-1') {
      queryString += `&filter[hub_id][in]=${params.hub_filter}`
    }
  }
  if (params.delivery_time) {
    queryString += `&filter[delivery_time][like]=${params.delivery_time}`
  }

  try {
    //params will fetch other stuff for qs
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/order${queryString}`)
    await dispatch({ type: orderTypes.LOAD_ORDERS, payload: res.data })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}
export const fetchSympathyOrders = (params) => async (dispatch) => {
  let queryString = `?page=${params.page}&pageSize=${params.pageSize}` //queryStringHelper(params);

  if (params.hasOwnProperty('payment_id')) {
    if (parseInt(params.payment_id) > 0) {
      queryString += `&filter[payment_id][eq]=${params.payment_id}`
    }
  }
  if (params.hasOwnProperty('order_status_id')) {
    if (parseInt(params.order_status_id) > 0) {
      queryString += `&filter[order_status_id][eq]=${params.order_status_id}`
    }
  }
  if (params.hasOwnProperty('payment_status_id') && params.payment_status_id) {
    if (typeof params.payment_status_id !== 'number') {
      queryString += `&filter[payment_status_id][in]=${params.payment_status_id.toString()}`
    } else if (parseInt(params.payment_status_id) > 0) {
      queryString += `&filter[payment_status_id][eq]=${params.payment_status_id}`
    }
  }
  if (params.hasOwnProperty('delivery_date') || params.delivery_date == ' ') {
    if (params.delivery_date.length > 0) {
      queryString += `&filter[delivery_date][eq]=${moment(
        params.delivery_date
      ).format('YYYY-MM-DD')}`
    }
  }
  if (params.hasOwnProperty('shopify_order_name')) {
    if (params.shopify_order_name.length > 0) {
      queryString += `&filter[shopify_order_name][like]=${params.shopify_order_name}`
    }
  }
  if (params.hasOwnProperty('hub_filter')) {
    if (params.hub_filter.length > 0 && params.hub_filter !== '-1') {
      queryString += `&filter[hub_id][in]=${params.hub_filter}`
    }
  }
  if (params.delivery_time) {
    queryString += `&filter[delivery_time][like]=${params.delivery_time}`
  }

  try {
    //params will fetch other stuff for qs
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.post(`/api/web/order/sympathy${queryString}`)

    console.log(res.data)
    await dispatch({ type: orderTypes.LOAD_ORDERS, payload: res.data })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchOrdersNoHub = (params) => async (dispatch) => {
  let queryString = `?page=${params.page}&pageSize=${params.pageSize}` //queryStringHelper(params);

  if (params.hasOwnProperty('payment_id')) {
    if (parseInt(params.payment_id) > 0) {
      queryString += `&payment_id=${params.payment_id}`
    }
  }
  if (params.hasOwnProperty('order_status_id')) {
    if (parseInt(params.order_status_id) > 0) {
      queryString += `&filter[order_status_id][eq]=${params.order_status_id}`
    }
  }
  if (params.hasOwnProperty('payment_status_id')) {
    if (parseInt(params.payment_status_id) > 0) {
      queryString += `&filter[payment_status_id][eq]=${params.payment_status_id}`
    }
  }
  if (params.hasOwnProperty('delivery_date')) {
    if (params.delivery_date.length > 0) {
      queryString += `&filter[delivery_date][eq]=${moment(
        params.delivery_date
      ).format('YYYY-MM-DD')}`
    }
  }
  if (params.hasOwnProperty('shopify_order_name')) {
    if (params.shopify_order_name.length > 0) {
      queryString += `&filter[shopify_order_name][like]=${params.shopify_order_name}`
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

  try {
    //params will fetch other stuff for qs
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/order/nohub${queryString}`)
    await dispatch({ type: orderTypes.LOAD_ORDERS_NO_HUB, payload: res.data })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchOrdersNoDateTime = (params) => async (dispatch) => {
  let queryString = `?page=${params.page}&pageSize=${params.pageSize}` //queryStringHelper(params);

  if (params.hasOwnProperty('payment_id')) {
    if (parseInt(params.payment_id) > 0) {
      queryString += `&filter[payment_id][eq]=${params.payment_id}`
    }
  }
  if (params.hasOwnProperty('order_status_id')) {
    if (parseInt(params.order_status_id) > 0) {
      queryString += `&filter[order_status_id][eq]=${params.order_status_id}`
    }
  }
  if (params.hasOwnProperty('payment_status_id')) {
    if (parseInt(params.payment_status_id) > 0) {
      queryString += `&filter[payment_status_id][eq]=${params.payment_status_id}`
    }
  }
  if (params.hasOwnProperty('delivery_date')) {
    if (params.delivery_date.length > 0) {
      queryString += `&filter[delivery_date][eq]=${moment(
        params.delivery_date
      ).format('YYYY-MM-DD')}`
    }
  }
  if (params.hasOwnProperty('shopify_order_name')) {
    if (params.shopify_order_name.length > 0) {
      queryString += `&filter[shopify_order_name][like]=${params.shopify_order_name}`
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

  if (params.hasOwnProperty('sort')) {
    if (params.sort.length > 0) {
      queryString += `&sort=${params.sort}`
    }
  }

  try {
    //params will fetch other stuff for qs
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/order/noDateTime${queryString}`)
    await dispatch({
      type: orderTypes.LOAD_ORDER_NO_DATE_TIME,
      payload: res.data,
    })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchRestOfPhil = (params) => async (dispatch) => {
  function yyyymmdd(dateIn) {
    var yyyy = dateIn.getFullYear()
    var mm = dateIn.getMonth() + 1 // getMonth() is zero-based
    var dd = dateIn.getDate()
    return String(10000 * yyyy + 100 * mm + dd) // Leading zeros for mm and dd
  }

  let queryString = `?page=${params.page}&pageSize=${
    params.pageSize
  }&created_at=${
    params.created_at ? yyyymmdd(new Date(params.created_at)) : ''
  }` //queryStringHelper(params);

  if (params.hasOwnProperty('payment_id')) {
    if (parseInt(params.payment_id) > 0) {
      queryString += `&filter[payment_id][eq]=${params.payment_id}`
    }
  }
  if (params.hasOwnProperty('order_status_id')) {
    if (parseInt(params.order_status_id) > 0) {
      queryString += `&filter[order_status_id][eq]=${params.order_status_id}`
    }
  }
  if (params.hasOwnProperty('payment_status_id')) {
    if (parseInt(params.payment_status_id) > 0) {
      queryString += `&filter[payment_status_id][eq]=${params.payment_status_id}`
    }
  }
  // if(params.hasOwnProperty('delivery_date')){
  //     if(params.delivery_date.length > 0){
  //         queryString += `&filter[delivery_date][eq]=${moment(params.delivery_date).format('YYYY-MM-DD')}`;
  //     }

  // }
  if (params.hasOwnProperty('shopify_order_name')) {
    if (params.shopify_order_name.length > 0) {
      queryString += `&filter[shopify_order_name][like]=${params.shopify_order_name}`
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

  if (params.hasOwnProperty('sort')) {
    if (params.sort.length > 0) {
      queryString += `&sort=${params.sort}`
    }
  }

  try {
    //params will fetch other stuff for qs
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/order/restofphil${queryString}`)
    await dispatch({
      type: orderTypes.LOAD_ORDER_REST_OF_PHIL,
      payload: res.data,
    })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchRestOfPhilDispatch = (params) => async (dispatch) => {
  function yyyymmdd(dateIn) {
    var yyyy = dateIn.getFullYear()
    var mm = dateIn.getMonth() + 1 // getMonth() is zero-based
    var dd = dateIn.getDate()
    return String(10000 * yyyy + 100 * mm + dd) // Leading zeros for mm and dd
  }

  let queryString = `?page=${params.page}&pageSize=${
    params.pageSize
  }&created_at=${
    params.created_at ? yyyymmdd(new Date(params.created_at)) : ''
  }` //queryStringHelper(params);

  if (params.hasOwnProperty('payment_id')) {
    if (parseInt(params.payment_id) > 0) {
      queryString += `&filter[payment_id][eq]=${params.payment_id}`
    }
  }
  if (params.hasOwnProperty('order_status_id')) {
    if (parseInt(params.order_status_id) > 0) {
      queryString += `&filter[order_status_id][eq]=${params.order_status_id}`
    }
  }
  if (params.hasOwnProperty('payment_status_id')) {
    if (parseInt(params.payment_status_id) > 0) {
      queryString += `&filter[payment_status_id][eq]=${params.payment_status_id}`
    }
  }
  // if(params.hasOwnProperty('created_at')){
  //     if(params.created_at.length > 0){
  //         queryString += `&filter[created_at][eq]=%${params.created_at}%`;
  //     }

  // }
  if (params.hasOwnProperty('shopify_order_name')) {
    if (params.shopify_order_name.length > 0) {
      queryString += `&filter[shopify_order_name][like]=${params.shopify_order_name}`
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

  if (params.hasOwnProperty('sort')) {
    if (params.sort.length > 0) {
      queryString += `&sort=${params.sort}`
    }
  }

  try {
    //params will fetch other stuff for qs
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/restofphilDispatch${queryString}`
    )
    await dispatch({
      type: orderTypes.LOAD_ORDER_REST_OF_PHIL_DISPATCH,
      payload: res.data,
    })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const dispatchStatus = (shopify_order_name) => async (dispatch) => {
  try {
    const res = await axios.post(`/api/web/rider/riderInfo`, {
      shopify_order_name,
    })

    dispatch({ type: orderTypes.LOAD_DISPATCH_STATUS, payload: res.data })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const fetchHistoryData = (params) => async (dispatch) => {
  try {
    //params will fetch other stuff for qs
    let queryString = `?page=${params.page}&pageSize=${params.pageSize}`

    if (params.hasOwnProperty('payment_id')) {
      if (parseInt(params.payment_id) > 0) {
        queryString += `&filter[payment_id][eq]=${params.payment_id}`
      }
    }
    if (params.hasOwnProperty('payment_status_id')) {
      if (parseInt(params.payment_status_id) > 0) {
        queryString += `&filter[payment_status_id][eq]=${params.payment_status_id}`
      }
    }
    if (params.hasOwnProperty('shopify_order_name')) {
      if (params.shopify_order_name.length > 0) {
        queryString += `&filter[shopify_order_name][like]=${params.shopify_order_name}`
      }
      if (params.order_status_id) {
        queryString += `&filter[order_status_id][in]=${params.order_status_id}`
      }
      if (params.delivery_time) {
        queryString += `&filter[delivery_time][like]=${params.delivery_time}`
      }
      if (params.delivery_date && params.delivery_date != ' ') {
        queryString += `&filter[delivery_date][eq]=${moment(
          params.delivery_date
        ).format('YYYY-MM-DD')}`
      }

      if (
        params.hasOwnProperty('hub_filter') &&
        params.hub_filter != 'history'
      ) {
        queryString += `&hub_id=${params.hub_filter}`
      }
    }

    console.log(queryString, 'queryString')

    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/closedorders${queryString}`,
      config
    )
    await dispatch({ type: orderTypes.LOAD_CLOSED_ORDERS, payload: res.data })

    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

//============FUNCTIONS============
// ramil params handler
const paramsHandler = (args) => {
  //list of key thats not include on params for each
  let arrKey = ['page', 'pageSize']

  let querystirnginsideofparamshandler = `?page=${args.page}&pageSize=${args.pageSize}`

  //convert object param into array of arrays of key value pair
  Object.entries(args).forEach((param) => {
    //object key the equal to page and page size will be ignored
    //check arrkey variable
    if (!arrKey.includes(param[0]) && param[1]) {
      //if the value of an object is an array
      //use in operator
      if (Object.prototype.toString.call(param[1]) === '[object Array]') {
        querystirnginsideofparamshandler += `&filter[${
          param[0]
        }][in]=${param[1].toString()}`
      } else if (typeof param[1] === 'string') {
        querystirnginsideofparamshandler += `&filter[${param[0]}][like]=${param[1]}`
      } else {
        querystirnginsideofparamshandler += `&filter[${param[0]}][eq]=${param[1]}`
      }
    }
  })

  return querystirnginsideofparamshandler
}

// ************ NEXT LINE ************ //

export const fetchUnpaidOrders = (params) => async (dispatch) => {
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/unpaidorders${paramsHandler(params)}`
    )
    await dispatch({ type: orderTypes.LOAD_ORDERS, payload: res.data })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    console.log(err)
  }
}

// ************ NEXT LINE ************ //

export const fetchOrdersOnhold = (params) => async (dispatch) => {
  console.log('FETCH FETCH FETCH ORDERS ON HOLD')
  console.log(paramsHandler(params), 'PARAMS')
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/ordersonhold${paramsHandler(params)}`
    )
    await dispatch({ type: orderTypes.LOAD_ORDERS, payload: res.data })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    console.log(err)
  }
}

export const addReinstatementRequest = (form, callback) => async (dispatch) => {
  // @NOTE :  form {user_name,address}

  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.post(
      `/api/web/order/addReinstatement`,
      form,
      config
    )

    if (res) {
      await dispatch({ type: webTypes.WEB_SUCCESS })
      callback('You successfully make a request')
    }
  } catch (err) {
    if (err.response.data) {
      console.log('ERROR', err.response)

      await dispatch({ type: webTypes.WEB_SUCCESS })
      callback(err.response.msg)
    }
  }
}

export const getReinstatementData = (params) => async (dispatch) => {
  let queryString = `?page=${params.page}&pageSize=${params.pageSize}`

  if (params.hasOwnProperty('hub_filter')) {
    queryString += `&filter[hub_id][in]=${params.hub_filter}`
  }
  if (params.hasOwnProperty('shopify_order_name')) {
    if (params.shopify_order_name.length > 0) {
      queryString += `&filter[shopify_order_name][like]=${params.shopify_order_name}`
    }
  }
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/order/getReinstatement${queryString}`)

    await dispatch({
      type: orderReinstatementTypes.LOAD_REINSTATEMENT_ORDERS,
      payload: res.data,
    })
    dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const updateReinstatement = (form, callback) => async (dispatch) => {
  console.log('reinstatement', form)
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/order/updateReinstatement`,
      form,
      config
    )
    if (res) {
      await dispatch({ type: webTypes.WEB_SUCCESS })
      callback('Record successfully updated')
    }
  } catch (err) {
    if (err.response) {
      console.log('ERROR', err.response)
      await dispatch({ type: webTypes.WEB_SUCCESS })
      callback(err.response.msg)
    }
  }
}

export const setQualityCheck = (form, callback) => async (dispatch) => {
  console.log('called action setQualityCheck', form)
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/order/setqualitycheck`,
      form,
      config
    )
    if (res) {
      await dispatch({ type: webTypes.WEB_SUCCESS })
      callback('Record successfully updated')
    }
  } catch (err) {
    if (err.response) {
      console.log('ERROR', err.response)
      await dispatch({ type: webTypes.WEB_SUCCESS })
      callback(err.response.msg)
    }
  }
}

export const unpaidOrder = (order, callback) => async (dispatch) => {
  const order_id = order
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.patch(`/api/web/order/unpaidOrder/${order_id}`)
    await dispatch({ type: webTypes.WEB_SUCCESS })
    callback(res.data.msg)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

export const unpaidOrderPage = (order, callback) => async (dispatch) => {
  const order_id = order
  try {
    dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(`/api/web/order/${order_id}`, config)
    console.log('res to pre', res)
    let data = res.data[0]
    await dispatch({ type: orderTypes.LOAD_SEL_ORDER, payload: data })
    await dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

export const removeOverdue = (order_id, callback) => async (dispatch) => {
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.post(
      `/api/web/order/removeOverdue`,
      {
        order_id,
      },
      config
    )
    await dispatch({ type: webTypes.WEB_SUCCESS })
    callback(res.data.msg)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

export const getOrderPaymentDetails = (order_id, callback) => async (
  dispatch
) => {
  // @NOTE :  form {user_name,address}
  // /api/web/order/payment-details/63989
  try {
    await dispatch({ type: webTypes.WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/payment-details/${order_id}`,
      config
    )

    await dispatch({
      type: orderTypes.LOAD_ORDER_PAYMENTDETAILS,
      payload: res.data,
    })
    await dispatch({ type: webTypes.WEB_SUCCESS })
  } catch (err) {
    if (err.response.data) {
      console.log('ERROR', err.response)

      await dispatch({ type: webTypes.WEB_SUCCESS })
      callback(err.response.msg)
    }
  }
}

// const handleRowUpdatedListener = (state,data) =>{
