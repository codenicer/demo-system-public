import React, { useEffect, lazy, Suspense, useState } from 'react'
import Header from './layout/Header/Header'
import Sidebar from './layout/Sidebar/Sidebar'
import './App.css'
import { connect } from 'react-redux'
import { PageDecider } from './AppScript'
import { updetedOrderListener } from './scripts/actions/ordersActions'
import { updateTicketsCount } from './scripts/actions/ticketsActions'
import { ToastContainer, Flip } from 'react-toastify'
import socket from './scripts/utils/socketConnect'
import { getNewTicketsCount } from './scripts/actions/ticketsActions'
import PagePreloader from './components/PagePreloader/PagePreloader'
import OrderPageLoadData from './PageLoader/OrderPageLoadData'
import ProductPageLoadData from './PageLoader/ProductPageLoadData'
import CustomerPageLoadData from './PageLoader/CustomerPageLoadData'
// const OrderPageLoadData = lazy(()=>import('./PageLoader/OrderPageLoadData'));
// const ProductPageLoadData = lazy(()=>import('./PageLoader/ProductPageLoadData'));
// const CustomerPageLoadData = lazy(()=>import('./PageLoader/CustomerPageLoadData'));

const App = (props) => {
  const {
    auth: { user },
    product,
    orders,
    history,
    updetedOrderListener,
    getNewTicketsCount,
    customer,
    isfetching,
    location,
  } = props
  const [paramsFunction, setParams] = useState({
    params: null,
    function: null,
  })

  // const rowDidUpdate = data =>{console.log(data); updetedOrderListener(data)}

  // const ticketListDidupdate = ()=>{
  //   if ( ![8,3].includes(user.user_info.user_id)) getNewTicketsCount(user.user_info.hubs)
  // }

  //   useEffect(()=>{
  //     if(user !== null){
  //       socket.on('TICKET_LIST_DID_UPDATE',ticketListDidupdate)
  //       return () =>   socket.off('TICKET_LIST_DID_UPDATE',ticketListDidupdate)

  //     }
  //   },[user])

  useEffect(() => {
    if (user) {
      if (
        history.location.pathname === '/system/dashboard' &&
        user.user_info.role_id === 3
      ) {
        history.push('/system')
      }
    }
  }, [user])

  return (
    <div className="app grd cont over-hid">
      <Header
        role={user !== null && user['user_info']['role_id']}
        match={props.match}
        history={history}
        status="Available"
      />
      <Sidebar
        location={location}
        role={user !== null && user['user_info']['role_id']}
      />
      <PageDecider
        {...props}
        role={user !== null && user['user_info']['role_id']}
        socket={socket}
        setFunctionParamns={setParams}
      />
      <OrderPageLoadData
        history={history}
        paramsFunction={paramsFunction}
        data={orders}
      />
      <CustomerPageLoadData data={customer} />
      <ProductPageLoadData data={product} />
      <PagePreloader text="Please wait..." isfetching={isfetching} />
      <ToastContainer autoClose={1500} transition={Flip} />
    </div>
  )
}

const transferStatetoProps = (state) => ({
  auth: state.authData,
  orders: state.orderData,
  customer: state.customerData,
  product: state.productData,
  isfetching: state.webFetchData.isFetching,
})

export default connect(transferStatetoProps, {
  updetedOrderListener,
  getNewTicketsCount,
  updateTicketsCount,
})(App)
