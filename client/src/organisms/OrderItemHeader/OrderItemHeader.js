import React from 'react';
import TableHeader from '../../atoms/TableHeader/TableHeader';
import IconButton from '../../atoms/IconButton/IconButton';
import PropTypes from 'prop-types'
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons'

const orderitemheader = ['Product', 'Status', 'Price', 'Qty', 'Subtotal'];

const OrderItemHeader = ({ css, data, action, additem }) => {
    return (
        <TableHeader css={css} height='35px'>
            {!action ? <div></div> :
                <IconButton
                    icon={faPlusCircle}
                    size='26px'
                    color='#003459'
                    onClick={additem}
                    label='Add item'
                />
            }
            {
                orderitemheader.map((value, key) => {
                    return <div key={key}>{value}</div>
                })
            }
            {
                action &&
                <span className='jsc'>Action</span>
            }
        </TableHeader>
    );
};

OrderItemHeader.propTypes = {
    action: PropTypes.bool,
};

OrderItemHeader.defaultProps = {
    action: false
}

export default OrderItemHeader;