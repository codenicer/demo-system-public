import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import Container from "../../../atoms/Container/Container";
import DispatchQueueJob from "./DispatchQueueJob/DispatchQueueJob";
import Input from "../../../atoms/Input/Input";
import Button from "../../../atoms/Button/Button";
import {
  fetchAssignedJobs,
  deleteJob,
  deleteJobItem,
  shipDispatchJob,
  getTrackingNo,
  setRiderDetails
} from "./../../../scripts/actions/dispatchActions";
import {
  fetchAvailableRiders,
  fetchRiderProviders
} from "./../../../scripts/actions/riderActions";
import { setQualityCheck } from "./../../../scripts/actions/ordersActions";

import { toast } from "react-toastify";
import _ from "lodash";
import Modal from "../../../template/Modal/Modal";
import CreatableSelect from "react-select/lib/Creatable";
import HubFilter from "../../../organisms/HubFilter/HubFilter";
import Pagination from "../../../atoms/Pagination/Pagination";


import {
  checkCPUDelivery,
  countNotes
} from "./../../../scripts/actions/dispatchActions";
import DispatchAddItem from "../DispatchAddItem/DispatchAddItem";
import DispatchQualityCheck from "./DispatchQualityCheck";
import Select from "react-select/lib/Select";
import filter_config from '../../../config.json';

