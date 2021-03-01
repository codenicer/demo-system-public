import * as types  from '../types/roleTypes';

const initialHubState = {
    roles:{rows:[], count:0},
    role_list:[],
    role_info:{},
    module_items:[],
    msg:null,
}

export default function (state = initialHubState,action){

    switch(action.type){
        case types.LOAD_ROLES:

            return {...state,
              roles:action.payload,
            };

        case types.LOAD_MODULE_ITEMS:

            return {...state,
              module_items:action.payload,
            };
      case types.LOAD_ROLE_INFO:

            return {...state,
              role_info:action.payload,
            };


        default :
            return state;
    }
}