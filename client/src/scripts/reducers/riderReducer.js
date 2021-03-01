import * as types from "../types/riderTypes";

const initialState = {
  available_riders: [],
  rider_providers: [],
  all_riders: { count: 0, row:[]},
  edit_riders: [],
  rider_info: null,
  rider_provider_info: [],
  rider_fetch: true,
  provider_fetch: true
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_AVAILABLE_RIDERS:
    case types.LOAD_AVAILABLE_RIDERS:
      return {
        ...state,
        available_riders: action.payload
      };

    case types.LOAD_RIDER_PROVIDERS :
    case types.UPDATE_RIDER_PROVIDERS:
    case types.LOAD_ALL_PROVIDERS:
      return {
        ...state,
        rider_providers: action.payload
      };
      case types.LOAD_PROVIDER:
        return {
          ...state,
          rider_provider_info: action.payload
        };
    case types.LOAD_ALL_RIDERS:
      return {
        ...state,
        all_riders: action.payload
      };
    case types.LOAD_EDIT_RIDERS:
      return {
        ...state,
        edit_riders: action.payload
      };
    case types.LOAD_RIDER:
        return {
          ...state,
          rider_info: action.payload
        };
    case types.RIDER_FETCH:
        return {
          ...state,
          rider_fetch: action.payload
        }
    case types.PROVIDER_FETCH:
        return {
          ...state,
          provider_fetch: action.payload
        }

    default:
      return state;
  }
};
