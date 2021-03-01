import React from 'react';
import TableHeader from '../../../../../atoms/TableHeader/TableHeader';
import './PendingOrderHeader.css';


const headerorder = ['Product', 'Payment', 'Order Status', 'Amount', 'Delivery', 'Customer', 'City Address', 'Hub', 'Created']

const PendingOrderHeader = ({css, bulk, sort}) => {
    return (
        <TableHeader css={`pending_order-header ${css}`}>
            {!bulk ?
                <div className='_action_header grd aic jic'>
                    <span>Action</span>
                </div>
                :
                <div 
                    className='_checkbox_header size-100'>
                </div>
            }
            <div className={`${bulk ? '_orderid_header-bulk' : '_orderid_header'} grd aic jic`}>
                <span>Order ID</span>
            </div>
            {
                headerorder.map((value, key) => {

                    if(sort && value === "Delivery"){
                        return <span className="delivery__sort" onClick={sort} key={key}>{value}</span>
                    }
                    return <span key={key}>{value}</span>
                })
            }
        </TableHeader>
    );
};

PendingOrderHeader.defaultProps = {
    data: {},
}

export default PendingOrderHeader;