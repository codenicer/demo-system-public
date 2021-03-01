import { LOAD_SEL_PRODUCTS, CLEAR_SEL_PRODUCTS } from '../types/productTypes'
import { WEB_SETFETCH, WEB_SUCCESS } from '../types/webfetchTypes'
import axios from 'axios'
import { domain } from './../helpers/config_helper'

export const loadSelectedProduct = (product_id, callback) => async (
  dispatch
) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.get(`/api/web/product/${product_id}`)
    await dispatch({ type: LOAD_SEL_PRODUCTS, payload: res.data })
    await dispatch({ type: WEB_SUCCESS })
    callback && callback()
  } catch (err) {
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    console.log('FROM LOAD LOADSEL_PRODUCTS: \n' + errMsg)
  }
}

// ************ NEXT LINE ************ //

export const clearSelectedProducts = () => async (dispatch) => {
  dispatch({ type: CLEAR_SEL_PRODUCTS })
}
