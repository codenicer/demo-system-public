import React, { useState, useEffect } from 'react';
import DashboardTable from './components/DashboardTable';
import { connect } from "react-redux";
import { fetchOrderDashboard } from '../../scripts/actions/dashboardActions';

const DashboardV2 = (props) => {
    //==========PROPS=========
    //==========PROPS=========

    //props from redux
    const {
        dashboardData,
        fetchOrderDashboard
      } = props;

    // destructuring the dashboard data from redux
    const { order_dashboard } = dashboardData;

    //==========STATE=========
    //==========STATE=========

    //state for changing the category of data show on table initial category is delivery time
    // caterogy can be change to payment or delivery_time
    const [ category, setCategory ] = useState('delivery_time')

    // state for delivery time filter
    // emplty array means get all the delivery time
    const [ deliveryTime, setDeliveryTime ] = useState([]);

    // state for order statuses filter
    // empty array means get all the statuses
    const [ statuses, setStatuses ] = useState([])

    // state for payment method filter
    // empty arras means get all the payment method
    const [ payment, setPayment ] = useState([]);

    //state for date filter
    // null or undefineds means today
    const [ date, setDate] = useState(null);


    //===========USE EFFECT==========
    //===========USE EFFECT==========

    // component did mount and unmount 
    // adding fetching data every 5 minutes
    useEffect(() => {
        var autoRefresh = setInterval(() => fetchOrderDashboard({
            today_date: date,
            hub_id: 1,
            category,
            params: {
                delivery_time: deliveryTime,
                payment_id: payment,
                status: statuses
            }
        }), 300000)
        return () => {
            clearInterval(autoRefresh)
        }
    }, [])

    useEffect(() => {
        fetchOrderDashboard({
            today_date: date,
            hub_id: 1,
            category,
            params: {
                delivery_time: deliveryTime,
                payment_id: payment,
                status: statuses,
            }
        })
    }, [category, deliveryTime, statuses, date, payment])

    useEffect(() => {
        console.log(dashboardData, 'dashboardData')
    }, [dashboardData])

    return (
        <div>
            <div className='grd gtc-fa bg-white pad-1 grd-gp-1'>
                <div className='grd gtc-fa'>
                    <span className='header'>Orders</span>
                    <span className='header-3 jse'>Orders with no date:</span>
                </div>
                <span className='header-3 sublabel'>{order_dashboard[0] && order_dashboard[0]['orders_with_no_date']}</span>
            </div>
            {order_dashboard &&
                <DashboardTable
                    date={date}
                    payment={payment}
                    setPayment={setPayment}
                    setDate={setDate} 
                    category={category}
                    setCategory={setCategory}
                    deliveryTime={deliveryTime}
                    setDeliveryTime={setDeliveryTime}
                    statuses={statuses}
                    setStatuses={setStatuses}
                    data={order_dashboard[0]}/>
            }
        </div>
    )
}

const mapStateToProps = state => {
    return {
      dashboardData: state.dashboardData
    };
  };

  export default connect(
    mapStateToProps, { fetchOrderDashboard }
  )(DashboardV2);
