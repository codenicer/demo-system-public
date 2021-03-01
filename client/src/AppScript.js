import React from 'react'
import TicketTable from './layout/Body/View/TicketTable/TicketTable'
import TicketHistory from './layout/Body/View/TicketHistory/TicketHistory'
import PrioritizationGrabber from './layout/Body/View/PrioritizationGrabber/PrioritizationGrabber'
import {Route,Switch} from 'react-router-dom'
import Orders from './layout/Body/View/PendingOrders/Orders';
import OrdersNoHub from './layout/Body/View/OrdersNoHub/OrdersNoHub';
import OrderPage from './layout/Body/View/OrderPage/OrderPage';
import OrderRefund from './Pages/OrderRefund/OrderRefund'
import CustomerPage from './layout/Body/View/CustomerPage/CustomerPage';
import ProductPage from './layout/Body/View/ProductPage/ProductPage';
import AssemblyRoutes from './layout/Body/View/Assembly/AssemblyRoutes';
import OrderHistory from './Pages/OrderHistory/OrderHistory';
import ReinstatementOrder from './Pages/ReinstatementOrders/ReinstatementOrders';
import FloristTable from './layout/Body/View/FloristTable/FloristTable';
import DispatchRoute from './Pages/Dispatch/DispatchRoute';
import HubRoute from './Pages/Hub/HubRoute';
import RoleRoute from './Pages/Role/RoleRoute';
import UserRoute from './Pages/User/UserRoutes';
import TicketSinglePage from './layout/Body/View/TicketSinglePage/TicketSinglePage' ;
import DispatchDashBoard from './Pages/DashboardV2/DashboardWrap';
import FloristHeadTabletView from './Pages/FloristHeadTabletView/FloristHeadTabletView';
import FloristTabletView from './Pages/FloristTabletView/FloristTabletView';
import RiderRoute from './Pages/Rider/RiderRoute';
import RiderProviderList from './Pages/RiderProvider/RiderProviderList';
import FloristQueueMobile from './layout/Body/View/FloristQueueMobile/FloristQueueMobile';
import OrderUnpaid from './layout/Body/View/OrderUnpaid/OrderUnpaid';
import OrderSympathy from './layout/Body/View/OrderSympathy/OrderSympathy';
import OrderOnHold from './layout/Body/View/OrderOnHold/OrderOnHold';
import OrdersNoDateTime from './layout/Body/View/OrdersNoTimeDate/OrdersNoDateTime';
import AssemblerJobTablet from './Pages/AssemblerJobTablet/AssemblerJobTablet';
import RestOfPhilOrders from './layout/Body/View/RestOfPhilOrders/RestOfPhilOrders'
import RestOfPhilOrdersDispatch from './layout/Body/View/RestOfPhilOrdersDispatch/RestOfPhilOrdersDispatch'


import RefundList from './layout/Body/OrderPaymentDetails/RefundList';


const PageNotFound = () =>{
    return <h1>Page is Under Maintenance.</h1>
}

export  const PageDecider = (props) =>{ 
  const { role, socket, match, history,setFunctionParamns } =  props
   if (role === false){
    return null
  }else if(role === 3){
         return<FloristQueueMobile socket={socket} match={match} history={history} exact/>
  }           
   else if(role === 7){
      return(
        <>
          <Route path={`${match.path}`} render={(props)=><FloristHeadTabletView {...props} socket={socket} />} />
          <Route component={PageNotFound} />
        </>
      )
   } else if(role === 4){
     return <AssemblerJobTablet match={match} {...props} />
   } else if (role === 8){
      return <FloristTabletView />
  }else{
     return (
     <div className='pad-1'>
        <Switch>
              <Route path={`${match.path}/dashboard`} component={DispatchDashBoard} exact />
              <Route path={`${match.path}/`} render={
                 (props) => <Orders {...props} setFunctionParamns={setFunctionParamns} />
              }  exact />
              <Route path={`${match.path}/restofphil`} component={RestOfPhilOrders} exact />
              <Route path={`${match.path}/restofphil/dispatch`} component={RestOfPhilOrdersDispatch} exact />
            { // <Route path={[`${match.path}/nohub`,`${match.path}/nohub/:shopify_order_name`]} component={OrdersNoHub} exact />
            }
           

              <Route path={`${match.path}/nohub`} component={OrdersNoHub} exact />
              <Route path={`${match.path}/noDateTime`} component={OrdersNoDateTime} exact />
              <Route path={`${match.path}/forist/monitoring`} component={FloristTable} exact />
              <Route path={`${match.path}/prioritization`} component={PrioritizationGrabber}  exact  />  
              <Route path={`${match.path}/ticket`} component={TicketTable}  exact />
              <Route path={`${match.path}/ticket/history`} component={TicketHistory} exact/>
              <Route path={`${match.path}/ticket/:ticket_id`} component={TicketSinglePage}  exact />
              <Route path={`${match.path}/unpaid`} component={OrderUnpaid} exact />
              <Route path={`${match.path}/onhold`} component={OrderOnHold} exact />
            { // <Route path={[`${match.path}/closedorders`,`${match.path}/closedorders/:shopify_order_name`]} component={OrderHistory}  exact  />
            }
              <Route path={`${match.path}/closedorders`} component={OrderHistory}  exact  />
              <Route path={`${match.path}/reinstatementorders`} component={ReinstatementOrder}  exact  />
              <Route path={`${match.path}/assembly`} component={AssemblyRoutes} />
              <Route path={`${match.path}/dispatch`} component={DispatchRoute} />
              <Route path={`${match.path}/hub`} component={HubRoute} />
              <Route path={`${match.path}/user`} component={UserRoute} />
              <Route path={`${match.path}/rider`} component={RiderRoute} />
              <Route path={`${match.path}/rider_provider`} component={RiderProviderList} />
              <Route path={`${match.path}/role`} component={RoleRoute} />
              <Route path={`${match.path}/sympathy`} component={OrderSympathy} exact />
              
              <Route path={`${match.path}/refunds/:order_id`} component={OrderRefund} exact />
              <Route path={`${match.path}/refunds`} component={RefundList} exact />
              <Route component={PageNotFound} />
       </Switch>
    </div>)
  }
}


//   <Route component={PageNotFound} />

export const ProductPageLoadData = ({data:{sel_products}}) =>{
  if(sel_products !== null){
    return  <ProductPage
    data={sel_products}
    />

  }else{
   return null
  }
  

}


export const CustomerPageLoadData = ({data:{sel_customer}}) =>{
  if(sel_customer !== null){
          return  <CustomerPage
          data={sel_customer}
          />

    }else{
      return null
    }
}

export const OrderPageLoadData = ({data:{sel_order}}) =>{
    if(sel_order !== null){
          return   <OrderPage
          data={sel_order}
          />
  
    }else{
      return null
    }
}
