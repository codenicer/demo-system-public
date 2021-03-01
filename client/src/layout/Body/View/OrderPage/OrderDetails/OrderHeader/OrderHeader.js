import React, { useState, useEffect } from 'react'
import PaymentStatus from '../../../../../../atoms/PaymentStatus/PaymentStatus'
import OrderStatus from '../../../../../../atoms/OrderStatus/OrderStatus'
import Button from '../../../../../../atoms/Button/Button'
import Paper from '../../../../../../atoms/Paper/Paper'
import moment from 'moment-timezone'
import { connect } from 'react-redux'
import './OrderHeader.css'
import { rePrint } from '../../../../../../scripts/actions/assemblyActions'
import {
  unpaidOrder,
  unpaidOrderPage,
  loadOrderTickets,
  removeOverdue,
} from '../../../../../../scripts/actions/ordersActions'
import { loadSelOrderLogs } from '../../../../../../scripts/actions/order_logActions'

import { toast } from 'react-toastify'
import PrintedStatus from '../../../../../../atoms/PrintedStatus/PrintedStatus'
moment.tz.setDefault('Asia/Manila')

const OrderHeader = (props) => {
  const {
    data,
    btnshow,
    saveClick,
    unpaidOrder,
    unpaidOrderPage,
    loadOrderTickets,
    loadSelOrderLogs,
    rePrint,
    removeOverdue,
    paramsFunction,
    history,
    clickClose,
  } = props

  // const created_at = data["created_at"].toString()

  // const date = new Date(created_at.split('T')[0]).toString().slice(0,16)
  // const time = created_at.split('-')[2].split('T')[1].split('.')[0]

  const handleUnpaid = (type, text) => {
    if (window.confirm('Are you sure you want to unpaid this order?')) {
      unpaidOrder(data.order_id, (msg) => {
        toast.success(msg)
        loadOrderTickets(data.order_id)
        loadSelOrderLogs(data.order_id)
        unpaidOrderPage(data.order_id)
        paramsFunction.fetchData(paramsFunction.params)
      })
    }
  }

  function handleReprint(type) {
    if (
      window.confirm(
        `Do you really want to print ${type} of ${data['shopify_order_name']}?`
      )
    ) {
      let order_no = data['shopify_order_name']

      if (data['payment_id'] === 2 && type === 'CR') {
        rePrint('COD', order_no, (msg) => {
          if (msg === 'Message cannot be empty.') {
            toast.error(msg)
          } else {
            toast.success(msg)
          }
        })
      } else {
        rePrint(type, order_no, (msg) => {
          if (msg === 'Message cannot be empty.') {
            toast.error(msg)
          } else {
            toast.success(msg)
          }
        })
      }
    }
  }

  return (
    <Paper css="grd grd-gp-1 gtr-af gtc-fa aic pad-1">
      <div
        className={`${
          btnshow ? 'order_header-btn' : 'order_header'
        } grd aic grd-gp-1`}
      >
        <span className="header-2">{data['shopify_order_name']}</span>
        <PaymentStatus
          paymentstatus={data['payment_status_id']}
          order_name={data['shopify_order_name']}
          order_id={data['order_id']}
          removeOverdue={removeOverdue}
        />
        {data['dar_printout_ready'] === 1 && (
          <PrintedStatus printedstatus={data['dar_printout_ready']} />
        )}
        <OrderStatus orderStatus={data['order_status_id']} />
        {btnshow && (
          <Button
            css="order_page-save_changes"
            color="primary"
            onClick={saveClick}
          >
            Save Changes
          </Button>
        )}
        <span
          style={{ gridColumn: '1 / 4', gridRow: '2 / 3' }}
          className="ass sublabel italic"
        >
          Placed on{' '}
          {moment(data['created_at']).format('MMM. DD, YYYY hh:mm:ss A')}
        </span>
      </div>
      <div
        style={{ gridRow: '2 / 3', gridColumn: '2 / -1' }}
        className="ass grd gtr-af grd-gp-1"
      >
        <span style={{ gridColumn: '1 / -1' }} className="label">
          Actions
        </span>
        <div className="grd grd-col grd-col-f grd-gp-1">
          <button
            className="button button-color--primary"
            onClick={() => handleReprint('DAR')}
          >
            PRINT DAR
          </button>
          {(data['payment_id'] === 2 || data['payment_id'] === 3) && (
            <button
              className="button button-color--primary"
              onClick={() => handleReprint('CR')}
            >
              PRINT CR
            </button>
          )}
          <button
            className="button button-color--primary mar-l-3"
            onClick={() => handleReprint('MSG')}
          >
            PRINT MSG
          </button>
          {data.payment_status_id === 2 && (
            <button
              className="button button-color--primary"
              style={{ cursor: 'pointer' }}
              onClick={handleUnpaid}
            >
              Unpaid
            </button>
          )}
          {data.payment_status_id === 2 && data.payment_id === 10 && (
            <button
              className="button button-color--primary"
              style={{ marginRight: '15px', cursor: 'pointer' }}
              onClick={() => {
                clickClose()
                history.push(`/system/refunds/${data.order_id}`)
              }}
            >
              Refund
            </button>
          )}
        </div>
      </div>
      <div className="ass grd grd-gp-1">
        <span className="label">Quick Links</span>
        <a
          rel="noopener noreferrer"
          className="pad-x-1 jss"
          href="#"
          target="_blank"
        >
          Shopify
        </a>
        <a
          rel="noopener noreferrer"
          className="pad-x-1 jss"
          href="#"
          target="_blank"
        >
          Freshdesk: Order ID
        </a>
        <a
          rel="noopener noreferrer"
          className="pad-x-1 jss"
          href="#"
          target="_blank"
        >
          Freshdesk: Customer Email
        </a>
      </div>
    </Paper>
  )
}

OrderHeader.defaultProps = {
  btnshow: false,
}

export default connect(null, {
  unpaidOrder,
  unpaidOrderPage,
  rePrint,
  loadOrderTickets,
  loadSelOrderLogs,
  removeOverdue,
})(OrderHeader)
