import {LOAD_FLORIST,UPDATE_FLORIST} from '../types/floristTypes'

const intialState = {
    florist:null
}

export default (state = intialState ,action) => { 
    switch(action.type){
        
        case LOAD_FLORIST :
        case UPDATE_FLORIST :
            return{
                ...state,
                florist:action.payload
            }


        default : 
        return state
  }
    
}

