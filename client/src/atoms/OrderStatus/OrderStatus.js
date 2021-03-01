import React,  { useState, useEffect } from 'react';
import './OrderStatus.css';

const statusHandler = (x) => {
    switch(x){
        case 12:
            return '-';
        case 13:
            return '—';
        case 14:
            return '—';
        default:
           return null
    }
}

const statusIDHandler = (id) => {
    switch(id){
        case 1:
            return 'created';
        case 2:
            return 'accepted';
        case 3:
            return 'ready_for_production';
        case 4:
            return 'in_production';
        case 5:
            return 'ready_to_assemble';
        case 6:
            return 'in_assembly';
        case 7:
            return 'ready_to_ship';
        case 8:
            return 'rider_assigned';
        case 9:
            return 'shipped';
        case 10:
            return 'delivered';
        case 11:
            return 'failed_delivery';
        case 12:
            return 'on_hold';
        case 13:
            return 'cancelled_internal';
        case 14:
            return 'cancelled_by_customer';
        case 15:
            return 'dispatch_booked';
        default:
            return 'New status';
    }
}

const OrderStatus = ({orderStatus}) => {
    const [ fixedstatus, setFixedstatus ] = useState('status');

    useEffect(() => {
        setFixedstatus(statusIDHandler(orderStatus))
    }, [orderStatus])

    return (
        <div className='order-status'>
            <span className='space-no-wrap'>{`${fixedstatus.split('_').join(' ').substring(0,1).toUpperCase()}${fixedstatus.split('_').join(' ').substring(1)}`}</span>
            <div className={`grd grd-col aic jic status-${fixedstatus}`}>
                <div className='relative status-progress--bar progress_one'>{statusHandler(orderStatus)}</div>
                <div className='relative status-progress--bar progress_two'>{statusHandler(orderStatus)}</div>
                <div className='relative status-progress--bar progress_three'>{statusHandler(orderStatus)}</div>
            </div>
        </div>
    );
};

export default OrderStatus;