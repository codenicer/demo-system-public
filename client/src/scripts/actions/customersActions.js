import { LOAD_SEL_CUSTOMER, CLEAR_SEL_CUSTOMER } from '../types/customerTypes'
import { WEB_SETFETCH, WEB_SUCCESS, WEB_ERROR } from '../types/webfetchTypes'
import axios from 'axios'

import { domain } from './../helpers/config_helper'
// const domain = process.env.REACT_APP_API_URL

export const loadSelectedCustomer = (customer_id, callback) => async (
  dispatch
) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/customer/${customer_id}`)
    await dispatch({ type: LOAD_SEL_CUSTOMER, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
    callback && callback()
  } catch (err) {
    dispatch({ type: WEB_ERROR })
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log('FROM LOAD LOADSEL_CUSTOMER: \n' + errMsg)
  }
}

// ************ NEXT LINE ************ //

export const clearSelectedCustomer = () => async (dispatch) => {
  dispatch({ type: CLEAR_SEL_CUSTOMER })
}
