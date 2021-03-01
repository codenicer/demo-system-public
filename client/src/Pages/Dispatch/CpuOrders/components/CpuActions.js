import React, { useState } from 'react'
import Button from '../../../../atoms/Button/Button'
import ModalHoldMobile from '../../../ModalHoldMobile/ModalHoldMobile';

//json file
import undeliveredreason  from './../../DispatchIntransit/DispatchIntransitQueueJob/undeliveredreason.json';

const CpuActions = (props) => {
    //============PROPS==============
    //============PROPS==============

    //pass down props
    const { id, cpuHandler } = props
    
    //===========USE STATE============
    //===========USE STATE============

    const [ show, setShow ] = useState(false);

    console.log(id, 'ID ID ID ID ID ID')
    return (
        <div>
            <div className='grd grd-gp-1'>
                <Button
                    onClick={() => cpuHandler({
                        status:10,
                        dispatch_job_detail_id: id,
                        action_id: 16,
                        action_cpu_id : 21
                    })}
                    color='success'
                >
                    Tag as Delivered
                </Button>
                <Button
                    onClick={() => setShow(true)}
                    color='warning'
                >
                    Tag as Undelivered
                </Button>
           </div>
           { show &&
            <ModalHoldMobile
               width='auto'
               backheight='auto'
               clickClose={() => { setShow(false);}}
               clickBack={() => { setShow(false);}}
               label='Undeliver item'
           >
               <div className='grd grd-gp-1'>
                   <span className='header-3'>Reason</span>
                   <div className='grd grd-gp-2' style={{gridTemplateColumns: '1fr 1fr'}}>
                       {
                         undeliveredreason.undelivered.map((value, key) => {
                           return <Button
                           key={key}
                           css='pad-1'
                           color='warning'
                           onClick={() => {cpuHandler({
                                status: 11,
                                reason: value,
                                dispatch_job_detail_id: id,
                                action_id: 17,
                                action_cpu_id : 22
                           })
                           setShow(false)
                           ;}}
                           >
                             {value}
                           </Button>
                         })
                       }
                   </div>
               </div>
            </ModalHoldMobile>
           }
        </div>
    )
}

export default CpuActions;
