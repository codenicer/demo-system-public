import React, { useEffect, useState } from 'react';
import config from './config.json';
import Modal from '../../../template/Modal/Modal';
import OrderID from '../../../molecules/OrderID/OrderID.js';
import { fetchDispatchDashboardList } from '../../../scripts/actions/dashboardActions.js';
import {connect} from 'react-redux'

const DashboardRow = (props) => {
    // The States
    const [modal, setModal] = useState(false);
    const [orderList, setOrderList] = useState([]);
    const [loading, setLoading] = useState(true);

    // config desctructuring
    const { payment } = config;

    //===========PROPS=========
    //===========PROPS=========
    
    //pass down props 
    const { data, category, fetchDispatchDashboardList, dashboardDataList } = props;

    //destructuring data props
    const { delivery_time, delivery_date, cancelled, hold, pending, booking, rider_assigned, shipped, delivered, failed_delivery, payment_id, jobtype } = data;

    //==============FUNCTIONS=============
    //==============FUNCTIONS=============

    //COMPONENT DID MOUNT
    useEffect(() => {
     if(dashboardDataList){
        setLoading(false);
        setOrderList(dashboardDataList);
     }
    }, [dashboardDataList])

    const paymentLabelHandler = (y) => {
        let result;
        payment.forEach(x => {
            if(x.id === y){
                result = x.name
            }
        })
        return result;
    }

    const checkStatus = async (length, order_status) =>{

        if(length <= 0){
            return;
        }

        let hub_id = data['hub_id'] || 1;
        setModal(true);
        setLoading(true);

        fetchDispatchDashboardList({
            delivery_date,
            delivery_time,
            hub_id,
            order_status
        });
    }

    //List of orders that is requested
    const ListOfOrders = <div style={{height: '355.2px',  overflowY:'auto', margin: 'auto'}}>
        {orderList.map((order, i) => {
            return(
                <OrderID orderid={order['order_id']}>
                    <p onClick={() => setModal(false)}>{order['shopify_order_name']}</p>
                </OrderID>
            )
        })}
    </div>

    return (
        <>
        {category === 'payment' ?
            <div 
                style={{borderBottom: '1px solid #929292'}}
                className='_dashboard_row grd grd-col grd-col-f jie pad-y-1'>
                <div className='jss'>{paymentLabelHandler(Number(payment_id))}</div>
                <div>{cancelled}</div>
                <div>{hold}</div>
                <div>{pending}</div>
                <div>{booking}</div>
                <div>{rider_assigned}</div>
                <div>{shipped}</div>
                <div>{delivered}</div>
                <div>{failed_delivery}</div>
            </div>
            :
            <div 
                style={{borderBottom: '1px solid #929292'}}
                className='_dashboard_row grd grd-col grd-col-f jie pad-y-1'>
                <div className='jss'>{jobtype ? `${delivery_time} (${jobtype})` : delivery_time}</div>
                <div
            className={cancelled > 0 ? "dashboard_count" : "dashboard_no_count"}
            onClick={() => checkStatus(cancelled, "cancelled")}
          >
            {cancelled}
          </div>
          <div
            className={hold > 0 ? "dashboard_count" : "dashboard_no_count"}
            onClick={() => checkStatus(hold, "onhold")}
          >
            {hold}
          </div>
          <div
            className={pending > 0 ? "dashboard_count" : "dashboard_no_count"}
            onClick={() => checkStatus(pending, "pending")}
          >
            {pending}
          </div>
          <div
            className={booking > 0 ? "dashboard_count" : "dashboard_no_count"}
            onClick={() => checkStatus(booking, "booking")}
          >
            {booking}
          </div>
          <div
            className={
              rider_assigned > 0 ? "dashboard_count" : "dashboard_no_count"
            }
            onClick={() => checkStatus(rider_assigned, "rider_assigned")}
          >
            {rider_assigned}
          </div>
          <div
            className={shipped > 0 ? "dashboard_count" : "dashboard_no_count"}
            onClick={() => checkStatus(shipped, "shipped")}
          >
            {shipped}
          </div>
          <div
            className={delivered > 0 ? "dashboard_count" : "dashboard_no_count"}
            onClick={() => checkStatus(delivered, "delivered")}
          >
            {delivered}
          </div>
          <div
            className={
              failed_delivery > 0 ? "dashboard_count" : "dashboard_no_count"
            }
            onClick={() => checkStatus(failed_delivery, "failed_delivery")}
          >
            {failed_delivery}
          </div>
            </div>
        }

    { modal && <Modal
        width='300px'
        height='500px'
        label="Pending Orders"
        clickClose={() => setModal(false)}
        clickCancel={() => setModal(false)}
        clickSubmit={() => setModal(false)}
        submitlabel="Close"
      >
        <div style={{height: '100%'}}>
            <h1>Delivery Date: {delivery_date}</h1>
            <h1>Delivery Time: {delivery_time}</h1>
            <hr/>
            {loading ? <p style={{textAlign: 'center', verticalAlign:'middle'}}>Loading...</p> : ListOfOrders}
        </div>
      </Modal>}
        </>
    )
}

const mapStateToProps = state => {
    return {
        dashboardDataList: state.dashboardData.dispatch_dashboard_list
    };
  };

export default connect(mapStateToProps, {fetchDispatchDashboardList})(DashboardRow);
