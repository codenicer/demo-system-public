import React from 'react';
import './TableHeader.css';

const TableHeader = (props) => {
    const { css, children, height, csswrap } = props;
    return (
        <div
            style={{display: 'table'}}
            className={`table_header ${csswrap}`}
        >
            <div 
                {...props} 
                className={`grd label ${css}`}
                style={{height: height}}
                >
                {children}
            </div>
        </div>
    );
};

TableHeader.defaultProps = {
    height: '35px'
}

export default TableHeader;