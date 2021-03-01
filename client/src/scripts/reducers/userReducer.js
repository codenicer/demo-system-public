import * as types from "../types/users";

const initialHubState = {
  all_users: [],
  user_profile: null,
  user: null,
  userHubs: null
};

export default function(state = initialHubState, action) {
  switch (action.type) {
    case types.LOAD_USER_INFO:
      return {
        ...state,
        user_info: action.payload
        //totalPages:action.payload.count,
      };

    case types.LOAD_USERS:
      return {
        ...state,
        all_users: action.payload
        //totalPages:action.payload.count,
      };

    case types.FETCH_USER:
      return {
        ...state,
        user: action.payload.user_info,
        userHubs: action.payload.user_info.hubs
        //totalPages:action.payload.count,
      };

    default:
      return state;
  }
}