import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");
const DispatchQueue = props => {
  
  //-------------------------STATE-----------------
  
  // state for add item modal and change rider
  const [addItemModal, setAddItemModal] = useState(false);
  // state for change rider modal
  const [changeRiderModal, setChangeRiderModal] = useState(false);
  // state for quality check modal
  const [qualityCheckModal, setQualityCheckModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  
  const [selected_dispatch_job_id, setSelectedDispatchJob] = useState(0);

  const [riderOptions, setRiderOptions] = useState([]);
  const [providerOptions, setProviderOptions] = useState([]);
  const [providerFilter, setProviderFilter] = useState([]);
  const [disableFields, setFields] = useState(false);
  const [failedIds, setFailedIds] = useState([]);
  const [noteCounts, setNoteCounts] = useState([]);
  const [once, setOnce] = useState(true);
  const [riderList, setRiderList] = useState([])

  // data of assigned job
  const [tableData, setTableData] = useState([]);

  const [riderForm, setRiderForm] = useState({
    rider_id: 0,
    rider_provider_id: 0,
    rider_provider_name: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    tracking_no: ""
  });

  // const [paramsChanged,setParamsChanged] = useState(0)

//  let filterVal = props.location.search ? queryString.parse(props.location.search.replace('?', '')) : '';
  
  // const {match:{params:{shopify_order_name}}} = props
  //assigned job params
  const [ ajParams, setAjParams ] = useState({
    page: 1,
    pageSize: 30, //by default
    filterall: '',
    hub_filter: [],
    filterVal: "",
    riderFilter: "",
    payment_method: '',
    providerFilter: ''
  });

  //-----------------PROPS-----------------

  const {
    fetchAssignedJobs,
    deleteJob,
    deleteJobItem,
    shipDispatchJob,
    addJobItem,
    fetchAvailableRiders,
    fetchRiderProviders,
    getTrackingNo,
    setRiderDetails,
    checkCPUDelivery,
    failCPUs,
    countNotes,
    noteCountsData,
      setQualityCheck
  } = props;

  const {
    dispatchData: { assigned_jobs, tracking_data }
  } = props;

  const {
    riderData: { available_riders, rider_providers }
  } = props;

  const { paymentMethod } = filter_config;

  
  //ref of barcode for focus
  // const inputBarcode = useRef();


  // get the returned params from hubfilter of assigned jobs
  const getHubID = (id) => {
    const returnedID = id();
    // setParamsChanged(paramsChanged+1)
    setAjParams({
        ...ajParams,
        hub_filter: returnedID
    })
}

  //get selected page of assigned jobs
  const PageClick = (x) => {
    let retpage = x();
    setAjParams({
        ...ajParams,
        page: retpage});
  }

  //barcode input handler
  // const barcodeEnter = event => {
  //   if (event.target.value.length === 10 || event.key === "Enter") {
  //     addDispatchItem(event);
  //   } else return null;
  // };

  //adding FS- on barcode input
  // function addDispatchItem(event) {
  //   // console.log("dispatch_job_id", selected_dispatch_job_id);

  //   let fsitem = event.target.value;
  //   if (fsitem.indexOf("FS-") > -1) {
  //     //may FS na
  //   } else {
  //     fsitem = `FS-${fsitem}`;
  //   }

  //fetch data
  function fetchData(params){
      fetchRiderProviders();
  }

  function changeRiderDetails() {
    if (riderForm.tracking_no.length <= 0) {
      toast.error("Please enter tracking number or generate one.");
      return false;
    }

    if (isNaN(riderForm.rider_id)) {
      //not a number

      if (riderForm.first_name.length <= 0) {
        toast.error(
          "Please enter first name or select from the list of riders"
        );
        return false;
      }

      if (riderForm.last_name.length <= 0) {
        toast.error("Please enter last name or select from the list of riders");
        return false;
      }
      if (riderForm.mobile_number.length <= 0) {
        toast.error(
          "Please enter contact number or select from the list of riders"
        );
        return false;
      }

      if (isNaN(riderForm.rider_provider_id)) {
        //integer
        if (riderForm.rider_provider_name.length <= 0) {
          toast.error(
            "Please enter provider or select from the list of providers"
          );
          return false;
        }
      } else if (parseInt(riderForm.rider_provider_id) === 0) {
        toast.error(
          "Please enter provider or select from the list of providers"
        );
        return false;
      }
    } else if (parseInt(riderForm.rider_id) === 0) {
      //probably new rider

      // console.log("cond:", parseInt(riderForm.rider_id) === 0);

      toast.error("Please enter rider name or select from the list of riders");
      return false;

    }


    const mparams = {
      dispatch_job_id: selected_dispatch_job_id,
      dispatch_data: {
        tracking_no: riderForm.tracking_no
      },
      tracking_no: riderForm.tracking_no,
      riderForm
    };

    setRiderDetails(mparams, msg => {
      fetchData(ajParams);
      toast.success(msg);
    });

    setChangeRiderModal(false);
  }
  function showAddItem (dispatch_job_id){
    // fetchJobsForAssignment(faParams)
    setAddItemModal(true);
   // console.log('itemModal:',dispatch_job_id);
    setSelectedDispatchJob(dispatch_job_id);
  }
    const deliveryTimeHourConverter = deliveryTime => {
        switch(deliveryTime){
          case '12am - 3am':
              return [0, 2];
          case '6am - 8am':
              return [6, 7];
          case '9am - 1pm':
              return [9, 13];
          case '1pm - 5pm':
              return [13, 17];
          case '5pm - 8pm':
              return [18, 20];
          case '9pm - 12am':
          case 'Anytime':
              return [21, 23];
          default:
              return null;
      }
    }
  function showQualityCheck(rec){
      //check if record delivery date and time is not correct

      const currentDeliveryDate = moment();
      const currentDeliveryTime = moment().hours();

      if (rec.delivery_date === null || rec.delivery_date === 'undefined' || !rec.delivery_date ){
          window.alert('You are about to process order with NO DELIVERY DATE and/or DELIVERY TIME. Please contact customer service to fix these information.');
             return false;
      }
      if (rec.delivery_time === null || rec.delivery_time === 'undefined' || !rec.delivery_time ){
          window.alert('You are about to process order with NO DELIVERY DATE and/or DELIVERY TIME. Please contact customer service to fix these information.');
          return false;
      }

      const orderDeliveryDate = moment(rec.delivery_date);
      const orderDeliveryTime = deliveryTimeHourConverter(rec.delivery_time);



      if(currentDeliveryDate === orderDeliveryDate){

          if(currentDeliveryTime >= orderDeliveryTime[0] && currentDeliveryTime <= orderDeliveryTime[1]){
            //ok
          }else{

             if(window.confirm('You are about to process order with different DELIVERY DATE and/or DELIVERY TIME. Please double check the order. Click OK to proceed')){
                 setQualityCheckModal(true);
                 setSelectedData(rec)
             }

          }
      }else if (currentDeliveryDate < orderDeliveryDate){
          if(window.confirm('You are about to process order with different DELIVERY DATE and/or DELIVERY TIME . Please double check the order. Click OK to proceed')){
              setQualityCheckModal(true);
              setSelectedData(rec)
          }

      }else{

          setQualityCheckModal(true);
          setSelectedData(rec)

      }




  }
  function showRiderModal(dispatch_job_id) {
    fetchAvailableRiders();
    setSelectedDispatchJob(dispatch_job_id);
    const selectedDJ = _.filter(assigned_jobs.rows, { dispatch_job_id });
    if (selectedDJ.length) {
      // console.log("selectedDJ", selectedDJ[0]);
      setRiderForm({
        rider_id: 0,
        rider_provider_id: 0,
        rider_provider_name: "",
        first_name: "",
        last_name: "",
        mobile_number: "",
        tracking_no: "" //selectedDJ[0]['tracking_no'],
      });
      setChangeRiderModal(true);
    } else {
      toast.warn("Unable to select Dispatch Job");
    }
  }
  function handleInputChange(event) {
    const target = event.target;
    setRiderForm({ ...riderForm, [target.name]: target.value });
  }
  function handleProviderChange(selectedValue, actionMeta) {
    if (selectedValue) {
      if (!selectedValue.hasOwnProperty("data")) {
        //new data
        setRiderForm({
          ...riderForm,
          rider_provider_id: selectedValue.value,
          rider_provider_name: selectedValue.label
        });
      } else {
        setRiderForm({
          ...riderForm,
          rider_provider_id: selectedValue.value,
          rider_provider_name: selectedValue.label
        });
      }
    } else {
      setRiderForm({
        ...riderForm,
        rider_provider_id: 0,
        rider_provider_name: ""
      });
    }

  }
  function handleRiderChange(selectedValue, actionMeta) {
    let rData = {
      rider_id: 0,
      rider_provider_id: 0,
      rider_provider_name: "",
      first_name: "",
      last_name: "",
      mobile_number: "",
      tracking_no: riderForm.tracking_no
    };
    if (selectedValue) {
      if (!selectedValue.hasOwnProperty("data")) {
        //new data
        rData.first_name = selectedValue.label;
        rData.rider_id = selectedValue.value;
        rData.tracking_no = _.clone(riderForm.tracking_no);
        setFields(false);
      } else {
        rData = selectedValue.data;
        rData.tracking_no = _.clone(riderForm.tracking_no);
        setFields(true);
      }
    } else {
      rData = {
        rider_id: 0,
        rider_provider_id: 0,
        rider_provider_name: "",
        first_name: "",
        last_name: "",
        mobile_number: "",
        tracking_no: riderForm.tracking_no
      };
      setFields(false);
    }

    // console.log("rdata:", rData);
    setRiderForm(rData);
  }

  useEffect(() => {
 

    if(ajParams.hub_filter.length > 0 && once){
          fetchAssignedJobs(ajParams);
          fetchRiderProviders();
        // fetchAssignedJobs(ajParams);
        setOnce(false);
    }else if(!once){
          fetchAssignedJobs(ajParams);
        // fetchAssignedJobs(ajParams);
    }
    // console.log(ajParams, 'aj params')
  }, [ajParams]);

 
  useEffect(() => {
    // setTableData(for_assignment)
    const rOptions = _.map(available_riders, rider => {
      return {
        key: rider.rider_id,
        data: rider,
        value: rider.rider_id,
        label: `${rider.first_name} ${rider.last_name} (${rider.mobile_number})`
      };
    });
    setRiderOptions(rOptions);
  }, [available_riders]);

  useEffect(() => {
    // setTableData(for_assignment)
    // console.log("available_riders:", available_riders);
    let providerFilterArr = [];

    const rpOptions = _.map(rider_providers, rp => {
      if(rp.is_active === 1){
        providerFilterArr.push({
          key: rp.rider_provider_id,
          data: rp,
          value: rp.name,
          label: rp.name
        });
       }

      return {
        key: rp.rider_provider_id,
        data: rp,
        value: rp.rider_provider_id,
        label: rp.name
      };
    });
    setProviderOptions(rpOptions);
    setProviderFilter(providerFilterArr);
  }, [rider_providers]);



  useEffect(() => {
    // setTableData(for_assignment)
    // console.log("assigned jobs:", assigned_jobs);
    // console.log('dispatch data', props.dispatchData)
    // if(assigned_jobs.rows.length){
    setTableData(assigned_jobs.rows);
    //  }
    //setTableData(assigned_jobs.rows)

    if (assigned_jobs.rows.length) {
      //FOR CPU ONLY TO CHECK IF DELIVERY IS SUCCESS
      let cpu_order_ids = [];
      console.log('assigned_jobs',assigned_jobs.rows);
      // _.map(assigned_jobs.rows, obj => {
      //   if (obj.view_dispatch_job_details[0]) {
      //     if (obj.view_dispatch_job_details[0].payment_method === "CPU") {
      //       cpu_order_ids.push(obj.view_dispatch_job_details[0].order_id);
      //     }
      //   }
      // });

      if (assigned_jobs.rows.length && !riderList.length) {
        // setRiderList(
        //   _.map(assigned_jobs.rows, rec => {
        //     return { value: `${rec.rider_id}`, label: `${rec.rider_first_name} ${rec.rider_last_name}` };
        //   })
        // );
      }

     // checkCPUDelivery(cpu_order_ids);
      //END

      //CHECK ALL NOTES
      let order_ids = [];
      // _.map(assigned_jobs.rows, obj => {
      //   if (obj.view_dispatch_job_details[0]) {
      //     order_ids.push(obj.view_dispatch_job_details[0].order_id);
      //   }
      // });

      //countNotes(order_ids);

      //END
    }

    //RED IF NOT ORDER_STATUS = 9 OR 10
    //GET ALL ORDER IDS FROM ASSIGNED JOBS CHECK IF CPU
  }, [assigned_jobs]);

  useEffect(() => {
    // setTableData(for_assignment)
    setRiderForm({
      ...riderForm,
      tracking_no: _.clone(tracking_data.tracking_no)
    });
  }, [tracking_data]);

  useEffect(() => {
    //Fetch all fail cpus
    if (failCPUs) {
      setFailedIds(failCPUs.failedIds);
    }
  }, [failCPUs]);

  useEffect(() => {
    //Fetch all note counts
    if (noteCountsData) {
      setNoteCounts(noteCountsData);
    }
  }, [noteCountsData]);

  function onRemoveJob(dispatch_job_id) {
    if (
      window.confirm(
        "You are about to delete the Dispatch Job. Click OK to proceed"
      )
    ) {
      deleteJob({ dispatch_job_id }, msg => {
        fetchData(ajParams);
          fetchAssignedJobs(ajParams);
        toast.success(msg);
      });
    }
  }
  function checkAssembly (){
            return true;
  }

  function onShipJob(dispatch_data) {

    if(!checkAssembly()){

      toast.error('Please make sure that orders have been assembled and quality checked.')
      return false;
    }
    if (window.confirm("You are about to Ship this Job. Click OK to proceed")) {
       console.log(dispatch_data);
      shipDispatchJob({ dispatch_data }, msg => {
        fetchData(ajParams);
          fetchAssignedJobs(ajParams);
        toast.success(msg);
      });
    }
  }

  //return data['dispatch_job_detail_id'] from children
  function removeDetailItem(dispatch_job_detail_id) {
    deleteJobItem({ dispatch_job_detail_id }, msg => {
      fetchData(ajParams);
      fetchAssignedJobs(ajParams);
      toast.success(msg);
    });
  }
  function onSetQualityCheck (order_id){

    //set quality check
     // console.log('call onSetQualityCheck');
        setQualityCheck({order_id},(msg) => {
       //   console.log('quality checking for order', order_id);
          toast.success(msg);

      });
      setQualityCheckModal(false);
     // console.log('ajParams',ajParams);
      fetchAssignedJobs(ajParams);





  }

  const onFilterTextChange = _.debounce(e => {
    let textFilter = e;
  //  console.log('ajParams',ajParams);
      // setParamsChanged(paramsChanged + 1)
      setAjParams({ ...ajParams, filterVal: textFilter });
  }, 1000);

  
  // useEffect(()=>{
  //   const splitPat = props.match.path.split('/')
  //   if(paramsChanged > 1){
  //     props.history.replace(`/${splitPat[1]}/${splitPat[2]}/${splitPat[3]}`)
  //   }
  // },[paramsChanged])
 

  return (
    <>
    <Container
      css='grd grd-gp-2 dispatch-q-template slideInRight animate-1 relative over-hid'
    >
      <div
        style={{gridTemplateColumns: 'auto 1fr'}}
        className='grd grd-gp-1'>
        <span className='header asc'>Assigned Jobs</span>
        <HubFilter
          getHubID={getHubID}
          maxBadgeCount={8}
        />
      </div>
      <div className='grd grd-col grd-col-f grd-gp-1'>
        <Input
            css='pad-1'
            type='search'
            label='Filter...'
            onChange={(e) => onFilterTextChange(e.target.value)}
          />
          <Select
                value={ajParams.payment_method}
                name='payment_method'
                placeholder='Payment method'
                options={
                  paymentMethod.map((data) => {
                    return {value: data.value, label: data.name}
                  })
                }
                onChange={(e) => {
                  // setParamsChanged(paramsChanged+1)
                  setAjParams({
                  ...ajParams,
                  payment_method: e ? e.value : ''

                })}}
              />
          {riderList.length !== 0 && <Select
          options={riderList}
            value={ajParams.riderFilter}
            name="riderFilter"
            placeholder="Rider Filter"
            simpleValue
            onChange={selecteditem =>{
              // setParamsChanged(paramsChanged+1)
              setAjParams({
                ...ajParams,
                riderFilter: selecteditem ? selecteditem : "",
                // page: 0,
                // pageSize: 10
              })}
            }
          
          />}

          {riderList.length !== 0 && <Select
            options={providerFilter}
            value={ajParams.providerFilter}
            name="providerFilter"
            placeholder="Provider Filter"
            simpleValue
            onChange={selecteditem =>{
              // setParamsChanged(paramsChanged+1)
              setAjParams({
                ...ajParams,
                providerFilter: selecteditem ? selecteditem : "",
                // page: 0,
                // pageSize: 10
              })}
            }
          
          />}
      </div>
      <div
        className='over-y-auto scroll pad-1'>

        {once ?
            <span>Spinner</span>
          :
            tableData.length ?
              <>
              {
                tableData.map((record, key) => {
                  return (
                    <DispatchQueueJob
                      // props for highlighting 
                      paymentHighlight={ajParams.payment_method}
                      noteCounts={noteCounts}
                      failedIds={failedIds}
                      key={key}
                      data={record}
                      onRemoveItem={removeDetailItem}
                      onRemoveJob={onRemoveJob}
                      onShip={onShipJob}
                      itemModal={showAddItem}
                      riderModal={showRiderModal}
                      onQualityCheck={showQualityCheck}
                      hubs = {filter_config.hubs}
                      payment_methods ={filter_config.paymentOptions}

                    />)
                })
              }
              {/* pagination of assigned jobs */}
              <div className='grd'>
                <Pagination
                  selPage={ajParams.page}
                  pageClick={PageClick}
                  count={assigned_jobs.count}
                  rows={ajParams.pageSize} />
              </div>
              </>
              :
              <div className='grd aic jic size-100'>
                <span>No Record Found</span>
              </div>
        }

      </div>
      { qualityCheckModal &&
          <DispatchQualityCheck
            data={selectedData}
            setQualityCheck={onSetQualityCheck}
            clickClose={() => setQualityCheckModal(false)}
            />
      }
    </Container>

    { addItemModal &&
        <DispatchAddItem
          unMount={() => fetchAssignedJobs(ajParams)}
          selected_dispatch_job_id={selected_dispatch_job_id}
          clickClose={() => setAddItemModal(false)}
        />
    }

    { changeRiderModal &&
    <Modal
      label='Change Rider'
      clickClose={() => setChangeRiderModal(false)}
      clickCancel={() => setChangeRiderModal(false)}
      clickSubmit={changeRiderDetails}
      submitlabel='Change Rider'
    >
      <div
        className='grd grd-col grd-gp-1 pad-1'
        style={{gridColumn: '1 / -1', gridTemplateColumns: 'auto 1fr auto'}}
      >
        <span className='asc sublabel'>Tracking #</span>
        <Input css='pad-1'
               name="tracking_no"
               id="tracking_no"
               placeholder={`Enter rider provider's tracking number`}
               onChange={handleInputChange}
               value={ riderForm.tracking_no ? riderForm.tracking_no : ''}
        />
        <Button
          css='zoomIn animate-2'
          color='secondary'
          onClick={getTrackingNo}
        >Generate</Button>
      </div>
      <div
        style={{gridTemplateColumns: '320px 320px', gridTemplateRows: 'auto 1fr auto 1fr'}}
        className='grd grd-gp-1 pad-1'>
        <span className='sublabel'>Name:</span>
        <CreatableSelect
          name="rider_id"
          id="rider_id"
          isClearable
          placeholder={`Enter first name or mobile number to search`}
          options= {riderOptions}
          onChange={handleRiderChange}
          value={ riderForm.rider_id ? riderForm.rider_id : 0}
        />
        <span
          style={{gridColumn: '2 / -1', gridRow: '1 / 2'}}
          className='sublabel'></span>
        <Input
          css='pad-1 over-hid'
          placeholder="last Name"
          name="last_name"
          id="last_name"
          key="last_name"
          readOnly={disableFields}
          value={ riderForm.last_name ? riderForm.last_name : ''}
          onChange={handleInputChange}
        />
        <span className='sublabel'>Contact #:</span>
        <Input
          css='pad-1 over-hid'
          name="mobile_number"
          id="mobile_number"
          key="mobile_number"
          placeholder="Contact No"
          readOnly={disableFields}
          value={ riderForm.mobile_number ? riderForm.mobile_number : ''}
          onChange={handleInputChange}
        />
        <span
          style={{gridColumn: '2 / -1', gridRow: '3 / 4'}}
          className='sublabel'>Provider:</span>
        <CreatableSelect
          name="rider_provider_id"
          id="rider_provider_id"
          isClearable
          placeholder={`Provider`}
          disabled={disableFields}
          options= {providerOptions}
          onChange={handleProviderChange}
          value={ riderForm.rider_provider_id ? riderForm.rider_provider_id : 0}
        />
      </div>
    </Modal>
    }
    </>
  );
};

const mapStatetoProps = state => ({
  dispatchData: state.dispatchData,
  riderData: state.riderData,
  isfetching: state.webFetchData.isFetching,
  failCPUs: state.dispatchData.fail_cpus,
  noteCountsData: state.dispatchData.note_counts,
    orderData: state.orderData
});

export default connect(
  mapStatetoProps,
  {
    setRiderDetails,
    getTrackingNo,
    fetchAvailableRiders,
    fetchRiderProviders,
    fetchAssignedJobs,
    deleteJob,
    deleteJobItem,
    shipDispatchJob,
    checkCPUDelivery,
    countNotes,
    setQualityCheck
  }
)(DispatchQueue);
