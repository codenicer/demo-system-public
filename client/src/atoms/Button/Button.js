import React from 'react';
import './Button.css';
import PropTypes from 'prop-types';

const Button = ({ color, size, css, height, children, loading, disabled, onClick, width }) => {
    return (
        <button
            style={{height: height, width: width}}
            onClick={onClick}
            disabled={disabled}
            className={`button button-color--${color} button-size--${size} ${css} button-${loading} point`}
            id={disabled ? 'button-state--disabled' : null} 
            >
                {children}
         </button >
    );
};

Button.propTypes = {
    disabled: PropTypes.bool
}

Button.defaultProps = {
    color: 'default',
    children: 'Default Label Text',
    disabled: false,
}

export default Button;