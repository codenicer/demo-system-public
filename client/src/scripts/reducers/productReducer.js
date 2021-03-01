import {LOAD_PRODUCTS,LOAD_SEL_PRODUCTS,CLEAR_SEL_PRODUCTS} from '../types/productTypes'
import {initialProductState} from './InitialStates'

export default (state = initialProductState ,action) => { 
    switch(action.type){
        
        case LOAD_PRODUCTS :
            return{
                ...state,
                products:action.payload
            }

        
        case LOAD_SEL_PRODUCTS :
            return{
                ...state,
                sel_products:action.payload
            }


        case CLEAR_SEL_PRODUCTS:
            return{
                ...state,
                sel_products:null
            }
            

        default : 
        return state
  }
    
}
