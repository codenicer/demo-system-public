import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadCry } from '@fortawesome/free-solid-svg-icons'

import './Spinner.css';
//isfetching States: success / isFetching / error
function Spinner({ isFetching }) {
    return (
        <div className='grd spinner-wrap aic jic absolute bg-white size-100'>
        {isFetching === 'isFetching' ?
            <div className='spinner circles relative'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            :
            isFetching === 'error' ?
            <div className='grd grd-gp-1 aic pad-2 br-2 error_page error_wrap'>
                <div className='error-icon' style={{fontSize: 40}}>
                    <FontAwesomeIcon icon={faSadCry}/>
                </div>
                <span className='header-3 error-header'>OOPS! Something went wrong</span>
                <span className='header-1 error-msg'>Please reload the page</span>
            </div>
            :
            null
        }
        </div>
    )
}

export default Spinner
