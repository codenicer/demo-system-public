import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Container from '../../../atoms/Container/Container'
import Input from '../../../atoms/Input/Input'
import DispatchHistoryQueueJob from './DispatchHistoryQueueJob/DispatchHistoryQueueJob'
import {
  fetchHistoryJobs,
  deleteJob,
  deleteJobItem,
  fetchJobsForAssignment,
  addJobItem,
} from './../../../scripts/actions/dispatchActions'
import { toast } from 'react-toastify'
import _ from 'lodash'
import Pagination from '../../../atoms/Pagination/Pagination'
import HubFilter from '../../../organisms/HubFilter/HubFilter'
import Select from 'react-select/lib/Select'
import filter_config from '../../../config.json'

const DispatchQueue = (props) => {
  const { paymentMethod } = filter_config
  const {
    fetchHistoryJobs,
    deleteJob,
    deleteJobItem,
    fetchJobsForAssignment,
  } = props
  const {
    dispatchData: { job_history },
  } = props
  const [riderList, setRiderList] = useState([])

  const [tableData, setTableData] = useState([])
  const [params, setParams] = useState({
    page: 1,
    pageSize: 30, //15, //by default
    filterall: '',
    hub_filter: '',
    filterVal: '',
    riderFilter: '',
    payment_method: '',
  })

  function fetchData(params) {
    fetchHistoryJobs(params)
  }
  useEffect(() => {
    fetchData(params)
  }, [params])

  // get the returned params from hubfilter
  const getHubID = (id) => {
    const returnedID = id()
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
    // if(job_history.rows.length){
    setTableData(job_history.rows)

    if (job_history.rows.length && !riderList.length) {
      setRiderList(
        _.map(job_history.rows, (rec) => {
          return {
            value: `${rec.rider_id}`,
            label: `${rec.rider_first_name} ${rec.rider_last_name}`,
          }
        })
      )
    }
    //}
    //setTableData(job_history.rows)
  }, [job_history])

  function showAddItem(dispatch_job_id) {
    fetchJobsForAssignment()
    ///console.log('itemModal:',dispatch_job_id);
    // setAddItemModal(true);
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

    setParams({ ...params, filterVal: textFilter })
  }, 1000)

  return (
    <>
      <Container css="grd grd-gp-2 gtr-af slideInRight animate-1 relative over-hid">
        <div
          style={{ gridTemplateColumns: '1fr 1fr 1fr' }}
          className="grd grd-gp-1"
        >
          <div className="grd grd-gp-1 gtc-af" style={{ gridColumn: '1/-1' }}>
            <span className="header asc">Dispatch History</span>
            <HubFilter getHubID={getHubID} maxBadgeCount={6} />
          </div>
          <Input
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
                  <DispatchHistoryQueueJob
                    key={key}
                    data={record}
                    onRemoveItem={removeDetailItem}
                    onRemoveJob={onRemoveJob}
                    itemModal={showAddItem}
                    onAssignRider={() => {}}
                    hubs={filter_config.hubs}
                    payment_methods={filter_config.paymentOptions}
                  />
                )
              })}
              <div className="grd">
                <Pagination
                  selPage={params.page}
                  count={job_history.count}
                  rows={params.pageSize}
                  pageClick={PageClick}
                />
              </div>
            </>
          ) : (
            <div>No Records Found</div>
          )}
        </div>
      </Container>
    </>
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
  fetchHistoryJobs,
  fetchJobsForAssignment,
  addJobItem,
})(DispatchQueue)
