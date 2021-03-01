import React, { useState, useEffect } from 'react'
import Button from '../../../../atoms/Button/Button'
import Input from '../../../../atoms/Input/Input'
import Select from 'react-select'
import Container from '../../../../atoms/Container/Container'
import PendingOrderHeader from './PendingOrderHeader/PendingOrderHeader'
import PendingOrderRow from './PendingOrderRow/PendingOrderRow'
import { fetchOrders } from '../../../../scripts/actions/ordersActions'
import {
  handleLoadOrders,
  filterOrder,
  fitlerTextOnchange,
  loadNewOrders,
  orderChangePage,
  holdMultiOrder,
} from '../../../../scripts/actions/ordersActions'
import { connect } from 'react-redux'
import filter_config from '../../../../config.json'
import { toast } from 'react-toastify'
import './PendingOrders.css'
import moment from 'moment-timezone'
import _ from 'lodash'
import Pagination from '../../../../atoms/Pagination/Pagination'
import ModalHold from '../../../../Pages/ModalHold/ModalHold'
import HubFilter from '../../../../organisms/HubFilter/HubFilter'
import queryString from 'querystring'
import exportCsv from '../../../../scripts/utils/exportOrderCsv'
moment.tz.setDefault('Asia/Manila')

const PendingOrders = (props) => {
  const { dispositions, setFunctionParamns } = props

  const pagesize = 15

  let filterVal = props.location.search
    ? queryString.parse(props.location.search.replace('?', ''))
    : ''

  //load orders based on pagination

  const { fetchOrders } = props

  const [params, setParams] = useState({
    page: 1,
    pageSize: pagesize,
    hub_filter: [],
    payment_id: 0,
    product_id: 0,
    payment_status_id: 0,
    deliver_time: '',
    delivery_date: filterVal ? '' : moment().format('YYYY-MM-DD'),
    shopify_order_name: filterVal ? filterVal.term : '',
  })

  const {
    orderData: { orders },
  } = props
  const {
    authData: { user },
  } = props
  const [tableData, setTableData] = useState([])
  const [orderCount, setOrderCount] = useState(0)

  const {
    paymentMethod,
    paymentStatus,
    orderStatus,
    deliverytime,
    printStatus,
  } = filter_config

  const [bulk, setBulk] = useState(false)
  const [hubList, setHubList] = useState([])

  const [modal, setModal] = useState(false)

  const [selectedId, setSelectedID] = useState([])

  const [btnDisabler, setBtnDisabler] = useState(true)

  const defaultHoldFormValue = {
    disposition_id: 1,
    name: 'ODZ',
    category: 14,
    comment: '',
  }

  const [holdForm, setHold] = useState(defaultHoldFormValue)

  const handleHolFormChange = (selected) => {
    setHold({ ...holdForm, ...selected })
  }

  const handleHoldSubmit = () => {
    if (holdForm['name'].replace(/\s/g, '').length < 1) {
      toast.error('Invalid Information')
    } else {
      // console.log('holdForm', holdForm);
      // console.log('selectedId', selectedId);
      // holdMultiOrder(holdForm,selectedId,(type,text)=>{
      //     holdFormClose()
      //        toast[type](text)
      // })
    }
  }
  // const holdFormClose = () =>{
  //     setModal(false)
  //     setHold(defaultHoldFormValue)
  // }

  function handleHoldCommentChange(e) {
    setHold({
      ...holdForm,
      comment: e.target.value,
    })
  }

  // get the returned params from hubfilter
  const getHubID = (id) => {
    const returnedID = id()
    setParams({
      ...params,
      hub_filter: returnedID,
    })
  }

  function fetchData(mParams = null) {
    fetchOrders(mParams || params)
  }

  const handleFilterChange = _.debounce((e) => {
    let textFilter = e
    setParams({
      ...params,
      shopify_order_name: textFilter.trim(),
      page: 1,
      delivery_date: '',
    })
  }, 500)

  function handleSelectChange(data, key) {
    console.log('data', data)
    setParams({
      ...params,
      [key]: data,
      page: 1,
    })
  }

  function handleChange(event) {
    setParams({
      ...params,
      [event.target.name]: event.target.value,
      page: 1,
    })
  }

  const PageClick = (x) => {
    let retpage = x()
    setParams({
      ...params,
      page: retpage,
    })
  }

  function idToArray(selectedorder) {
    let newArray
    if (selectedId.includes(selectedorder)) {
      newArray = [...selectedId]
      const index = selectedId.findIndex((x) => x === selectedorder)
      newArray.splice(index, 1)
      setSelectedID(newArray)
    } else {
      newArray = [...selectedId, selectedorder]
      setSelectedID(newArray)
    }
    setBtnDisabler(newArray.length === 0)
  }

  useEffect(() => {
    if (user) {
      const availhubs = _.map(user.user_info.hubs, (hub) => {
        return { hub_id: hub['user_hub']['hub_id'], name: hub.name }
      })
      setHubList(availhubs)
    }
  }, [user])

  //check if params and filter changed
  useEffect(() => {
    if (params.hub_filter.length > 0) {
      fetchData(params)
    }
    setFunctionParamns({ fetchData, params })
  }, [params])

  //check if params and filter changed
  useEffect(() => {
    setTableData(orders.rows)
    setOrderCount(orders.count)
    setSelectedID([])
  }, [orders])

  //      <a href='/somefile.txt' download >Click to download</a>
  return (
    <>
      <Container
        css="grd order-grid relative over-hid slideInRight animate-2"
        width="100%"
      >
        <div
          className="grd grd-gp-1 pad-1"
          style={{ gridTemplateRows: 'min-content auto' }}
        >
          <div className="grd gtc-af grd-gp-3 jis">
            <span className="header asc">Orders</span>
            <HubFilter getHubID={getHubID} maxBadgeCount={6} />
          </div>
          <div
            style={{
              gridTemplateColumns: 'repeat(8, 1fr)',
            }}
            className="grd grd-gp-1"
          >
            <Input
              defaultValue={params.shopify_order_name}
              name="shopify_order_name"
              type="search"
              css="pad-1"
              onChange={(e) => handleFilterChange(e.target.value)}
              label="Filter orders"
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
            <Select
              value={params.order_status_id}
              name="order_status_id"
              placeholder="Order Status"
              options={orderStatus.map((rec, key) => {
                return { value: rec.id, label: rec.name }
              })}
              onChange={(selecteditem) =>
                handleSelectChange(
                  selecteditem ? selecteditem.value : 0,
                  'order_status_id'
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
                handleSelectChange(
                  selecteditem ? selecteditem.value : 0,
                  'delivery_time'
                )
              }
            />
            <Button color="primary" onClick={() => exportCsv(orders.rows)}>
              Download Orders Data
            </Button>
            {/* <div 
                        className='grd grd-gp-1 grd-col grd-col-f'
                        >
                        {!bulk ?
                            <Button
                                color='primary'
                                onClick={() => setBulk(true)}
                                >
                            Bulk Action
                            </Button>
                            :
                            <>
                                <Button
                                    color='neutral'
                                    onClick={() => setBulk(false)}
        
                                >
                                Cancel
                                </Button>
                                <Button
                                    disabled={btnDisabler}
                                    color='warning'
                                    onClick={() => setModal(true)}
        
                                >
                                Hold
                                </Button>
                            </>   
                        }
                    </div> */}
          </div>
        </div>
        <div className="grd">
          <Pagination
            selPage={params.page}
            pageClick={PageClick}
            count={orderCount || 0}
            rows={params.pageSize}
          />
        </div>
        <div
          style={{
            overflow: 'auto',
          }}
        >
          <PendingOrderHeader
            bulk={bulk}
            data={orders !== null && orders.length > 0 ? orders[0] : []}
            css={`
              ${bulk ? 'pending_template-bulk' : 'pending_template'} aic
            `}
          />
          <RowRender
            params={params}
            fetchData={fetchData}
            idToArray={idToArray}
            bulk={bulk}
            orders={tableData}
            selectedId={selectedId}
            hubList={hubList}
          />
        </div>
        <div className="grd pad-y-1">
          <Pagination
            selPage={params.page}
            pageClick={PageClick}
            count={orderCount || 0}
            rows={params.pageSize}
          />
        </div>
      </Container>
      {modal && (
        <ModalHold
          level={selectedId.length === 1 ? 'Order' : 'Orders'}
          clickClose={() => setModal(false)}
          clickCancel={() => setModal(false)}
          clickSubmit={handleHoldSubmit}
          holdreasonlist={dispositions}
          holdreason={holdForm['disposition_id'] === null}
          selectChange={(e) => handleHolFormChange(JSON.parse(e.target.value))}
          textChange={(e) =>
            setHold({
              ...holdForm,
              name: e.target.value,
            })
          }
          noteChange={handleHoldCommentChange}
        />
      )}
    </>
  )
}

const RowRender = React.memo((props) => {
  const {
    orders,
    bulk,
    idToArray,
    selectedId,
    hubList,
    params,
    fetchData,
  } = props
  return (
    orders &&
    orders.map((order) => {
      return (
        <PendingOrderRow
          params={params}
          fetchData={fetchData}
          idToArray={idToArray}
          selectedData={selectedId}
          hub={hubList.find((hub) => hub.hub_id === order.hub_id)}
          bulk={bulk}
          css={bulk ? 'pending_template-bulk' : 'pending_template'}
          key={order['order_id']}
          rowData={order}
        />
      )
    })
  )
})

const transferStatetoProps = (state) => ({
  orderData: state.orderData,
  isFetching: state.webFetchData.isFetching,
  dispositions: state.dispoData.dispositions,
  authData: state.authData,
})

export default connect(transferStatetoProps, {
  fetchOrders,
  handleLoadOrders,
  orderChangePage,
  filterOrder,
  fitlerTextOnchange,
  loadNewOrders,
  holdMultiOrder,
})(PendingOrders)
