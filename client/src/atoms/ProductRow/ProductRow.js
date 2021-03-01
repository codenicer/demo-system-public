import React from 'react';
import Button from '../Button/Button';
import './ProductRow.css';

const ProductRow = ({data, qty, added, onClick}) => {
    return (
        <div className='product_row grd grd-gp-2 space-no-wrap br-2 pad-1' style={{gridTemplateColumns: 'min-content 1fr 3fr min-content min-content auto', marginBottom: '10px'}}>
            <img src={data['img_src']} alt={data['title']} height='50px' width='auto' />
            <span>{data['product-id']}</span>
            <div className='asc'>
                <span className='label'>{data['title']}</span>
                <span>{data['type']}</span>
            </div>
            {!added ?
                <div className='asc'>
                    {/* <span>{`stock: ${stock}`}</span> */}
                    <span className='header-3'>&#x20B1; {data['price']}</span>
                </div>
                :
                <span className='header-3 asc'>&#x20B1; {data['price']}</span>
            }
            {!added ?
                <div className='asc grd grd-gp-1 gtc-fa aic'>
                    <span>Qty:</span>
                    {qty}
                </div>
                :
                <span className='product_row-qty asc'>{`x ${qty}`}</span>
            }
            {!added ? 
                <Button onClick={onClick} color='success' >Add</Button>
                :
                <Button onClick={onClick} color='warning' >Remove</Button>
            }
        </div>
    );
};

export default ProductRow;