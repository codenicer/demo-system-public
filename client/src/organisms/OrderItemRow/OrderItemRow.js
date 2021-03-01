import React, { useState } from 'react';
import TableRow from '../../atoms/TableRow/TableRow';
import ConfirmationModal from '../../Pages/ConfirmationModal/ConfirmationModal';
import IconButton from '../../atoms/IconButton/IconButton';
import Button from '../../atoms/Button/Button';
import ImgSrc from '../../atoms/ImgSrc/ImgSrc';
import PropTypes from 'prop-types';
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import { formatMoney } from 'accounting-js'
import config from '../../config.json'

const statusHandler = (x) => {
    switch(parseInt(x)) {
        case 1:
            return 'Pending';
        case 2:
            return 'Sent to Production';
        case 3:
            return 'Florist Accepted';
        case 4:
            return 'Florist Completed';
        case 5:
            return 'Ready to Assemble';
        case 6:
            return 'Assembler Accepted';
        case 7:
            return 'Assembler Completed';
        case 8:
            return 'Rider Assigned';
        case 9:
            return 'Shipped';
        case 10:
            return 'Delivered';
        case 11:
            return 'Failed Delivery';
        case 12:
            return 'On Hold';
        case 13:
            return 'Cancelled Internal';
        case 14:
            return 'Cancelled External';
        case 15:
            return 'Dispatch Booked';
        default:
            return null;
    }
}

const OrderItemRow = (props) => {
    const { currency } = config;
    const { action, data, css } = props;
    const [ deleteModal, setDeleteModal ] = useState(false);
    return (
            <>
                <TableRow css={css}>
                    <div className='jsc'>
                        <ImgSrc src={data['product']['img_src']} resolution='50x50' />
                    </div>
                    <div>{data['title']}</div>
                    <div>{statusHandler(data['order_item_status_id'])}</div>
                    <div>{formatMoney(data['price'], { symbol: currency, precision: 2 })}</div>
                    <div>x {data['quantity']}</div>
                    <div>{formatMoney((data['price'] * data['quantity']), { symbol: currency, precision: 2 })}</div>
                    {action &&
                        <div className='jsc asc'>
                            <IconButton
                                icon={faTimes}
                                size='20px'
                                color='var(--warning)'
                                onClick={() => setDeleteModal(true)}
                                label='Remove Item'
                            />
                        </div>     
                    }
                </TableRow>
                {deleteModal &&
                    <ConfirmationModal
                        clickClose={() => setDeleteModal(false)} 
                        label='Are you sure you want to remove this item?'
                        button= {
                            <>
                                <Button color='neutral' onClick={() => setDeleteModal(false)}>Cancel</Button>
                                <Button 
                                    onClick={() => alert('line 101 order item row')}  
                                    color='warning'>Remove Item</Button>  
                            </>
                        }
                        />
                }
            </>
    );
};

OrderItemRow.propTypes = {
    name: PropTypes.bool,
}

OrderItemRow.defaultProps = {
    action: false,
}

export default OrderItemRow;