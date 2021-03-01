import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faBan } from '@fortawesome/free-solid-svg-icons'
import './EditableData.css';

const EditableData = ({edit, children, onClick}) => {
    return (
        <div className='grd gtc-fm grd-gp-1 aic edit_data'>
            {children}
            <FontAwesomeIcon className='point' icon={ !edit ? faPen : faBan } onClick={onClick} />
        </div>
    );
};

export default EditableData;