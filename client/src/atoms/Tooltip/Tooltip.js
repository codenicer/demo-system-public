import React from 'react';
import './Tooltip.css';

const Tooltip = (props) => {
    const { children, css, type, leftposition, rightposition, top, width } = props;
    return (
        <div 
            {...props}
            className={`tooltip tooltip-${type} absolute pad-1 ${css}`}
            style={{left: `${leftposition}`, right: `${rightposition}`, marginTop: `${top}`, width: `${width}`}}>
            {children}
        </div>
    );
};

Tooltip.defaultProps = {
    type: 'left',
    rightposition: 'auto',
    leftposition: 'auto',
    top: '0',
    width: 'auto',
}

export default Tooltip;