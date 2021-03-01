import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getSelectedOrderRefundList,declineRefundRequest ,acceptRefundRequest,createRefundRequest} from "../../scripts/actions/refundActions";
import Container from "../../atoms/Container/Container";
import Button from "../../atoms/Button/Button";
import Select from 'react-select';
import TableHeader from "../../atoms/TableHeader/TableHeader";
import Modal from '../../template/Modal/Modal'
import RefundTableRow from "./components/RefundTableRow";
import "./RiderList.css";
import Pagination from "../../atoms/Pagination/Pagination";
import _ from 'lodash';
import Input from '../../atoms/Input/Input';
import moment from 'moment-timezone'
import {colHeaders} from './RefundPageSettings'
import {toast} from 'react-toastify'

moment.tz.setDefault("Asia/Manila");

const OrderRefund = props => {

  const {getSelectedOrderRefundList,declineRefundRequest,acceptRefundRequest,selected_order_refund_details,createRefundRequest} = props
  


  const [params, setParams] = useState({
    page: 1,
    pageSize: 30,
    order_id: props.match.params.order_id
  });

  const [form , setForm]= useState({
    payment_id:null,
    shopify_order_name:null,
    order_id:null,
    amount:null,
    notes:null,
    refund_type:null
  })

  const [modalState, setModalState] = useState({
      modalState:false,
      modalName:"",
      mode:0
  })

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
        getSelectedOrderRefundList(params)
  },[]);

  const PageClick = x => {
    let retpage = x();
    const newparam = { ...params, page: retpage };
    setParams(newparam);
    return true;
  };

    useEffect(()=>{
        setTableData(selected_order_refund_details? selected_order_refund_details.refund_list.rows:[])
        setForm({
            ...form,
            payment_id:selected_order_refund_details?selected_order_refund_details.payment.id : null,
            shopify_order_name:selected_order_refund_details ? selected_order_refund_details.order.shopify_order_name  : null,
            order_id:selected_order_refund_details ? selected_order_refund_details.order.order_id :null
        })

    }, [selected_order_refund_details]);


function fullRefundRequestHandler(){
        setModalState({
            modalState:true,
            modalName:"Make Full Refund Request",
            mode:0
        })
        setForm({
            ...form,
            refund_type:'full',
            amount:selected_order_refund_details ?selected_order_refund_details.order.total_price:0
        })
        return true
}


function partialRefundRequestHandler(){
    setModalState({
        modalState:true,
        modalName:"Make Partial Refund Request",
        mode:1
    })
    setForm({
        ...form,
        refund_type:'partial'
    })
    return true
}

function modalReset(){
   return setModalState({
        modalState:false,
        modalName:"",
        mode:0
    })
}


function payment_status_helper(id){
    switch (id) {
        case 1:
            return 'Pending'
        case 2:
            return 'Paid'
        case 3:
            return 'Refunded'
        default:
            return 'Overdue';
    }
}

function textOnchange(target,value){
  return  setForm({
        ...form,
        [target]:value
    })
}


