import * as types from '../types/order_logTypes'
import axios from 'axios'
import { config, domain } from './../helpers/config_helper'
// ************ SETTINGS ************ //

export const loadSelOrderLogs = (order_id) => async (dispatch) => {
  try {
    await dispatch({
      type: types.UPDATE_ORDERLOGS_STATE,
      payload: 'isFetching',
    })
    const res = await axios.get(
      `/api/web/order_logs?order_id=${order_id}`,
      config
    )
    await dispatch({ type: types.LOAD_SEL_ORDERLOGS, payload: res.data })
    await dispatch({ type: types.UPDATE_ORDERLOGS_STATE, payload: 'success' })
  } catch (err) {
    const error = errFilter(err)
    alert(error)
    await dispatch({ type: types.UPDATE_ORDERLOGS_STATE, payload: 'error' })
  }
}

function errFilter(err) {
  let errMsg
  if (err.response) {
    errMsg = err.response.data.msg
  } else {
    errMsg = err.message
  }
  return errMsg
}
