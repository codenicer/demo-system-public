import React from 'react';
import Paper from '../../../../../atoms/Paper/Paper';
import moment from 'moment-timezone'
import Batch from '../../../../../atoms/Batch/Batch';

moment.tz.setDefault("Asia/Manila");
const ProductPreview = ({data}) => {
    console.log(data);
    return (
        <Paper 
            height='100%'
            width='35%'
            css='product_preview grd pad-2 absolute slideInRight animate-2'
        >
            <span className='header-2'>Order Details</span>
            <img className='jsc asc' src={data['img_src']} alt={data['title']} height='auto' width='100%'/>
            <div className='grd aic pad-1 '>
                <div className='grd grd-col aic pad-y-1'>
                    <span className='label'>Order No.</span>
                    <span className='jse'>{data['order_id']}</span>
                </div>
                <div className='grd grd-col aic pad-y-1'>
                    <span className='label'>Item No.</span>
                    <span className='jse'>{data['order_item_id']}</span>
                </div>
                <div className='grd grd-col aic pad-y-1'>
                    <span className='label'>Product Name</span>
                    <span className='jse'>{data['title']}</span>
                </div>
                <div className='grd grd-col aic pad-y-1'>
                    <span className='label'>Date</span>
                    <span className='jse'>{moment(data['delivery_date']).format('MMM. DD, YYYY')}</span>
                </div>
                <div className='grd grd-col aic pad-y-1'>
                    <span className='label'>Time</span>
                    <Batch css='jse' batch={data['delivery_time']} />
                </div> 
            </div>
        </Paper>
    );
};

export default ProductPreview;