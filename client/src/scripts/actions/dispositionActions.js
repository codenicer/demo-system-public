import { LOAD_DISPOSITIONS } from '../types/dispositionTypes'
import axios from 'axios'
import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'

import { domain } from './../helpers/config_helper'
// const domain = process.env.REACT_APP_API_URL;

export const loadDisposition = () => async (dispatch, getState) => {
  const { isFetching } = getState().webFetchData
  try {
    if (!isFetching) await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/dispositions`)
    await dispatch({ type: LOAD_DISPOSITIONS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    let errMsg = err.message
    if (err.response) {
      errMsg = err.response.data.msg
    } else {
      errMsg = err.message
    }
    console.log('FROM LOAD DISPOSITIONS: \n' + errMsg)
  }
}
