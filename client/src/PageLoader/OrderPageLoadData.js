import React from 'react'
import OrderPage from '../layout/Body/View/OrderPage/OrderPage';

 const OrderPageLoadData = ({data:{sel_order},paramsFunction,history}) =>{
    if(sel_order !== null){
          return   <OrderPage
          paramsFunction={paramsFunction}
          data={sel_order}
          history={history} 
          />
  
    }else{
      return null
    }
}

export default OrderPageLoadData
