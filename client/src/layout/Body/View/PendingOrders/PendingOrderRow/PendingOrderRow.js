import React, { useState, useEffect } from 'react';
import TableRow from '../../../../../atoms/TableRow/TableRow';
import OrderID from '../../../../../molecules/OrderID/OrderID';
import Batch from '../../../../../atoms/Batch/Batch';
import OrderStatus from '../../../../../atoms/OrderStatus/OrderStatus';
import PaymentStatus from '../../../../../atoms/PaymentStatus/PaymentStatus';
import OrderItemList from '../../../../../template/OrderItemList/OrderItemList';
import OrderItemRow from '../../../../../organisms/OrderItemRow/OrderItemRow';
import OrderQty from '../../../../../molecules/OrderQty/OrderQty';
import OrderRowAction from './OrderRowAction/OrderRowAction';
import {loadSelOrder} from '../../../../../scripts/actions/ordersActions'
import {loadSelectedCustomer} from '../../../../../scripts/actions/customersActions'
import {connect} from 'react-redux'
import moment from 'moment-timezone'
import _ from 'lodash';
import Checkbox from '../../../../../atoms/Checkbox/Checkbox';
import { formatMoney } from 'accounting-js';
import config from '../../../../../config.json'
moment.tz.setDefault("Asia/Manila");

