import React, { useState, useEffect } from 'react';
import DispatchJobHeader from './components/DispatchJobHeader';
import DispatchJobRow from './components/DispatchJobRow';
import Container from './../../../atoms/Container/Container';
import Input from './../../../atoms/Input/Input';
import HubFilter from '../../../organisms/HubFilter/HubFilter'
import Select from 'react-select';
import UseBarcode from './components/UseBarcode';
//config
import filter_config from '../../../config.json'

//actions
import { connect } from 'react-redux';
import { fetchJobsForAssignment, updateJobsForAssignment, removeJobsForAssignment, fetchNoteHistory, fetchOrderStatus } from './../../../scripts/actions/dispatchActions';
import moment from 'moment-timezone';

//package
import {toast} from 'react-toastify';

//aesthetics
import './DispatchJob.css';
import ProcessWrap from './components/ProcessWrap';


moment.tz.setDefault("Asia/Manila");
const DispatchJobList = (props) => {
  //=======VARIABLE======
  //=======VARIABLE======

  //destrute from config file
  const { deliverytime, paymentOptions } = filter_config;

  //variable for timer
  let timer;


  //========PROPS=======
  //========PROPS=======
  
  // redux props
  const { dispatchData:{for_assignment}, fetchJobsForAssignment, updateJobsForAssignment, removeJobsForAssignment,fetchNoteHistory } = props;

  //============STATE============
  //============STATE============

  // state to store the selected item job
  const [ selectedData, setSelectedData] = useState([]);

  //state to store barcode msg
  const [ barcodeMsg, setBarcodeMsg ] = useState({
    msg: null,
    notes: null
  });

  //state for payment method
  const [ payment, setPayment ] = useState('');

  //state for params
  const [ params, setParams ] = useState(() => ({
      page:1,
      pageSize: 1000, //by default
      filterall:'',
      shopify_order_name:'',
      hub_filter: [],
      listCity:1,
      city_filter:'',
      deliver_time:'',
      delivery_date:moment().format('YYYY-MM-DD'),
      payment_method: ''
  }));

  //state for filteredtable
  const [ filteredData, setFilteredData ] = useState(null);

  //======FUNCTIONS=======
  //======FUNCTIONS=======

  // get the returned params from hubfilter
  const getHubID = (id) => {
    const returnedID = id();
      setParams({
      ...params,
      hub_filter: returnedID
    })
  };

  // adding and removing job data on selected data
  const jobSelectHandler = async (selectedJob, origFs) => {

    // variable for the input value exist in redux state
    let match = for_assignment.rows.find(row => {
      return row.shopify_order_name === selectedJob;
    })

    // if there is a match execute addjobitem function else throw an error msg
    if(match){

        //add match to selected data if its empty 
        //to avoid error on array find 
        if(!selectedData.length){
          setSelectedData([...selectedData, match])

          const fetchnote = await fetchNoteHistory(match);

          if(fetchnote.length > 0){

            setBarcodeMsg({
              msg: 'Job item added',
              notes: fetchnote
            })

          }else{
            setBarcodeMsg({
              msg: 'Job item added',
              notes: null
            })

          }


        } else {

          // check if match is in the selected data array
          let exist = selectedData.findIndex(data => data === match)

          if(exist > -1) {
            // spread operator to make the state mutable and do re render onchange
            let arr = [...selectedData];

            //remove the object on the selected data
            arr.splice(exist, 1)
            setSelectedData(arr)
            setBarcodeMsg({
              msg: 'Job item removed',
              notes: null
            })
          } else {
            setSelectedData([...selectedData, match])
            const fetchnote = await fetchNoteHistory(match);

            if(fetchnote.length > 0){

              setBarcodeMsg({
                msg: 'Job item added',
                notes: fetchnote
              })

            }else{
              setBarcodeMsg({
                msg: 'Job item added',
                note: null
              })

            }

          }
        }
    } else {
        await props.fetchOrderStatus(origFs, (order_status) => {
          //setOrderStatus(order_status);

          let checkStatus = [8, 9, 10, 11, 12, 13, 14, 15];

          if(order_status){
            if(checkStatus.includes(order_status['id'])){
  
              //let myStatus = orderStatus.find(status => status.id === order_status);
              setBarcodeMsg({
                msg: `Order is ${order_status['label']}`,
                notes: null
              });
  
            }
  
            else{
              toast.error('Job doesnt exist')
              setBarcodeMsg({
                msg: null,
                notes: null
              })
            }
          }
  
          else{
            toast.error('Job doesnt exist')
            setBarcodeMsg({
              msg: null,
              notes: null
            })
          }
        });
    }

    //manul clean up
    match = null;
  }

  //barcode validator
  const barcodeHandler = (value) => {
      // save barcode value and adding suffix of FS- for conditional purpose
      let origFs = 'FS-' + value.replace("FS-", "");
      let newFs = 'FS-' + value
      if(newFs.indexOf('-CPU') > -1){
          //remove -CPU on input
          newFs = newFs.slice(0, newFs.indexOf('-CPU'))
      }

      jobSelectHandler(newFs, origFs)
    }

  //socket function for assignment did update
  // const socketForAssignment = data => {
  //   console.log(data, 'data data data')
  //   try{
  //     if ( data.method === 'remove' ) removeJobsForAssignment(data.rows)
  //     if ( data.method === 'update') updateJobsForAssignment(data.rows,params)
  //   }catch(e){
  //     console.log(e, 'error in socket');
  //     alert('Error in socket');
  //   }
  // }

  //filter only the redux state
  const filterHandler = search => {
    console.log('filterHandler')
    if(search.indexOf('-CPU') > -1){
      //remove -CPU on input
      search = search.slice(0, search.indexOf('-CPU'))
  }

    //arr container if there is a match on redux state
    let arr = []

    if(search){
      arr = for_assignment.rows.filter(row => row.shopify_order_name.toLowerCase().includes(search.toLowerCase()))

      setFilteredData(arr)
    } else {
        setFilteredData(null)
    }
  }

  //const filter timer
  const filterTimer = (search) => {
    clearTimeout(timer)
    if(search){
      timer = setTimeout(() => filterHandler(search), 2000)
    } else {
      filterHandler(search)
    }
  }

  //==========USE EFFECT==========
  //==========USE EFFECT==========

  // initialize and remove socket on mount and unmout of component
  // saving row_assignment.cities into state
  useEffect(() => {
    // socket.on('FORASSIGNMENT_DID_UPDATE', socketForAssignment)
    // // socket.on('RIDERS_DID_UPDATE', socketForRider);
    console.log(paymentOptions)
    return () => {
      // socket.off('FORASSIGNMENT_DID_UPDATE', socketForAssignment)
      // socket.off('RIDERS_DID_UPDATE', socketForRider)
      clearTimeout(timer)
    }
  }, []);

  //fetch data when params change
  //wait for params hub filter to have a value
  useEffect(()=>{
    if(params.hub_filter.length > 0){
      fetchJobsForAssignment(params);
      setFilteredData(null)
      setSelectedData([])
    }
  }, [params]);

  useEffect(() => {
    
    //arr container if there is a match on redux state
    let arr = []

    if(payment){
      
      const [selected_payment]  = paymentOptions.filter(x=>x.value.toLowerCase() === payment.toLowerCase())

      arr = for_assignment.rows.filter(row => row.payment_id === selected_payment.id)

       setFilteredData(arr)
    } else {
        setFilteredData(null)
    }
  }, [payment])
  
  return (
    <Container css={`grd over-hid grd-gp-1 ${selectedData.length  && 'gtr-af'}`}>
      {selectedData.length > 0 &&
        <ProcessWrap

          selectedData={selectedData}
          setSelectedData={setSelectedData}
        />
      }
      <div className='grd gtr-af slideInRight animate-2 over-hid'>
        <div>
          <div
            style={{gridTemplateColumns: `repeat(5, 1fr) auto`}}
            className='grd grd-gp-1'>
            <div style={{gridColumn: '1 / -1'}} className='grd gtc-af grd-gp-1'>
              <span className='header pad-1 space-no-wrap'>Dispatch Job</span>
              <HubFilter
                getHubID={getHubID}
                maxBadgeCount={6}
              />
            </div>
            <Input 
              css='pad-1' 
              name="search" 
              type='search' 
              label='Filter...' 
              onChange={e => filterTimer(e.target.value)}
              />
              { for_assignment.hasOwnProperty('cities') &&
                  <div css="pad-1 jss">
                      <Select
                          value={params.city_filter}
                          name="city_filter"
                          placeholder='City Filter'
                          options={
                            for_assignment.cities.map(city => {
                              return {value: city.City, label: city.City}
                            })
                          }
                          onChange={(e) => {
                            setParams({...params, city_filter: e ? e.value : ''})
                          }}

                      />
                  </div>
              }
              {/* <select 
                className='pad-x-1' 
                defaultValue=''
                onChange={ (e) => filterPaymentMethod(e) }
                >
                <option style={{display: "none"}} value=''>Payment Method</option>
                {
                  paymentOptions.map((payment, key) => {
                    return <option value={payment.value} key={key}>{payment.label}</option>
                  })
                }
              </select> */}
              <Select
                value={payment}
                name='payment_method'
                placeholder='Payment method'
                options={
                  paymentOptions
                }
                onChange={e => {
                  setPayment(e ? e.value : '')
                }}
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
            <UseBarcode
              msg={barcodeMsg} 
              onKeyPress={e => barcodeHandler(e)}
            />
          </div>
          <DispatchJobHeader
            css='mar-y-1'
            selCount={selectedData.length}/>
        </div>
        <div className='over-y-auto scroll relative'>
          { filteredData ?
              filteredData.length > 0 ?
                filteredData.map((record) => {
                  return <DispatchJobRow
                            data={record}
                            selected={!!selectedData.find(data => data.order_id === record.order_id)}
                            btnshow={selectedData.length}
                            key={record.order_id}
                            onChange={() =>  jobSelectHandler(record.shopify_order_name)}
                />
                })
                :
                <div className='grd aic jic size-100 header'>
                  <span>Job not found</span>
                </div>
                : 
                for_assignment.count ?
                    for_assignment.rows.map((record) => {
                      return <DispatchJobRow
                        data={record}
                        selected={!!selectedData.find(data => data.order_id === record.order_id)}
                        btnshow={selectedData.length}
                        key={record.order_id}
                        onChange={() =>  jobSelectHandler(record.shopify_order_name)}
                      />
                    })
                :
                <div className='grd aic jic size-100 header'>
                  <span>No Records Found</span>
                </div>
                }
        </div>
      </div>
    </Container>
  );
};

const mapStatetoProps = state => ({
  dispatchData:state.dispatchData,
});

export default connect(mapStatetoProps,
  {
    updateJobsForAssignment,
    removeJobsForAssignment,
    fetchJobsForAssignment,
    fetchNoteHistory,
    fetchOrderStatus
  }
)(DispatchJobList);

