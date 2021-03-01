import React from 'react';
import './Balloon.css';

function Balloon(props) {
    const { children, color } = props 
    return (
        <div className={`grd aic jic balloon balloon_color-${color} round absolute`}>
            {children}
        </div>
    )
}

export default Balloon
