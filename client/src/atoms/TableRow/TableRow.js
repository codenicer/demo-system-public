import React from 'react';
import RowPreloader from '../../components/RowPreloader/RowPreloader';
import PropTypes from 'prop-types';
import './TableRow.css';

const TableRow = (props) => {
    const { children, css, myref, height, loading, loaderheight, loadertitle, width, maxWidth, newOrder } = props;
    return (
        <div
            style={{display: 'table', width, maxWidth}}
            className={newOrder ? `new_order-indicator--${newOrder} table_row` : 'table_row'}
        >
            <div 
                ref={myref} 
                className={`relative grd bg-white ${css}`}
                style={{height: height}}
                >
                    {children} 
                    {loading &&
                        <RowPreloader title={loadertitle} height={loaderheight}/>
                    }
            </div>
        </div>
    );
};

TableRow.propTypes = {
    loading: PropTypes.bool
}

TableRow.defaultProps = {
   height: '60px',
   loading: false,
   width: '100%',
   newOrder: 0,
}

export default TableRow;