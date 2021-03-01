import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const PageClose = (props) => {
    const { size, clickClose, label } = props

    const pageCloseHandler = () => {
        let currentOpenPage = Number(sessionStorage.getItem('openpage'));
        let minusPage = currentOpenPage - 1;
        sessionStorage.setItem('openpage', minusPage.toString())
        clickClose()
    }

    return (
        <div className='grd grd-gp-2 gtc-af aic pad-1'>
            <div onClick={pageCloseHandler} className='grd gtc-af grd-gp-1 point'> 
                <FontAwesomeIcon icon={faChevronLeft} style={{fontSize: size}} />
                <span className='subheader italic'>Back</span>
            </div>
            <div className='header-2'>{label}</div>
        </div>
    );
};

PageClose.defaultProps = {
    size: '20px',
}

export default PageClose;