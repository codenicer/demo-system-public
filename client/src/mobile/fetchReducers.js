import { SET_FETCH,SET_SUCCESS } from './floristjobs/floristjobsTypes';

const initialState = {
    isFetching:false,
}

export default (state = initialState ,action) => { 
    switch(action.type){
        
        case SET_FETCH :
            return{
                ...state,
                isFetching:true
            }
            
        case SET_SUCCESS : 
            return{
                ...state,
                isFetching:false
            }

        default : 
        return state
  }
    
}
