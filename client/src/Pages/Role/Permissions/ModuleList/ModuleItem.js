import React, { useState, useRef } from 'react';
import OrderID from '../../../../molecules/OrderID/OrderID';
import Batch from '../../../../atoms/Batch/Batch';
import IconButton from '../../../../atoms/IconButton/IconButton';
import TableRow from '../../../../atoms/TableRow/TableRow';
import Modal from '../../../../template/Modal/Modal';
import Button from '../../../../atoms/Button/Button';
import Dropdown from '../../../../atoms/Dropdown/Dropdown';
import Checkbox from '../../../../atoms/Checkbox/Checkbox';
import OrderStatusLabel from '../../../../atoms/OrderStatus/OrderStatusLabel';
import {toast} from 'react-toastify';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");;

const QueueJobItem = ({data, setDispatchOrderDelivered, setDispatchOrderUnDelivered}) => {
    let type =  1;

    const [modal, setModal] = useState({undelivered: false, close: false,});
    const [selectedItem, setSelectedItem] = useState({
        reason: '',
        dispatch_job_detail_id: 0
    });
    const myref = useRef(myref);


    function handleReason(event){
      const target = event.target;
      setSelectedItem({ ...selectedItem, [target.name]: target.value });
    }
    return (
        <>
            <TableRow
                    css='dispatch_for_delivery_table-template pad-y-1'
                    height='auto'
                > 
                    <OrderID>{data.shopify_order_name}</OrderID>
                    <span>{data['jobtype']}</span>
                    <span>{data['quantity']}</span>
                    <span>{data['jobtype'] === 'delivery'? data['title'] :data['total']}</span>
                    <div className='grd grd-gp-1 jss'>
                        <div>{data['delivery_date']}</div>
                        <Batch batch={data['delivery_time']}/>
                    </div>
                    <div className='grd grd-gp-1'>
                      <span className='label'>{data['name']}</span>
                      <span className='sublabel emp'>({data['phone']})</span>
                    </div>
                    <div className='grd'>
                      {data['address1'] && <span>{data['address1']}</span>}
                      {data['address2'] && <span>{data['address2']}</span>}
                      {data['city'] && <span>{data['city']}</span>}
                      {data['province'] && <span>{data['province']}</span>}
                      {data['country'] && <span>{data['country']}</span>}
                    </div>
                    <span className='updated_at'>
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
                      dispatch_job_detail_id: data.view_dispatch_job_detail_id
                    });
                    setModal({undelivered: true})
                  }}>Tag as UnDelivered</Button>
              </div>
                : <div className="status">
                    <OrderStatusLabel  orderStatus={data.status}/>
                </div>
              }
            </TableRow>
            {modal.undelivered &&
                <Modal
                    width='400px'
                    //clickClose={() => { setModal({...modal, undelivered: false}); setSelectedItem({ reason: '', dispatch_job_detail_id: 0});}}
                    clickCancel={() => { setModal({...modal, undelivered: false}); setSelectedItem({ reason: '', dispatch_job_detail_id: 0});}}
                    clickSubmit={() => {

                         if(selectedItem.reason.length){
                           setDispatchOrderUnDelivered(selectedItem);
                           setModal({undelivered: false})
                         }else{
                             toast.warn('Please enter reason');
                         }


                    }}
                    label='Undeliver item'
                >
                    <div className='grd grd-gp-1'>
                        <span className='label'>Reason</span>
                        <textarea
                            className='br-2 pad-1'
                            rows='7'
                            name='reason'
                            id='reason'

                            value={selectedItem.reason? selectedItem.reason : ''}
                            onChange={handleReason}
                        ></textarea>

                    </div>   
                </Modal>
            }

        </>
    );
};

export default QueueJobItem;