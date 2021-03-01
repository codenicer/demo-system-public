import React from 'react';
import PaymentStatus from '../../../../../atoms/PaymentStatus/PaymentStatus';
import OrderStatus from '../../../../../atoms/OrderStatus/OrderStatus';
import TableRow from '../../../../../atoms/TableRow/TableRow';
import OrderID from '../../../../../molecules/OrderID/OrderID';
import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Manila");

const OrderHistory = ({data}) => {
    return (
        <TableRow css='jic aic grd grd-col grd-col-f'> 
            <OrderID orderid={data['order_id']}>{data['shopify_order_name']}</OrderID>
            <span>{moment(data['created_at']).format('MMM DD, YYYY')}</span>
            <PaymentStatus paymentstatus={data['payment_status_id']} />
            <div>
                <OrderStatus orderStatus={data['order_status_id']} />
            </div>
            <span>{`updated ${moment(data['updated_at']).format('MM-DD-YYYY')}`}</span>
        </TableRow>
    );
};

export default OrderHistory;

    