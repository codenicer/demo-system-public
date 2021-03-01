import { WEB_SETFETCH, WEB_SUCCESS, WEB_ERROR } from '../types/webfetchTypes'
import axios from 'axios'
// import {rowWillChange} from '../helpers/helper'

// ************ SETTINGS ************ //

import { config, domain } from './../helpers/config_helper'

// const domain = process.env.REACT_APP_API_URL
// const config = {
//     headers:{
//         'Content-Type' : 'application/json',
//         'Access-Control-Allow-Origin': true,
//     }
// }

// ************ NEXT LINE ************ //

export const updateOrderCheckAll = (order, callback) => async (dispatch) => {
  try {
    const { order_item_id_list, order_id } = order

    await dispatch({ type: WEB_SETFETCH })
    // rowWillChange(order_id)
    const res = await axios.put(
      `/api/web/order_item/status/all`,
      {
        order_id,
        order_item_id_list,
        order_item_status_id: 7,
      },
      config
    )
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

export const updateOrderItemStatus = (
  form,
  order_id,
  ischecked,
  callback
) => async (dispatch) => {
  try {
    let status
    ischecked ? (status = 7) : (status = 6)
    const { order_item_id } = form
    await dispatch({ type: WEB_SETFETCH })
    // rowWillChange(order_id)
    const res = await axios.put(
      `/api/web/order_item/status`,
      {
        order_id,
        order_item_id,
        order_item_status_id: status,
      },
      config
    )
    dispatchSuccess(res, dispatch, callback)
  } catch (err) {
    dispatchError(err, dispatch, callback)
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
  if (err.response.data.msg) {
    filterMsg = err.response.data.msg
  } else {
    filterMsg = err.message
  }
  return filterMsg
}
