import React from 'react';
import Overlay from '../../atoms/Overlay/Overlay';
import Paper from '../../atoms/Paper/Paper';
import ModalHeader from '../../organisms/ModalHeader/ModalHeader';
import ModalButton from '../../organisms/ModalButton/ModalButton';

const Modal = ({ css, children, height, width, label, clickClose, button, clickSubmit, clickCancel, submitlabel, submitcolor, cancellabel, disabled }) => {
    return (
        <Overlay onClick={clickClose}>
            <Paper onClick={(e) => e.stopPropagation()} height={height} width={width} css={`grd gtr-mfm grd-gp-1 pad-3 zoomIn animate-1 ${css}`}>
                <ModalHeader 
                    label={label}
                    onClick={clickClose}
                />
                        { children }
                <ModalButton 
                    button={button}
                    disabled={disabled}
                    clickSubmit={clickSubmit} 
                    clickCancel={clickCancel} 
                    submitlabel={submitlabel} 
                    submitcolor={submitcolor}
                    cancellabel={cancellabel}
                    />
            </Paper>
        </Overlay>
    );
};

export default Modal;