import React from 'react';
import IconButton from '../../atoms/IconButton/IconButton';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
const ModalHeader = (props) => {
    const { label, onClick } = props;
    return (
        <div className='grd gtc-fm aic'>
            <span className='header'>{label}</span>
            <IconButton 
                icon={faTimes}
                css='jse'
                size='25px'
                width='auto'
                onClick={onClick}
            />
        </div>
    );
};

export default ModalHeader;