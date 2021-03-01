import React from 'react';
import TableHeader from '../../../../../../atoms/TableHeader/TableHeader';

const prioritizationHeader = [ 'Order ID', 'Qty', 'Delivery', 'Date', 'Customer', 'Shipping Address']

const PrioritizationHeader = () => {
    return (
        <TableHeader css='prioritization_header jic aic'>
            <div />
            {prioritizationHeader.map((value, key) => {
                return <span key={key}>{value}</span>
            })}
        </TableHeader>
    );
};

export default PrioritizationHeader;