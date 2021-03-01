import React from 'react';
import TableRow from '../../../../../atoms/TableRow/TableRow';
import OrderID from '../../../../../molecules/OrderID/OrderID';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");

function TicketHistoryRow({data}) {
    return (
        <TableRow
            //css in ticektablerow.css
            css='ticket_history-template aic jic'
        >
            <span>{data.ticket_id}</span>
            <OrderID
                orderid={data.order_id}
            >
                {data.shopify_order_name}
            </OrderID>
            <span>{data.disposition_name}</span>
            <span>{data.status_id === 2 ? 'Closed' : 'Resolved'}</span>
            <div className='grd grd-gp-1'>
                <span className='label'>{`${data['created_by_firstname']} ${data['created_by_last']}`}</span>
                <span className='sublabel'>{`${moment(data['created_at']).format('MMM. DD, YYYY hh:mm:ss A')}`}</span>
            </div>
            <div className='grd grd-gp-1'>
                <span className='label'>{`${data['updated_by_firstname']} ${data['updated_by_last']}`}</span>
                <span className='sublabel'>{`${moment(data['updated_at']).format('MMM. DD, YYYY hh:mm:ss A')}`}</span>
            </div>
        </TableRow>
    )
}

export default TicketHistoryRow
