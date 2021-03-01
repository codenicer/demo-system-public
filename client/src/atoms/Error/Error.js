import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamation } from '@fortawesome/free-solid-svg-icons';

const Error = ({label, iconsize, labelsize}) => {
    return (
        <div className='size-100 grd aic jic'>
            <div 
                className='pad-3 br-2 grd grd-gp-3 gtc-af aic'>
                <div style={{
                        fontSize: iconsize, 
                        color: 'rgb(255, 206, 59)', 
                        stroke: 'black',
                        strokeWidth: 7
                    }}>
                    <FontAwesomeIcon icon={faExclamation} />
                </div>
                <span style={{fontSize: labelsize}}>{label}</span>
            </div>
        </div>
    )
}

Error.defaultProps = {
    iconsize: 50,
    labelsize: 25
}

export default Error
