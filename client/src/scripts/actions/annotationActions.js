import { LOAD_ANNOTATIONS, UPDATE_ANNOTATIONS } from '../types/annotationTypes'
import { WEB_SETFETCH, WEB_SUCCESS, WEB_ERROR } from '../types/webfetchTypes'
import axios from 'axios'
import { config, domain } from './../helpers/config_helper'

// ************ NEXT LINE ************ //

export const handleLoadAnnotations = (ticket_id) => async (dispatch) => {
  loadAnnotations(dispatch, ticket_id)
}

// ************ NEXT LINE ************ //

export const updateAnnotation = (data) => async (dispatch, getState) => {
  const { sel_ticket } = getState().ticketData
  if (sel_ticket.ticket_id === data[0].ticket_id) {
    dispatch({ type: UPDATE_ANNOTATIONS, payload: data })
  }
}

// ************ NEXT LINE ************ //

export const addAnnotation = (form, callback) => async (dispatch) => {
  try {
    dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/annotation/`, { form }, config)
    dispatch({ type: WEB_SUCCESS })
    callback('success', res.data.msg)
  } catch (err) {
    await dispatch({ type: WEB_ERROR })
    displayErr(err, dispatch, callback)
  }
}

// ************ NEXT LINE ************ //

async function loadAnnotations(dispatch, ticket_id) {
  try {
    dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/annotation/${ticket_id}`)
    dispatch({ type: LOAD_ANNOTATIONS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg
    if (err.response.data.msg) {
      errMsg = err.response.data.msg
    } else {
      errMsg = err.message
    }
    dispatch({ type: WEB_ERROR })
    alert(errMsg)
  }
}

// ************ NEXT LINE ************ //

function displayErr(err, dispatch, callback) {
  let errMsg
  if (err.response.data.msg) {
    errMsg = err.response.data.msg
  } else {
    errMsg = err.message
  }
  dispatch({ type: WEB_ERROR })
  if (callback) callback('error', errMsg)
}
