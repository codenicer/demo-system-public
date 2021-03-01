import React, { useState, useEffect } from 'react';
import IconButton from '../../../../../../atoms/IconButton/IconButton';
import Modal from '../../../../../../template/Modal/Modal';
import Input from '../../../../../../atoms/Input/Input';
import Dropzone from '../../../../../../atoms/Dropzone/Dropzone';
 import ModalHold from '../../../../../../Pages/ModalHold/ModalHold';
import { toast } from 'react-toastify';
import {connect} from 'react-redux'
import {confirmPaid,holdOrder,cancelOrder,sentToFloristJob} from '../../../../../../scripts/actions/ordersActions'
import ModalCancel from '../../../../../../Pages/ModalCancel/ModalCancel';
import { faCheck, faHandPaper, faBan, faArrowRight,faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import Upload from '../../../../../../components/Upload/Upload';
import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Manila");

toast.configure()

const OrderRowAction = ({ css, rowData ,confirmPaid,holdOrder,cancelOrder,dispositions,sentToFloristJob ,params,fetchData}) => {
    const [ thumbnail, setThumbnail ] = useState(null)
    const [ file, setFile ] = useState(null)
    const [ modal, setModal ] = useState({confirm: false, hold: false,  cancel: false})
    const [confirmForm ,setConfirm] = useState({
        ref:"",
        amount:"",
        details:"",
    })

    const holdFormInitialState = {
        disposition_id:1,
        name:"ODZ",
        category:14,
        onhold: true,
        comment:'',
      payment_status_id : rowData.payment_status_id,
    }


  const [holdForm ,setHold] = useState(holdFormInitialState)
    const [cancelForm, setCancel] = useState({
        cancel_status:14,
        cancel_reason:"ODZ",
      payment_status_id : rowData.payment_status_id,
        textOn:false
    })


    const handleCOChange = (value) =>{
        const selected = JSON.parse(value)
        
        setCancel({
            cancel_status:selected['category'],
            cancel_reason:selected['name'],
            textOn:selected['on']
        })  
    }
    const handleCOSubmit = () =>{
        if(cancelForm['cancel_reason'].replace(/\s/g,'').length < 1){
            toast.error("Invalid Information");
        }else{
            cancelOrder(cancelForm,rowData,
                    (type,text)=>{
                        handleCOClose()
                        toast[type](text)   
                        if(fetchData && params)   fetchData(params)
                }
            )
        }
    }
    const handleCOClose = () =>{
        setCancel({
            cancel_status:14,
            cancel_reason:"ODZ",
            textOn:false
        })
        setModal({...modal, cancel: false})
    }

    /////////////////////////////////////////////////////
    const handleCFOnChange = (e) =>{
        setConfirm({
            ...confirmForm,
            [e.target.name]:e.target.value
        })
    }
    const handleCFSubmit = () =>{
        if(!file){
            return toast.error("Please upload the proof of payment.");
        }

        const {ref,amount,details} = confirmForm
        if(ref.replace(/\s/g,'').length < 1 || amount.replace(/\s/g,'').length < 1 ||details.replace(/\s/g,'').length < 1){
            toast.error("Invalid Information");
        }else{
            confirmPaid(confirmForm, file, rowData,(type,text)=>{
                handleCFClear()
                toast[type](text)
                if(fetchData && params)   fetchData(params)
            })
        }
    }
    const handleCFClear= () =>{
        setModal({...modal, confirm: false})
        setConfirm({
            ref:"",
            amount:"",
            details:"",
        })

    }

    const handleSubOnChange = (selected) =>{
        if(selected['name'] === "Others"){
            setHold({
                disposition_id:null,
                name:"",
            })
        }else{
            setHold({...holdForm,...selected})
        }
    }

    const handleHoldSubmit = () => {
        // console.log('hold', holdFormInitialState)
        holdOrder(holdForm,rowData,
            (type,text)=>{
                holdFormClose()
                toast[type](text)
                if(fetchData && params)   fetchData(params)
                
       })
    }
    const holdFormClose = () =>{
        setModal({...modal, hold: false})
        setHold(holdFormInitialState)
    }

    const handleSendToFloristJob = ()=>{
       const ans =  window.confirm("Create a florist job for this order?")
        if(ans === true){
            sentToFloristJob(rowData.order_id,(type,text)=>{
                toast[type](text)
                if(fetchData && params)   fetchData(params)
              
            })
        }
    }

    function handleHoldCommentChange(e){
        setHold({
            ...holdForm,
            comment:e.target.value
        })
    }

    const onChangeImage = (url, file) => {
        if(url || file){
            setThumbnail(url);
            setFile(file);
        }
    }

    const removeImage = () => {
        setThumbnail(null);
        setFile(null);
    }

    function onHoldCheckedChange(){
        if (holdForm.onhold === true)
        setHold({
          ...holdForm,
          onhold : false
        })
      else if (holdForm.onhold === false)
        setHold({
          ...holdForm,
          onhold : true
        })
    }

    return (
        <>
            <div className='_action_row bg-white grd aic jic'>
                <div className={`aic grd grd-col jic grd-gp-1 ${css}`}>
                {/* {rowData['payment_id'] === 10 && rowData['payment_status_id'] === 2 &&
                 <IconButton
                        icon={faMoneyBillWave}
                        size='18px'
                        shadow={true}
                        tooltip
                        tooltiptype='left'
                        leftposition='50%'
                        label="Refund"
                        onClick={() =>{ setModal({...modal, hold: true}); console.log(rowData)}}
                    />} */}
                {rowData['payment_status_id'] === 1 && (rowData['allow_prod_b4_payment'] !== 1) && (rowData.payment.name !== 'CPU' && rowData.payment.name !== 'COD')  && <IconButton
                        icon={faCheck}
                        size='18px'
                        shadow={true}
                        tooltip
                        tooltiptype='left'
                        leftposition='50%'
                        label='Confirm payment'
                        onClick={() => setModal({...modal, confirm: true})}

                    />}
                {!([12,1].includes(rowData.order_status_id )) &&
                <IconButton
                        icon={faHandPaper}
                        size='18px'
                        shadow={true}
                        tooltip
                        tooltiptype='left'
                        leftposition='50%'
                        label="Create Ticket"
                        onClick={() =>{ setModal({...modal, hold: true}); console.log(rowData)}}
                    />}
                    <IconButton
                        icon={faBan}
                        size='18px'
                        shadow={true}
                        tooltip
                        tooltiptype='left'
                        leftposition='50%'
                        label='Cancel order'
                        onClick={() => setModal({...modal, cancel: true})}
                    />
                  {(parseInt(rowData.payment_status_id)  === 2 && rowData.order_status_id <=2  && !rowData.job_florist) && (rowData.payment.name !== 'CPU' || moment(rowData.delivery_date).format("YYYY-MM-DD") === moment(new Date()).format("YYYY-MM-DD")) &&
                    <IconButton
                      icon={faArrowRight}
                      size='18px'
                      shadow={true}
                      tooltip
                      tooltiptype='left'
                      leftposition='50%'
                      label='Send to florist'
                      onClick={handleSendToFloristJob}
                    />
                  }
                </div>
            </div>
            {modal.confirm &&
                <Modal
                    width='400px' 
                    clickClose={handleCFClear}
                    clickCancel={handleCFClear}
                    clickSubmit={handleCFSubmit}
                    label='Confirm Payment'
                    submitlabel='Confirm'
                    submitcolor='success'
                    >
                    <Dropzone 
                        image={thumbnail} 
                        dropImage={onChangeImage}
                        removeImage={removeImage}
                        />
                    <span className='label'>Reference ID</span>
                    <Input
                        onChange={handleCFOnChange}
                        name="ref"
                        value={confirmForm.ref}
                        css='pad-1' />
                    <span className='label'>Amount Due</span>
                    <Input



                        onChange={handleCFOnChange}
                        name="amount"
                        value={confirmForm.amount}


                        css='pad-1' />
                    <span className='label'>Details</span>
                    <textarea


                        onChange={handleCFOnChange}
                        name="details"
                        value={confirmForm.details}

                        rows='6' 
                        className='pad-1'></textarea>
                    <div className='grd grd-gp-1 gtc-fa'>
                        <span className='jse label italic'>Upload image</span>
                        <Upload
                            type='file'
                            css="ase"
                            onChange={e => { onChangeImage(URL.createObjectURL(e.target.files[0]), e.target.files[0])}}
                            />
                    </div>
                </Modal> 
            }
            {modal.hold &&
                <ModalHold
                    level='Ticket'
                    clickClose={holdFormClose }
                    clickCancel={holdFormClose}
                    clickConfirm={holdFormClose}
                    clickSubmit={()=>handleHoldSubmit(holdForm)}
                    holdreasonlist={dispositions}
                    onhold = {onHoldCheckedChange}
                    noteChange={handleHoldCommentChange}
                    holdreason={holdForm['disposition_id'] === null}
                    selectChange={(e) => handleSubOnChange(JSON.parse( e.target.value))}
                    order_status={rowData.order_status_id}
                    textChange={(e) => setHold({
                        ...holdForm,
                        name:e.target.value

                    })}
                />
            }
            {modal.cancel &&
                <ModalCancel
                    level='Order'
                    clickClose={handleCOClose}
                    clickCancel={handleCOClose}
                    clickConfirm={handleCOClose}
                    clickSubmit={handleCOSubmit}
                    cancelreasonlist={dispositions}
                    cancelreason={cancelForm['textOn']}
                    cancelFromVal={cancelForm['cancel_status'] === 14 ? 'External': 'Internal'}
                    selectChange={(e) =>handleCOChange(e.target.value)}
                    textChange={(e) =>setCancel({
                        ...cancelForm,
                        cancel_reason:e.target.value
                    })}
                    cancelChange={() =>setCancel({
                        ...cancelForm,
                        cancel_status:cancelForm['cancel_status'] === 14? 13:14
                    })}
                />
            }
        </>
    );
};

OrderRowAction.defaultProps = {
    confirmpayment: false,
}

const transferStatetoProps = state => ({
    dispositions:state.dispoData.dispositions
})

export default connect(transferStatetoProps,{confirmPaid,holdOrder,cancelOrder,sentToFloristJob})(OrderRowAction);