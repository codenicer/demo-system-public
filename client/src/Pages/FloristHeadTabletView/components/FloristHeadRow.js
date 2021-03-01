import React, { useState } from 'react';
import TableRow from '../../../atoms/TableRow/TableRow';
import ImgSrc from '../../../atoms/ImgSrc/ImgSrc';
import Button from '../../../atoms/Button/Button';
import ModalHoldMobile from '../../ModalHoldMobile/ModalHoldMobile';
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal';
import config from '../../../config.json';
import {toast} from'react-toastify'


const FloristHeadRow = (props) => {
    // ============================ STATES ======================
    // hold modal state
    const [ hold, setHold ] = useState(false);
    const [ confirm, setConfirm] = useState(false);
    // hold reason state
    const [holdReason, setHoldReason] = useState(null)


    // =========================== PROPS ======================
    // =========================== PROPS ======================
    const {css , job, head} = props
    const {title,img_src,shopify_order_name,order_item_id,user_id,order_item_status_id} = job
    const {cancelAssignedTablet,completeJobTablet,holdJobTablet} = props

    // get florst hold reason on config file
    const { floristDisposition } = config;

    

    // =========================== FUNCTIONS ======================
    // =========================== FUNCTIONS ======================

       //details: reset all hold modal state to default
    function resetHoldModalState (){
        setConfirm(false)
        setHold(false)
        setHoldReason(null)
    }

      //details: handle hold submit
      function handleHoldSubmit(){
        const toHold = {order_item_id_list:[order_item_id],hold_info:holdReason}
        holdJobTablet(toHold,(type,msg)=>{
            resetHoldModalState()
             toast[type](msg)
        })
    }
    

    //details: check if job status is 3 or FLorist Accepted for button DONE
    //will be depricated if will not use in the futures
    function doneChecker(){
        return order_item_status_id !== 3
    }
    
    return (
        <>
        <TableRow 
            height='auto'
            css={css} >
                <ImgSrc src={img_src} resolution='50x50'/>
            <div className='grd'>
                <div className='over-hid text-over-ell space-no-wrap'>{title}</div>            
            </div>
            <span>{shopify_order_name}</span>
            <div className='grd grd-col grd-gp-1'>
                {head && 
                <>
                    <Button
                        onClick={() =>  setHold(true)}  
                        height='42px' 
                        color='warning'>Hold</Button>
                    <Button onClick={()=>{cancelAssignedTablet(order_item_id)}} height='42px' color='alert'>Reassign</Button>
                </>
                }
                <Button 
                        onClick={()=>{completeJobTablet(order_item_id,user_id)}} height='42px' color='success'>
                Done</Button>               
            </div>
        </TableRow>
        {hold  &&
            <ModalHoldMobile
                clickClose={() => setHold(false)}
                clickBack={() => setHold(false)}
            >
                {
                    floristDisposition.map((value) => {
                        return <Button
                                    height='42px'
                                    color='warning' 
                                    onClick={() =>{
                                        setHoldReason(value)
                                        setConfirm(true)
                                     }} 
                                    key={value.id}>{value['name']}</Button>
                    })
                }
            </ModalHoldMobile>
        }
        {confirm && 
            <ConfirmationModal
                mobile={true}
                label='Are you sure you want to hold the item/s ?'
                submitlabel='Yes, hold the item/s'
                submitcolor='warning'
                clickSubmit={handleHoldSubmit}
                clickCancel={resetHoldModalState}
            />
        }
        </>
    )
}

export default React.memo(FloristHeadRow)
