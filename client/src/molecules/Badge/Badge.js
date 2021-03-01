import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './Badge.css';

function Badge({label, onClick}) {
    return (
        <div className='grd grd-gp-1 badge aic jic'>
            <div className='badge_label-wrap text-ac'>
                <span className='space-no-wrap'>{label}</span>
            </div>
            <div className='point badge_btn-wrap' onClick={onClick}>
                <FontAwesomeIcon icon={faTimes} /> 
            </div>
        </div>
    )
}

export default Badge
