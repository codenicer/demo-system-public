import React from 'react';

const Select = (props) => {
    const { children, css, defaultValue } = props;
    return (
        <select {...props} defaultValue={defaultValue} className={`point br-2 ${css}`} style={{border: '1.3px solid #A9A9A9', padding: 3}}>
            {children}  
        </select>
    );
};

export default Select;