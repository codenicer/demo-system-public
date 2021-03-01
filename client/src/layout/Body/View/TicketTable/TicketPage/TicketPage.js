    
import React, {useState, useEffect} from 'react';
import Button from '../../../../../atoms/Button/Button';
import OrderID from '../../../../../molecules/OrderID/OrderID';
import Comment from '../../../../../molecules/Comment/Comment';
import ConfirmationModal from '../../../../../Pages/ConfirmationModal/ConfirmationModal';
import AddComment from '../../../../../molecules/AddComment/AddComment';
import Paper from '../../../../../atoms/Paper/Paper';
import ModalCancel from '../../../../../Pages/ModalCancel/ModalCancel';
import {resolveTicket,closeTicket,closeSelTicket} from '../../../../../scripts/actions/ticketsActions'
import {handleLoadAnnotations,addAnnotation,updateAnnotation} from '../../../../../scripts/actions/annotationActions'
import {connect} from 'react-redux'
import {toast} from 'react-toastify'
// import socket from '../../../../../scripts/utils/socketConnect'
import moment from 'moment-timezone';
import './TicketPage.css';
import Page from '../../../../../atoms/Page/Page';

moment.tz.setDefault("Asia/Manila");

const statusHandler = (x) => {
    switch(x){
        case 1:
            return 'Open';
        case 2:
            return 'Closed';
        case 3:
            return 'Resolved';
        default:
            return null
    }
}

