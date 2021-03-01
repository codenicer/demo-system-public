import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Container from '../../../atoms/Container/Container'
import DispatchIntransitQueueJob from './DispatchIntransitQueueJob/DispatchIntransitQueueJob'
import {
  fetchIntransitJobs,
  deleteJob,
  deleteJobItem,
  setDispatchJobDetailStatus,
  setDispatchCpuCancelled,
} from './../../../scripts/actions/dispatchActions'
import { toast } from 'react-toastify'
import HubFilter from '../../../organisms/HubFilter/HubFilter'
import Pagination from '../../../atoms/Pagination/Pagination'
import Input from '../../../atoms/Input/Input'
import _ from 'lodash'
import Select from 'react-select/lib/Select'
import filter_config from '../../../config.json'
import queryString from 'querystring'

const DispatchQueue = (props) => {
  let filterVal = props.location.search
    ? queryString.parse(props.location.search.replace('?', ''))
    : ''
  const { paymentMethod } = filter_config
  const {
    fetchIntransitJobs,
    deleteJob,
    deleteJobItem,
    setDispatchJobDetailStatus,
  } = props
  const {
    dispatchData: { intransit_jobs },
  } = props
  const [riderList, setRiderList] = useState([])

  const [tableData, setTableData] = useState([])
  const [params, setParams] = useState({
    page: 1,
    pageSize: 30, //15, //by default
    filterall: '',
    hub_filter: '',
    filterVal: filterVal ? filterVal.term : '',
    riderFilter: '',
    payment_method: '',
  })

  // const {match:{params:{shopify_order_name}}} = props

  function fetchData(params) {
    fetchIntransitJobs(params)
  }
  useEffect(() => {
    if (params.hub_filter) {
      console.log(params, 'PARAAAAMS')
      // if(shopify_order_name){
      //   fetchData({...params,filterVal:shopify_order_name})
      // }else{
      fetchData(params)
      // }

      console.log(params, 'params')
    }
  }, [params])

  // get the returned params from hubfilter
  const getHubID = (id) => {
    const returnedID = id()
    console.log(returnedID, 'returnedID')
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

  useEffect(() => {
    // setTableData(for_assignment)
    // if(advance_jobs.rows.length){
    setTableData(intransit_jobs.rows)

    if (intransit_jobs.rows.length && !riderList.length) {
      setRiderList(
        _.map(intransit_jobs.rows, (rec) => {
          return {
            value: `${rec.rider_id}`,
            label: `${rec.rider_first_name} ${rec.rider_last_name}`,
          }
        })
      )
    }
    //}
    //setTableData(advance_jobs.rows)
  }, [intransit_jobs])

  function setDispatchOrderDelivered(obj) {
    console.log('setDispatchOrderDelivered', obj)

    setDispatchJobDetailStatus(
      {
        status: 10,
        dispatch_job_detail_id: obj.dispatch_job_detail_id,
        action_id: 16,
        action_cpu_id: 21,
      },
      (msg) => {
        fetchData(params)
        toast.success(msg)
      }
    )
  }

  function setDispatchOrderCancelled(obj) {
    console.log('setDispatchOrderCancelled', obj)

    setDispatchJobDetailStatus(
      {
        status: 14,
        dispatch_job_detail_id: obj.dispatch_job_detail_id,
        action_cpu_id: 24,
      },
      (msg) => {
        fetchData(params)
        toast.success(msg)
      }
    )
  }

  function setDispatchOrderUnDelivered(obj) {
    console.log('setDispatchOrderUnDelivered', obj)
    setDispatchJobDetailStatus(
      {
        status: 11,
        reason: obj.reason,
        dispatch_job_detail_id: obj.dispatch_job_detail_id,
        action_id: 17,
        action_cpu_id: 22,
      },
      (msg) => {
        fetchData(params)
        toast.success(msg)
      }
    )
  }

  function onRemoveJob(dispatch_job_id) {
    if (
      window.confirm(
        'You are about to delete the Dispatch Job. Click OK to proceed'
      )
    ) {
      deleteJob({ dispatch_job_id }, (msg) => {
        fetchData(params)
        toast.success(msg)
      })
    }
  }

  //return data['dispatch_job_detail_id'] from children
  function removeDetailItem(dispatch_job_detail_id) {
    deleteJobItem({ dispatch_job_detail_id }, (msg) => {
      fetchData(params)
      toast.success(msg)
    })
  }

  const onFilterTextChange = _.debounce((e) => {
    let textFilter = e

    if (textFilter.length > 0) {
      setParams({ ...params, filterVal: textFilter, page: 0 })
    } else {
      setParams({ ...params, filterVal: textFilter })
    }
  }, 1000)

  return (
    <Container css="grd grd-gp-2 gtr-af slideInRight animate-1 relative over-hid">
      <div
        style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
        className="grd grd-gp-1"
      >
        <div className="grd gtc-af grd-gp-1" style={{ gridColumn: '1/-1' }}>
          <div className="header asc">Dispatch Jobs for Delivery</div>
          <HubFilter getHubID={getHubID} maxBadgeCount={6} />
        </div>
        <Input
          defaultValue={params.filterVal}
          css="pad-1"
          type="search"
          label="Filter..."
          onChange={(e) => onFilterTextChange(e.target.value)}
        />
        <Select
          value={params.payment_method}
          name="payment_method"
          placeholder="Payment method"
          options={paymentMethod.map((data) => {
            return { value: data.value, label: data.name }
          })}
          onChange={(e) =>
            setParams({
              ...params,
              payment_method: e ? e.value : '',
            })
          }
        />
        {riderList.length !== 0 && (
          <Select
            options={riderList}
            value={params.riderFilter}
            name="riderFilter"
            placeholder="Rider Filter"
            simpleValue
            onChange={(selecteditem) =>
              setParams({
                ...params,
                riderFilter: selecteditem ? selecteditem : '',
                page: 0,
                pageSize: 10,
              })
            }
          />
        )}
      </div>
      <div className="over-y-auto scroll pad-1">
        {tableData.length ? (
          <>
            {tableData.map((record, key) => {
              return (
                <DispatchIntransitQueueJob
                  paymentHighlight={params.payment_method}
                  key={key}
                  data={record}
                  hubs={filter_config.hubs}
                  payment_methods={filter_config.paymentOptions}
                  onRemoveItem={removeDetailItem}
                  setDispatchOrderDelivered={setDispatchOrderDelivered}
                  setDispatchOrderUnDelivered={setDispatchOrderUnDelivered}
                  setDispatchOrderCancelled={setDispatchOrderCancelled}
                  onRemoveJob={onRemoveJob}
                  onAssignRider={() => {}}
                />
              )
            })}
            <div className="grd">
              <Pagination
                selPage={params.page}
                pageClick={PageClick}
                count={intransit_jobs.count}
                rows={params.pageSize}
              />
            </div>
          </>
        ) : (
          <span>No Records Found</span>
        )}
      </div>
    </Container>
  )
}

const mapStatetoProps = (state) => ({
  dispatchData: state.dispatchData,
  riderData: state.riderData,
  isfetching: state.webFetchData.isFetching,
})

export default connect(mapStatetoProps, {
  deleteJob,
  deleteJobItem,
  fetchIntransitJobs,
  setDispatchJobDetailStatus,
})(DispatchQueue)
