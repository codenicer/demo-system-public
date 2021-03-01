import React from 'react';
import { formatMoney } from 'accounting-js';
import config from '../../config.json'

const OrderItemFooter = (props) => {
    const { currency } = config;
    const { totalprice, amountdue, total_discounts } = props;
    return (
        <div 
            className='grd gtc-fa grd-gp-2 jie pad-1' 
            style={{gridTemplateColumns: amountdue === undefined ? null : '1fr auto auto', gridTemplateRows: amountdue === undefined ? null : '1fr 1fr'}}>
            {amountdue === undefined ? null :
                <div style={{gridRow: '1/-1'}}> 
                    <span className='italic' style={{paddingRight: '1rem'}}>Amount Due</span>
                    <span>{`( ${amountdue} )`}</span>
                </div>
            }
            { total_discounts > 0 ?
                <>
                    <span className='italic'>Discount</span>
                    <span className='italic'>({formatMoney(total_discounts, { symbol: currency, precision: 2 })})</span>
                </>
            :''}
            <span className='subheader'>TOTAL</span>
            <span className='header-3'>{formatMoney(totalprice, { symbol: currency, precision: 2 })}</span>
        </div>
    );
};

export default OrderItemFooter;