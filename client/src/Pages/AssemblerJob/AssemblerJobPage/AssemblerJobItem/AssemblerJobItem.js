import React from 'react';
import Checkbox from '../../../../atoms/Checkbox/Checkbox';
import ImgSrc from '../../../../atoms/ImgSrc/ImgSrc';
import { formatMoney } from 'accounting-js'
import config from '../../../../config.json'


const AssemblerJobItem = (props) => {
    const { currency } = config;
    const { data, onChange,type } = props;
    console.log(data)
    return (
        <div className='grd grd-col grd-gp-3 aic'>
            <Checkbox
                checked={type === 'qualityCheck' ? null : data.order_item_status_id === 7}
                value={data['order_item_id']}
                onChange={onChange}
                color='secondary'
                />
            <ImgSrc src={data['product']['img_src']} resolution='80x80' />
            <span>{`${data['title']}`}</span>
            <span className='italic jse'>x {data['quantity']}</span>
            <span className='jse'>{formatMoney(data['price'], { symbol: currency, precision: 2 })}</span>
            <span className='header-3 jse'>{formatMoney(data['price'] * data['quantity'], { symbol: currency, precision: 2 })}</span>
        </div>
    );
};



export default AssemblerJobItem;