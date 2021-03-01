export const initialLogState = {
    token:localStorage.getItem('token'),
    isAuthenticated: false,
    user:null,
    fetching:true
}



export const initialOrderState = {
    orders:null,
    sel_order:null,
    prioritization:null,
    msg:null,
    closed_orders:null,
    filter_hub: null,
    dispatch_rider: [],
    closed_count:0,
    count:0,
    prio_count:0
}



export const initialGSearchState = {
    results:null,
    fetching:false,
    remaining:0,
    loadmore:false,
    lm_fetch:false,
}


export const intialDispoState ={
    dispositions:null,
}


export const initialWebSearchState ={
    isFetching:false,
    error:null
}


export const initialCustomerState ={
    customers:null,
    sel_customer:null
}


export const initialProductState ={
    products:null,
    sel_products:null
}
