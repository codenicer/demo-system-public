import React, { useState, useRef, useEffect } from 'react';
import TableRow from '../../../../../atoms/TableRow/TableRow';
import OrderID from '../../../../../molecules/OrderID/OrderID';
import Batch from '../../../../../atoms/Batch/Batch';
import OrderStatus from '../../../../../atoms/OrderStatus/OrderStatus';
import PaymentStatus from '../../../../../atoms/PaymentStatus/PaymentStatus';
import OrderItemList from '../../../../../template/OrderItemList/OrderItemList';
import OrderItemRow from '../../../../../organisms/OrderItemRow/OrderItemRow';
import OrderQty from '../../../../../molecules/OrderQty/OrderQty';
import OrderNoHubRowAction from './OrderRowAction/OrderNoHubRowAction';
import {loadSelOrder} from '../../../../../scripts/actions/ordersActions'
import {loadSelectedCustomer} from '../../../../../scripts/actions/customersActions'
import {connect} from 'react-redux'
import moment from 'moment-timezone'
import _ from 'lodash';
import Checkbox from '../../../../../atoms/Checkbox/Checkbox';
import { formatMoney } from 'accounting-js';
import config from '../../../../../config.json'
moment.tz.setDefault("Asia/Manila");

const OrderNoHubRow = (props) => {

    const { currency } = config;
    const { css, bulk, selectedData, rowData, loadSelectedCustomer, idToArray, hub,match} = props;
    const [ itemPreview, setItemPreview] = useState(false);
    
    return (
        <>
            <TableRow 
                css={`${css} pad-y-2 relative`}
                height='auto'
                >
                    {!bulk ?
                        <OrderNoHubRowAction rowData={rowData} />
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
                        <OrderID
                            match={match}
                          openNotes={rowData['open_ticket']} 
                          orderid={rowData['order_id']}>{rowData['shopify_order_name']}
                         </OrderID>
                    </div>
                    {/* <OrderQty
                        qty={rowData['order_items'].length}
                        open={itemPreview}
                        onClick={() => {setItemPreview(!itemPreview)}} 
                        /> */}
                    <div className="grd grd-gp-1 asc">
                        <span>{rowData['title']}</span>
                   </div>
                   <div className='grd aic grd-gp-1 jis label asc'>
                        <span className='label'>{rowData['payment_method']}</span>
                        <PaymentStatus paymentstatus={rowData['payment_status_id']}/>
                    </div>
                    <div className='asc'>
                        <OrderStatus orderStatus={rowData['order_status_id']} />
                    </div>  
                    <span className='header-3 asc'>{formatMoney(rowData['total'], { symbol: currency, precision: 2 })}</span>
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
                        {`${rowData['customer_first_name']} ${rowData['customer_last_name']}`}
                    </div>
                    <div className='asc'>
                        {`${rowData['city']}`}
                    </div>
                    <span className='asc'> {rowData.hub ? rowData.hub.name : 'No Hub'}</span>
                    <div className='asc'>{moment(rowData['created_at']).format('YYYY-MM-DD')}</div>
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

export default React.memo(connect(null,{loadSelOrder,loadSelectedCustomer})(OrderNoHubRow))