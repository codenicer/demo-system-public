import React, { useState, useRef } from 'react';
import OrderID from '../../../../molecules/OrderID/OrderID';
import Batch from '../../../../atoms/Batch/Batch';
import IconButton from '../../../../atoms/IconButton/IconButton';
import TableRow from '../../../../atoms/TableRow/TableRow';
import Modal from '../../../../template/Modal/Modal';
import Dropdown from '../../../../atoms/Dropdown/Dropdown';
import Checkbox from '../../../../atoms/Checkbox/Checkbox';
import Customer from '../../../../atoms/Customer/Customer';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const QueueJobItem = ({css, data, onRemove, paymentHighlight, hubs, payment_methods}) => {
    let type =  1;
    const [modal, setModal] = useState({undelivered: false, close: false,});
    const [dropdown, setDropdown] = useState(false);
    const myref = useRef();

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
    return (
        <>
            <TableRow
                    css={`${css} jic`}

                > 
                    <OrderID orderid={data['order_id']}>{data.job_item_type === 'delivery' ? data.shopify_order_name : `${data.shopify_order_name}-CPU`}</OrderID>
                    <span>{data['job_item_type']}</span>
                    <span style={{textAlign: 'center'}}>{data['job_item_type'] === 'delivery'? data['item'] :data['item']}</span>
                    <div className='grd grd-gp-1 aic jic'>
                        <div>{data['delivery_date']}</div>
                        <Batch batch={data['delivery_time']}/>
                    </div>
                        <span>{getHub(data['hub_id'])}</span>
                        <span>{getPaymentOptions(data['payment_id'])}</span>

                    <div className='grd jic space-no-wrap'>
                        <Customer id={data['order_id']} firstname="" lastname={data['shipping_name']}/>
                        <span>{data['phone']}</span>
                    </div>
                    <span className='sublabel'>
                        {data['shipping_address1']}
                        {data['shipping_address2']}
                        {data['shipping_city']}
                        {data['shipping_province']}
                    </span>
                    
                    <div
                        ref={myref}
                        tabIndex='0'
                        onBlur={() => setDropdown(false)} 
                        className='relative'>
                        {type === 'assigned' ? 
                            <>
                                <i 
                                    className='fas fa-ellipsis-h point'
                                    onClick={() => {setDropdown(!dropdown); myref.current.focus()}}
                                    style={{fontSize: '20px'}}
                                    ></i>
                                {dropdown &&
                                    <Dropdown>
                                        <span 
                                            onClick={() => {setModal({...modal, close: true}); setDropdown(false)}}
                                            className='point'>Close</span>
                                        <span 
                                            onClick={() => {setModal({...modal, undelivered: true}); setDropdown(false)}}
                                            className='point'>Undelivered</span>
                                        <span className='point'>Delivered</span>
                                    </Dropdown>
                                }
                            </>
                            :
                            <IconButton
                            icon={ faTimes }
                            color='#F86C6B'
                            size='18px'
                            onClick={() => onRemove(data.dispatch_job_detail_id)}/>
                        }
                    </div>
            </TableRow>
            {modal.undelivered &&
                <Modal
                    width='400px'
                    clickClose={() => setModal({...modal, undelivered: false})}
                    clickCancel={() => setModal({...modal, undelivered: false})}
                    clickSubmit={() => alert('click submit props on modal')}
                    label='Undeliver item'
                >
                    <div className='grd grd-gp-1'>
                        <span className='label'>Reason</span>
                        <textarea
                            className='br-2 pad-1'
                            rows='7'
                        ></textarea>
                        <Checkbox
                            color='secondary' 
                            label='Send to redispatch'
                            checked={true}
                            />
                    </div>   
                </Modal>
            }
            {modal.close &&
                <Modal
                    width='400px'
                    clickClose={() => setModal({...modal, close: false})}
                    clickCancel={() => setModal({...modal, close: false})}
                    clickSubmit={() => alert('click submit props on modal')}
                    label='Close Item'
                >
                    <div className='grd grd-gp-1'>
                        <span className='label'>Reason</span>
                        <textarea
                            className='br-2 pad-1'
                            rows='7'
                        ></textarea>
                    </div>   
                </Modal>
            }
        </>
    );
};

export default QueueJobItem;