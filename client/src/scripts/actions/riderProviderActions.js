import * as types from '../types/riderProviderTypes'
import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'
import axios from 'axios'
import { toast } from 'react-toastify'
import { config, domain } from './../helpers/config_helper'
import { dispatchError } from './../helpers/dispatch_helper'
// ************ SETTINGS ************ //

export const fetchRiderProviders = (params) => async (dispatch) => {
  try {
    //params will fetch other stuff for qs
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/rider/providers`)
    await dispatch({ type: types.LOAD_ALL_RIDER_PROVIDER, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
    console.log(err)
  }
}

export const fetchProvider = (riderProviderId) => async (dispatch) => {
  dispatch({ type: WEB_SETFETCH })

  try {
    const res = await axios.get(
      `/api/web/rider_provider/${riderProviderId}`,
      config
    )
    await dispatch({ type: types.LOAD_RIDER_PROVIDER_INFO, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const addRiderProvider = (form, callback) => async (dispatch) => {
  // @NOTE :  form {user_name,address}
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/rider_provider/`, form, config)

    if (res) {
      await dispatch({ type: WEB_SUCCESS })
      callback(res.data.msg)
    }
  } catch (err) {
    if (err.response.data) {
      console.log('ERROR', err.response.data)

      await dispatch({ type: WEB_SUCCESS })
      return toast.warn(err.response.data.msg)
    }
  }
}

export const updateRiderProvider = (riderProviderForm, callback) => async (
  dispatch
) => {
  console.log('FORMS', riderProviderForm)
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(
      `${process.env.REACT_APP_API_URL}/api/web/rider_provider/${riderProviderForm.rider_provider_id}`,
      riderProviderForm,
      config
    )
    await dispatch({ type: types.LOAD_EDIT_RIDER_PROVIDER, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
    if (res) {
      await dispatch({ type: WEB_SUCCESS })
      callback(res.data.msg)
    }
  } catch (err) {
    if (err.response.data) {
      console.log('ERROR', err.response.data)

      await dispatch({ type: WEB_SUCCESS })
      return toast.warn(err.response.data.msg)
    }
  }
}
