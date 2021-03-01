import React, { useState, useEffect, useRef } from 'react'
import Button from '../../../../atoms/Button/Button'
import Input from '../../../../atoms/Input/Input'
import Select from 'react-select'
import Container from '../../../../atoms/Container/Container'
import { fetchRestOfPhilDispatch } from '../../../../scripts/actions/ordersActions'
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
import moment from 'moment-timezone'
import _ from 'lodash'
import Pagination from '../../../../atoms/Pagination/Pagination'
import ModalHold from '../../../../Pages/ModalHold/ModalHold'
import PendingOrderRow from '../PendingOrders/PendingOrderRow/PendingOrderRow'
import PendingOrderHeader from '../PendingOrders/PendingOrderHeader/PendingOrderHeader'

moment.tz.setDefault('Asia/Manila')
const RestOfPhilOrdersDispatch = (props) => {
  const { dispositions, match } = props

  const pagesize = 15
  //load orders based on pagination

  const { fetchRestOfPhilDispatch } = props

  const defaultParams = {
    page: 1,
    pageSize: pagesize,
    payment_id: 0,
    product_id: 0,
    payment_status_id: 0,
    shopify_order_name: '',
    created_at: moment().format('YYYY-MM-DD'),
  }
  const [params, setParams] = useState(defaultParams)

  // const {match:{params:{shopify_order_name}}} = props

  const {
    orderData: { ordersRestOfPhilDispatch },
  } = props
  const {
    authData: { user },
  } = props
  const [tableData, setTableData] = useState([])
  const [orderCount, setOrderCount] = useState(0)

  //const [paymentDrawer, setPaymentDrawer] = useState({show: false, type: 'confirm'})

  const {
    paymentMethod,
    paymentStatus,
    orderStatus,
    deliverytime,
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

  // const holdFormClose = () => {
  //   setModal(false);
  //   setHold(defaultHoldFormValue);
  // };

  function handleHoldCommentChange(e) {
    setHold({
      ...holdForm,
      comment: e.target.value,
    })
  }

  // get the returned params from hubfilter
  // const getHubID = id => {
  //   const returnedID = id();
  //   setParams({
  //     ...params
  //   });
  // };

  function fetchData(mParams = null) {
    fetchRestOfPhilDispatch(mParams || params)
  }

  const handleFilterChange = _.debounce((e) => {
    let textFilter = e

    setParams({ ...params, shopify_order_name: textFilter, delivery_date: '' })
  }, 500)

  function handleSelectChange(data, key) {
    setParams({
      ...params,
      [key]: data,
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
    // console.log('user', user);
    if (user) {
      const availhubs = _.map(user.user_info.hubs, (hub) => {
        return { hub_id: hub['user_hub']['hub_id'], name: hub.name }
      })
      setHubList(availhubs)
    }
  }, [user])

  useEffect(() => {
    //handleLoadOrders()
    fetchData(params)
  }, [])

  //check if params and filter changed
  useEffect(() => {
    // const splitPat = props.match.path.split('/')
    // if(defaultParams !== params){
    //   props.history.replace(`/${splitPat[1]}/${splitPat[2]}`)
    // }

    if (params.hub_filter !== '-1') {
      fetchData(params)
    }
  }, [params])

  // useEffect(()=>{
  //   if(shopify_order_name){
  //     fetchData({ page: 1,
  //       pageSize: pagesize,shopify_order_name});
  //   }else{
  //     if ((!shopify_order_name) && params.hub_filter !== "-1") {
  //       fetchData(params);
  //     }
  //   }

  // },[shopify_order_name])

  //check if params and filter changed
  useEffect(() => {
    setTableData(ordersRestOfPhilDispatch.rows)
    setOrderCount(ordersRestOfPhilDispatch.count)
    setSelectedID([])
  }, [ordersRestOfPhilDispatch])

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
            <span className="header asc">
              Rest of the Philippines (Dispatch)
            </span>
          </div>
          <div
            style={{
              gridTemplateColumns: 'repeat(7, 1fr)',
              // gridTemplateRows: '1fr 1fr',
              // width: '100%'
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
              value={params.created_at}
              onChange={handleChange}
              name="created_at"
              css="pad-1"
              type="date"
              label="Created at"
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
            {/* <div className="grd grd-gp-1 grd-col grd-col-f">
              {!bulk ? (
                <Button color="primary" onClick={() => setBulk(true)}>
                  Bulk Action
                </Button>
              ) : (
                <>
                  <Button color="neutral" onClick={() => setBulk(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={btnDisabler}
                    color="warning"
                    onClick={() => setModal(true)}
                  >
                    Hold
                  </Button>
                </>
              )}
            </div> */}
          </div>
        </div>
        <div className="grd pad-y-1">
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
            data={
              ordersRestOfPhilDispatch !== null &&
              ordersRestOfPhilDispatch.length > 0
                ? ordersRestOfPhilDispatch[0]
                : []
            }
            css={`
              ${bulk ? 'pending_template-bulk' : 'pending_template'} aic
            `}
          />

          <RowRender
            match={match}
            idToArray={idToArray}
            bulk={bulk}
            orders={tableData}
            selectedId={selectedId}
            hubList={hubList}
            history={props.history}
          />

          {!tableData.length ? (
            <h1 style={{ textAlign: 'center' }}>No orders found</h1>
          ) : (
            ''
          )}
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

const RowRender = (props) => {
  const { orders, bulk, idToArray, selectedId, hubList, match } = props
  return orders ? (
    orders.map((order, key) => {
      return (
        <PendingOrderRow
          page={props.page}
          idToArray={idToArray}
          selectedData={selectedId}
          history={props.history}
          match={match}
          //  loadCustomerPageData ={context.loadCustomerPageData}
          hubList={hubList}
          bulk={bulk}
          css={`
            ${bulk ? 'pending_template-bulk' : 'pending_template'}
          `}
          key={key}
          orders={orders}
          rowData={order}
          indexColumn={key}
        />
      )
    })
  ) : (
    <></>
  )
}

const transferStatetoProps = (state) => ({
  orderData: state.orderData,
  isFetching: state.webFetchData.isFetching,
  dispositions: state.dispoData.dispositions,
  authData: state.authData,
})

export default connect(transferStatetoProps, {
  fetchRestOfPhilDispatch,
  handleLoadOrders,
  orderChangePage,
  filterOrder,
  fitlerTextOnchange,
  loadNewOrders,
  holdMultiOrder,
})(RestOfPhilOrdersDispatch)
