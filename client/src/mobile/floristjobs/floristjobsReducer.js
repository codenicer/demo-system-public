import {LOAD_MFLORISTJOBS,LOAD_MINJOB,LOAD_MOBILE_FLORISTJOBS,CLEAR_MINJOB,LOAD_MHOLDJOB,UPDATE_MHOLDJOB, LOADING_PENDING_FLORIST} from './floristjobsTypes'

const initialState = {
    florist_job:{
        rows:[],
        count:0
    },
    florist_holdjob:null,
    florist_injob:null,
    florist_pending: null,
    florist_job_mobile: null
}

export default (state = initialState ,action) => { 
    switch(action.type){
        
        case LOAD_MFLORISTJOBS :
            return{
                ...state,
                florist_job:{
                    rows:action.payload.rows,
                    count:action.payload.count
                }
            }
        case LOAD_MOBILE_FLORISTJOBS :
            return{
                ...state,
                 florist_job_mobile:action.payload
            }
        
        case LOAD_MINJOB :
            return{
                ...state,
                florist_injob:action.payload
            }
        case CLEAR_MINJOB:
            return{
                ...state,
                florist_injob:action.payload
            }
        
        case UPDATE_MHOLDJOB:
        case LOAD_MHOLDJOB :
            return{
                ...state,
                florist_holdjob:action.payload
            }

        case LOADING_PENDING_FLORIST :
            return{
                ...state,
                florist_pending:action.payload
            }

        default : 
        return state
  }
    
}
