import React from 'react';
import {formatMoney} from "accounting-js";

const SelectedItem = (data) => {
    return (
        <div
            className='grd grd-gp-1 aic pad-1'
            style={{width: 650, gridTemplateColumns: '1.5fr 1.5fr 1.5fr 2.5fr'}} 
            >
            <span className='header-3'>{`${data.data['shopify_order_name']}`}{data.data['jobtype']==='cash pickup'?'-CPU':''}</span>
            <span>{data.data.jobtype}</span>
            <span className='emp'>{data.data.jobtype === 'delivery' ? data.data.title : formatMoney(data.data.total, { symbol: '₱ ', precision: 2 }) }</span>
            <span className='sublabel'>{data.data.address1} {data.data.address1} {data.data.city} {data.data.province}</span>
        </div>
    );
};

export default SelectedItem;
