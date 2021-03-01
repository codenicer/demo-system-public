import React from 'react';
import TableHeader from '../../../../../../atoms/TableHeader/TableHeader';

const floristqHeader = ['Order ID', 'Product Name', 'Payment Method', 'Delivery Date', 'Delivery Time', 'Shipping City'];

const FloristProductionHeader = () => {
    return (
        <TableHeader
            css='jic aic _florist_production-template'
        >
            {
                floristqHeader.map((x, key) => {
                    return <span key={key}>{x}</span>
                })
            }
        </TableHeader>
    );
};

export default FloristProductionHeader;