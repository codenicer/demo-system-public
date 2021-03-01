import React from 'react';
import OrderItemHeader from '../../organisms/OrderItemHeader/OrderItemHeader';
import OrderItemFooter from '../../organisms/OrderItemFooter/OrderItemFooter';
import './OrderItemList.css';

const OrderItemList = ({ total_discounts, css, itemlist, totalprice, action, additem, myref, amountdue, data, width, maxWidth, template }) => {
    return (
        <div ref={myref} 
            style={{width, maxWidth}}
            className={`grd ${css}`}>
            <OrderItemHeader data={data} action={action} additem={additem} css={`${template} aic`} />
            <div className='order_item_list-body over-y-auto space-no-wrap over-hid text-over-ell scroll'>
                {itemlist}
            </div>
            <OrderItemFooter total_discounts={total_discounts} totalprice={totalprice} amountdue={amountdue} />
        </div>
    );
};

export default OrderItemList;