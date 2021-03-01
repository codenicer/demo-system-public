import * as types from '../types/order_notesTypes'
import axios from 'axios'

// ************ SETTINGS ************ //

import { config, domain } from './../helpers/config_helper'

export const loadSelOrderNotes = (order_id) => async (dispatch) => {
  reloadOrderNotes(order_id, dispatch)
}

export const addOrderNotes = (toInsert, callback) => async (dispatch) => {
  try {
    await dispatch({
      type: types.UPDATE_ORDERNOTES_STATE,
      payload: 'isFetching',
    })
    const res = await axios.post(
      `/api/web/order_notes`,
      { order_notes: { toInsert } },
      config
    )
    await dispatch({ type: types.UPDATE_ORDERNOTES_STATE, payload: 'success' })
    await reloadOrderNotes(toInsert.order_id, dispatch)
    callback('success', res.data.msg)
  } catch (err) {
    const error = errFilter(err)
    callback('success', error)
    await dispatch({ type: types.UPDATE_ORDERNOTES_STATE, payload: 'error' })
  }
}

async function reloadOrderNotes(order_id, dispatch) {
  try {
    await dispatch({
      type: types.UPDATE_ORDERNOTES_STATE,
      payload: 'isFetching',
    })
    const res = await axios.get(
      `/api/web/order_notes?order_id=${order_id}`,
      config
    )
    await dispatch({ type: types.LOAD_SEL_ORDERNOTES, payload: res.data })
    await dispatch({ type: types.UPDATE_ORDERNOTES_STATE, payload: 'success' })
    return true
  } catch (err) {
    const error = errFilter(err)
    alert(error)
    await dispatch({ type: types.UPDATE_ORDERNOTES_STATE, payload: 'error' })
    return false
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
