import {LOAD_DISPOSITIONS} from '../types/dispositionTypes'
import {intialDispoState} from './InitialStates'

export default (state = intialDispoState ,action) => { 
    switch(action.type){
        
        case LOAD_DISPOSITIONS :
            return{
                ...state,
                dispositions:action.payload
            }


        default : 
        return state
  }
    
}
