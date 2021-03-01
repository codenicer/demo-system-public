import React, { useEffect, useState } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import Container from '../../atoms/Container/Container'
import OrderHistoryRow from './OrderHistoryRow'
import { connect } from 'react-redux'
import Pagination from '../../atoms/Pagination/Pagination'
import HubFilter from '../../organisms/HubFilter/HubFilter'
import Input from './../../atoms/Input/Input'
import { toast } from 'react-toastify'
import filter_config from '../../config.json'
import Modal from '../../template/Modal/Modal'
import moment from 'moment-timezone'

import _ from 'lodash'
import {
  updeteClosedOrder,
  fetchHistoryData,
  addReinstatementRequest,
} from '../../scripts/actions/ordersActions'
import Select from 'react-select'
moment.tz.setDefault('Asia/Manila')
// import queryString from 'querystring';

const headerorder = [
  'Order ID',
  'Item Qty',
  'Created',
  'Delivery',
  'Customer',
  'Amount',
  'Hub',
  'Payment Method',
  'Payment',
  'Order Status',
  'Action',
]
const { deliverytime, paymentStatus, paymentMethod } = filter_config

function OrderHistory(props) {
  const [closedOrders, setClosedOrders] = useState(null)
  const [dispatchRiders, setDispatchRiders] = useState([])
  const { fetchHistoryData, addReinstatementRequest } = props
  const {
    orders: { closed_orders },
  } = props

  const [requestCancelledForm, setRequestCancelledForm] = useState({
    remarks: '',
    order_id: '',
    delivery_time: 'Anytime',
  })

  // const {match:{params:{shopify_order_name}}} = props

  const isValid = () => {
    if (
      !requestCancelledForm.remarks ||
      !requestCancelledForm.order_id ||
      !requestCancelledForm.delivery_time
    ) {
      toast.warn('Please input all fields')
      return false
    }
    return true
  }

  const [requestModal, setRequestModal] = useState(false)
  const [orderCount, setOrderCount] = useState(null)
  const [deliveryStatus] = useState([
    { id: 14, name: 'Cancelled By Customer' },
    { id: 13, name: 'Cancelled By Internal' },
    { id: 10, name: 'Delivered' },
  ])

  const getHubID = (id) => {
    const returnedID = id()

    console.log('hub_id', returnedID)

    // setParamsChanged(paramChanged+1)
    setParams({
      ...params,
      hub_filter: returnedID,
    })
  }
  const defaultParams = {
    page: 1,
    pageSize: 15, //by default
    filterall: '',
    shopify_order_name: '',
    delivery_date: moment().format('YYYY-MM-DD'),
  }

  // get the returned params from hubfilter
  const [params, setParams] = useState(defaultParams)

  // const [paramChanged ,setParamsChanged] = useState(0)

  const onReinstatementRequest = (orderData) => {
    setRequestCancelledForm({
      ...requestCancelledForm,
      order_id: orderData.order_id,
    })
    setRequestModal(true)
  }
  function handleInputChange(event) {
    const target = event.target
    setRequestCancelledForm({
      ...requestCancelledForm,
      [target.name]: target.value,
    })
  }

  function reinstatementRequest() {
    if (isValid()) {
      setRequestModal(false)

      addReinstatementRequest(requestCancelledForm, (msg) => {
        toast.success(msg)
        props.history.push('/system/closedorders')
      })
    }
  }

  function handleSelectChange(data, key) {
    // setParamsChanged(paramChanged+1)

    console.log(data)
    if (key == 'payment_status_id') {
      setParams({
        ...params,
        payment_status_id: data,
        page: 1,
      })
    } else if (key == 'payment_id') {
      setParams({
        ...params,
        payment_id: data,
        page: 1,
      })
    } else
      setParams({
        ...params,
        order_status_id: `${data.id}`,
        order_status_name: `${data.name}`,
        page: 1,
      })
  }

  function handleSelectChanges(data, key) {
    // setParamsChanged(paramChanged+1)
    setParams({
      ...params,
      [key]: data,
    })
  }
  function handleChange(event) {
    // setParamsChanged(paramChanged+1)
    setParams({
      ...params,
      [event.target.name]: event.target.value,
      page: 1,
    })
  }

  useEffect(() => {
    if (closed_orders.rows) {
      if (closed_orders.rows.length > 0) {
        setClosedOrders(closed_orders.rows)
        setDispatchRiders(closed_orders.dispatch_rider)
        setOrderCount(closed_orders.count)
      }
    }
  }, [closed_orders])

  function filterTableData(event) {
    // setParamsChanged(paramChanged+1)

    setParams({
      ...params,
      shopify_order_name: event.target.value.trim(),
      hub_filter: 'history',
      delivery_date: ' ',
      page: 1,
    })
  }

  const PageClick = (param) => {
    let retpage = param()

    // setParamsChanged(paramChanged+1)
    const newparam = { ...params, page: retpage }
    setParams(newparam)
    fetchHistoryData(newparam)
  }
  useEffect(() => {
    console.log(params, 'PARAMS')
    if (params.hub_filter && params.hub_filter.length > 0) {
      // if(shopify_order_name){
      //    console.log("HERE FETCH",1)
      //   fetchHistoryData({...params,shopify_order_name})
      // }else{
      //   console.log("HERE FETCH",2)
      fetchHistoryData(params)
      // }
      // if(shopify_order_name){
      //   fetchHistoryData({...params,shopify_order_name})
      // }else{
      //   fetchHistoryData(params)
      // }
    }
  }, [params])

  // useEffect(()=>{
  //   console.log(paramChanged)
  //   if(paramChanged > 1){
  //     const splitPat = props.match.path.split('/')
  //     props.history.replace(`/${splitPat[1]}/${splitPat[2]}`)
  //   }
  // },[paramChanged])

  return (
    <>
      <Container css="grd gtr-af pad-1 slideInRight animate-2 over-hid">
        <div className=" grd grd-gp-1">
          <span className="header">History</span>
          <div
            style={{
              gridTemplateColumns: 'repeat(7, 1fr)',
              // gridTemplateRows: '1fr 1fr',
              // width: '100%'
            }}
            className=" grd grd-gp-1"
          >
            <Input
              defaultValue={params.shopify_order_name}
              css="pad-1"
              type="search"
              label="Filter..."
              name="shopify_order_name"
              onChange={filterTableData}
            />
            <Select
              value={params.order_status_id}
              name="order_status_id"
              placeholder={
                params.order_status_id
                  ? params.order_status_name
                  : 'Delivery Status'
              }
              options={deliveryStatus.map((rec) => {
                return {
                  value: {
                    id: rec.id,
                    name: rec.name,
                  },
                  label: rec.name,
                }
              })}
              onChange={(selecteditem) =>
                handleSelectChange(
                  selecteditem ? selecteditem.value : 0,
                  'order_status_id'
                )
              }
            />
            <Select
              value={params.payment_status_id}
              name="payment_status_id"
              placeholder="Payment Status"
              options={paymentStatus.map((rec, key) => {
                return { value: rec.id, label: rec.name }
              })}
              onChange={(selecteditem) =>
                handleSelectChange(
                  selecteditem ? selecteditem.value : 0,
                  'payment_status_id'
                )
              }
            />
            <Select
              value={params.payment_id}
              name="payment_id"
              placeholder="Payment Method"
              options={paymentMethod.map((rec, key) => {
                return { value: rec.id, label: rec.name }
              })}
              onChange={(selecteditem) =>
                handleSelectChange(
                  selecteditem ? selecteditem.value : 0,
                  'payment_id'
                )
              }
            />
            <Input
              value={params.delivery_date}
              onChange={handleChange}
              name="delivery_date"
              css="pad-1"
              type="date"
              label="Delivery Date"
            />
            <Select
              value={params.delivery_time}
              name="delivery_time"
              placeholder="Delivery time"
              options={deliverytime.map((rec, key) => {
                return { value: rec.id, label: rec.id }
              })}
              onChange={(selecteditem) =>
                handleSelectChanges(
                  selecteditem ? selecteditem.value : 0,
                  'delivery_time'
                )
              }
            />
          </div>
          <div css="pad-1 jss">
            <HubFilter getHubID={getHubID} maxBadgeCount={6} />
          </div>
          <TableHeader css="aic grd-col jic">
            {headerorder.map((value, key) => {
              return <span key={key}>{value}</span>
            })}
          </TableHeader>
        </div>
        <div className="over-y-auto scroll ">
          {closedOrders !== null && closed_orders.count !== 0 ? (
            closedOrders.map((order, i) => {
              return (
                <OrderHistoryRow
                  dispatchRiders={_.filter(dispatchRiders, {
                    order_id: order.order_id,
                  })}
                  key={i}
                  selectedorder={order}
                  onclick={onReinstatementRequest}
                />
              )
            })
          ) : (
            <div className="grd aic jic size-100 header">
              <span>No Records Found</span>
            </div>
          )}
        </div>
        <div className="grd">
          <Pagination
            selPage={params.page}
            pageClick={PageClick}
            count={Number(orderCount)}
            rows={params.pageSize}
          />
        </div>
      </Container>
      {requestModal ? (
        <Modal
          width="400px"
          label="Return Reinstatement "
          clickClose={() => setRequestModal(false)}
          clickCancel={() => setRequestModal(false)}
          clickSubmit={reinstatementRequest}
          submitlabel="Send to reinstatement"
        >
          <label>Delivery Date:</label>
          <Input
            css="pad-1"
            name="delivery_date"
            type="date"
            label={`Enter the Date`}
            onChange={handleInputChange}
          />
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
          <label>Remarks:</label>
          <textarea
            className="pad-1 zoomIn animate-2"
            rows="15"
            name="remarks"
            placeholder="Add details"
            onChange={handleInputChange}
          />
        </Modal>
      ) : (
        ''
      )}
    </>
  )
}

const transferStatetoProps = (state) => ({
  orders: state.orderData,
  isfetching: state.webFetchData.isFetching,
})

export default connect(transferStatetoProps, {
  updeteClosedOrder,
  fetchHistoryData,
  addReinstatementRequest,
})(OrderHistory)
