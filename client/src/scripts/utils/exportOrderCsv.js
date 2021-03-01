import moment from 'moment-timezone'
moment.tz.setDefault('Asia/Manila')
export default (orders) => {
  const headers =
    'order_id\tshopify_order_name\tpayment_status\torder_status\torder_items\ttotal_price\tdelivery_date\t' +
    'delivery_time\tcustomer_name\tcustomer_email\tbilling_address\tbilling_city\t' +
    'billing_country\tbilling_zip\tshipping_name\tshipping_phone\tshipping_address\tshipping_city\tshipping_country\tshipping_zip\n'

  const order_status = {
    1: 'created',
    2: 'accepted',
    3: 'ready_for_production',
    4: 'in_production',
    5: 'ready_to_assemble',
    6: 'in_assembly',
    7: 'ready_to_ship',
    8: 'rider_assigned',
    9: 'shipped',
    10: 'delivered',
    11: 'failed_delivery',
    12: 'on_hold',
    13: 'cancelled_internal',
    14: 'cancelled_by_customer',
    15: 'dispatch booked',
    16: 'redispatch',
    17: 'completed',
  }
  const payment_status = {
    1: 'pending',
    2: 'paid',
    3: 'refunded',
    4: 'overdue',
  }

  let ordersToString = ''
  orders.forEach((o) => {
    const info =
      `${o.order_id},` +
      `${o.shopify_order_name},` +
      `${payment_status[o.payment_status_id]},` +
      `${order_status[o.order_status_id]},` +
      `${o.order_items
        .map((x, i) =>
          i < o.order_items.length - 1
            ? `(${x.quantity}) ${x.title} / `
            : `(${x.quantity}) ${x.title}`
        )
        .toLocaleString()
        .replace(/,/g, '')},` +
      `${o.total_price},` +
      `${o.delivery_date},` +
      `${o.delivery_time},` +
      `${o.addresses.billing_name},` +
      `${o.addresses.billing_phone},` +
      `${o.addresses.billing_address_1.toString().replace(/[,#]/g, '')} ${
        o.addresses.billing_address_2 &&
        o.addresses.billing_address_2.toString().replace(/,/g, '')
      },` +
      `${o.addresses.billing_city.toString().replace(/,/g, '`')},` +
      `${o.addresses.billing_country},` +
      `${o.addresses.billing_zip},` +
      `${o.addresses.shipping_name},` +
      `${o.addresses.shipping_phone},` +
      `${o.addresses.shipping_address_1.toString().replace(/[,#]/g, '`')} ${
        o.addresses.shipping_address_2 &&
        o.addresses.shipping_address_2.toString().replace(/,/g, '')
      },` +
      `${o.addresses.shipping_city.toString().replace(/,/g, '`')},` +
      `${o.addresses.shipping_country},` +
      `${o.addresses.shipping_zip}\n`

    ordersToString = ordersToString.concat(info)
  })

  const test2 = document.createElement('a')
  test2.href = 'data:attachment/csv,' + headers + ordersToString
  test2.target = '_Blank'
  test2.download = `export ${moment().format('YYYYMMDDHHmm')}.csv`
  document.body.appendChild(test2)

  test2.click()
}
