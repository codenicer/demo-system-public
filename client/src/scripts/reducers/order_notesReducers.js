import * as types from '../types/order_notesTypes';

const initialState ={
    order_notes:null,
    sel_order_notes:null,
    order_notes_state:null,
}


export default function (state = initialState, action){
    
    switch (action.type) {
        case types.UPDATE_ORDERNOTES:
        case types.LOAD_SEL_ORDERNOTES:
            return {
                ...state,
                sel_order_notes:action.payload,
            }
        
        case types.UPDATE_ORDERNOTES_STATE:
            return {
                ...state,
                order_notes_state:action.payload,
            }

        default:
            return state;
    }
}