const PendingOrderRow = (props) => {

    const { currency } = config;
    const { css, bulk, selectedData, rowData, loadSelectedCustomer, idToArray, hub, newOrder,params,fetchData} = props;
    const [ itemPreview, setItemPreview] = useState(false)
    
    //=========FUNCTIONS=============
    //=========FUNCTIONS=============

    const newOrderStatusHandler = (dateTime, deliveryTime, deliveryDate, status) => {
        // set dateTime parameter into year month day format
        let dateFormat = moment(dateTime).format('YYYY-MM-DD');
        // console.log(dateFormat, 'DATE FORMAT')

        // set deliveryTime paramater into array of start and end hour
        let deliveryTimeArrInt = deliveryTimeHourConverter(deliveryTime)
        // console.log(deliveryTimeArrInt, 'deliverytimearr int', rowData.shopify_order_name, dateTime, parseFloat(moment().format('HH.MM')))

        // check if the order is created within the day
        // and deliveryTimeArrInt is not equal to null
        // and delivery date is not today, and status is not shipped
        if(dateFormat === moment().format('YYYY-MM-DD') && dateFormat === moment(deliveryDate).format('YYYY-MM-DD') && deliveryTimeArrInt !== null && status !== 9){

            // set parameter into hour format
            let hourFormat = moment(dateTime).format('HH');
            console.log(hourFormat, 'hourformat')

            if(parseFloat(moment().format('HH.MM')) > deliveryTimeArrInt[1]){
                return 1
            } else    
            //if the place time is greater than 2 or more hours
            //not considered as new
            if(hourFormat > deliveryTimeArrInt[0] - 2 ){
                if(hourFormat >= deliveryTimeArrInt[0] - 1 && hourFormat <= deliveryTimeArrInt[1] - 2 ){
                    return 2  //good
                } else {
                    return 1 //danger
                }  
            } else {
                return null
            }
        }
    }

    // convert the delivery time into array
    const deliveryTimeHourConverter = deliveryTime => {
        switch(deliveryTime){
            case '12am - 3am':
                return [0, 2];
            case '6am - 8am':
                return [6, 7];
            case '9am - 1pm':
                return [9, 13];
            case '1pm - 5pm':
                return [13, 17];
            case '5pm - 8pm':
                return [18, 20];
            case '9pm - 12am':
            case 'Anytime':
                return [21, 23];
            default:
                return null;
        }
    }

    //==========USE EFFECT============
    //==========USE EFFECT============

    // useEffect(() => {
    //     console.log(rowData, 'rowData', rowData.datetime_created)
    // }, [])

    return (
        <>
            <TableRow 
                css={`${css} pad-y-2 relative`}
                height='auto'
                newOrder={newOrderStatusHandler(rowData.datetime_created, rowData.delivery_time, rowData.delivery_date, rowData.order_status_id)}
                >
                    {!bulk ?
                        <OrderRowAction 
                        params={params}
                        fetchData={fetchData}
                        rowData={rowData} />
                            :
                            <div className='grd aic jic _checkbox_row bg-white'>
                                {![12, 1].includes(rowData.order_status_id) ?
                                    <Checkbox
                                        checked={selectedData.some((id => id === rowData.order_id))}
                                        onChange={()=>{idToArray(rowData.order_id)}}
                                        color='secondary'
                                    />
                                    :
                                    <span className='italic'>
                                    {rowData.order_status_id === 12 ?
                                        'already on hold'
                                        :
                                        'created'
                                    }
                                    </span>
                                }
                            </div>
                        
                    }
                    <div className={`${bulk ? '_orderid-row-bulk' : '_orderid-row'} grd aic jic bg-white`}>
                        <OrderID openNotes={rowData['open_ticket']}  orderid={rowData['order_id']}>{rowData['shopify_order_name']}</OrderID>
                    </div>
                    <OrderQty
                        qty={rowData['order_items'].length}
                        open={itemPreview}
                        onClick={() => {setItemPreview(!itemPreview)}} 
                        />
                    <div className="grd grd-gp-1 asc">
                    {rowData['order_items'].map((order,key) => (
                        <span key={key}>{order.title}</span>
                    ))}
                   </div>
                   <div className='grd aic grd-gp-1 jis label asc'>
                        <span className='label'>{rowData['payment']['name']}</span>
                        <PaymentStatus paymentstatus={rowData['payment_status_id']}/>
                    </div>
                    <div className='asc'>
                        <OrderStatus orderStatus={rowData['order_status_id']} />
                    </div>
                    <span className='header-3 asc'>{formatMoney(rowData['total_price'], { symbol: currency, precision: 2 })}</span>
                    <div className='grd aic grd-gp-1 jis asc'>
                        <div>{rowData['delivery_date']}</div>
                        {rowData["delivery_time"] ? (
                        <Batch batch={rowData["delivery_time"]} />
                        ) : (
                        <span style={{ color: "red" }}>No delivery time</span>
                        )}
                    </div>
                    <div
                        onClick={() => loadSelectedCustomer(rowData['customer_id'])}
                        className='point emp label asc'>
                        {`${rowData['customer']['first_name']} ${rowData['customer']['last_name']}`}
                    </div>
                    <div className='asc'>
                        {`${rowData['addresses']['shipping_city']}`}
                    </div>
                    <span className='asc'> {hub ? hub.name : 'No Hub'}</span>
                    <div className='asc'>{moment(rowData['created_at']).format('YYYY-MM-DD')}</div>
                    <div className="asc">
                        {rowData["dar_printout_ready"] === 1 ? (
                            <p style={{ color: "#41ad41" }}>Yes</p>
                        ) : (
                            "No"
                        )}
                        </div>
                        <div className="asc">
                        {rowData["cpu_printout_ready"] === 1 ||
                        rowData["cod_printout_ready"] === 1 ? (
                            <p style={{ color: "#41ad41" }}>Yes</p>
                        ) : (
                            "No"
                        )}
                        </div>
                        <div className="asc">
                        {rowData["msg_printout_ready"] === 1 ? (
                            <p style={{ color: "#41ad41" }}>Yes</p>
                        ) : (
                            "No"
                        )}
                    </div>
            </TableRow>
            {itemPreview ?
                <OrderItemList
                    template='order_item-row-template'
                    css='slideInLeft animate-1'
                    data={rowData['order_items'][0]}
                    total_discounts={rowData['total_discounts']} 
                    totalprice={rowData['total_price']}
                    itemlist=
                        {
                        Object.values(rowData['order_items']).map(order => {
                            return( <OrderItemRow
                                        css='order_item-row-template aic'
                                        key={order['order_item_id']}
                                        data={order}   />)
                        })}
                    />
                : null
            }
        </>
    );
};

export default React.memo(connect(null,{loadSelOrder,loadSelectedCustomer})(PendingOrderRow))