import React from 'react';
import ArrowButton from '../ArrowButton/ArrowButton';

const OrderQty = (props) => {
    const { css, qty, open } = props
    return (
        <div 
            {...props} 
            className={`${css} grd aic jic grd-gp-1 point`}
            style={{gridTemplateColumns: 'min-content min-content'}}
            >
            <span>{qty}</span>
            <ArrowButton open={open} size='15px'/>
        </div>
    );
};

export default OrderQty;