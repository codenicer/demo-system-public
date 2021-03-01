import React from 'react';
import TableRow from '../../../../../../atoms/TableRow/TableRow';
import OrderID from '../../../../../../molecules/OrderID/OrderID';
import Batch from '../../../../../../atoms/Batch/Batch';
import moment from 'moment-timezone';


const FloristProductionRow = (props) => {
    const { data } = props;
    return (
        <TableRow
            data={data}
            css='jic aic _florist_production-template'    
        >     
                <OrderID css='florist_q_row-id' orderid={data['order_id']}>{data['shopify_order_name']}</OrderID>
                <div>{data['title']}</div>
                <div>{data['shopify_payment_gateway']}</div>
                <div>{moment(data['delivery_date']).format('MMM. DD, YYYY')}</div>
                <Batch batch={data['delivery_time']} />
                <div>{data['shipping_city']}</div>
        </TableRow>
    );
};

export default FloristProductionRow;