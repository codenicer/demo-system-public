import React from 'react';
import Batch from '../../../atoms/Batch/Batch';
import moment from 'moment-timezone';
import PaymentStatus from '../../../atoms/PaymentStatus/PaymentStatus';
import Button from '../../../atoms/Button/Button';
import Paper from '../../../atoms/Paper/Paper';
import './AssemblerJobRow.css';

moment.tz.setDefault("Asia/Manila");
const AssemblerJobRow = ({data, onClick, status,btndisabled}) => {


  return (
         <Paper 
             css='ass assembler_row grd grd-gp-2 pad-1'>
            <div className='grd grd-gp-2 ais assembler_row-top'>
                <span className='header-2'>{data['shopify_order_name']}</span>
                <span className='header-3'>{`Item/s: ${data['order_items'].length}`}</span>
                <PaymentStatus paymentstatus={data['payment_status_id']} />
                <span>{data['payment']['name']}</span>
            </div>
            <div className='grd grd-gp-2 aie assembler_row-bot' >
                <span className='sublabel'>{`${data['customer']['first_name']} ${data['customer']['last_name']} | ${data['addresses']['shipping_city']}`}</span>
                <span>{moment(data['delivery_date']).format('MMM. DD, YYYY')}</span>
                <Batch batch={data['delivery_time']}/>
            </div>
            <Button
                disabled={btndisabled}
                onClick={onClick} 
                css='assembler_row_btn' 
                color={ status === 'hold' ? 'alert' : 'success'} 
                >{status === 'hold' ? 'Resume' : 'Accept'}</Button>
        </Paper>
    );
};

export default AssemblerJobRow;

