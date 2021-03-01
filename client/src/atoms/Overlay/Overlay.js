import React from 'react';
import './Overlay.css';

const Overlay = (props) => {
    const { children } = props;
    return (
        <div {...props} className='overlay fixed grd jic aic cont'>
            {children}
        </div>
    );
};

export default Overlay;