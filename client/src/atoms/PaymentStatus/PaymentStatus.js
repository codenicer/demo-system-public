import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faHourglass, faReply } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './PaymentStatus.css';

const paymentHandler = (x) => {
    switch (x) {
        case 'paid':
            return faCheck;
        case 'overdue':
            return faTimes;
        case 'pending':
            return faHourglass;
        case 'refunded':
            return faReply;
        default:
    }
}

const paymentIDHandler = (id) => {
    switch(id){
        case 1:
            return 'pending';
        case 2:
            return 'paid';
        case 3:
            return 'refunded';
        case 4:
            return 'overdue'
        default:
            return null;
    }
}

const handleRemoveOverdue = (paymentstatus, order_name, order_id, removeOverdue, setStatus) => {
    if(order_id){
        if(paymentstatus === 4){
            if (window.confirm(`Do you really want to remove OVERDUE of ${order_name}?`)) {
                removeOverdue(order_id, (msg) => {
                    setStatus(1);
                    toast.success(msg);
                })
            }
        }
    }
}

const PaymentStatus = ({ paymentstatus, order_name, order_id, removeOverdue } ) => {

    const [status, setStatus] = useState(paymentstatus);

    return (
        <div
        className={`grd grd-col aic jis grd-gp-1 color-white payment-status payment-status--${paymentIDHandler(
          status
        )}`}
        onClick={() =>
          handleRemoveOverdue(
            status,
            order_name,
            order_id,
            removeOverdue,
            setStatus
          )
        }
      >
            <div style={{fontSize: 11}}>
                <FontAwesomeIcon icon={paymentHandler(paymentIDHandler(status))}/>
            </div>
            <span className='label'>{paymentIDHandler(paymentstatus) !== undefined && paymentIDHandler(paymentstatus) !== null ? `${paymentIDHandler(status).substring(0,1).toUpperCase()}${paymentIDHandler(status).substring(1)}` : ''}</span>
        </div>
    );
};

export default PaymentStatus;