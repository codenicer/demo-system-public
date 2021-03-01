import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux';
import Container from '../../../atoms/Container/Container';
import Paper from '../../../atoms/Paper/Paper';
import Input from '../../../atoms/Input/Input';
import Checkbox from '../../../atoms/Checkbox/Checkbox';
import {toast} from 'react-toastify';
import Select from 'react-select';
import './CreateRole.css'

import {handleLoadHubs} from '../../../scripts/actions/hubActions';
import { createRole} from '../../../scripts/actions/roleActions';
import Button from '../../../atoms/Button/Button';



const DefaultModuleItem = [
  {label:'Open Orders', value: 1},
  {label:'Florist Queue', value: 4},
  {label:'Dispatch Job', value: 12},
  {label:'Ticket', value: 8},

];


const CreateRole = (props) => {

  const { handleLoadHubs, createRole } = props;
  const { hubData:{hubs} } = props;

  const [ hubList, setHubList ] = useState([]);
  const [ selectedHub, setSelectedHub ] = useState([]);
  const [ roleForm, setRoleForm ] = useState({
    title:'',
    description:'',
    default_module_item_id:0
  });


  function handleChange(event){
    setRoleForm({...roleForm, [event.target.name]:event.target.value});
  }
  function handleSelectChange(input){
    if(!input){
      setRoleForm({...roleForm, default_module_item_id:0});
    }else{
      setRoleForm({...roleForm, default_module_item_id:input.value});
    }

  }
  function fetchData(){
    handleLoadHubs();
  }

  function handleSubmit(event){
    event.preventDefault();

    if(!roleForm.title.length){
      toast.error('Please enter role name.');

      return false;
    }
    if(!roleForm.description.length){
      toast.error('Please enter role description.');
      return false;
    }
    if(!roleForm.default_module_item_id){
      toast.error('Please select Module item.');
      return false;
    }

    if(!selectedHub.length){
      toast.error('Please select appropriate hub(s).');
      return false;
    }


    if(window.confirm('You are about to create a role. Click OK to proceed')){

      const params = {
        formData: roleForm,
        hubs: selectedHub,

      }


      createRole(params, (msg)=>{

        toast.success(msg, {
          onClose: ()=>{props.history.push('/system/role/list');},
          pauseOnHover: false,
          autoClose: 500,
        });

      });

    }



    return false;


  }

  function toggleCheckbox(event) {

    const options = selectedHub;

    if(event.target.checked){
      options.push(event.target.value)
    }
    else{
      const index=options.indexOf(event.target.value)
      options.splice(index,1)
    }
    setSelectedHub(options);

  }

  useEffect (() => {
    fetchData();


  },[]);

  useEffect (() => {
    setHubList(hubs);
  },[hubs]);


  return (
    <Container
      css='pad-1 grd grd-gp-1 gtr-af over-hid'
    >
      <span className='header'>Create Role</span>
      <Paper
        css='grd grd-gp-1 create_user-wrap over-hid over-hid over-y-auto scroll'
      >
        <form name="frmRole" onSubmit={handleSubmit} >
          <div className='grd grd-gp-1 pad-2'>
            <span className='label' >Role Name:</span>
            <Input
              type='text'
              name = 'title'
              id ='title'
              value={ roleForm ? roleForm.title : ''}
              onChange={handleChange}
            />
            <span className='label' >Description:</span>
            <Input
              type='textarea'
              name = 'description'
              id ='description'
              value={ roleForm ? roleForm.description : ''}
              onChange={handleChange}
            />

          <span className='label' >Default Module Item:</span>
                <Select options={DefaultModuleItem}
                        value={ roleForm ? roleForm.default_module_item_id : 0}
                        onChange={handleSelectChange}
                />

          </div>
          <div className='grd hub-wrap over-hid'>
            <span className='header-3'>Hubs:</span>



            { hubList.length
              ?
              <div
                className='grd pad-3 grd-gp-3 scroll over-y-auto'
                style={{gridTemplateColumns: '1fr 1fr'}}
              >
                {
                  hubList.map((record, key) => {
                    return   <Checkbox key={key} data={record} label={record.name} value={record.hub_id} name="hubs[]" onChange={toggleCheckbox} />

                  })

                }
              </div>

              : <div>No Records Found</div>
            }




          </div>
          <div>
            <Button type="submit" color="success">

              SUBMIT

            </Button>&nbsp;<Button type="button" color="danger" onClick={()=> props.history.push('/system/role/list')} >

            CANCEL

          </Button>
          </div>
        </form>



      </Paper>
    </Container>
  )
}


const mapStatetoProps = state => ({
  hubData:state.hubData,
  roleData:state.roleData,
  isfetching:state.webFetchData.isFetching
});

export default connect(mapStatetoProps,{handleLoadHubs, createRole})(CreateRole);