import axios from 'axios'
import { domain } from './config_helper'
import * as types from '../types/productTypes'

export const goSearch = (
  keyword,
  loadmore,
  source,
  offSet,
  resetfxn,
  dispatchSystemState
) => {
  axios
    .post(
      `/system/globalsearch`,
      {
        //signal:signal,
        keyword: keyword,
        offSet: offSet,
        loadmore,
      },
      {
        cancelToken: source.token,
      }
    )
    .then((res) => {
      const { result, resultRemaining, loadmoreState } = res.data
      dispatchSystemState({
        type: types.LOAD_GS_DATA,
        whatstate: true,
        result: result,
        loadmore: loadmore,
        resultRemaining,
        loadmoreState: loadmoreState,
      })
      resetfxn()
    })
    .catch(function (thrown) {
      if (axios.isCancel(thrown)) {
        console.log('Request canceled')
      }
    })
}
