import React, { useState, useEffect } from 'react'
import Button from '../../../atoms/Button/Button';
import Modal from '../../../template/Modal/Modal';
import config from './config.json';
import Checkbox from '../../../atoms/Checkbox/Checkbox';

const FilterTable = (props) => {
    //config
    const { delivery_time, statuses: statuses_config, payment: payment_config } = config;


    //============STATE=============
    //============STATE=============

    // state fpr showing the modal for filtering the table
    const [ show, setShow ] = useState(false);

    // copy deliverytime props into state
    const [ delTimeState, setDelTimeState ] = useState([]);

    // copy statuses props into state
    const [ statusesState, setStatusesState ] = useState([]);

    // copy payment props into state
    const [ paymentState, setPaymentState ] = useState([]);

    //=============PROPS============
    //=============PROPS============
    
    //pass down props
    const { deliveryTime, category, statuses, setDeliveryTime, setStatuses, payment, setPayment } = props;

    //=========USE EFFECT==========
    //=========USE EFFECT==========

    // save the props into state
    useEffect(() => {
        setDelTimeState([...deliveryTime]);
        setStatusesState([...statuses]);
        setPaymentState([...payment])
    }, [])

    //============FUNCTIONS============
    //============FUNCTIONS============
    
    //checkbox checkhandler
    const checkboxHandler = (value, array, setArray) => {
        const find = array.findIndex(data => data === value);
        let arr = [...array];
        if(find === -1){
            arr.push(value);
            setArray(arr);
        } else {
            arr.splice(find, 1);
            setArray(arr)
        }
    }

    return (
        <>
            <Button
                css='jse'
                onClick={() => setShow(true)}
                color='primary'
            >Filter Table</Button>
            {
                show && 
                <Modal
                    width='400px'
                    clickClose={() => setShow(false)}
                    clickCancel={() => setShow(false)}
                    label='Filter Table'
                    submitlabel='Apply filter'
                    clickSubmit={() => {setDeliveryTime(delTimeState); setStatuses(statusesState); setPayment(paymentState); setShow(false)}}
                >
                    {category === 'payment' ?
                        <>
                            <span className='header-3 sublabel'>Delivery Time</span>
                            <div
                                style={{gridTemplateColumns: '1fr 1fr'}} 
                                className='grd grd-gp-1'>
                                {
                                    payment_config.map((payment, key) => {
                                        return <Checkbox
                                            color='primary'
                                            key={key} 
                                            label={payment.name}
                                            checked={!paymentState.includes(payment.id)}
                                            onChange={() => checkboxHandler(payment.id, paymentState, setPaymentState)}
                                            />
                                    } )
                                }
                            </div>
                        </>
                        :
                        <>
                            <span className='header-3 sublabel'>Delivery Time</span>
                            <div
                                style={{gridTemplateColumns: '1fr 1fr'}} 
                                className='grd grd-gp-1'>
                                {
                                    delivery_time.map((time, key) => {
                                        return <Checkbox
                                            color='primary'
                                            key={key} 
                                            label={time}
                                            checked={!delTimeState.includes(time)}
                                            onChange={() => checkboxHandler(time, delTimeState, setDelTimeState)}
                                            />
                                    } )
                                }
                            </div>
                        </>
                    }
                    <span className='header-3 sublabel'>Statuses</span>
                    <div
                        style={{gridTemplateColumns: '1fr 1fr'}} 
                        className='grd grd-gp-1'>
                    {
                        statuses_config.map((status, key) => {
                            return <Checkbox
                                color='primary'
                                key={key}
                                label={status.label}
                                checked={!statusesState.includes(status.value)}
                                onChange={() => checkboxHandler(status.value, statusesState, setStatusesState)}
                            />
                        })
                    }
                    </div>
                </Modal>
            }
        </>
    )
}

export default FilterTable
