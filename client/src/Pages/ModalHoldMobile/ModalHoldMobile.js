import React from 'react';
import Modal from '../../template/Modal/Modal';
import Button from '../../atoms/Button/Button';

const ModalHoldMobile = ({children, clickClose, clickBack, width, backheight, label}) => {
    return (
        <Modal
            css='grd-gp-2'
            width={width}
            label={label}
            clickClose={clickClose}
            button={
                <Button
                    height={backheight} 
                    color='neutral'
                    onClick={clickBack}>
                    Back
                </Button>
            }
            >
            { children }
        </Modal>
    );
};

ModalHoldMobile.defaultProps = {
    width: '90%',
    backheight: '42px',
    label: "Hold Item",
}

export default ModalHoldMobile;