import { LOAD_ANNOTATIONS,UPDATE_ANNOTATIONS} from '../types/annotationTypes'

const initialState = {
    annotations:null
}

export default (state = initialState ,action) =>{
    switch (action.type) {
        
        case UPDATE_ANNOTATIONS :
        case LOAD_ANNOTATIONS :
            return {
                ...state,
                annotations:action.payload    
            }

    
        default:
            return state
    }
}