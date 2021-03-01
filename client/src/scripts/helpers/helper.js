// import socket from '../utils/socketConnect'

export const stringChecker = (qty) => {
  return qty.toString().match(/[a-z]/i) ? true : false
}

export const Timer_Pop = (callback, delay) => {
  let timerId,
    start,
    remaining = delay
  this.pause = function () {
    clearTimeout(timerId)
    remaining -= Date.now() - start
  }

  this.resume = function () {
    start = Date.now()
    clearTimeout(timerId)
    timerId = setTimeout(callback, remaining)
  }

  this.resume()
}

export function queryStringHelper(pParams = {}) {
  if (!pParams) {
    return '?'
  }

  let params = pParams
  if (params.hasOwnProperty('page')) {
    if (parseInt(params.page) <= 0 || isNaN(params.page)) {
      params.page = 1
      if (params.hasOwnProperty('pageSize')) {
        if (parseInt(params.pageSize) <= 0 || isNaN(params.pageSize)) {
          params.pageSize = 15
        }
      } else {
        params.pageSize = 15
      }
    } else {
      if (params.hasOwnProperty('pageSize')) {
        if (parseInt(params.pageSize) <= 0 || isNaN(params.pageSize)) {
          params.pageSize = 15
        }
      } else {
        params.pageSize = 15
      }
    }
  } else {
    if (params.hasOwnProperty('pageSize')) {
      if (parseInt(params.pageSize) <= 0 || isNaN(params.pageSize)) {
        params.pageSize = 15
        params.page = 1
      }
    }
  }

  let str = Object.keys(params)
    .map(function (key) {
      return key + '=' + encodeURIComponent(params[key])
    })
    .join('&')

  return `?${str}`
}
