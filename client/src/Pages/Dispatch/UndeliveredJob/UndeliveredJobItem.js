import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import Container from '../../../atoms/Container/Container'
import TableHeader from '../../../atoms/TableHeader/TableHeader'
import UndeliveredRow from './UndeliveredRow/UndeliveredRow'
import {
  fetchUndeliveredItems,
  redispatchDetailJobItem,
  redispatchDetailJobItemCpu,
} from './../../../scripts/actions/dispatchActions'
import { toast } from 'react-toastify'
import filter_config from '../../../config.json'
import './UndeliveredTable.css'
import Pagination from '../../../atoms/Pagination/Pagination'
import Input from '../../../atoms/Input/Input'
import HubFilter from '../../../organisms/HubFilter/HubFilter'
import Modal from '../../../template/Modal/Modal'
import _ from 'lodash'
import queryString from 'querystring'
import { ENGINE_METHOD_NONE } from 'constants'
const headerdata = [
  'Action',
  'Order ID',
  'Product/Amount',
  'Delivery',
  'Contact Person',
  'Address',
  'Payment Type',
  'Date Updated',
  'Last Rider',
  'Reason',
]

const UndeliveredTable = (props) => {
  let filterVal = props.location.search
    ? queryString.parse(props.location.search.replace('?', ''))
    : ''

  const { deliverytime, paymentMethod } = filter_config

  const {
    fetchUndeliveredItems,
    redispatchDetailJobItem,
    redispatchDetailJobItemCpu,
  } = props
  const {
    dispatchData: { undelivered_jobs },
  } = props
  const [requestModal, setRequestModal] = useState(false)
  const [totalRecCount, setTotalRecCount] = useState(0)
  const [tableData, setTableData] = useState([])
  const [params, setParams] = useState({
    page: 1,
    pageSize: 30,
    filterall: '',
    hub_filter: '',
    filterVal: filterVal ? filterVal.term : '',
    payment_method: '',
  })

  // state to show delivery time input on redispatch modal
  const [showDelTime, setShowDelTime] = useState(false)

  const [requestRedispatchForm, setRequestRedispatchForm] = useState({
    delivery_time: null,
    delivery_date: null,
    redispatchData: {},
  })

  console.log('redispatch', requestRedispatchForm)

  // get the returned params from hubfilter
  const getHubID = (id) => {
    const returnedID = id()
    console.log(returnedID, 'returnedID')
    setParams({
      ...params,
      hub_filter: returnedID,
    })
  }

  function fetchData(params) {
    fetchUndeliveredItems(params)
  }

  const isValid = () => {
    if (
      !requestRedispatchForm.delivery_date ||
      !requestRedispatchForm.delivery_time
    ) {
      toast.warn('Please input all fields')
      return false
    }
    return true
  }

  function redispatchItem(dispatch_data) {
    if (isValid()) {
      if (
        window.confirm(
          'You are about to redispatch this Job Item, Click OK to proceed'
        )
      ) {
        setRequestModal(false)
        redispatchDetailJobItem({ requestRedispatchForm }, (msg) => {
          fetchData(params)
          toast.success(msg)
        })
      }
    }
  }

  useEffect(() => {
    setParams({ ...params, pageSize: parseInt(15) })
  }, [])

  useEffect(() => {
    fetchData(params)
  }, [params])

  useEffect(() => {
    setTableData(undelivered_jobs.rows)
    console.log(undelivered_jobs)
    setTotalRecCount(undelivered_jobs.count)
  }, [undelivered_jobs])

  const PageClick = (x) => {
    let retpage = x()
    const newparam = { ...params, page: retpage }
    setParams(newparam)
    fetchData(newparam)
  }

  const redispatchUpdate = (redispatchData) => {
    console.log(redispatchData, 'redispatch data')
    setRequestRedispatchForm({
      ...requestRedispatchForm,
      redispatchData: redispatchData,
    })
    if (redispatchData.payment_method == 'CPU') {
      let reqform = { ...requestRedispatchForm }
      reqform.redispatchData = redispatchData

      if (
        window.confirm(
          'You are about to redispatch this Job Item, Click OK to proceed!'
        )
      ) {
        setRequestModal(false)
        redispatchDetailJobItemCpu({ reqform }, (msg) => {
          fetchData(params)
          toast.success(msg)
        })
      }
    } else {
      setShowDelTime(redispatchData.jobtype === 'delivery' ? true : false)
      setRequestModal(true)
    }
  }

  function handleInputChange(event) {
    const target = event.target
    setRequestRedispatchForm({
      ...requestRedispatchForm,
      [target.name]: target.value,
    })
  }

  const onFilterTextChange = _.debounce((e) => {
    let textFilter = e

    setParams({ ...params, filterVal: textFilter })
  }, 1000)

  return (
    <Container css="pad-1 grd gtr-af over-hid">
      <div className="grd gtr-af grd-gp-1">
        <div
          style={{ gridTemplateColumns: 'auto auto auto 1fr' }}
          className="grd grd-gp-1"
        >
          <span className="header asc">Failed Delivery</span>
          <Input
            defaultValue={params.filterVal}
            css="pad-1"
            type="search"
            label="Filter..."
            onChange={(e) => onFilterTextChange(e.target.value)}
          />
          <select
            className="pad-1"
            placeholder="Payment method"
            onChange={(e) =>
              setParams({
                ...params,
                payment_method: e.target.value,
              })
            }
          >
            {paymentMethod.map((method) => {
              return (
                <option key={method.id} value={method.value}>
                  {method.name}
                </option>
              )
            })}
          </select>
          <HubFilter getHubID={getHubID} maxBadgeCount={6} />
        </div>
        <TableHeader css="aic jic undelivered_header">
          {headerdata.map((value, key) => {
            return <span key={key}>{value}</span>
          })}
        </TableHeader>
      </div>
      <div className="over-hid over-y-auto scroll">
        {tableData.length ? (
          <>
            {tableData.map((record, key) => {
              return (
                <UndeliveredRow
                  key={key}
                  data={record}
                  onRedispatch={redispatchItem}
                  onclick={redispatchUpdate}
                />
              )
            })}
            <div className="grd">
              <Pagination
                selPage={params.page}
                count={totalRecCount}
                rows={params.pageSize}
                pageClick={PageClick}
              />
            </div>
          </>
        ) : (
          <div>No Records Found</div>
        )}
      </div>
      {requestModal && (
        <Modal
          width="300px"
          label="Redispatch"
          clickClose={() => setRequestModal(false)}
          clickCancel={() => setRequestModal(false)}
          clickSubmit={redispatchItem}
          submitlabel="Redispatch"
        >
          <label>Delivery Date:</label>
          <Input
            css="pad-1"
            name="delivery_date"
            type="date"
            label={`Enter the date`}
            onChange={handleInputChange}
          />
          {showDelTime && (
            <>
              <label>Delivery Time:</label>
              <select
                className="pad-1"
                name="delivery_time"
                onChange={handleInputChange}
              >
                {deliverytime.map((time, key) => {
                  return (
                    <option key={key} value={time.id}>
                      {time.id}
                    </option>
                  )
                })}
              </select>
            </>
          )}
        </Modal>
      )}
    </Container>
  )
}

const mapStatetoProps = (state) => ({
  dispatchData: state.dispatchData,
  riderData: state.riderData,
  isfetching: state.webFetchData.isFetching,
})

export default connect(mapStatetoProps, {
  redispatchDetailJobItem,
  redispatchDetailJobItemCpu,
  fetchUndeliveredItems,
})(UndeliveredTable)
