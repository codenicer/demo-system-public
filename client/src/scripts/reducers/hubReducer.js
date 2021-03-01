import * as hubtypes from '../types/hubTypes';

const initialHubState = {
    hubs:[],
    hub_list:{rows:[], count:0},
    msg:null,
}

export default function (state = initialHubState,action){

    switch(action.type){
        case hubtypes.LOAD_HUBS:
            
            return {...state,
                hubs:action.payload,
            };
        case hubtypes.LOAD_HUB_LIST:

            return {...state,
                hub_list:action.payload,
            };


        default :
            return state;
    }
}