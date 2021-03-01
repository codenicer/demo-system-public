import {LOAD_CUSTOMERS,LOAD_SEL_CUSTOMER,CLEAR_SEL_CUSTOMER} from '../types/customerTypes'
import {initialCustomerState} from './InitialStates'

// customers:null,
// sel_customer:null

export default (state = initialCustomerState ,action) => { 
    switch(action.type){
        
        case LOAD_CUSTOMERS :
            return{
                ...state,
                customers:action.payload
            }

        
        case LOAD_SEL_CUSTOMER :
            return{
                ...state,
                sel_customer:action.payload
            }


        case CLEAR_SEL_CUSTOMER:
            return{
                ...state,
                sel_customer:null
            }
            

        default : 
        return state
  }
    
}
