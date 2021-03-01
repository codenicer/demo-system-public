import {WEB_SETFETCH,WEB_SUCCESS,WEB_ERROR} from '../types/webfetchTypes'
import {initialWebSearchState} from './InitialStates'


export default (state = initialWebSearchState ,action) => { 
    switch(action.type){
        
        case WEB_SETFETCH :
            return{
                ...state,
                isFetching:true
            }

            
        case WEB_ERROR:
        case WEB_SUCCESS :
            return{
                ...state,
                isFetching:false
            }

            
        default : 
        return state
  }
    
}
