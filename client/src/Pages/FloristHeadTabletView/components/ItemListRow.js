import React from 'react';
import TableRow from '../../../atoms/TableRow/TableRow';
import Batch from '../../../atoms/Batch/Batch';

const ItemListRow = (props) => {

     // =========================== PROPS ======================
    // =========================== PROPS ======================
    const {css , job } = props
    const {title, first_name, last_name, shopify_order_name,order_item_id,user_id,order_item_status_id,delivery_time} = job

    return (
        <TableRow height='auto' css={css} >
            <span className='label'>{shopify_order_name}</span>
            <div 
                className='grd grd-gp-1 jic'>
                <div>{title}</div>
                <Batch batch={delivery_time}/>
            </div>
            <div className='text-ac'>
                {user_id !== 1 ?
                    <>
                        <div>{first_name}</div>
                        <div>{last_name}</div>
                    </>
                    :
                    '- - -' 
                }
            </div>
        </TableRow>
    )
}

export default React.memo(ItemListRow)
