import React from 'react';
import TableHeader from '../../../../atoms/TableHeader/TableHeader';

const CpuJobHeader = ({css}) => {
    //==========VARIABLE============
    //==========VARIABLE============

    const headerData = ['Order ID', 'Status', 'Item/Price','Contact Person', ' Address', 'Delivery', 'Hub', 'Action'];
    
    return (
        <TableHeader
            height='auto'
            csswrap='width-100'
            css={`grd aic jic pad-y-1 ${css}`}
        >
            {headerData.map((value, key) => {
                return <div className='space-no-wrap' key={key}>{value}</div>
            })}

        </TableHeader>
    );
};

export default CpuJobHeader;