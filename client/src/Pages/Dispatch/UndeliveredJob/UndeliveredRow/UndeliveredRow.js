import React from 'react';
import TableRow from '../../../../atoms/TableRow/TableRow';
import IconButton from '../../../../atoms/IconButton/IconButton';
import OrderID from '../../../../molecules/OrderID/OrderID';
import moment from 'moment-timezone';
import Batch from '../../../../atoms/Batch/Batch'
import OrderStatusLabel from '../../../../atoms/OrderStatus/OrderStatusLabel'
import { faRedo } from '@fortawesome/free-solid-svg-icons'
import Customer from '../../../../atoms/Customer/Customer'
moment.tz.setDefault("Asia/Manila");
const UndeliveredRow = ({data, onRedispatch, onclick}) => {
    return (
        <>
            <TableRow
                height='auto'
                css='undelivered_row aic jic'
                >
                <div className='grd grd-col grd-gp-1'>

                  {data.status === '11' || data.status === 11 || data.status === 14  ? <IconButton
                    icon={faRedo}
                    size='18px'
                    tooltip={true}
                    color='#929292'
                    label='Redispatch'
                    leftposition='50%'
                     onClick={() =>onclick(data)}
                  />

                    : <OrderStatusLabel orderStatus={data.status}/>
                  }
                </div>
                <div>
                  <OrderID orderid={data['order_id']}>{data.shopify_order_name}</OrderID>
                  <span>{data['jobtype']}</span>
                </div>
                <div>
                  <span style={{textAlign: 'center'}}>{data['jobtype'] === 'delivery'? data['title'] :data['total']}</span>
                </div> 
                <div className='grd grd-gp-1'>
                    <div>{data['delivery_date']}</div>
                  {data.delivery_time ? <Batch batch={data['delivery_time']}/> : "No delivery time" }
                </div>
                <div className='grd'>
                    <Customer id={data['customer_id']} firstname={data['first_name']} lastname={data['last_name']}/>
                    <span>{data['phone']}</span>
                </div>
                <div className="grd jic">
                  <span className='label italic'>{data["hub_name"]}</span>
                  <div className='grd text-ac'>
                    {data['address_1'] && <span>{data['address_1']}</span>}
                    {data['address_2'] && <span>{data['address_2']}</span>}
                    {data['city'] && <span>{data['city']}</span>}
                    {data['province'] && <span>{data['province']}</span>}
                    {data['country'] && <span>{data['country']}</span>}
                  </div>
                </div>
                <div className="grd jic">
                  <span>{data["payment_method"]}</span>
                </div>
                <div className='grd'>
                    <span>{moment(data['updated_at']).format('YYYY-MM-DD')}</span>
                    <span>{moment(data['updated_at']).format('HH:mm:ss A')}</span>
                </div>
                <span>
                    {data['dispatch_job']['rider_first_name']}  {data['dispatch_job']['rider_last_name']}
                </span>
                <div style={{wordWrap: 'break-word'}}>{data['remarks']}</div>
            </TableRow>


        </>
    );
};

export default UndeliveredRow;