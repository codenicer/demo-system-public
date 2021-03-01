import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowAltUp, faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons';

const SortButton = ({state,onClick}) => {
  

    return (
        <div
            className={`grd grd-gp-1 gtc-af aic br-2 pad-1 point ${state !== 0 ? '_florist-header_filter-badge shadow color-white' : '_florist-header_filter-badge_off'}`} 
            onClick={onClick}>
            <FontAwesomeIcon icon={ state === 2 ? faLongArrowAltUp : faLongArrowAltDown } />
            <span className='space-no-wrap'>A-Z</span>
        </div>
    )
}

export default SortButton
