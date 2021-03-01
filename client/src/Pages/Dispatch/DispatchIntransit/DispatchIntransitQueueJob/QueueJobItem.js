import React, { useState, useRef } from 'react';
import OrderID from '../../../../molecules/OrderID/OrderID';
import Batch from '../../../../atoms/Batch/Batch';
import TableRow from '../../../../atoms/TableRow/TableRow';
import Button from '../../../../atoms/Button/Button';
import OrderStatusLabel from '../../../../atoms/OrderStatus/OrderStatusLabel';
import {toast} from 'react-toastify';

import undeliveredreason  from './undeliveredreason.json';
import ModalHoldMobile from '../../../ModalHoldMobile/ModalHoldMobile';
import ConfirmationModal from '../../../ConfirmationModal/ConfirmationModal';
import Customer from '../../../../atoms/Customer/Customer';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");

const QueueJobItem = ({data, setDispatchOrderDelivered, setDispatchOrderUnDelivered,setDispatchOrderCancelled, paymentHighlight,
    hubs,
    payment_methods

}) => {

    //get undelivered on json file
    const [ undelivered ] = useState(undeliveredreason.undelivered)

    const [modal, setModal] = useState({undelivered: false, close: false, confirm: false});
    const [selectedItem, setSelectedItem] = useState({
        reason: '',
        dispatch_job_detail_id: 0
    });
    const myref = useRef(null);

    const getHub = (x) => {
        if(x){
            let h = hubs.filter( r => parseInt(r.id) === parseInt(x));
            if(h){
                return h[0].name
            }
        }
        return '';
    }
    const getPaymentOptions = (x) => {
        try{
            if(x){
                let h = payment_methods.filter( r => parseInt(r.id) === parseInt(x) || r.value === x);
                if(h){
                    return h[0].value
                }
            }
        } catch(e){
            console.log('error', e);
        }
        return '';
    }


    // function handleReason(event){
    //   const target = event.target;
    //   setSelectedItem({ ...selectedItem, [target.name]: target.value });
    // }

    const handleReason = (value) => {
      setSelectedItem({...selectedItem, reason: value})
      setModal({...modal, confirm: true})
    }

    // console.log('dispatch', data)
    return (
        <>
            <TableRow
                    css='dispatch_for_delivery_table-template pad-1 aic '
                    height='auto'
                > 
                   <div>
                        <OrderID orderid={data['order_id']}>
                        {data.job_item_type === "delivery" ? data.shopify_order_name: `${data.shopify_order_name}-CPU` }
                        </OrderID>
                        <span>{data['job_item_type']}</span>
                    </div>
                    <div
                      className='text-ac'
                    >
                      {data['job_item_type'] === 'delivery'? data['item'] :data['item']}
                    </div>
                    <div className='grd grd-gp-1 jic'>
                        <div>{data['delivery_date']}</div>
                        <Batch batch={data['delivery_time']}/>
                    </div>
                    <div className='grd jic'>
                        <Customer id={data['order_id']} firstname={data['shipping_name']} lastname=""/>
                        <span>{data['phone']}</span>
                    </div>
                    <div className="text-ac">
                        <span className='label italic'>{getHub(data['hub_id'])}</span>
                        <div className="sublabel grd">
                            {data["shipping_address_1"] && <span>{data["shipping_address_1"]}</span>}
                            {data["shipping_address_2"] && <span>{data["shipping_address_2"]}</span>}
                            {data["shipping_city"] && <span>{data["shipping_city"]}</span>}
                            {data["shipping_province"] && <span>{data["shipping_province"]}</span>}
                        </div>
                    </div>
                    <div
                      className='pad-x-1 grd jsc' 
                      style={{background: paymentHighlight === data['payment_id'] && 'var(--yellow)'}}>{getPaymentOptions(data['payment_id'])}</div>
                    <span className='sublabel'>
                       {moment(data['updated_at']).format('YYYY-MM-DD HH:mm:ss')}
                    </span>
              { data.status === 9 || data.status === '9' ? <div
                className='grd grd-col grd-gp-1'
                ref={myref}
                tabIndex='0'>
                  <Button
                    css='space-no-wrap'
                    onClick={() => setDispatchOrderDelivered(data)}
                    color='success'>Tag as Delivered</Button>
                  <Button
                    css='space-no-wrap' 
                    color='warning' 
                    onClick={() => {
                    setSelectedItem({
                      reason: '',
                      dispatch_job_detail_id: data.dispatch_job_detail_id
                    });
                    setModal({undelivered: true})
                  }}>Tag as UnDelivered</Button>
                {data.job_item_type === 'cash pickup' && data.shopify_payment_gateway === 'Cash pick-up from sender' ?
                <Button
                  css='space-no-wrap'
                  onClick={() => setDispatchOrderCancelled(data)}
                  color='black'>Cancel</Button>
                  : "" }
              </div>
                : <div className="status">
                    <OrderStatusLabel  orderStatus={data.status}/>
                </div>
              }
            </TableRow>
            {modal.undelivered &&
                <ModalHoldMobile
                    width='auto'
                    backheight='auto'
                    clickClose={() => { setModal({...modal, undelivered: false}); setSelectedItem({ reason: '', dispatch_job_detail_id: 0});}}
                    clickBack={() => { setModal({...modal, undelivered: false}); setSelectedItem({ reason: '', dispatch_job_detail_id: 0});}}
                    label='Undeliver item'
                >
                    <div className='grd grd-gp-1'>
                        <span className='header-3'>Reason</span>
                        <div className='grd grd-gp-2' style={{gridTemplateColumns: '1fr 1fr'}}>
                            {
                              undelivered.map((value, key) => {
                                return <Button
                                key={key}
                                css='pad-1'
                                color='warning'
                                onClick={() => handleReason(value)}
                                >
                                  {value}
                                </Button>
                              })
                            }
                        </div>
                    </div>
                </ModalHoldMobile>
            }
            {modal.confirm &&
              <ConfirmationModal
                  mobile={true}
                  label='Are you sure you want to tag as undelivered this item ?'
                  submitlabel='Yes, tag as undelivered'
                  submitcolor='warning'
                  body={
                    <span className='sublabel jsc'>{`Reason:  ${selectedItem.reason}`}</span>
                  }
                  clickSubmit={() => {
                      if(selectedItem.reason.length){
                        setDispatchOrderUnDelivered(selectedItem);
                        setModal({undelivered: false, close: false, confirm: false})
                      }else{
                          toast.warn('Please enter reason');
                      }
                  }}
                  clickCancel={() => setModal({...modal, confirm: false})}
              />
            }

        </>
    );
};

export default QueueJobItem;