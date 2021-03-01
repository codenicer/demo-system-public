import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'
import { dispatchError } from './../helpers/dispatch_helper'
import { queryStringHelper } from '../helpers/helper'
import axios from 'axios'
import { domain, config } from './../helpers/config_helper'
import * as types from '../types/refundTypes'

export const getRefundList = (params) => async (dispatch) => {
  const params_filtered = queryStringHelperForRefundParams(params)
  const query = queryStringHelper(params_filtered)
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/order/payment/refund${query}`)
    await dispatch({ type: types.LOAD_REFUNDS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const createRefundRequest = (form, callback) => async (dispatch) => {
  try {
    dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/order/payment/refund`, form, config)
    dispatch({ type: WEB_SUCCESS })
    callback && callback('success', res.data.msg)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

export const declineRefundRequest = (form, callback) => async (dispatch) => {
  try {
    dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/order/payment/refund/decline`,
      form,
      config
    )
    dispatch({ type: WEB_SUCCESS })
    callback && callback(res.data.msg)
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const acceptRefundRequest = (form, callback) => async (dispatch) => {
  try {
    dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `/api/web/order/payment/refund/accept`,
      form,
      config
    )
    dispatch({ type: WEB_SUCCESS })
    callback && callback('success', res.data.msg)
  } catch (err) {
    dispatchError(err, dispatch, callback)
  }
}

export const getSelectedOrderRefundList = (params) => async (dispatch) => {
  try {
    const params_filtered = queryStringHelper(params)

    dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(
      `/api/web/order/payment/paymentDetail${params_filtered}`,
      config
    )
    await dispatch({
      type: types.GET_SELECTED_ORDER_REFUND_LIST,
      payload: res.data,
    })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

function queryStringHelperForRefundParams(params) {
  let params_filtered = params
  if (params_filtered.refund_type) {
    params_filtered = {
      ...params_filtered,
      refund_type:
        params.refund_type && params.refund_type.id
          ? params.refund_type.id.toLowerCase()
          : '',
    }
  }

  if (params_filtered.status) {
    params_filtered = {
      ...params_filtered,
      status: params.status.id !== null ? params.status.id : '',
    }
  }

  return params_filtered
}
