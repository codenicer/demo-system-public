import React, { useState } from 'react';
import Button from '../../../atoms/Button/Button';
import Modal from '../../../template/Modal/Modal';
import Input from '../../../atoms/Input/Input';
import {connect} from 'react-redux'
import {addHub} from '../../../scripts/actions/hubActions';
import {toast} from 'react-toastify';

const HubCaption = (props) => {
    const [ state, setState ] = useState(false);
    const {addHub} = props
    const [form ,setForm] = useState({
        hub_name:"",
        address:""
    })

    const handleOnChange  = (key,value) =>{
        if(value.trimStart().length)value = value.trimStart()
        let val = ""
        if(value.length > 0) val = value[0].toUpperCase() + value.slice(1,value.length) 
        setForm({
            ...form,
            [key]:val
        })
    }
    const handleFormRest = () =>{
        setForm({
            hub_name:"",
            address:""
        })
    }
    const handleFormClose = () =>{
        handleFormRest()
        setState(false)
    }
    const handelSubmit = () =>{
        const {hub_name,address} =form
        if(hub_name.replace(/\s/g,'').length < 1 || address.replace(/\s/g,'').length < 1 ){
            toast.error("Invalid information");
        }else{
            addHub(form,(msg)=>{
                toast.success(msg);
                handleFormClose()
            }) 
        }
    }

    return (
        <>
            <div className='grd grd-gp-2 pad-1' style={{gridTemplateColumns: 'auto auto 1fr'}}>
                <span className='header'>Hub</span>
                <Button css='jss' color='secondary' onClick={() => setState(true) }>Create Hub</Button>
            </div>
            {state &&
              <Modal 
                width='300px'
                clickClose={() =>handleFormClose()}
                clickCancel={() =>handleFormClose()}
                clickSubmit ={handelSubmit}
                label='Create Hub'
                >
                <span className='subheader'>Name</span>
                <Input 
                   onChange={(e)=>handleOnChange('hub_name',e.target.value)}
                   value = {form['hub_name']}
                   css='pad-1' />
                <span className='subheader'>Address</span>
                <Input
                   onChange={(e)=>handleOnChange('address',e.target.value)}
                   value = {form['address']}
                   css='pad-1' />
              </Modal>       
            }
        </>
    );
};

export default connect(null,{addHub})(HubCaption)