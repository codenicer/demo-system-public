import {
  LOAD_ORDER_DASHBOARD,
  LOAD_DISPATCH_DASHBOARD,
  LOAD_DISPATCH_DASHBOARD_LIST,
} from '../types/dashboardTypes'
import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'
import axios from 'axios'
import { domain } from './../helpers/config_helper'
import { dispatchError } from './../helpers/dispatch_helper'
import _ from 'lodash'

export const fetchOrderDashboard = (params) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/dispatch/orderDashboard`, params)
    await dispatch({ type: LOAD_ORDER_DASHBOARD, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const fetchDispatchDashboard = (params) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/dispatch/dispatchDashboard`, params)
    await dispatch({ type: LOAD_DISPATCH_DASHBOARD, payload: [res.data] })
    await dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}

export const fetchDispatchDashboardList = (params) => async (dispatch) => {
  try {
    const res = await axios.post(
      `/api/web/dispatch/dispatchDashboardList`,
      params
    )
    await dispatch({ type: LOAD_DISPATCH_DASHBOARD_LIST, payload: res.data })
  } catch (err) {
    await dispatchError(err, dispatch)
  }
}
