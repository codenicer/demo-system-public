import React, { useEffect, useState } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import Container from '../../atoms/Container/Container'
import ReinstatementOrderRow from './ReinstatementOrderRow'
import { connect } from 'react-redux'
import { getReinstatementData } from '../../scripts/actions/ordersActions'
import Pagination from '../../atoms/Pagination/Pagination'
import Input from './../../atoms/Input/Input'
import HubFilter from '../../organisms/HubFilter/HubFilter'

const headerorder = [
  'Order ID',
  'Item Qty',
  'Created',
  'New Delivery',
  'Customer',
  'Amount',
  'Hub',
  'Remarks',
  'Created By',
  'Action',
]
function OrderReinstatement(props) {
  const { getReinstatementData } = props

  const [params, setParams] = useState({
    page: 1,
    pageSize: 15, //by default
    filterall: '',
    shopify_order_name: '',
  })

  const {
    reinstatement: { reinstatement_order },
  } = props

  const [reinstatementOrders, setReinstatementOrders] = useState([])
  const [reinstatementCount, setReinstatementCount] = useState([])
  const PageClick = (param) => {
    let retpage = param()
    const newparam = { ...params, page: retpage }
    setParams(newparam)
    getReinstatementData(newparam)
  }

  const getHubID = (id) => {
    const returnedID = id()
    setParams({
      ...params,
      hub_filter: returnedID,
    })
  }

  function filterTableData(event) {
    console.log('event', event)
    setParams({ ...params, shopify_order_name: event.target.value })
  }

  useEffect(() => {
    setReinstatementOrders(reinstatement_order.rows)
    setReinstatementCount(reinstatement_order.count)
  }, [reinstatement_order])

  useEffect(() => {
    getReinstatementData(params)
  }, [params])

  return (
    <>
      <Container css="grd gtr-af pad-1 slideInRight animate-2 over-hid">
        <div className="grd grd-gp-1">
          <span className="header">Reinstatement Orders</span>
          <Input
            css="pad-1"
            type="search"
            label="Filter..."
            onChange={filterTableData}
          />
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
          {reinstatementOrders !== undefined &&
          reinstatementOrders.length > 0 ? (
            reinstatementOrders.map((order, i) => {
              return (
                <ReinstatementOrderRow
                  key={i}
                  selectedorder={order}
                  param={params}
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
            count={reinstatementCount}
            rows={params.pageSize}
          />
        </div>
      </Container>
    </>
  )
}
const transferStatetoProps = (state) => ({
  isfetching: state.webFetchData.isFetching,
  reinstatement: state.orderReinstatementData,
})

export default connect(transferStatetoProps, {
  getReinstatementData,
})(OrderReinstatement)
