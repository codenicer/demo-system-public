import React from 'react';
import PropTypes from 'prop-types';
import './PagePreloader.css';

const  PagePreloader = ({ text, isfetching}) => {
	return (
        <>
            {isfetching &&
                <div style={{zIndex:'2000'}} className='page-preloader grd grd-gp-2 absolute aic jic size-100'>
                    <div>
                        <span className='header'>{text}</span>
                    </div>
                    <div className='page-preloader_bars'>
                        <div className='page-preloader_bar'></div>
                        <div className='page-preloader_bar'></div>
                        <div className='page-preloader_bar'></div>
                        <div className='page-preloader_bar'></div>
                        <div className='page-preloader_bar'></div>
                        <div className='page-preloader_bar'></div>
                        <div className='page-preloader_bar'></div>
                        <div className='page-preloader_bar'></div>
                    </div>
                </div>
            }
        </>
    )
}

PagePreloader.propTypes = {
    isfetching: PropTypes.bool,
}

export default PagePreloader;