function sumbitRefundRequestHandle(){
  // console.log(form.amount > 1,form.amount <= selected_order_refund_details.order.total_price,form.amount , selected_order_refund_details.order.total_price)
    if( Number(form.amount) > 1 && Number(form.amount) <= Number(selected_order_refund_details.order.total_price)){
    
        createRefundRequest({form},(type,msg)=>{
          
            modalReset()
            getSelectedOrderRefundList(params)
            toast[type](msg)
        
        })
    }else{
        toast.error("Invalid refund amount.")
    }
    return true
}


  return (
    <>
    <Container css="over-hid grd slideInRight animate-2 gtr-af">
      <div>
        <div className="grd grd-gp-2 pad-1 gtc-af">
          <span className="header">Order Refund Detail</span>
        </div>
        <h1 style={{
            fontSize:"1.2rem"
        }}>Order Details</h1>
        <div
          style={{
            gridTemplateColumns: '.5fr repeat(5, 1fr) 2fr 2fr .5fr', 
            borderTop:'1px solid #A9A9A9',
            borderBottom:'1px solid #A9A9A9',
            marginTop:'.2rem',
            paddingTop:'1rem',
            marginBottom:'1rem',
            paddingBottom:'1rem'

          }}
          className='grd grd-gp-1'  
        >
            <span></span>
            <div>   
                <h1 className='r-header' style={{color:'#666666'}}>Order Number:</h1>
                <h1 className="r-text" style={{
                    marginLeft:'1rem'
                }}>{selected_order_refund_details ? selected_order_refund_details.order.shopify_order_name : 'N/A'}</h1>
            </div>
            <div>   
                <h1 className='r-header' style={{color:'#666666'}}>Payment Status:</h1>
                <h1 className="r-text" style={{
                    marginLeft:'2rem'
                }}>{selected_order_refund_details ? payment_status_helper(selected_order_refund_details.order.payment_status_id) : 'N/A'}</h1>
            </div>
            <div>   
                <h1 className='r-header' style={{color:'#666666'}}>Total Price:</h1>
                <h1 className="r-text" style={{
                    marginLeft:'2rem'
                }}>{selected_order_refund_details ?selected_order_refund_details.order.total_price: 'N/A' }</h1>
            </div>
            <div>   
                <h1  className='r-header'style={{color:'#666666'}}> Delivery Date:</h1>
                <h1 className="r-text" style={{
                    marginLeft:'2rem'
                }}>{selected_order_refund_details ? selected_order_refund_details.order.delivery_date : 'N/A'}</h1>
            </div>

            <div>   
                <h1  className='r-header'style={{color:'#666666'}} >Delivery  Time:</h1>
                <h1 className="r-text" style={{
                    marginLeft:'2rem'
                }}>{selected_order_refund_details ? selected_order_refund_details.order.delivery_time : 'N/A'}</h1>
            </div>

            <Button onClick={fullRefundRequestHandler} color='success' >Request Full Refund</Button>
             
            <Button onClick={partialRefundRequestHandler} color='success' >Request Partial Refund</Button>
        
        </div>

         <h1 style={{
            fontSize:"1.2rem"
        }}>Refund List </h1>
      
        <TableHeader csswrap="width-100" css="r-user_list-template jic aic">
          {colHeaders.map((x, y) => {
            return <div key={y}>{x}</div>;
          })}
        </TableHeader>
      </div>
      <div className="over-y-auto scroll">
        {tableData && tableData.length ?
          tableData.map((record, key) => {
            return (
              <RefundTableRow
                css="r-user_list-template aic jic"
                key={key}
                data={record}
                declineRefund={declineRefundRequest }
                acceptRefundRequest={acceptRefundRequest}
              />
            );
          }):
          
          <h1 style={{display:'flex',justifyContent:'center',fontSize:"1.2rem" ,marginTop:"2rem"}}>NO REFUND REQUEST YET</h1>
        }
      </div>
      <div className="grd pad-y-1">
        <Pagination
          selPage={params.page}
          rows={params.pageSize}
          count={selected_order_refund_details ? selected_order_refund_details.refund_list.count : 0}
          pageClick={PageClick}
        />
      </div>
    </Container>
        {modalState.modalState && <Modal
            width='400px' 
            clickClose={() => modalReset()}
            clickCancel={() => modalReset()}
            clickSubmit={sumbitRefundRequestHandle}

            label={modalState.modalName}
            submitlabel='Submit Request'
            submitcolor='success'
            >

            {modalState.mode === 0 ?
                  <>
                  <span className="label">Full Amount</span>
                  <Input
                      fontSize='2rem'
                      css="pad-1"
                      type='search'
                      name="name"
                      disabled={true}
                      value={selected_order_refund_details.order.total_price}
                  />
                  </>
                :
                <>
                <span className="label">Partial Amount</span>
                <input
                   style={{
                       height:'4rem',
                       fontSize:'2rem'
                   }}
                    onChange={(e)=>textOnchange('amount',e.target.value)}
                    type='number'
                    value={form.amount || ''}
                />
                </>
            }
              <span className="label">Note</span>
              <textarea 
              onChange={(e)=>textOnchange('notes',e.target.value)}
              value={form.notes || ''}
               placeholder='Add a note.' rows='4'></textarea>
        </Modal>}
 </>
  );
};

const MapStateToProps = state => ({
  isFetching: state.webFetchData.isFetching,
  selected_order_refund_details: state.refundData.selected_order_refund_details
});

export default connect(
  MapStateToProps,
  {getSelectedOrderRefundList,declineRefundRequest,acceptRefundRequest,createRefundRequest }
)(OrderRefund);
