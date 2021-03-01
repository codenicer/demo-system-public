import React from 'react'
import CustomerPage from '../layout/Body/View/CustomerPage/CustomerPage';


 const CustomerPageLoadData = ({data:{sel_customer}}) =>{
    if(sel_customer !== null){
            return  <CustomerPage
            data={sel_customer}
            />
  
      }else{
        return null
      }
  }
  
  export default CustomerPageLoadData