import React, { useState, useEffect } from 'react';
import Container from '../../../../atoms/Container/Container';
import Input from '../../../../atoms/Input/Input';
import Select from 'react-select/lib/Select';
import PendingOrderHeader from '../PendingOrders/PendingOrderHeader/PendingOrderHeader';
import PendingOrderRow from '../PendingOrders/PendingOrderRow/PendingOrderRow';

//redux
import {connect} from 'react-redux';
import { fetchUnpaidOrders } from '../../../../scripts/actions/ordersActions';

//package
import moment from 'moment-timezone'

//config
import filter_config from '../../../../config.json'
import Pagination from '../../../../atoms/Pagination/Pagination';
import Error from '../../../../atoms/Error/Error';

moment.tz.setDefault("Asia/Manila");
const OrderUnpaid = (props) => {
    //======VARIABLE======
    //======VARIABLE======

    let timer;

    //destructuring the config json
    const { paymentMethod, orderStatus, deliverytime } = filter_config

    //======PROPS=======
    //======PROPS=======

    //redux
    const { orderData, userhubs, fetchUnpaidOrders } = props

    //=======STATE========
    //=======STATE========

    //params for fetching
    const [ params, setParams] = useState({
        page: 1,
        pageSize: 30,
        shopify_order_name: '',
        delivery_date: moment().format('YYYY-MM-DD'),
        order_status_id: 0,
        payment_id: 0,
        delivery_time: '',
    })


    //=======FUNCTIONS========
    //=======FUNCTIONS========

    // page click handler
    const PageClick = (x) => {
        let retpage = x();
        setParams({
            ...params,
            page: retpage});
    }

    // filter order

    const filterHandler = (e) => {
        clearTimeout(timer);

        timer = setTimeout(() => {
            setParams({...params, shopify_order_name: e})
        }, 2000)
    }

    //======USE EFFECT========
    //======USE EFFECT========

    useEffect(() => {
        return() => {
            clearTimeout(timer)
        }
    }, [])

    //get the user hubs and set as filter(hub_id) on fetch
    useEffect(() => {
        if(userhubs){
            let arrOfHubs = userhubs.map(hub => hub.user_hub.hub_id)
            setParams({...params, hub_id: arrOfHubs})
        }
    }, [userhubs])
    
    //fetch on params change
    //and if hub_id is avaialable
    useEffect(() => {
        if(params.hasOwnProperty('hub_id')){
            fetchUnpaidOrders(params)
        }
    }, [params])

    return (
        <Container
            css='grd orders_unpaid_template relative over-hid slideInRight animate-2' 
            width='100%'
            >
            <div
                className='grd grd-gp-1 pad-1'
                style={{gridTemplateRows: 'min-content auto'}}
            >
                <span className='header asc'>Unpaid Orders</span>
                <div
                    style={{
                        gridTemplateColumns: 'repeat(5, 1fr)', 
                    }}
                    className='grd grd-gp-1'    
                >
                    <Input
                        type='search'
                        css='pad-1'
                        // onChange={e => setParams({...params, shopify_order_name: e.target.value})}
                        onChange={e => filterHandler(e.target.value)}
                        label='Filter orders' />
                    <Select
                        value={params.payment_id}
                        placeholder='Payment Method'
                        options = {
                            paymentMethod.map(rec => {
                                return {value: rec.id, label: rec.name}
                            })
                        }
                        onChange={e => setParams({...params, payment_id: e ? e.value : 0})}

                    />
                    <Select
                        value={params.order_status_id}
                        placeholder='Order Status'
                        options = {
                            orderStatus.map(rec => {
                                return {value: rec.id, label: rec.name}
                            })
                        }
                        onChange={e => setParams({...params, order_status_id: e ? e.value : 0})}
                    />
                    <Input
                        value={params.delivery_date}
                        onChange={e => setParams({...params, delivery_date: e.target.value})}
                        css='pad-1'
                        type='date'
                        label='Delivery Date' />
                    <Select
                        value={params.delivery_time}
                        placeholder='Delivery time'
                        options = {
                            deliverytime.map(rec => {
                                return {value: rec.id, label: rec.id}
                            })
                        }
                        onChange={e => setParams({...params, delivery_time: e ? e.value : 0})}
                    />
                </div>
            </div>
            <div style={{overflow: 'auto'}}>
                <PendingOrderHeader css='pending_template aic' />
                {orderData.rows.length > 0 ?
                    orderData.rows.map(order => {
                        console.log(order.order_id, 'ORDER ID')
                        return(
                            <PendingOrderRow
                                hub={userhubs.find(hub => hub.user_hub.hub_id === order.hub_id)}
                                css='pending_template'
                                key={order['order_id']}
                                rowData={order}
                            />
                        )
                    })
                    :
                    <Error label='No Records Found'/>
                }
            </div>
            <div className='grd pad-y-1'>
                <Pagination
                    selPage={params.page}
                    pageClick={PageClick}
                    count={orderData.count}
                    rows={params.pageSize} />
            </div>
        </Container>
    )
}

const transferStatetoProps = state => ({
    orderData:state.orderData.orders,
    userhubs: state.authData.user.user_info.hubs
})

export default connect(transferStatetoProps, { fetchUnpaidOrders })(OrderUnpaid)
