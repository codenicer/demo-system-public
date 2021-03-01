import * as types from "../types/order_reinstatementTypes";

const initialState = {
  reinstatement_order: [],
  reinstatement_count : [],
order: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_REINSTATEMENT_ORDERS:
      return {
        ...state,
        reinstatement_order: action.payload
      };
    case types.ORDER_REINSTATEMENT_COUNT:
      return {
        ...state,
        reinstatement_count: action.payload
      };
    default:
      return state;
  }
};
