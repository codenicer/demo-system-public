import * as types from "../types/refundTypes";

const initialState = {
  refund_list: null,
  selected_order_refund_details:null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.LOAD_REFUNDS:
   
      return {
        ...state,
        refund_list: action.payload
      };

      case types.GET_SELECTED_ORDER_REFUND_LIST:
   
        return {
          ...state,
          selected_order_refund_details: action.payload
        };

    default:
      return state;
  }
};
