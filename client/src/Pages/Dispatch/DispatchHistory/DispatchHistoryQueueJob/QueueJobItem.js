import React from 'react';
import OrderID from '../../../../molecules/OrderID/OrderID';
import Batch from '../../../../atoms/Batch/Batch';
import TableRow from '../../../../atoms/TableRow/TableRow';
import OrderStatusLabel from '../../../../atoms/OrderStatus/OrderStatusLabel';
import moment from 'moment-timezone';
import Customer from '../../../../atoms/Customer/Customer';

moment.tz.setDefault("Asia/Manila");
const QueueJobItem = ({data,
                          hubs,payment_methods,
                          css}) => {


    const getHub = (x) => {
        if(x){
            let h = hubs.filter( r => parseInt(r.id) === parseInt(x));
            if(h){
                return h[0].name
            }
        }

        return '';
    }
    const getPaymentOptions = (x) => {
        try{
            if(x){
                let h = payment_methods.filter( r => parseInt(r.id) === parseInt(x) || r.value === x);
                if(h){
                    return h[0].value
                }
            }
        } catch(e){
            console.log('error', e);
        }
        return '';
    }
    return (
        <>
            <TableRow
                    height='auto'
                    css={`jic ${css}`}
                > 
                    <div>
                        <OrderID orderid={data['order_id']}>{data.shopify_order_name}</OrderID>
                        <span>{data['job_item_type']}</span>
                    </div>
                    <div className='text-ac'>
                        {data['job_item_type'] === 'delivery'? data['item'] : data['item']}
                    </div>
                    <div className='grd grd-gp-1'>
                        <div>{data['delivery_date']}</div>
                        <Batch batch={data['delivery_time']}/>
                    </div>
                    <div className='grd'>
                        <Customer id={data['order_id']} firstname={data['shipping_name']} lastname=""/>
                        <span>{data['shipping_phone']}</span>
                    </div>
                    <div className="text-ac">
                        <span className='label italic'>{getHub(data['hub_id'])}</span>
                        <div className="sublabel grd">
                            {data["shipping_address_1"] && <span>{data["shipping_address_1"]}</span>}
                            {data["shipping_address_2"] && <span>{data["shipping_address_2"]}</span>}
                            {data["shipping_city"] && <span>{data["shipping_city"]}</span>}
                            {data["shipping_province"] && <span>{data["shipping_province"]}</span>}
                        </div>
                    </div>
                    <div className="grd jic">
                        <span>{getPaymentOptions(data["payment_id"])}</span>
                    </div>
                    <span className='sublabel'>
                       {moment(data['updated_at']).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
                    <OrderStatusLabel orderStatus={data.status} />
                    <span className='remarks'>{data['remarks']}</span>

            </TableRow>

        </>
    );
};

export default QueueJobItem;