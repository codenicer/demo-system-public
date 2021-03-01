import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import Container from '../../../atoms/Container/Container'
import Input from '../../../atoms/Input/Input'
import Button from '../../../atoms/Button/Button'
import {
  fetchAdvanceJobs,
  deleteJob,
  deleteJobItem,
  fetchJobsForAssignment,
  addJobItem,
  getTrackingNo,
  setRiderDetails,
} from './../../../scripts/actions/dispatchActions'
import {
  fetchAvailableRiders,
  fetchRiderProviders,
} from './../../../scripts/actions/riderActions'
import { toast } from 'react-toastify'
import _ from 'lodash'
import Modal from '../../../template/Modal/Modal'
import CreatableSelect from 'react-select/lib/Creatable'
import HubFilter from '../../../organisms/HubFilter/HubFilter'
import Pagination from '../../../atoms/Pagination/Pagination'
import DispatchAdvanceQueueJob from '../DispatchAdvance/DispatchAdvanceQueueJob/DispatchAdvanceQueueJob'
import DispatchAddItem from '../DispatchAddItem/DispatchAddItem'
import Select from 'react-select'
import filter_config from '../../../config.json'
import queryString from 'querystring'

const DispatchQueue = (props) => {
  let filterVal = props.location.search
    ? queryString.parse(props.location.search.replace('?', ''))
    : ''
  const { deliverytime, paymentMethod } = filter_config
  const [addItemModal, setAddItemModal] = useState(false)
  const [changeRiderModal, setChangeRiderModal] = useState(false)
  const [selected_dispatch_job_id, setSelectedDispatchJob] = useState(0)
  const {
    fetchAvailableRiders,
    fetchRiderProviders,
    fetchAdvanceJobs,
    deleteJob,
    deleteJobItem,
    fetchJobsForAssignment,
    addJobItem,
    getTrackingNo,
    setRiderDetails,
  } = props
  const {
    dispatchData: { advance_jobs, for_assignment, tracking_data },
  } = props
  const {
    riderData: { available_riders, rider_providers },
  } = props

  const [riderOptions, setRiderOptions] = useState([])
  const [providerOptions, setProviderOptions] = useState([])
  const [disableFields, setFields] = useState(false)

  const [paramsChanged, setParamChanged] = useState(0)

  const [tableData, setTableData] = useState([])
  const [itemList, setItemList] = useState([])
  const [params, setParams] = useState({
    page: 1,
    pageSize: 30, //15, //by default
    filterall: '',
    hub_filter: [],
    filterVal: filterVal ? filterVal.term : '',
    deliveryDate: '',
    payment_method: '',
  })

  const [riderForm, setRiderForm] = useState({
    rider_id: 0,
    rider_provider_id: 0,
    rider_provider_name: '',
    first_name: '',
    last_name: '',
    mobile_number: '',
    tracking_no: '',
  })

  // const {match:{params:{shopify_order_name}}} = props

  // get the returned params from hubfilter
  const getHubID = (id) => {
    const returnedID = id()
    console.log(returnedID, 'returnedID')
    setParamChanged(paramsChanged + 1)
    setParams({
      ...params,
      hub_filter: returnedID,
    })
  }

  //get selected page
  const PageClick = (x) => {
    let retpage = x()
    setParams({
      ...params,
      page: retpage,
    })
  }

  //state for barcode input
  const [barcodeValue, setBarcodeValue] = useState('')

  //ref of barcode for focus
  const inputBarcode = useRef()

  function fetchData(params) {
    fetchAdvanceJobs(params)
  }
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const splitPat = props.match.path.split('/')
    if (paramsChanged > 1) {
      props.history.replace(`/${splitPat[1]}/${splitPat[2]}/${splitPat[3]}`)
    }
  }, [paramsChanged])

  useEffect(() => {
    console.log('here loading', params, 'params')
    // if(!shopify_order_name){
    if (params.hub_filter.length > 0 && firstLoad) {
      // console.log("HERE",1.2)
      fetchData(params)

      setFirstLoad(false)
    } else if (!firstLoad) {
      fetchData(params)
      // fetchData(params);
    }
    // }
  }, [params])

  // useEffect(()=>{
  //   if(shopify_order_name){
  //     console.log("HERE",2.2)
  //    fetchData({...params,filterVal:shopify_order_name})
  //   }
  // },[shopify_order_name])

  useEffect(() => {
    // setTableData(for_assignment)
    // if(advance_jobs.rows.length){
    setTableData(advance_jobs.rows)
    //}
    //setTableData(advance_jobs.rows)
  }, [advance_jobs])

  useEffect(() => {
    // setTableData(for_assignment)
    setItemList(_.clone(for_assignment.rows))
  }, [for_assignment])

  useEffect(() => {
    // setTableData(for_assignment)
    const rOptions = _.map(available_riders, (rider) => {
      return {
        key: rider.rider_id,
        data: rider,
        value: rider.rider_id,
        label: `${rider.first_name} ${rider.last_name} (${rider.mobile_number})`,
      }
    })
    setRiderOptions(rOptions)
  }, [available_riders])

  useEffect(() => {
    // setTableData(for_assignment)
    //console.log('available_riders:',available_riders);
    //console.log("HERE PLEASE",rider_providers)
    const rpOptions = _.map(rider_providers, (rp) => {
      return {
        key: rp.rider_provider_id,
        data: rp,
        id: rp.rider_provider_id,
        value: rp.name,
        label: rp.name,
      }
    })
    setProviderOptions(rpOptions)
  }, [rider_providers])

  useEffect(() => {
    // setTableData(for_assignment)
    console.log('tracking number generated')
    setRiderForm({
      ...riderForm,
      tracking_no: _.clone(tracking_data.tracking_no),
    })
  }, [tracking_data])

  function changeRiderDetails() {
    if (riderForm.tracking_no.length <= 0) {
      toast.error('Please enter tracking number or generate one.')
      return false
    }

    if (isNaN(riderForm.rider_id)) {
      //not a number

      if (riderForm.first_name.length <= 0) {
        toast.error('Please enter first name or select from the list of riders')
        return false
      }

      if (riderForm.last_name.length <= 0) {
        toast.error('Please enter last name or select from the list of riders')
        return false
      }
      if (riderForm.mobile_number.length <= 0) {
        toast.error(
          'Please enter contact number or select from the list of riders'
        )
        return false
      }

      if (isNaN(riderForm.rider_provider_id)) {
        //integer
        if (riderForm.rider_provider_name.length <= 0) {
          toast.error(
            'Please enter provider or select from the list of providers'
          )
          return false
        }
      } else if (parseInt(riderForm.rider_provider_id) === 0) {
        toast.error(
          'Please enter provider or select from the list of providers'
        )
        return false
      }
    } else if (parseInt(riderForm.rider_id) === 0) {
      //probably new rider

      console.log('cond:', parseInt(riderForm.rider_id) === 0)

      toast.error('Please enter rider name or select from the list of riders')
      return false
    }

    const xparams = {
      dispatch_job_id: selected_dispatch_job_id,
      dispatch_data: {
        tracking_no: riderForm.tracking_no,
        status: 8,
      },
      tracking_no: riderForm.tracking_no,
      riderForm,
      order_status_id: 8,
      order_item_status_id: 8,
    }
    setRiderDetails(xparams, (msg) => {
      fetchData(params)
      toast.success(msg)
    })
    setChangeRiderModal(false)
  }

  function showAddItem(dispatch_job_id) {
    fetchJobsForAssignment()
    //console.log('itemModal:',dispatch_job_id);
    setSelectedDispatchJob(dispatch_job_id)

    setAddItemModal(true)
  }

  const stateHandler = (value, key) => {
    const tData = _.clone(itemList)
    tData[key]['isSelected'] = value
    addDispatchJob(tData[key].shopify_order_name)
    inputBarcode.current.focus()
  }

  const barcodeEnter = (event) => {
    if (event.key === 'Enter') {
      addDispatchItem(event)
    } else return null
  }

  function addDispatchItem(event) {
    console.log('dispatch_job_id', selected_dispatch_job_id)

    let fsitem = event.target.value

    // if (fsitem.indexOf('FS-') > -1) {
    //   //may FS na
    // } else {
    //   fsitem = `FS-${fsitem}`;
    // }

    addDispatchJob(fsitem)
  }
  function addDispatchJob(fsitem) {
    //search from redux items else
    const fsTableData = _.filter(_.clone(itemList), (rec, key) => {
      //check me here if iam cpu or flower
      if (rec.shopify_order_name.toLowerCase() === fsitem.toLowerCase()) {
        return rec
      }
    })
    if (fsTableData.length) {
      //add the item
      addJobItem(
        {
          dispatch_job_id: selected_dispatch_job_id,
          shopify_order_name: fsitem,
        },
        (msg) => {
          fetchJobsForAssignment(_.clone(params))
          fetchData(params)
          toast.success(msg)
          setBarcodeValue('')
        }
      )
    } else {
      //check if
      const rmItem = _.filter(advance_jobs, (rec, key) => {
        const sitem = _.filter(rec.view_dispatch_job_details, (item, k) => {
          if (item.shopify_order_name.toLowerCase() === fsitem.toLowerCase()) {
            return sitem
          }
        })
        if (sitem.length) {
          return rec
        }
      })
      if (rmItem.length) {
        //remove item
        if (rmItem[0].view_dispatch_job_details.length === 1) {
          onRemoveJob(rmItem[0].dispatch_job_id)
        } else {
          removeDetailItem(
            rmItem[0]['view_dispatch_job_details'][0].dispatch_job_detail_id
          )
        }
      }
    }
  }

  function onRemoveJob(dispatch_job_id) {
    console.log('Params', params)
    if (
      window.confirm(
        'You are about to delete the Dispatch Job. Click OK to proceed'
      )
    ) {
      deleteJob({ dispatch_job_id }, (msg) => {
        console.log('Params', params)
        fetchData(params)
        toast.success(msg)
      })
    }
  }

  // function onShipJob(dispatch_job_id){
  //   if(window.confirm('You are about to Ship this Job. Click OK to proceed')){
  //     deleteJobItem({dispatch_job_id}, (msg)=>{
  //       fetchData(params);
  //       toast.success(msg);
  //     });
  //   }

  // }

  //return data['dispatch_job_detail_id'] from children
  function removeDetailItem(dispatch_job_detail_id) {
    deleteJobItem({ dispatch_job_detail_id }, (msg) => {
      fetchData(params)
      toast.success(msg)
    })
  }

  function showRiderModal(dispatch_job_id) {
    fetchRiderProviders()
    fetchAvailableRiders()
    setSelectedDispatchJob(dispatch_job_id)
    const selectedDJ = _.filter(advance_jobs.rows, { dispatch_job_id })
    if (selectedDJ.length) {
      console.log('selectedDJ', selectedDJ[0])
      setRiderForm({
        rider_id: 0,
        rider_provider_id: 0,
        rider_provider_name: '',
        first_name: '',
        last_name: '',
        mobile_number: '',
        tracking_no: '', //selectedDJ[0]['tracking_no'],
      })
      setChangeRiderModal(true)
    } else {
      toast.warn('Unable to select Dispatch Job')
    }
  }

  function handleInputChange(event) {
    const target = event.target
    setRiderForm({ ...riderForm, [target.name]: target.value })
  }
  function handleProviderChange(selectedValue, actionMeta) {
    if (selectedValue) {
      if (!selectedValue.hasOwnProperty('data')) {
        //new data
        setRiderForm({
          ...riderForm,
          rider_provider_id: selectedValue.id,
          rider_provider_name: selectedValue.label,
        })
      } else {
        setRiderForm({
          ...riderForm,
          rider_provider_id: selectedValue.id,
          rider_provider_name: selectedValue.label,
        })
      }
    } else {
      setRiderForm({
        ...riderForm,
        rider_provider_id: 0,
        rider_provider_name: '',
      })
    }
  }
  function handleRiderChange(selectedValue, actionMeta) {
    let rData = {
      rider_id: 0,
      rider_provider_id: 0,
      rider_provider_name: '',
      first_name: '',
      last_name: '',
      mobile_number: '',
      tracking_no: riderForm.tracking_no,
    }
    // console.clear()
    // console.log(selectedValue,actionMeta)

    // console.log('rDATA', rData);

    if (selectedValue) {
      console.log(0)
      if (!selectedValue.hasOwnProperty('data')) {
        //new data
        console.log(1)
        rData.first_name = selectedValue.label
        rData.rider_id = selectedValue.value
        rData.tracking_no = _.clone(riderForm.tracking_no)
        setFields(false)
      } else {
        console.log(2)
        rData = selectedValue.data
        rData.tracking_no = _.clone(riderForm.tracking_no)
        setFields(true)
      }
    } else {
      console.log(3)
      rData = {
        rider_id: 0,
        rider_provider_id: 0,
        rider_provider_name: '',
        first_name: '',
        last_name: '',
        mobile_number: '',
        tracking_no: riderForm.tracking_no,
      }
      setFields(false)
    }
    setRiderForm(rData)
  }

  const onFilterTextChange = _.debounce((e) => {
    let textFilter = e
    setParamChanged(paramsChanged + 1)
    setParams({ ...params, filterVal: textFilter })
  }, 1000)

  function handleChange(event) {
    setParamChanged(paramsChanged + 1)
    setParams({
      ...params,
      [event.target.name]: event.target.value,
      page: 1,
      pageSize: 10,
    })
  }

  //This is for select time
  function handleSelectChange(data, key) {
    setParamChanged(paramsChanged + 1)
    setParams({
      ...params,
      [key]: data,
    })
  }

  let pageCount = 0

  // console.log("providerOptions",providerOptions)
  // console.log("RIDER FORM",riderForm)
  return (
    <>
      <Container css="grd grd-gp-1 dispatch_advance slideInRight animate-1 relative over-hid">
        <div className="grd grd-gp-1 gtc-af">
          <span className="header asc">Advance Bookings</span>
          <HubFilter getHubID={getHubID} maxBadgeCount={6} />
        </div>
        <div
          style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}
          className="grd grd-gp-1 mar-y-1"
        >
          {/* <Select
                        //   value={params.city_filter}
                          name="city_filter"
                          placeholder='City Filter'
                        //   options={cityList}
                          simpleValue
                        //   onChange={(selecteditem) => setParams({...params,city_filter: selecteditem ? selecteditem : ''})}

                      /> */}
          <Input
            defaultValue={params.filterVal}
            css="pad-1"
            type="search"
            label="Filter..."
            onChange={(e) => onFilterTextChange(e.target.value)}
          />
          <Input
            value={params.delivery_date}
            onChange={handleChange}
            name="deliveryDate"
            css="pad-1"
            type="date"
            label="Delivery Date"
          />
          <Select
            value={params.deliveryTime}
            name="deliveryTime"
            placeholder="Delivery time"
            options={deliverytime.map((rec, key) => {
              return { value: rec.id, label: rec.id }
            })}
            onChange={(selecteditem) =>
              handleSelectChange(
                selecteditem ? selecteditem.value : '',
                'deliveryTime'
              )
            }
          />
          <Select
            value={params.payment_method}
            name="payment_method"
            placeholder="Payment method"
            options={paymentMethod.map((data) => {
              return { value: data.value, label: data.name }
            })}
            onChange={(e) =>
              handleSelectChange(e ? e.value : '', 'payment_method')
            }
          />
        </div>
        <div className="jsc over-y-auto scroll pad-1 size-100">
          {tableData.length ? (
            <>
              {tableData.map((record, key) => {
                if (record.details.length > 0) {
                  pageCount++
                  return (
                    <DispatchAdvanceQueueJob
                      type="advance"
                      key={key}
                      data={record}
                      onRemoveItem={removeDetailItem}
                      onRemoveJob={onRemoveJob}
                      itemModal={showAddItem}
                      riderModal={showRiderModal}
                      hubs={filter_config.hubs}
                      payment_methods={filter_config.paymentOptions}
                    />
                  )
                } else return null
              })}
              {console.log(advance_jobs)}
              <div className="grd">
                <Pagination
                  selPage={params.page}
                  pageClick={PageClick}
                  count={pageCount}
                  rows={params.pageSize}
                />
              </div>
            </>
          ) : (
            <div>No Records Found</div>
          )}
        </div>
      </Container>

      {addItemModal && (
        <DispatchAddItem
          unMount={() => fetchAdvanceJobs(params)}
          clickClose={() => {
            setSelectedDispatchJob(0)
            setAddItemModal(false)
          }}
          myref={inputBarcode}
          value={barcodeValue}
          inputChange={(e) => setBarcodeValue(e.target.value)}
          inputKeyPress={(e) => barcodeEnter(e)}
          itemList={itemList}
          rowChange={stateHandler}
          selected_dispatch_job_id={selected_dispatch_job_id}
        />
      )}

      {changeRiderModal && (
        <Modal
          label="Assign to Rider"
          clickClose={() => setChangeRiderModal(false)}
          clickCancel={() => setChangeRiderModal(false)}
          clickSubmit={changeRiderDetails}
          submitlabel="Assign to Rider"
        >
          <div
            className="grd grd-col grd-gp-1 pad-1"
            style={{
              gridColumn: '1 / -1',
              gridTemplateColumns: 'auto 1fr auto',
            }}
          >
            <span className="asc sublabel">Tracking #</span>
            <Input
              css="pad-1"
              name="tracking_no"
              id="tracking_no"
              placeholder={`Enter rider provider's tracking number`}
              onChange={handleInputChange}
              value={riderForm.tracking_no ? riderForm.tracking_no : ''}
            />
            <Button
              css="zoomIn animate-2"
              color="secondary"
              onClick={getTrackingNo}
            >
              Generate
            </Button>
          </div>
          <div
            style={{
              gridTemplateColumns: '320px 320px',
              gridTemplateRows: 'auto 1fr auto 1fr',
            }}
            className="grd grd-gp-1 pad-1"
          >
            <span className="sublabel">Name:</span>
            <CreatableSelect
              name="rider_id"
              id="rider_id"
              isClearable
              placeholder={`Enter first name or mobile number to search`}
              options={riderOptions}
              onChange={handleRiderChange}
              value={riderForm.rider_id ? riderForm.rider_id : 0}
            />
            <span
              style={{ gridColumn: '2 / -1', gridRow: '1 / 2' }}
              className="sublabel"
            ></span>
            <Input
              css="pad-1 over-hid"
              placeholder="last Name"
              name="last_name"
              id="last_name"
              key="last_name"
              readOnly={disableFields}
              value={riderForm.last_name ? riderForm.last_name : ''}
              onChange={handleInputChange}
            />
            <span className="sublabel">Contact #:</span>
            <Input
              css="pad-1 over-hid"
              name="mobile_number"
              id="mobile_number"
              key="mobile_number"
              placeholder="Contact No"
              readOnly={disableFields}
              value={riderForm.mobile_number ? riderForm.mobile_number : ''}
              onChange={handleInputChange}
            />
            <span
              style={{ gridColumn: '2 / -1', gridRow: '3 / 4' }}
              className="sublabel"
            >
              Provider:
            </span>
            <CreatableSelect
              name="rider_provider_id"
              id="rider_provider_id"
              isClearable
              placeholder={`Provider`}
              disabled={disableFields}
              options={providerOptions}
              onChange={handleProviderChange}
              value={
                riderForm.rider_provider_name
                  ? riderForm.rider_provider_name
                  : 0
              }
            />
          </div>
        </Modal>
      )}
    </>
  )
}

const mapStatetoProps = (state) => ({
  dispatchData: state.dispatchData,
  riderData: state.riderData,
  isfetching: state.webFetchData.isFetching,
})

export default connect(mapStatetoProps, {
  fetchAvailableRiders,
  fetchRiderProviders,
  getTrackingNo,
  setRiderDetails,
  deleteJob,
  deleteJobItem,
  fetchAdvanceJobs,
  fetchJobsForAssignment,
  addJobItem,
})(DispatchQueue)
