import React from 'react';
import IconButton from '../../atoms/IconButton/IconButton';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import './ArrowButton.css';

const ArrowButton = (props) => {
    const { open, size, color } = props;
    return (
        <IconButton
            {...props}
            css={open ? 'arrow_button arrow_button_open' : 'arrow_button'}
            icon={faCaretDown}
            size={size}
            color={color}
        />
    );
};

export default ArrowButton;