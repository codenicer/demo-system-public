import React, { useState } from 'react';
import Page from '../../../../atoms/Page/Page';
import Paper from '../../../../atoms/Paper/Paper';
import {clearSelectedProducts} from  '../../../../scripts/actions/productActions'
import {connect } from 'react-redux'
import './ProductPage.css';

const ProductPage = ({ data,clearSelectedProducts }) => {
    const [index, setIndex] = useState(0);

    return (
        <Page
            css='product_page'
            clickClose={clearSelectedProducts}
        >
            <Paper
                css='product_page-img grd aic jic'
                height='100%'
                width='100%'
            >
                <img src={data[index]['img_src']} height='auto' width='100%' alt={data[index]['title']}/>
            </Paper>
            <Paper
                css='product_page-details pad-2 grd grd-gp-2 gtr-af'
            >
                <div className='grd grd-gp-1'>
                    <span className='header-2'>Product Details</span>
                    {data.length > 1 && <div>
                        {
                            data.map((x, y) => {
                                return <button key={y} onClick={() => setIndex(y)}>{x['variant_id']}</button>
                            })
                        }
                    </div>}
                </div>
                <div className='grd pad-2'>
                    <span className='subheader'>Product ID</span>
                    <span className='jsc'>{data[index]['product_id']}</span>
                    <span className='subheader'>Category</span>
                    <span className='jsc'>{data[index]['category']}</span>
                    <span className='subheader'>Title</span>
                    <span className='jsc'>{data[index]['title']}</span>
                    <span className='subheader'>Type</span>
                    <span className='jsc'>{data[index]['type']}</span>
                    <span className='subheader'>Tags</span>
                    <span className='jsc'>{data[index]['tags']}</span>
                    <span className='subheader'>Price</span>
                    <span className='jsc'>&#x20B1; {data[index]['price']}</span>
                </div>
            </Paper>
        </Page>
   );
};

export default connect (null,{clearSelectedProducts})(ProductPage);