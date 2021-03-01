import React from 'react';
import Button from '../../atoms/Button/Button';
import PropTypes from 'prop-types';

const ModalButton= ({ button, mobile, clickCancel, cancellabel, submitcolor, clickSubmit, submitlabel, disabled }) => {
    return (
        <div className='grd grd-col gtc-fa'>
            {!mobile && <div></div>}
            <div className='grd grd-col grd-gp-1'>
                {!button ?
                    <>
                        <Button
                            height={mobile && '42px'} 
                            color='neutral' 
                            css={!mobile && 'jse'} 
                            onClick={clickCancel}>
                            {cancellabel}
                        </Button>
                        <Button
                            disabled={disabled}
                            height={mobile && '42px'} 
                            color={submitcolor} 
                            css={!mobile && 'jse'} 
                            onClick={clickSubmit}>
                            {submitlabel}
                        </Button>
                    </>
                    :
                    button
                }
            </div>
        </div>
    );
};

ModalButton.propTypes = {
    mobile: PropTypes.bool,
}

ModalButton.defaultProps = {
    mobile: false,
    submitcolor: 'primary',
    submitlabel: 'Submit',
    cancellabel: 'Cancel',
}

export default ModalButton;