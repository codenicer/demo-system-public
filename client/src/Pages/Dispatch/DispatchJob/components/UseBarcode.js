import React, { useState, useRef } from 'react'
import Button from '../../../../atoms/Button/Button';
import Overlay from '../../../../atoms/Overlay/Overlay';
import Paper from '../../../../atoms/Paper/Paper';
import Input from '../../../../atoms/Input/Input';
import BarcodeMsg from './BarcodeMsg';


const UseBarcode = (props) => {
    //=========PROPS========
    //=========PROPS========

    //pass down props
    const { msg, onKeyPress, notes } = props;

    //========REF=========
    //========REF=========

    // ref for input for auto focus purpose
    const barcodeInput = useRef(null);

    //========STATE========
    //========STATE========

    // state to show and hide the barcode input modal
    const [ show, setShow ] = useState(null);

    //=========FUNCTIONS========
    //=========FUNCTIONS========

    const barcodeHandler = e => {
        if(e.key === 'Enter'){
            onKeyPress(barcodeInput.current.value);
            barcodeInput.current.value = null;
        }
    }

    return (
        <>
            <Button
                onClick={() => setShow(true)}
            >Use Barcode</Button>
            { show &&
                <Overlay
                    onClick={() => setShow(false)}
                >
                    <Paper
                        onClick={(e) => {e.stopPropagation(); barcodeInput.current.focus()}}
                        height='400px'
                        width='500px'
                        css='pad-2 grd barcode-modal-wrap grd-gp-1'
                    >
                        <span className='header'>Scan Barcode</span>
                        <Input
                            css='pad-1 barcode-input'
                            myref={barcodeInput}
                            type='search'
                            maxLength='15'
                            onKeyDown={e => e.key === 'Escape' && setShow(false)}
                            onKeyPress={e => barcodeHandler(e)}
                            autoFocus />
                        <BarcodeMsg msg={msg} />
                    </Paper>
                </Overlay>
            }
        </>
    )
}

export default UseBarcode
