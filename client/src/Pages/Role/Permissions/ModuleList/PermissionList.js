import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import _ from 'lodash';

//components
import ModuleList from './ModuleList'
import Container from '../../../../atoms/Container/Container'

//action
import {fetchRoleInfo, setRolePermissions, getModuleItems} from '../../../../scripts/actions/roleActions';
import Button from '../../../../atoms/Button/Button'


const PermissionList = (props) => {

    let role_id;

    const { fetchRoleInfo,setRolePermissions, getModuleItems  } = props;
    const { roleData:{role_info, module_items} } = props;

    const [tableData, setTableData ] = useState([]);
    const [roleInfo, setRoleInfo ] = useState([]);
    const [roleName, setRoleName ] = useState('');
    const [selectedModuleItem, setSelectedModuleItem ] = useState(null);

    function fetchData(){
      //console.log.log('fetching');
      fetchRoleInfo(role_id);
    }
    useEffect(() => {
      role_id = parseInt(props.match.params.role_id);
      //console.log(role_id);
      getModuleItems()
      fetchData();

    }, [] );

    useEffect(() => {
            setTableData(module_items);
    }, [module_items] );

    useEffect(() => {
        if(roleInfo.length){
          const options = _.map(roleInfo[0].module_items, (rec, i)=> { return rec.module_item_id});
          setSelectedModuleItem(options);
          setRoleName(roleInfo[0].title);
        }



    }, [roleInfo] );

    useEffect(() => {
      //console.log.log('got role info');
      setRoleInfo(role_info);
      //console.log.log('role_info', role_info);
    }, [role_info] );





  function toggleCheckbox(event) {

    const options = selectedModuleItem;

    if(event.target.checked){
      options.push(parseInt(event.target.value))
    }
    else{
      const index=options.indexOf(parseInt(event.target.value))
      options.splice(index,1)
    }
    setSelectedModuleItem(options);
    //console.log.log(options);

  }

  function onHandleSubmit(){
    if(!setSelectedModuleItem.length){
      toast.error('Please select Module permission(s).');
    }else{
      if(window.confirm(`You are about to set permission(s) to the role:${roleName}. Click OK to proceed`)){

        const params = {
          role_module_item_id: selectedModuleItem,
          role_id:parseInt(props.match.params.role_id)

        }


        setRolePermissions(params, (msg)=>{
          fetchData();
          toast.success(msg, {
            onClose: ()=>{props.history.push('/system/role/list');},
            pauseOnHover: false,
            autoClose: 500,
          });

        });

      }
    }
  }
    
    return (
        <Container
            css='grd grd-gp-2 gtr-af pad-1 slideInRight animate-1 relative over-hid'
        >  
            <span className='header'>Role Permissions: { roleName } </span>
          <Button color="success" css="jse" onClick={onHandleSubmit}>Set Permissions</Button>
            <Button type="button" css="jse" color="danger" onClick={()=> props.history.push('/system/role/list')} >

            Back

        </Button>
          <div className='over-hid over-y-auto scroll pad-1' >
          <form name="permissions" id="permissions"  >





                {
                    tableData.length  && selectedModuleItem !== null ?
                  tableData.map((record, key) => {
                      //console.log.log(record);
                      return   <ModuleList key={key} data={record} toggleCheckbox={toggleCheckbox} handleSubmit={onHandleSubmit} moduleItems={selectedModuleItem}  />

                    })
                    : <div>No Records Found</div>


                }


          </form>
            </div>


        </Container>
    );
};

const mapStatetoProps = state => ({
    roleData:state.roleData,
    isfetching:state.webFetchData.isFetching
});

export default connect(mapStatetoProps,{fetchRoleInfo,setRolePermissions, getModuleItems})(PermissionList);

