import {LOAD_ASSEMBLYJOB,LOAD_MY_ASSEMBLYJOB,UPDATE_ASSEMBLYJOB,UPDATE_MY_ASSEMBLYJOB,LOAD_ASSEMBLYJOBTWO} from '../types/assemblyTypes'

const initialState = {
    assembly_jobs:{
        rows:[],
        count:0
    },
    assembly_jobs_two:{
        rows:[],
        count:0
    },
    my_assembly_job:null,
}

export default  (state = initialState , action) =>{
    switch(action.type){
        
        case UPDATE_ASSEMBLYJOB :
        case LOAD_ASSEMBLYJOB :
            return{
                ...state,
                assembly_jobs:{
                    rows:action.payload.rows,
                    count:action.payload.count
                }
            }


        case UPDATE_MY_ASSEMBLYJOB :
        case LOAD_MY_ASSEMBLYJOB :
            return{
                ...state,
                my_assembly_job:action.payload
            }
        case LOAD_ASSEMBLYJOBTWO :
            return{
                ...state,
                assembly_jobs_two:action.payload
            }
            

        default : 
        return state
  }

}