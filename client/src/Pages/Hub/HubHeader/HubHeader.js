import React from 'react';
import TableHeader from '../../../atoms/TableHeader/TableHeader';

const hubHeader = ['ID', 'Name', 'Address', 'Status', 'Action'];

const HubHeader = () => {
    return (
        <TableHeader 
            csswrap='width-100'
            css='jic grd-col grd-col-f aic'>
            {
                hubHeader.map((x, y) => {
                    return <div key={y}>{x}</div>
                })
            }
        </TableHeader>
    );
};

export default HubHeader;