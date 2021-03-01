import React from 'react';
import TableHeader from '../../../../atoms/TableHeader/TableHeader';

const headerData = ['', 'Order ID', 'Job type', 'Item/Price', 'Payment Type', 'Contact Person', ' Address', 'Delivery/PickupDate','Hub'];

const DispatchJobHeader = ({css}) => {
    return (
        <TableHeader
            height='auto'
            csswrap='width-100'
            css={`jic dispatch_job-header pad-1 ${css}`}
        >
            {headerData.map((value, key) => {
                return <div className='space-no-wrap' key={key}>{value}</div>
            })}
        </TableHeader>
    );
};

export default DispatchJobHeader;