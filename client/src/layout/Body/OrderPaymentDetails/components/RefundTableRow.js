import React from 'react';
import TableRow from '../../../../atoms/TableRow/TableRow';
import Modal from '../../../../template/Modal/Modal';
import Input from '../../../../atoms/Input/Input'
import moment from 'moment-timezone';
import Button from "../../../../atoms/Button/Button";


import { toast } from 'react-toastify';

const userStatus = ['Active', 'Suspended','Inactive'];

moment.tz.setDefault("Asia/Manila");

const RiderTableRow = ({ data, declineRefund,acceptRefundRequest,getRefundList, css }) => {

    // console.log('data list row', data)
    const form = {
        id:data.id
    }

    function refund_status_filter (stat){
        if (stat === 0 ) return 'For approval'
        return stat === 1 ? 'Approved' : 'Declined'
    }
    
    function handleDecline(){
            const confirm = window.confirm(`${data.shopify_order_name}: Decline this refund request?`)
            if(confirm){
                declineRefund({form},(msg)=>{
                    getRefundList()
                    toast.success(msg)
                })
                // 
            }
    }

    function handleAccecpt () {
        const confirm = window.confirm(`${data.shopify_order_name}: Approve this refund request?`)
        if(confirm){
            acceptRefundRequest({form},(type,msg)=>{
                getRefundList()
                toast[type](msg)
            })
        }
    }

    if(data)
    return (
        <>
            <TableRow css={`jic ${css}`} key={data.id}>
                 <div>{data.id}</div>
                <div>{data.shopify_order_name}</div>
                <div>{data.amount}</div>
                <div>{refund_status_filter(data.status)}</div>
                <div>{moment(data.created_at).format('h:mm A MMMM D ,YYYY')}</div>
                <div>{data.approved_at ? moment(data.approved_at).format('hh:mm A MMMM D ,YYYY') : 'N/A'}</div>
                <div>{data.refund_type || 'N/A'}</div>
                <div>{data.refund_status || 'N/A'}</div>
                <div className='grd grd-col grd-gp-1'>
                    {
                        data.status === 0 &&
                        <>
                              <Button color='success' onClick={handleAccecpt}>Accept</Button>
                              <Button color='error' onClick={handleDecline }>Decline</Button>
                        </>
                    }
                </div>
            </TableRow>
        </>
    );
    else return '';
};


export default RiderTableRow;
