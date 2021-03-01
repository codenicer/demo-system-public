import * as types from '../types/order_logTypes';

const initialState ={
    order_logs:null,
    sel_order_logs:null,
    order_logs_state:null,
}


export default function (state = initialState, action){
    
    switch (action.type) {
        case types.UPDATE_ORDERLOGS:
        case types.LOAD_SEL_ORDERLOGS:
            return {
                ...state,
                sel_order_logs:action.payload,
            }
        
        case types.UPDATE_ORDERLOGS_STATE:
            return {
                ...state,
                order_logs_state:action.payload,
            }

        default:
            return state;
    }
}