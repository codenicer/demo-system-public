import React from 'react'
import Batch from '../../../atoms/Batch/Batch'
import TableRow from '../../../atoms/TableRow/TableRow';

const HistoryRow = (props) => {
    //============PROPS==================
    //============PROPS==================

    // pass down props
    const { data } = props;

    //destructuring the data props
    const { delivery_time, title, shopify_order_name, first_name, last_name} = data

    return (
        <TableRow css='grd grd-col grd-col-f aic jic'>
            <div className='label'>{shopify_order_name}</div>
            <div className='grd aic jic grd-gp-1'>
                <div>{title}</div>
                <Batch batch={delivery_time}/>
            </div>
            <div>{`${first_name} ${last_name}`}</div>
        </TableRow>
    )
}

export default HistoryRow
