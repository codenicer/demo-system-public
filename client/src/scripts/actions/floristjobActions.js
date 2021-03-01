import { LOAD_FLORISTJOB, UPDATE_FLORISTJOB } from '../types/floristjobTypes'
import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'
import axios from 'axios'
import { config, domain } from './../helpers/config_helper'

// ************ NEXT LINE ************ //

export const handleLoadFloristJob = () => async (dispatch, getState) => {
  loadFloristJob(dispatch, getState)
}

// ************ NEXT LINE ************ //

export const updateFloristJob = (data) => async (dispatch) => {
  await dispatch({ type: UPDATE_FLORISTJOB, payload: data })
}

// ************ NEXT LINE ************ //

const loadFloristJob = async (dispatch, getState) => {
  const { isFetching } = getState().webFetchData
  try {
    if (isFetching === false) await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/floristjob`, config)
    await dispatch({ type: LOAD_FLORISTJOB, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    alert('ALERT FROM: LOAD FLORIST\n', errMsg)
  }
}
