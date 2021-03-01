import {LOAD_RESULT,SET_GFETCH,CLEAR_RESULT,LOAD_MORE,LM_FETCH} from '../types/gsearchTypes'
import {initialGSearchState} from './InitialStates'

export default (state = initialGSearchState ,action) => { 
    switch(action.type){
        
        case LOAD_RESULT :
            return{
                ...state,
                results:action.payload.result,
                remaining:action.payload.resultRemaining,
                fetching:false
            }

        
        case SET_GFETCH :
            return{
                ...state,
                remaining:0,
                loadmore:false,
                fetching:true
            }
        

        case LM_FETCH:
            return{
                ...state,
                lm_fetch:true
            }


        case LOAD_MORE : 
            return{
                ...state,
                results:state.results.concat(action.payload.result),
                remaining:action.payload.resultRemaining,
                fetching:false,
                lm_fetch:false
            }


        case CLEAR_RESULT :
            return{
                ...state,
                results:null,
                fetching:false,
                remaining:0,
                loadmore:false,
            }

            

        default : 
        return state
  }
    
}

