import React, { useEffect, useState } from 'react';
import EditableData from '../../../../../../atoms/EditableData/EditableData';
import OrderStatusLabel from "../../../../../../atoms/OrderStatus/OrderStatusLabel";
import Input from '../../../../../../atoms/Input/Input';
import config from '../../../../../../config.json';
import moment from 'moment-timezone'
import Select from '../../../../../../atoms/Select/Select';
import Batch from '../../../../../../atoms/Batch/Batch';
import {connect} from 'react-redux'
moment.tz.setDefault("Asia/Manila");

const OrderCPUDetails = (props) => {
    //========PROPS===========
    //========PROPS===========

    // props from redux
    const { hubs:{hubs} } = props

    // pass down props
    const { data, cpuDate, cpuTime, cpuHub, cpuDateClick, cpuTimeClick, cpuHubClick, setCPUInfo } = props;

    //destructure from config.json
    const { deliverytime } = config;

    //destructure the pass down data
    const { target_pickup_date, target_pickup_time, hub_id, status } = data.job_riders[0];

    //===========STATE=============
    //===========STATE=============

    //state for hubname
    const [ hubname, setHubname ] = useState();

    //==========USE EFFECT=========
    //==========USE EFFECT=========

    //change hubname when hubs change or data change
    useEffect(() => {
        hubHandler(hub_id)
    }, [hubs, data])

    //==========FUNCTIION===========
    //==========FUNCTIION===========

    const hubHandler = (id) => {
        if(id === null){
            setHubname('No Hub')
        } else {
            let arr = [...hubs];
            let result = arr.findIndex((ar => ar.hub_id === id))
            if(result !== -1 ){setHubname(arr[result].name);}
        }
    }
    
    return (
        <div className='grd grd-gp-1 gtc-af aic size-100' style={{gridTemplateRows: 'min-content auto auto', gridTemplateColumns: 'auto 1fr auto 1fr'}}>
            <div className='header-3' style={{gridColumn: '1 / -1'}}>CPU Payment Details</div>
            <span className='sublabel space-no-wrap'>CPU Status:</span>
            <OrderStatusLabel orderStatus={status} />
            <span className='sublabel space-no-wrap'>Pick-up date:</span>
            <EditableData
                edit={cpuDate}
                onClick={cpuDateClick}
            >
                {cpuDate ?
                    <Input type='date' label='Pick-up date' onChange={ e =>  setCPUInfo(e.target.value, 'target_pickup_date')}/>
                    :
                    <span>{data.job_riders && moment(target_pickup_date).format('MMM. DD, YYYY')}</span>
                }
            </EditableData>
            <span className='sublabel space-no-wrap'>Pick-up time:</span>
            <EditableData
                edit={cpuTime}
                onClick={cpuTimeClick}
            >
                {cpuTime ?
                    <Select value={target_pickup_time ? target_pickup_time : 'label'} onChange={e => {console.log(e.target.value); setCPUInfo(e.target.value, 'target_pickup_time')}}>
                        <option style={{display: 'none'}} value='label'>--Select Time--</option>
                        {
                            deliverytime.map((value) => {
                                return <option key={value.id}>{value.id}</option>
                            })
                        }
                    </Select>
                    :
                    <Batch css='jss' batch={target_pickup_time} />
                }
            </EditableData>
            <span className='sublabel space-no-wrap'>Pick-up hub:</span>
            <EditableData
                edit={cpuHub}
                onClick={cpuHubClick}
            >
                {cpuHub ?
                    <Select
                        defaultValue={hubname} 
                        onChange={(e) => setCPUInfo(Number(e.target.value), 'hub_id')}>
                        <option style={{display: 'none'}} value={hubname}>{hubname}</option>
                        {
                            hubs.map((value) => {
                                return <option key={value.hub_id} value={value.hub_id}>{value.name}</option>
                            })
                        }
                    </Select>
                    :
                     <span>{hubname}</span>
                }
            </EditableData>
        </div>
    )
}

const transferStatetoProps = state => ({
    hubs:state.hubData,
})

export default connect(transferStatetoProps)(OrderCPUDetails);