const TicketPage = (props) => {
    const { data ,reload_ticket} = props;
    const [state, setState] = useState({resolve: false, close: false, cancel: false});
 
    const [comment ,setComment] = useState("")

    const [cancelForm, setCancel] = useState({
        cancel_status:13,
        cancel_reason:"ODZ",
        textOn:false
    })

    const {resolveTicket,dispositions,closeTicket,closeSelTicket} = props
    const {handleLoadAnnotations,addAnnotation,annotations,updateAnnotation} = props

    const handleCOChange = (value) =>{
        const selected = JSON.parse(value)
        setCancel({
            cancel_status:selected['category'],
            cancel_reason:selected['name'],
            textOn:selected['on']
        })  
    }

    const handleCTClose = () =>{
        setCancel({
            cancel_status:14,
            cancel_reason:"ODZ",
            textOn:false
        })
        setState({...state,close:false, cancel: false})
    }

    const handleCloseTicket = () =>{
        if(cancelForm['cancel_reason'].replace(/\s/g,'').length < 1){
            toast.error("Invalid Information");
        }else{
            if(itemLengthChecker()){
                 const dispo = dispositions.filter(x => x['name'] === data['disposition_name'])
                closeTicket({
                    cancel_status:dispo[0]['category'],
                    cancel_reason:dispo[0]['name'],
                    cancel_order: !itemLengthChecker()},data,
                    (type,text)=>{
                        handleCTClose()
                         toast[type](text)   
                         if(reload_ticket) reload_ticket()
                    })
                  
            }else{
                closeTicket({
                    ...cancelForm,

                    cancel_order: !itemLengthChecker()},data,
                    (type,text)=>{
                        handleCTClose()
                         toast[type](text) 
                         if(reload_ticket) reload_ticket()  
                    })
                 
            }
        }
    }

    const handleResolveTicket = () =>{
        resolveTicket(data,(type,text)=>{
            setState({...state, resolve: false})
            toast[type](text)   
            if(reload_ticket) reload_ticket()
        })
    }

    function itemLengthChecker(){
        if (data !== undefined){
            return !(data['no_of_items'] <= 1)
        }else{
            return false
        }
    }

    useEffect(()=>{
       handleLoadAnnotations(data['ticket_id'])
       console.log(data, 'ticket page data')
    },[data])

    // const newTicketAnno = anno => updateAnnotation(anno)
  

    // useEffect(()=>{
    //     socket.on('NEW_TICKET_ANNOTATION',newTicketAnno)

    //     return ()=> socket.off('NEW_TICKET_ANNOTATION',newTicketAnno)

    // },[])
        
    function handleInputChange(e){
        setComment(e.target.value)
    }

    function handleSubmitComment(){
        if(comment.replace(/\s/g,'').length > 4 ){
            const form = {
                ticket_id:data['ticket_id'],
                note:comment, 
            }
            addAnnotation(form,(type,text)=>{
               toast[type](text)
               setComment("")
               handleLoadAnnotations(data['ticket_id'])
            })
        }else{
            toast.error("Please provide a commnent atleast 5 characters.")
        }
    }

    function handleOnKeyPress(e){
        if(e.charCode === 13){
            handleSubmitComment()
        }
    }
  function goBack() {
      if(props.match.path === '/system/ticket'){
            closeSelTicket()
      }else{
        props.history.goBack()
      }
      console.log(props)
   // window.history.back();
  }

    return (
        <>
        <Page
          css='grd-gp-1 over-hid above-all'
          clickClose={goBack}
          label='Open Ticket'
        >
            <Paper
                height='100%'
                css='pad-2'>

                <div className='ticket_page-wrap grd grd-gp-2 size-100'>

                        <div className='ticket_page-header grd grd-gp-1 space-no-wrap'>

                            <span >{`#${data['ticket_id']}`}</span>
                            <span className='header-2 clr-secondary'>{data['disposition_name']}</span>
                            { data &&
                                data.status_id === 1 ?
                                <>
                                    <Button onClick={() => {setState({...state, resolve: true})}}color='success'>Resolve</Button>
                                    <Button onClick={() => {setState({...state, close: true})}}color='warning'>Close Ticket</Button>
                                </>
                                :
                                data.status_id === 3 ?
                                    <span className='header-3' style={{color: 'var(--green)'}}>Resolved</span>
                                :
                                data.status_id === 2 ?
                                    <span className='header-3' style={{color: 'var(--warning)'}}>Closed</span>
                                :
                                    null
                            }
                        </div>
                        <div className='grd grd-col'>

                            <div className='grd grd-gp-1'>
                                <span className='subheader'>Details</span>
                                <div className='grd gtc-af aic grd-gp-1 pad-1'>
                                    <span className='sublabel'>Order ID</span>
                                    <OrderID orderid={data['order_id']} 
                                            ticketIssueID={data.disposition_id} 
                                            ticket_id = {data.ticket_id}
                                     >{data['shopify_order_name']}</OrderID>
                                    <span className='sublabel'>Order Item ID</span>
                                    <span>{data['order_item_id']}</span>  
                                    <span className='sublabel'>Status</span>
                                    <span>{statusHandler(data['status_id'])}</span>
                                </div>
                                <span className='subheader'>Notes</span>
                                <span>{data['notes']}</span>
                            </div>

                            <div className='grd grd-gp-1'>
                                <span className='subheader'>People</span> 
                                <div className='grd grd-gp-1 pad-1 aic gtc-af'>
                                    <span className='sublabel'>Updated by</span>
                                    <span>{`${data['updated_by_firstname']} ${data['updated_by_last']}`}</span>
                                    <span className='sublabel'>Created by</span>
                                    <span>{`${data['created_by_firstname']} ${data['created_by_last']}`}</span>
                                </div>

                                <span className='subheader'>Date</span>
                                <div className='grd grd-gp-1 pad-1 aic gtc-af'>
                                    <span className='sublabel'>Created at</span>
                                    <span>{moment(data['created_at']).format('MMM. DD, YYYY LTS')}</span>
                                    <span className='sublabel'>Updated at</span>
                                    <span>{moment(data['updated_at']).format('MMM. DD, YYYY LTS')}</span>
                                </div>
                            </div>

                        </div>

                        <div className='ticket_page-comments_wrap grd grd-gp-1 over-hid'>
                            <span className='subheader'>Comments</span>
                            <div className='grd over-y-auto ticket_page-comment_wrap scroll'>
                                {annotations !== null && annotations.length > 0 ?
                                    annotations.map((value, key) => {
                                        return <Comment
                                        firstname={value['first_name']}
                                        lastname={value['last_name']}
                                        content={value['note']}
                                        time={value['timestamp']}
                                        key={key} 
                                    />
                                    }):
                                    <h2>No comment yet</h2>
                                }
                            </div>
                            <AddComment  
                                onChange={handleInputChange} 
                                onKeyPress={handleOnKeyPress} 
                                onClick={handleSubmitComment}
                                value={comment}
                                disabled={data.status_id === 1 ? false : true}
                            />
                        </div>
                </div>
            </Paper>
        </Page>

            {state.resolve === false ? null :
                <ConfirmationModal
                    clickClose={() => setState({...state, resolve: false})} 
                    label='Are you sure you want to resolve this ticket?'
                    button= {
                        <>
                            <Button color='neutral' onClick={() => setState({...state, resolve: false})} >Cancel</Button>
                            <Button 
                            onClick={handleResolveTicket}  
                             color='success' >Resolve</Button>  
                        </>
                    }
                />
            }
            {//should change on multiple item line 
                state.close === false ? null :  itemLengthChecker() ?
                <ConfirmationModal
                    clickClose={() => setState({...state, close: false})}
                    label='Are you sure you want to close this ticket?'
                    button={
                        <>
                            <Button color='neutral' onClick={() => setState({...state, close: false})}>Cancel</Button>
                            <Button
                             onClick={handleCloseTicket}
                             color='warning'>Close</Button>
                        </>
                    }
                />
                :
                <ConfirmationModal
                    clickClose={() => setState({...state, close: false})}
                    label='Are you sure you want to close this ticket?'
                    warning='Closing ticket with one item will cancel the order'
                    button={
                        <>
                            <Button color='neutral' onClick={() => setState({...state, close: false})}>Cancel</Button>
                            <Button color='warning' onClick={() => setState({...state, cancel: true, close: false})}>Close</Button>
                        </>
                    }
                />
            }
            {state.cancel &&
            <ModalCancel
                    level='Order'
                    clickClose={handleCTClose}
                    clickCancel={handleCTClose}
                    clickConfirm={handleCTClose}
                    clickSubmit={handleCloseTicket}
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
    )
};

const transferStatetoProps = state => ({
    dispositions:state.dispoData.dispositions,
    annotations:state.annotationData.annotations
    
})

export default connect(transferStatetoProps,{resolveTicket,closeSelTicket,closeTicket,handleLoadAnnotations,addAnnotation,updateAnnotation})(TicketPage); 
