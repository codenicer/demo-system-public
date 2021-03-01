import React from 'react';
import TableHeader from '../../../../../../atoms/TableHeader/TableHeader';

const floristqHeader = ['Order ID', 'Product Name', 'Delivery Date', 'Delivery Time', 'Shipping City', 'Florist', 'Time'];

const FloristQueueHeader = () => {
    return (
        <TableHeader
            css='jic aic _florist_queue-template'
        >
            {
                floristqHeader.map((x, key) => {
                    return <span key={key}>{x}</span>
                })
            }
        </TableHeader>
    );
};

export default FloristQueueHeader;