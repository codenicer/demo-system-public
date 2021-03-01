import * as types from "../types/riderProviderTypes";

const initialState = {
  available_riders_providers: [],
  rider_providers: [],
  all_riders_providers: [],
  edit_riders_providers: [],
  rider_provider_info: null

};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.UPDATE_AVAILABLE_RIDER_PROVIDER:
    case types.LOAD_AVAILABLE_RIDER_PROVIDER:
      return {
        ...state,
        available_RIDERS_PROVIDERS: action.payload
      };

    case types.UPDATE_RIDER_PROVIDERS:
    case types.LOAD_ALL_RIDER_PROVIDER:
      return {
        ...state,
        rider_providers: action.payload
      };
    case types.LOAD_RIDER_PROVIDER_INFO:
      return {
        ...state,
        rider_provider_info: action.payload
      };
    case types.LOAD_EDIT_RIDER_PROVIDER:
      return {
        ...state,
        edit_riders_providers: action.payload
      };

    default:
      return state;
  }
};
