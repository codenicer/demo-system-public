import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faHourglass, faReply } from '@fortawesome/free-solid-svg-icons';
import './PrintedStatus.css';

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
            return 'printed';
        default:
            return null;
    }
}

const PrintedStatus = ({ printedstatus } ) => {
    return (
            <div className={`grd grd-col aic jis grd-gp-1 color-white payment-status printed-status`}>
                <div style={{fontSize: 11}}>
                    <FontAwesomeIcon icon={paymentHandler('paid')}/>
                </div>
                <span className='label'>{paymentIDHandler(printedstatus) !== undefined && paymentIDHandler(printedstatus) !== null ? `Printed` : ''}</span>
            </div>
    );
};

export default PrintedStatus;