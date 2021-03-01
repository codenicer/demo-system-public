import { LOAD_ORDER_DASHBOARD, LOAD_DISPATCH_DASHBOARD, LOAD_DISPATCH_DASHBOARD_LIST } from '../types/dashboardTypes'

const initialState = {
    order_dashboard:[],
    dispatch_dashboard:[],
    dispatch_dashboard_list:[]
}

export default  (state = initialState , action) =>{
    switch(action.type){
        case LOAD_ORDER_DASHBOARD:
            return{
                ...state,
                order_dashboard: action.payload
            }
        case LOAD_DISPATCH_DASHBOARD:
            return{
                ...state,
                dispatch_dashboard:action.payload
            }

        case LOAD_DISPATCH_DASHBOARD_LIST:
            return{
                ...state,
                dispatch_dashboard_list:action.payload
            }
        default : 
        return state
  }

}