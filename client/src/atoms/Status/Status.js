import React from 'react';
import PropTypes from 'prop-types';
import './Status.css';

const Status = ({ status, dot, fontSize, css }) => {
    const statusHandler = (x) => {
        switch(x){
            case 1:
                return 'Off';
            case 2:
                return 'Available';
            case 3:
                return 'Working';
            case 4:
                return 'Away';
            case 5:
                return 'Break';
            default: 
        }
    }
    return (
            <span
                style={{fontSize}} 
                className={`relative ${dot ? 'pad-x-2 status' : 'status_no-dot'}-${statusHandler(status)} ${css}`}>{statusHandler(status)}</span>    );
};

Status.propTypes = {
    dot: PropTypes.bool, 
}

Status.defaultProps = {
    dot: true,
}

export default Status;