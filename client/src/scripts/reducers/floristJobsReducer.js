import {LOAD_FLORISTJOB,UPDATE_FLORISTJOB} from '../types/floristjobTypes'

const intialState = {
    floristjobs:null
}

export default (state = intialState ,action) => { 
    switch(action.type){
        
        case UPDATE_FLORISTJOB :
        case LOAD_FLORISTJOB :
            return{
                ...state,
                floristjobs:action.payload
            }


        default : 
        return state
  }
    
}

