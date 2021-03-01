import React, { useState } from 'react';
import TableRow from '../../../atoms/TableRow/TableRow';
import IconButton from '../../../atoms/IconButton/IconButton';
import Modal from '../../../template/Modal/Modal';
import Input from '../../../atoms/Input/Input';
import Select from '../../../atoms/Select/Select';
import { toast } from 'react-toastify';
import {connect} from 'react-redux'
import {updateHub} from '../../../scripts/actions/hubActions'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import 'react-toastify/dist/ReactToastify.css';
const selectData = ['Active', 'Inactive'];
toast.configure()
 
const HubRow = (props) => {

    

    const {updateHub} = props
    const { data } = props;
    const [ state, setState ] = useState(false);
    const [form ,setForm] = useState({
        hub_name:null,
        address:null,
        status:null,
        hub_id:null,
    })

    const handleOnclick =() =>{
        setForm({
            hub_name:data['name'],
            address:data['address'],
            status:data['status'][0].toUpperCase()+ data['status'].slice(1,data['status'].length) ,
            hub_id:data['hub_id'],
        })
        setState(true)
    }

    const handleOnChange  = (key,value) =>{
        if(value.trimStart().length)value = value.trimStart()
        let val = ""
        if(value.length > 0) val = value[0].toUpperCase() + value.slice(1,value.length) 
        setForm({
            ...form,
            [key]:val
        })
    }

    const handleSubmit = () =>{
        const {hub_name} = form
        if(hub_name.replace(/\s/g,'').length < 1){
            toast.error("Invalid Information");
        }else{
            let filteredForm = form
            filteredForm = {
                ...filteredForm,
                status: filteredForm['status'] === "Active" ? 1 : 0
            }
          
            updateHub(filteredForm,(type,text)=>{
                setState(false)
                toast[type](text)
            })
        }
    }

    
    return (
        <>
            <TableRow css='jic grd-col grd-col-f aic'>
                <div>{data['hub_id']}</div>
                <div>{data['name']}</div>
                <div style={{textAlign: 'center'}}>{data['address']}</div>
                <div>{data['status']}</div>
                <IconButton 
                    tooltip
                    icon={faEdit}
                    size='20px' 
                    label='Edit Hub'
                    onClick={handleOnclick}
                    />
            </TableRow>
            {state &&
                <Modal
                    width='350px'
                    clickClose={() => setState(false)}
                    clickCancel={() => setState(false)}
                    clickSubmit = {handleSubmit}
                    label='Edit Hub'
                >
                    <span className='subheader'>Name</span>
                    <Input 
                        onChange={(e)=>handleOnChange('hub_name',e.target.value)}
                        value={form['hub_name']}
                        css='pad-1' />
                    <span className='subheader'>Address</span>
                    <Input 
                         onChange={(e)=>handleOnChange('address',e.target.value)}
                        value={form['address']}
                        css='pad-1' />
                    <span className='subheader'>Status</span>
                    <Select 
                            onChange={(e)=>handleOnChange('status',e.target.value)}
                        value={form['status']}
                        css='pad-1'>
                        {
                            selectData.map((x, y) => {
                                return <option key={y}>{x}</option>
                            })
                        }
                    </Select>
                </Modal>
            }
        </>
    );
};


export default connect(null ,{updateHub})(HubRow);  

