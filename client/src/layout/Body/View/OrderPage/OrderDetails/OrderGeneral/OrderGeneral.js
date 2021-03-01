import React, { useState, useEffect } from 'react';
import EditableData from '../../../../../../atoms/EditableData/EditableData';
import Input from '../../../../../../atoms/Input/Input';
import Select from '../../../../../../atoms/Select/Select';
import Batch from '../../../../../../atoms/Batch/Batch';
import option_config from '../../../../../../config.json';
import moment from 'moment-timezone'
import {connect} from 'react-redux'
import {handleLoadHubs} from '../../../../../../scripts/actions/hubActions';

moment.tz.setDefault("Asia/Manila");
const OrderGeneral = (props) => {
    //=========STATE===========
    //=========STATE===========

    // state for hubname label
    const [ hubname, setHubname ] = useState();


    //========PROPS============
    //========PROPS============

    // pass down props
    const {data, date, time, dateClick, timeClick, hub, hubClick, setInfo, paymentmethod, paymentmethodClick} = props;

    // props for redux
    const {hubs:{hubs}, handleLoadHubs} = props;

    // destructure from config
    const {deliverytime, paymentMethod} = option_config;

    //=======USE EFFECT=======
    //=======USE EFFECT=======


    // load hubs on did mount
    useEffect(()=>{
        handleLoadHubs();
    }, []);

    // change hubname state when hubs or data change
    useEffect(() => {
        hubHandler(data['hub_id'])
    }, [hubs, data])

    //=======FUNCTIONS========
    //=======FUNCTIONS========

    //functions to check the hub name on hub redux
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
            <span className='header-3' style={{gridColumn: '1 / -1'}}>Order Details</span>
            <span className='sublabel space-no-wrap'>Delivery date :</span>
            <EditableData
                edit={date}
                onClick={dateClick}
            >
                {date ?
                    <Input label='Delivery Date' type='date' onChange={e => setInfo(e.target.value,'delivery_date')}/>
                    :
                    <span>{moment(data['delivery_date']).format('MMM. DD, YYYY')}</span>
                }
            </EditableData>
            <span className='sublabel'>Time :</span>
            <EditableData
                edit={time}
                onClick={timeClick}
            >
                {time ?
                    <Select value={data['delivery_time'] ? data['delivery_time'] : 'label'} onChange={(e) => setInfo(e.target.value,'delivery_time')} >
                        <option style={{display: 'none'}} value=''>--Select Time--</option>
                        {deliverytime &&
                            deliverytime.map((value, key) => {
                                return <option key={key}>{value.id}</option>
                            })
                        }
                    </Select>
                    :
                    <Batch css='jss' batch={data['delivery_time']} />
                }
            </EditableData>
            <span className='sublabel'>Hub :</span>
            <EditableData
                edit={hub}
                onClick={hubClick}
            >
                {hub ?
                    <Select 
                        defaultValue={hubname === 'No Hub' ? '--Select Hub' : hubname}
                        onChange={(e) => setInfo(JSON.parse(e.target.value),'hub_id')}>
                        <option style={{display: 'none'}} value=''>--Select Hub--</option>
                        {
                            hubs.map((value, key) => {
                                return <option key={value.hub_id} value={JSON.stringify(value)}>{value.name}</option>
                            })
                        }
                    </Select>
                    :
                     <span>{hubname}</span>
                }
            </EditableData>
            <span className='sublabel'>Payment Method :</span>
            <EditableData
                edit={paymentmethod}
                onClick={paymentmethodClick}
            >
                {
                     paymentmethod ?
                    <Select onChange={(e) => { setInfo(JSON.parse(e.target.value),'payment_id') }}>
                        {<option style={{display: 'none'}} selected>{data['payment_id'] ? data['payment']['name'] : '--Select Payment Method'}</option>}
                        {
                            paymentMethod.map((value) => {
                                return <option key={value.id} value={JSON.stringify({value:value.id,name:value.name})} name={value.name} >{value.name}</option>
                            })
                        }
                    </Select>
                    :
                      <span>{data['payment']['name']}</span>
                }
            </EditableData>
        </div>
    );
};

const transferStatetoProps = state => ({
    hubs:state.hubData
})

export default connect(transferStatetoProps,{handleLoadHubs})(OrderGeneral);