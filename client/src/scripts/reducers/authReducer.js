
  import {LOGIN_FAILED, LOGIN_SUCCESS, LOAD_USER, USER_LOGOUT } from '../types/auth'
  import {initialLogState} from './InitialStates'

  
  export default (state = initialLogState ,action) => {
      switch(action.type){

        case LOGIN_SUCCESS:
          localStorage.setItem('token',action.payload)
          return{
            ...state,
            token:action.payload,
            logout:false,
          }


        case LOGIN_FAILED:
          localStorage.removeItem('token')
          return{
            ...state,
            token:null,
            isAuthenticated: false,
            user:null,
            fetching:false,
            logout:false,
          }


        case LOAD_USER : 
          return{
            ...state,
            user:action.payload, 
            isAuthenticated:true,
            fetching:false,

          }

          
        case USER_LOGOUT : 
          localStorage.removeItem('token')
          return {
            ...state,
            token:null,
            user:null,
            isAuthenticated:false,
            logout:true,
          }

          
        default :
            return state
      }
  }