import React, { useState } from 'react';
import TableHeader from '../../../../../../atoms/TableHeader/TableHeader';

const FloristListHeader = (props) => {
    const [header] = useState(['Name', 'Status', 'Order No', 'Product', 'Time']);
    return (
        <TableHeader css='aic jic florist-live_template'>
            <div />
            {
                header.map((value, key) => {
                    return <span key={key}>{value}</span>
                })
            }
        </TableHeader>
    );
};

export default FloristListHeader;
