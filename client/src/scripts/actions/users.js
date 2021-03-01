import axios from 'axios'
import { WEB_SETFETCH, WEB_SUCCESS, FETCH_USER } from '../types/webfetchTypes'
import { LOAD_USERS, LOAD_USER_INFO } from '../types/users'
// import { config, domain } from "./../helpers/config_helper";
import { dispatchError } from './../helpers/dispatch_helper'
import { queryStringHelper } from './../helpers/helper'
import { toast } from 'react-toastify'
import { config, domain } from './../../scripts/helpers/config_helper'

export const handleLoadUsers = () => async (dispatch) => {
  await dispatch({ type: WEB_SETFETCH })
  loadUsers(dispatch)
}

export const fetchUsers = (params) => async (dispatch) => {
  dispatch({ type: WEB_SETFETCH })
  try {
    //params are pagination settings

    let queryString = queryStringHelper(params)
    const res = await axios.get(`/api/web/user/${queryString}`, config)
    await dispatch({ type: LOAD_USERS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

//FETCHING SPECIFIC USER
export const fetchUser = (userId) => async (dispatch) => {
  dispatch({ type: WEB_SETFETCH })
  try {
    const res = await axios.get(`/api/web/user/${userId}`)
    await dispatch({ type: FETCH_USER, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const getUserByID = (params) => async (dispatch) => {
  try {
    //params are pagination settings

    let queryString = queryStringHelper(params)
    const res = await axios.get(`/api/web/user/${queryString}`, config)
    await dispatch({ type: LOAD_USER_INFO, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}

export const addUser = (form, image, callback) => async (dispatch) => {
  // @NOTE :  form {user_name,address}
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.post(`/api/web/user/create`, form)

    if (res) {
      if (image) {
        const data = new FormData()

        data.append('image', image, [res.data.fileName, res.data.userEmail])
        axios
          .post(`/api/web/user/user_file_upload`, data, {
            headers: {
              'Content-Type': `multipart/form-data`,
            },
          })
          .then(async (res) => {
            await dispatch({ type: WEB_SUCCESS })
            callback('User successfully created.')
          })
          .catch((error) => {
            // If another error
            // this.ocShowAlert(error, "red");
            console.log(error)
          })
      } else {
        //if no image file
        await dispatch({ type: WEB_SUCCESS })
        callback(res.data.msg)
      }
    }
  } catch (err) {
    if (err.response.data) {
      console.log('ERROR', err.response.data)

      await dispatch({ type: WEB_SUCCESS })
      return toast.warn(err.response.data.msg)
    }
  }
}

// ************ NEXT LINE ************ //

export const updateUser = (
  form,
  email,
  userId,
  image,
  fileName,
  callback
) => async (dispatch) => {
  try {
    await dispatch({ type: WEB_SETFETCH })
    const res = await axios.patch(`/api/web/user/update/${userId}`, form)

    if (res) {
      if (image) {
        const data = new FormData()

        data.append('image', image, [fileName, email])
        axios
          .post(`/api/web/user/user_file_upload`, data, {
            headers: {
              'Content-Type': `multipart/form-data`,
            },
          })
          .then(async (res) => {
            await dispatch({ type: WEB_SUCCESS })
            callback('User successfully created.')
          })
          .catch((error) => {
            // If another error
            // this.ocShowAlert(error, "red");
            console.log(error)
          })
      } else {
        //if no image file
        await dispatch({ type: WEB_SUCCESS })
        callback(res.data.msg)
      }
    }
  } catch (err) {
    if (err.response.data) {
      console.log('ERROR', err.response.data)

      await dispatch({ type: WEB_SUCCESS })
      return toast.warn(err.response.data.msg)
    }
  }
}

// ************ NEXT LINE ************ //

// NOTE : method replace on placing promise so we can put it on exported actions
async function loadUsers(dispatch) {
  try {
    const res = await axios.get(`/api/web/user/`)
    await dispatch({ type: LOAD_USERS, payload: res.data })
    dispatch({ type: WEB_SUCCESS })
  } catch (err) {
    dispatchError(err, dispatch)
  }
}
