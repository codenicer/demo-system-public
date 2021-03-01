import React from 'react';
import './OrderStatus.css';



const arrOrderStatus = ['Pending','Created', 'Accepted', 'Ready for production', 'In Production', 'Ready to assemble', 'In assembly', 'Ready to ship', 'Rider Assigned','Shipped', 'Delivered', 'Failed Delivery', 'On Hold', 'Dispatch Cancelled', 'Cancelled by Customer', 'Dispatch Booked', 'Redispatched', 'Completed'];

const OrderStatus = ({orderStatus}) => {
    const oStatus = arrOrderStatus[orderStatus]|| 'Pending';
    return (
            <span className='space-no-wrap'>{`${oStatus.split('_').join(' ').substring(0,1).toUpperCase()}${oStatus.split('_').join(' ').substring(1)}`}</span>

    );
};

export default OrderStatus;