import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const PageNotFound = () => {
    return (
            <div className='mar-auto aic jic grd gtc-af grd-gp-1'>
                <div style={{color: 'var(--yellow)', fontSize: 50}}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
                <span className='header'>Page not found</span>
            </div>
    )
}

export default PageNotFound
