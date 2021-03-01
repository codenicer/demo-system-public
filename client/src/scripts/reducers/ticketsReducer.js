import {GET_NEW_TICKETS_COUNT, UPDATE_NEW_TICKETS_COUNT,LOAD_TICKETS,UPDATE_TICKETS ,LOAD_SEL_TICKET,UPDATE_SEL_TICKET ,CLEAR_SEL_TICKETS } from '../types/ticketTypes' 
import * as types from '../../scripts/types/ticketTypes'
const initialState = {
    tickets:null,
    open_ticket_count:0,
    closed_tickets:null,
    closed_ticket_count:0,
    sel_ticket:null,
    new_tickets_count:{
        open_ticket: 0,
        no_hub: 0,
        no_datentime: 0,
        returns_count: 0
    },
    single_page_ticket:null
}



export default (state = initialState ,action) => { 
        switch(action.type){
            
            case UPDATE_TICKETS:
            case LOAD_TICKETS:
                return{
                    ...state,
                    tickets:action.payload.rows,
                    open_ticket_count:action.payload.count
                }
                

            case UPDATE_SEL_TICKET:
            case LOAD_SEL_TICKET:
                return{
                    ...state,
                    sel_ticket:action.payload
                }
            
            case types.LOAD_TICKET_HISTORY:
            case types.UPDATE_TICKET_HISTORY:
                return{
                    ...state,
                    closed_tickets:action.payload.rows,
                    closed_ticket_count:action.payload.count
                }

            case CLEAR_SEL_TICKETS:
                    return{
                        ...state,
                        sel_ticket:null
                    }

            case UPDATE_NEW_TICKETS_COUNT :
            case GET_NEW_TICKETS_COUNT:
                    return{
                        ...state,
                        new_tickets_count:action.payload
                    }

            case types.LOAD_SINGLE_PAGE_TICKET :
                    return{
                        ...state,
                        single_page_ticket:action.payload

                    }
            

            default : 
            return state
    }
    
}
