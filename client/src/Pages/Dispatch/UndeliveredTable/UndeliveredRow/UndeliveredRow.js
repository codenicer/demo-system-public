import React, { useState } from 'react';
import TableRow from '../../../../atoms/TableRow/TableRow';
import IconButton from '../../../../atoms/IconButton/IconButton';
import OrderID from '../../../../molecules/OrderID/OrderID';
import ConfirmationModal from '../../../ConfirmationModal/ConfirmationModal';
import Button from '../../../../atoms/Button/Button';
import { faTrash, faRedo } from '@fortawesome/free-solid-svg-icons'

const UndeliveredRow = () => {
    const [ modal, setModal ] = useState({close: false, redispatch: false}) 
    return (
        <>
            <TableRow
                css='undelivered_row jic'
                >
                <div className='grd grd-col grd-gp-1'>
                    <IconButton 
                        icon={faTrash}
                        size='18px'
                        tooltip={true}
                        color='#F86C6B'
                        label='Close'
                        leftposition='50%'
                        onClick={() => setModal({...modal, close: true})}
                    />
                    <IconButton
                        icon={faRedo}
                        size='18px'
                        tooltip={true}
                        color='#929292'
                        label='Redispatch'
                        leftposition='50%'
                        onClick={() => setModal({...modal, redispatch: true})}
                    />
                </div>
                <OrderID>FS-313131</OrderID>
                <span>1</span>
                <span>Lolita</span>
                <span>Ramil Saavedra</span>
                <div className='grd jic' style={{wordWrap: 'break-word'}}>
                    <span>2940 Borja St. Malaban</span>
                    <span>Binan, Laguna</span>
                    <span>4024, PH</span>
                </div>
                <div style={{wordWrap: 'break-word'}}>Unable to deliver as there was no access to the delivery address</div>
            </TableRow>
            {modal.close &&
                <ConfirmationModal 
                    clickClose={() => setModal({...modal, close: false})}
                    label='Are you sure you want to close this item'
                    warning='insert warning just in case, line 50'
                    button={
                        <>
                            <Button color='neutral' onClick={() => setModal({...modal, close: false})}>
                                Cancel
                            </Button>
                            <Button color='warning' onClick={() => alert('line 56 undeliveredrow')}>
                                Close
                            </Button>
                        </>
                    }
                />
            }
            {modal.redispatch &&
                <ConfirmationModal
                    clickClose={() => setModal({...modal, redispatch: false})}
                    label='Are you sure you want to redispatch this item'
                    button={
                        <>
                            <Button color='neutral' onClick={() => setModal({...modal, redispatch: false})}>
                                Cancel
                            </Button>
                            <Button color='success' onClick={() => alert('line 72 undeliveredrow')}>
                                Redispatch
                            </Button>
                        </>
                    }
                />
            }
        </>
    );
};

export default UndeliveredRow;