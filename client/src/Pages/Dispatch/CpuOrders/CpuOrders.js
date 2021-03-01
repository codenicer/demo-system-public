import React, { useState, useEffect } from 'react';
import CpuJobHeader from './components/CpuJobHeader';
import CpuJobRow from './components/CpuJobRow';
import Container from './../../../atoms/Container/Container';
import Input from './../../../atoms/Input/Input';
import Select from 'react-select';

//config
import filter_config from '../../../config.json'

//actions
import { connect } from 'react-redux';
import { fetchJobsForCpuDone, setDispatchJobDetailStatus } from './../../../scripts/actions/dispatchActions';
import moment from 'moment-timezone';

//package
import Pagination from '../../../atoms/Pagination/Pagination';
import Error from '../../../atoms/Error/Error';

//aesthetics
import './CpuOrder.css'
import { toast } from 'react-toastify';

moment.tz.setDefault("Asia/Manila");
const DispatchJobList = (props) => {
  //=======VARIABLE======
  //=======VARIABLE======

  //destrute from config file
  const { deliverytime } = filter_config;

  //variable for timer
  let timer;

  //========PROPS=======
  //========PROPS=======

  // redux props
  const { cpuOrders, fetchJobsForCpuDone, userhubs, setDispatchJobDetailStatus } = props;

  //============STATE============
  //============STATE============

  //state for params
  const [ params, setParams ] = useState(() => ({
    page:1,
    pageSize: 30, //by default
    filterall:'',
    shopify_order_name:'',
    deliver_time:'',
    delivery_date:moment().format('YYYY-MM-DD')
  }));


  //======FUNCTIONS=======
  //======FUNCTIONS=======

  const PageClick = (x) => {
    let retpage = x();
    setParams({
        ...params,
        page: retpage});
  }  

  //filter only the redux state
  const filterHandler = search => {
    console.log('filterHandler')
    if(search.indexOf('-CPU') > -1){
      //remove -CPU on input
      search = search.slice(0, search.indexOf('-CPU'))
    }

    setParams({
      ...params,
      shopify_order_name: search
    })
  }

  //const filter timer
  const filterTimer = (search) => {
    clearTimeout(timer)

    timer = setTimeout(() => filterHandler(search), 2000)
  }

  //set dispatch job into delivered / undelivered
  //the fetch after
  const cpuHandler = (args) => {
    setDispatchJobDetailStatus(args, (msg) => {
      fetchJobsForCpuDone(params)
      toast.success(msg)
    })
  }

  //==========USE EFFECT==========
  //==========USE EFFECT==========

  // initialize and remove socket on mount and unmout of component
  // saving row_assignment.cities into state
  useEffect(() => {
    // socket.on('FORASSIGNMENT_DID_UPDATE', socketForAssignment)
    // // socket.on('RIDERS_DID_UPDATE', socketForRider);


    return () => {
      // socket.off('FORASSIGNMENT_DID_UPDATE', socketForAssignment)
      // socket.off('RIDERS_DID_UPDATE', socketForRider)
      clearTimeout(timer)
    }
  }, []);


  //get the user hubs and set as filter(hub_id) on fetch
  useEffect(() => {
    if(userhubs){
        let arrOfHubs = userhubs.map(hub => hub.user_hub.hub_id)
        setParams({...params, hub_id: arrOfHubs})
    }
  }, [userhubs])

  //fetch data when params change
  //wait for params hub filter to have a value
  useEffect(()=>{
    if(params.hasOwnProperty('hub_id')){
      fetchJobsForCpuDone(params);
    }
  }, [params]);

  return (
    <Container css='grd grd-gp-1 gtr-af slideInRight animate-2 '>
      <div>
        <div className='header pad-y-1 space-no-wrap'>CPU Orders</div>
        <div
          style={{gridTemplateColumns: `repeat(3, 1fr) auto`}}
          className='grd grd-gp-1'>
          <Input
            css='pad-1'
            name="search"
            type='search'
            label='Filter...'
            onChange={e => filterTimer(e.target.value)}
          />
          <Input
            value={params.delivery_date}
            onChange={event => setParams({
              ...params,
              [event.target.name]: event.target.value,
              page:1
            })}
            name="delivery_date"
            css='pad-1'
            type='date'
            label='Delivery Date' />
          <Select
            value={params.delivery_time}
            name="delivery_time"
            placeholder='Delivery time'
            options = {
              deliverytime.map((rec, key) => {
                return {value: rec.id, label: rec.id}
              })
            }
            onChange={e => setParams({
              ...params,
              delivery_time: e ? e.value : ''
            })}
          />
        </div>
      </div>
      <div className='over-y-auto scroll relative'>
        <CpuJobHeader css='cpu_orders-template' />
        {cpuOrders.rows.length > 0 ?
          cpuOrders.rows.map(order => {
            return <CpuJobRow
              css='cpu_orders-template'
              hub={userhubs.find(hub => hub.user_hub.hub_id === order.job_rider.hub_id)}
              key={order.dispatch_job_detail_id}
              cpuHandler={cpuHandler}
              data={order}
            />
          })
          :
          <Error  label='No Records Found'/>
        }
      </div>
      {cpuOrders.count &&
        <Pagination
          selPage={params.page}
          pageClick={PageClick}
          count={cpuOrders.count}
          rows={params.pageSize}
        />
      }
    </Container>
  );
};

const mapStatetoProps = state => ({
  cpuOrders: state.dispatchData.cpu_orders,
  userhubs: state.authData.user.user_info.hubs
});

export default connect(mapStatetoProps,
  {
    fetchJobsForCpuDone,
    setDispatchJobDetailStatus
  }
)(DispatchJobList);

