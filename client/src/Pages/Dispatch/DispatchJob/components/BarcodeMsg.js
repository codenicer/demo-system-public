import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'

const BarcodeMsg = ({msg}) => {
    console.log(msg, 'MSG MSG MSG')

    if(!msg.msg){
        return null
    }

    return (
        <div
            style={{gridTemplateRows: 'auto auto 1fr'}} 
            className='grd over-hid'>
            <div className='grd gtc-af aic grd-gp-2 pad-1 asc jsc'>
                <FontAwesomeIcon 
                    style={{
                        fontSize: '3rem',
                        color: msg.msg === 'Job item added' ? 'var(--green)' : 'var(--warning)'
                    }}
                    icon={msg.msg === 'Job item added' ? faCheckCircle : faMinusCircle } />
                <span className='header-2'>{msg.msg}</span>  
            </div>
            <div 
                style={{borderTop: '1px solid black'}}
                className='header-2 pad-y-1'>
                NOTES:
            </div>
            <div
                style={{gridAutoRows: 'min-content'}} 
                className='pad-x-2 grd grd-gp-1 over-y-auto scroll'>
                {msg.notes && 
                    msg.notes.map((note, key) => {
                        return <div className='italic' key={key}>{note.note}</div>
                    })
                }                    
            </div>
        </div>
    )
}

export default BarcodeMsg
