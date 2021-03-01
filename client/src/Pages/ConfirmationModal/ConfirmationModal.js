import React from 'react';
import Overlay from '../../atoms/Overlay/Overlay';
import Paper from '../../atoms/Paper/Paper';
import ModalButton from '../../organisms/ModalButton/ModalButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const ConfirmationModal = ({clickClose, label, warning, body, mobile, button, clickCancel, cancellabel, submitcolor, clickSubmit, submitlabel, width, disabled}) => {
    return (
       <Overlay onClick={clickClose}>
           <Paper
                width={width} 
                css='pad-2 grd grd-gp-1 zoomIn animate-1'
                onClick={(e) =>  e.stopPropagation()}>
                <span className='header-3 jsc'>{label}</span>
                {warning &&
                    <div className='grd gtc-af pad-1 grd-gp-1 aic' style={{color: 'var(--yellow)', fontSize: '2rem'}}>
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                        <span style={{fontSize: '1rem'}}>{warning}</span>
                    </div>
                }
                {
                    body
                }
                <ModalButton
                    mobile={mobile} 
                    button={button}
                    disabled={disabled}
                    clickCancel={clickCancel} 
                    cancellabel={cancellabel}
                    submitcolor={submitcolor} 
                    clickSubmit={clickSubmit} 
                    submitlabel={submitlabel}
                />
           </Paper>
       </Overlay>
    );
};

export default ConfirmationModal;