import {
  LOAD_RESULT,
  SET_GFETCH,
  CLEAR_RESULT,
  LOAD_MORE,
  LM_FETCH,
} from '../types/gsearchTypes'
import axios from 'axios'
import { domain } from './../helpers/config_helper'

const CancelToken = axios.CancelToken

// ************ SETTINGS ************ //

let getID = null
let offSet
let interval
let keywordHolder

// ************ NEXT LINE ************ //

export const goSearch = (keyword, cb) => async (dispatch) => {
  offSet = [0, 10]

  if (keyword && keyword.length > 3) {
    try {
      dispatch({ type: SET_GFETCH })
      const res = await axios.get(
        `/api/web/gsearch/testSearch?q=${keyword}&fos=${offSet[0]}&los=${offSet[1]}&lm=false`,
        {}
      )
      dispatch({ type: LOAD_RESULT, payload: res.data })
      cb && cb()
    } catch (err) {
      cb && cb()
      if (axios.isCancel(err)) return console.log('Fetch canceled')
      let errMsg = err.message
      if (err.response.data.msg) errMsg = err.response.data.msg
      alert('ALERT FROM: GO SEARCH\n', errMsg)
    }
  } else {
    cb && cb()
    reset()
    dispatch({ type: CLEAR_RESULT })
  }
}

// ************ NEXT LINE ************ //

export const seeMore = () => async (dispatch) => {
  try {
    offSet[0] = offSet[0] + 10
    offSet[1] = offSet[1] + 10
    getID = CancelToken.source()
    dispatch({ type: LM_FETCH })
    const res = await axios.get(
      `/api/web/gsearch?q=${keywordHolder}&fos=${offSet[0]}&los=${offSet[1]}&lm=true`,
      {
        cancelToken: getID.token,
      }
    )
    dispatch({ type: LOAD_MORE, payload: res.data })
  } catch (err) {
    if (axios.isCancel(err)) return console.log('Fetch canceled')
    let errMsg = err.message
    if (err.response.data.msg) errMsg = err.response.data.msg
    alert('ALERT FROM: SEE MORE\n', errMsg)
  }
}

// ************ NEXT LINE ************ //

export const clResult = () => async (dispatch) => {
  reset()
  dispatch({ type: CLEAR_RESULT })
}

// ************ NEXT LINE ************ //

function reset() {
  clearInterval(interval)
  if (getID !== null) getID.cancel('Api is being canceled')
}
