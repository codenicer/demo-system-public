import React, { useState } from 'react'
import Button from '../../../atoms/Button/Button'

const DeliveryDateModal = (props) => {
    //=========PROPS======
    //=========PROPS======

    // pass down props
    const { dateFilter } = props;


    //========STATE=======
    //========STATE=======

    // state for showing the modal
    const [ show, setShow ] = useState(false);
    
    return (
        <>
            <Button
                color='secondary text-no-wrap'
                onClick={() => setShow(!show)}
            >
                Del. Date
            </Button>
            {show &&
                <div 
                    className='fixed florist_head-tablet-date-filter size-100 grd aic jic' 
                    onClick={(e) => { e.stopPropagation(); setShow(false);}}>
                    <input 
                        type='date' 
                        className='pad-1' 
                        onClick={e => e.stopPropagation()} 
                        onChange={e => {dateFilter(e); setShow(false)}}/>
                </div>
            }
        </>
    )
}

export default DeliveryDateModal
