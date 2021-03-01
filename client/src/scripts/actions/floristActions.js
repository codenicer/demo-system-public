import { LOAD_FLORIST, UPDATE_FLORIST } from '../types/floristTypes'
import { WEB_SETFETCH, WEB_SUCCESS, WEB_ERROR } from '../types/webfetchTypes'
import axios from 'axios'
import { config, domain } from './../helpers/config_helper'

export const handleLoadFlorist = () => async (dispatch, getState) => {
  loadFlorist(dispatch, getState)
}

// ************ NEXT LINE ************ //

export const updateFlorist = (data) => async (dispatch) => {
  await dispatch({ type: UPDATE_FLORIST, payload: data })
}

// ************ NEXT LINE ************ //

const loadFlorist = async (dispatch, getState) => {
  const { isFetching } = getState().webFetchData
  try {
    if (isFetching === false) await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/florist`, config)
    await dispatch({ type: LOAD_FLORIST, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatch({ type: WEB_ERROR })
    alert('ALERT FROM: LOAD FLORIST\n', err)
  }
}

export const updateFloristv2 = (data) => async (dispatch) => {
  await dispatch({ type: LOAD_FLORIST, payload: data })
}

export const loadFloristv2 = () => async (dispatch, getState) => {
  const { isFetching } = getState().webFetchData
  try {
    if (isFetching === false) await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/florist/v2`, config)
    console.log({ res })
    await dispatch({ type: LOAD_FLORIST, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatch({ type: WEB_ERROR })
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    alert('ALERT FROM: LOAD FLORIST\n', err)
  }
}
