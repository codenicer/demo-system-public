
import  * as types from '../types/ordersTypes';


const InitialState = {
    orders: {count:0, rows:[]},
    ordersNoHub: {count:0, rows:[]},
    ordersNoDateTime: {count:0, rows:[]},
    ordersRestOfPhil: {count:0, rows:[]},
    ordersRestOfPhilDispatch: {count:0, rows:[]},
    sel_order:null,
    sel_order_tickets:[],
    prioritization:null,
    msg:null,
    closed_orders:{count:0, rows:[]},
    count:0,
    prio_count:0,
    ticket_info: [],
    history_count: 0,
    dispatch_status: null,
    order:null,
    orderpaymentdetail:null,
}

export default function (state = InitialState,action){

    switch(action.type){

        
            case types.LOAD_ORDER_PAYMENTDETAILS :
                return {
                    ...state,
                    orderpaymentdetail:action.payload,
                }
            
    

        case types.UPDATE_ORDERS :
        case types.LOAD_ORDERS :
            return {
                ...state,
                orders:action.payload,
            }
        

        case types.LOAD_CLOSED_ORDERS:
            return{
                ...state,
                closed_orders:action.payload,
            }


        case types.UPDATE_SORDER :
        case types.LOAD_SEL_ORDER :
            return{
                ...state,
                sel_order:action.payload,
            }


        case types.ORDER_CLOSED_CHANGE_COUNT :
            return{
                ...state,
                closed_count:action.payload
            }

        case types.ORDER_CHANGE_COUNT :
            return{
                ...state,
                count:action.payload
            }

       case types.ORDER_HISTORY_COUNT :
            return{
                ...state,
                history_count:action.payload
            }
         
        case types.UPDATE_PRIORITIZATION :
        case types.LOAD_PRIORITIZATION :
            return{
                ...state,
                prioritization:action.payload.rows,
                prio_count:action.payload.count
            }

        case types.LOAD_ORDER_TICKET :
            return{
                ...state,
                ticket_info:action.payload

            }

        case types.CLEAR_SELEDTED :
            return{
                ...state,
                sel_order:null,
                fetching:false,
            }

        case types.LOAD_SEL_ORDER_TICKETS :
            return{
                ...state,
                sel_order_tickets:action.payload
            }

        case  types.LOAD_FOR_HUB_FILTER:
            return{
                ...state,
                filter_hub:action.payload,
            }

        case  types.LOAD_DISPATCH_RIDER:
            state.dispatch_rider = action.payload
            return{
                ...state,
                dispatch_rider:action.payload,
            }

        case types.LOAD_DISPATCH_STATUS:
            return{
                ...state,
                dispatch_status: action.payload
            }

        case types.LOAD_ORDERS_NO_HUB :
            return {
                ...state,
                ordersNoHub:action.payload,
            }

        case types.LOAD_ORDER_NO_DATE_TIME :
            return {
                ...state,
                ordersNoDateTime:action.payload,
            }

        case types.LOAD_ORDER_REST_OF_PHIL :
            return {
                ...state,
                ordersRestOfPhil:action.payload,
            }

        case types.LOAD_ORDER_REST_OF_PHIL_DISPATCH :
            return {
                ...state,
                ordersRestOfPhilDispatch:action.payload,
            }

        case types.VIEW_ORDER :
            return {
                ...state,
                order:action.payload,
            }
        
        default :
            return state;
    }
}