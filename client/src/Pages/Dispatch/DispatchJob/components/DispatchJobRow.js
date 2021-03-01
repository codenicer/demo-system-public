import React, {useState}  from 'react';
import Checkbox from '../../../../atoms/Checkbox/Checkbox';
import Batch from '../../../../atoms/Batch/Batch';
import OrderID from '../../../../molecules/OrderID/OrderID';
import TableRow from '../../../../atoms/TableRow/TableRow';
import Tooltip from '../../../../atoms/Tooltip/Tooltip';
import Customer from '../../../../atoms/Customer/Customer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import {hubs, paymentOptions} from '../../../../config.json'

import moment from 'moment-timezone';
import account from 'accounting-js';

const arrOrderStatus = ['Pending','Created', 'Accepted', 'Ready for production', 'In Production', 'Ready to assemble', 'In assembly', 'Ready to ship', 'Rider Assigned','Shipped', 'Delivered', 'Failed Delivery', 'On Hold', 'Dispatch Cancelled', 'Cancelled by Customer', 'Dispatch Booked', 'Redispatched', 'Completed'];
moment.tz.setDefault("Asia/Manila");

const DispatchJobRow = (props) => {

    //=========PROPS=========
    //=========PROPS=========

    //pass down props
    const { data, onChange, selected } = props
    // console.log({wew:data['order_item'],ruther:"ruther"})
    // state for hover warning icon on cpu payment type
    const [ hover, setHover ]  = useState(false);

    return (
        <TableRow 
        height={65}
        css={`jic aic dispatch_job-row pad-1 ${data['isSelected'] && 'dispatch_job-row_selected'}`}>
            <div>
                <Checkbox
                    onChange={onChange}
                    color='secondary'
                    checked={selected}
                    />
            </div>
            {console.log("DATAAAAAAAAAAA", data, hubs)}
            <OrderID orderid={data['order_id']}>{data['jobtype'] === 'delivery' ? data['shopify_order_name'] : data['shopify_order_name']+'-CPU'}</OrderID>
            <span className="label">{data['jobtype']}</span>
            {data['jobtype'] === 'delivery' ?
                <span className='text-ac'>{data['title']}</span>
                :
                <div className='grd gtc-af grd-gp-1 aic'>
                    <span className='label text-ac pad-x-1'>{account.formatNumber(data['total'])}</span>

                </div>
            }

            <div className='grd gtc-af grd-gp-1 aic'>
                <span className='label text-ac pad-x-1 italic relative'> {paymentOptions[data['payment_id'] - 1].value}</span>
                { data['cpu_dispatch'] && parseInt(data['cpu_dispatch']) !== 10 ?
                    <div
                        className='relative'
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
                        <FontAwesomeIcon style={{color: 'var(--yellow)', fontSize: '1.6rem'}} className='point'
                                         icon={faExclamationTriangle}/>
                        {hover &&
                        <Tooltip
                            type='left'
                            top='10px'
                            leftposition='10px'
                        >
                            {`CPU is ${arrOrderStatus[data['cpu_dispatch']]}`}
                        </Tooltip>
                        }
                    </div>
                    : ''
                }
            </div>
            <div className='grd jic grd-gp-1'>
                <Customer id={data['customer_id']} firstname={data['name'] ||data['shipping_name']  } lastname={''}/>
                <span>{data['customer_phone'] || data['billing_phone']}</span>
            </div>
            <div
                className='grd jic text-ac' style={{width:`250px`}}>
                <span>{data['address_1'] ||data['shipping_address_1'] }</span>
                <span>{data['address_2'] || data['shipping_address_2']} </span>
                <span>{`${data['city'] || data['billing_city'] } ${data['zip'] ||data['shipping_zip'] }`}</span>
            </div>
            <div className='grd jic grd-gp-1'>
                <span>{moment(data['delivery_date']).format('MMM. DD, YYYY')}</span>
                <Batch
                    batch={data['delivery_time']} />
            </div>
            <span className="italic label">{hubs[data['hub_id']-1] ? hubs[data['hub_id']-1]['name']: "No Hub"}</span>
        </TableRow>
    );
};

export default DispatchJobRow;