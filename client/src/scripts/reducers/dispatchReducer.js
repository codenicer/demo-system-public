import * as types from '../types/dispatchTypes';

const initialState = {
    for_assignment:{rows:[], count:0},
    assigned_jobs:{rows:[], count:0},
    ready_to_ship:{rows:[], count:0},
    advance_jobs:{rows:[], count:0},
    redispatch_jobs:{rows:[], count:0},
    job_history:{rows:[], count:0},
    undelivered_jobs:{rows:[], count:0},
    intransit_jobs:{rows:[], count:0},
    tracking_data:{tracking_no:'', status: false},
    fail_cpus: [],
    note_counts: [],
    dashboard_data: [],
    process_fetch: false,
    dispatch_count:{
        list_count:0,
        jobAssigned_count:0
    },
    cpu_orders:{rows: [], count: 0}
}

export default  (state = initialState , action) =>{
    switch(action.type){

        case types.CREATE_RIDER_ASSIGNEMENT :
          return{
            ...state,
            tracking_data:{tracking_no:'', status: false}

          }
        case types.GET_TRACKING_NO :
            return{
                ...state,
                tracking_data:action.payload

            }
        case types.UPDATE_FOR_ASSINGMENT_JOBS:
        case types.LOAD_FOR_ASSINGMENT_JOBS :
            return{
              ...state,
                for_assignment:action.payload

            }
        case types.LOAD_UNDELIVERED_JOBS :
            return{
                ...state,
                undelivered_jobs:action.payload

            }
        case types.LOAD_FOR_HISTORY_JOBS :
            return{
                ...state,
                job_history:action.payload

            }
        case types.LOAD_ASSIGNED_JOBS :
            return{
                ...state,
                assigned_jobs:action.payload
            }

        case types.LOAD_READY_TO_SHIP :
            return{
                ...state,
                ready_to_ship:action.payload
            }

        case types.LOAD_INTRANSIT_JOBS :
            return{
                ...state,
                intransit_jobs:action.payload
            }
        case types.LOAD_ADVANCE_JOBS :
                return{
                    ...state,
                    advance_jobs:action.payload
                }


        case types.UPDATE_MY_DISPATCHJOB :
        case types.LOAD_MY_DISPATCHJOB :
            return{
                ...state,
                my_assembly_job:action.payload
            }

        case types.LOAD_FAIL_CPU :
                return{
                    ...state,
                    fail_cpus:action.payload
            }

        case types.LOAD_NOTES_COUNT :
                return{
                    ...state,
                    note_counts:action.payload
        }

        case types.LOAD_DASHBOARD_DATA:
                return{
                    ...state,
                    dashboard_data:action.payload
        }

        case types.PROCESS_FETCH:
                return{
                    ...state,
                    process_fetch: action.payload
                }
        case types.UPDATE_DISPATCH_COUNT:
            return{
                ...state,
                dispatch_count: action.payload
            }
        case types.LOAD_CPU_ORDERS :
            return{
              ...state,
                cpu_orders:action.payload

            }
        default :
            return state
    }

}