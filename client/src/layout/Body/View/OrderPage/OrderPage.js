import React, { useState, useEffect } from 'react'
import OrderItemList from '../../../../template/OrderItemList/OrderItemList'
import OrderItemRow from '../../../../organisms/OrderItemRow/OrderItemRow'
import ProductRow from '../../../../atoms/ProductRow/ProductRow'
import OrderDetails from './OrderDetails/OrderDetails'
import OrderHeader from './OrderDetails/OrderHeader/OrderHeader'
import Page from '../../../../atoms/Page/Page'
import OrderNotes from './OrderNotes/OrderNotes'
import OrderTicket from './OrderTicket/OrderTicket'
import OrderLogs from './OrderLogs/OrderLogs'
import OrderCSNotes from './OrderCSNotes/OrderCSNotes'
import Modal from '../../../../template/Modal/Modal'
import Input from '../../../../atoms/Input/Input'
// import socket from '../../../../scripts/utils/socketConnect'
import './OrderPage.css'
import { clearSelected, updateOrder, updateLognNotes, loadSelOrder } from '../../../../scripts/actions/ordersActions'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'

const OrderPage = (props) => {
  const {data, clearSelected, updateOrder, updateLognNotes,loadSelOrder,paramsFunction, history } = props

  const inisialState = {
    date: false,
    time: false,
    bname: false,
    bcontact: false,
    baddress: false,
    sname: false,
    scontact: false,
    saddress: false,
    message: false,
    notes: false,
    cpu_date: false,
    cpu_time : false,
    cpu_hub : false
  }
  const [edit, setEdit] = useState({...inisialState, hub: false, paymentmethod: false})
  const [add, setAdd] = useState(false)
  const [order, setOrder] = useState(null)
  const [actions, setActions] = useState([])
  var action_id = actions


  console.log(history)

  useEffect(() => {
    //Deleted from socket tuning
    // socket.on('NOTESNLOGS_DID_UPDATE',noteLogDidUpdate)
    setOrder(data);

    //Deleted from socket tuning
    // return () => {
    //   setOrder(null)
    //     socket.off('NOTESNLOGS_DID_UPDATE',noteLogDidUpdate)
    // }
  }, [data])

  useEffect(() => {
    // console.log(actions, 'actions')
  }, [actions])

  const btnShow = () => {
    let string_data = null
    let string_order = null
    if (data) string_data = JSON.stringify(data).replace(/\s/g, '')
    if (order) string_order = JSON.stringify(order).replace(/\s/g, '')

    if (string_data && string_order) {
      return string_data !== string_order
    }

  }

  const setBilling = (value, key) => {
    setOrder({
      ...order,
      addresses: {
        ...order['addresses'],
        [key]: value,
      }
    })
  }

  const setShipping = (value, key) => {
    setOrder({
      ...order,
      addresses: {
        ...order['addresses'],
        [key]: value
      }
    })
  }
  const setInfo = (value, key) => {


    setActions([...actions, key])
    var action_id = actions
    action_id.push(key)

    if(key === "payment_id" && value.name == 'CPU') {
      setOrder({
      ...order,
        [key]: value.value,
        payment: {
          name: value.name,
          payment: 'yes'
        },
        action: action_id
      })
    }else if(key === "payment_id") {
        setOrder({
          ...order,
          [key]: value.value,
          payment: {
            name: value.name
          },
          action : action_id
        })
    }else if(key === "hub_id"){
      setOrder({
        ...order,
        [key]: value.hub_id,
        hubname: {
          name: value.name
        },
        action : action_id
      })
    }

    else{
      setOrder({
        ...order,
        [key]: value,
        action : actions
      })
    }

  }

  //functions for changing CPU info
  const setCPUInfo = (value, key) => {
    if (key != "hub_id") {
      setActions([...actions, key])
      var action_id = actions
      setOrder({
        action: action_id,
        ...order,
        job_riders: [
          {
            ...order.job_riders[0],
            [key]: value
          }
        ]
      })
    }else{
      setOrder({
        ...order,
        job_riders: [
          {
            ...order.job_riders[0],
            [key]: value
          }
        ]
      })
    }
  }

  const setPaymentName = (value) => {
    setOrder({
      ...order,
      payment: {
        name: value
      }
    })

  }


  const handleUpdateOrder = () => {
    //  const updateOrders = (order, resolve, (type, text) => {
    //   setEdit({
    //     date: false, time: false, bname: false, bcontact: false, baddress: false,
    //     sname: false, scontact: false, saddress: false, message: false, notes: false
    //   })
    //   toast[type](text)
    // })
    let resolve = false
    if (order.issueID && order.issueID !== 7) {
      console.log(1)
      if ([4, 1].includes(order.issueID)) {
        console.log(1.1)

        const oldAddresses = JSON.stringify(data.addresses).replace(/\s/g, '')
        const newAddresses = JSON.stringify(order.addresses).replace(/\s/g, '')
        if (oldAddresses !== newAddresses && order.hub_id !== null) {

          resolve = true
        } else if (order.hub_id !== null && oldAddresses !== null) {

          resolve = true
        } else if (order.hub_id !== null && newAddresses !== null) {

          resolve = true
        }
        else {

          resolve = false
        }
        updateOrder(order, resolve, (type, text) => {
          setEdit(inisialState)
          setOrder({...order,  action : []})
          action_id.length = 0

          toast[type](text)
        })
        //    }else{
        //         alert("This order has ticket [NO HUB] or [Unrecognized address] please fill before saving.")
        //    }

      }else if ( order.issueID == undefined || [6,2,3,5,8,9,10,11,12,].includes(order.issueID)){
        console.log(1.2)
        resolve = false
        updateOrder(order, resolve, (type, text) => {
            setEdit({
              date: false, time: false, bname: false, bcontact: false, baddress: false,
              sname: false, scontact: false, saddress: false, message: false, notes: false, cpu_date: false,cpu_time : false, cpu_hub : false
            })
          setOrder({...order,  action : []})
          action_id.length = 0
          toast[type](text)
          })

          
      }else{
     
      }
    } else if (order.issueID  && order.issueID === 7) {
      console.log(2)

      if (order.delivery_date !== null && order.delivery_time !== null) {
        resolve = true
      }
      updateOrder(order, resolve, (type, text) => {
        setEdit({
          date: false, time: false, bname: false, bcontact: false, baddress: false,
          sname: false, scontact: false, saddress: false, message: false, notes: false, cpu_date : false, cpu_time : false, cpu_hub : false
        })
        setOrder({...order,  action : []})
        action_id.length = 0
        toast[type](text)
      })
    } else {
      console.log(3)
      updateOrder(order, resolve, (type, text) => {
        setEdit({
          date: false, time: false, bname: false, bcontact: false, baddress: false,
          sname: false, scontact: false, saddress: false, message: false, notes: false, cpu_date : false, cpu_time : false, cpu_hub : false
        })

        setOrder({...order, action : []})
        action_id.length = 0
        loadSelOrder(order.order_id)
        toast[type](text)
      })
    }

  }

  const editHandle = (x, y) => {
    setEdit({...edit, [x]: !y})

    // console.log('what', x)
    setActions([...actions, x])
    action_id.push(x)

    if (x === 'saddress' || x === 'baddress'|| x === 'sname' || x === 'bname') {
      setOrder({
        ...order,
        action: actions
      })
    } else if (x === 'scontact') {
      setOrder({
        ...order,
        action: action_id,
        edit_ship_phone: data.addresses.shipping_phone

      })
    }else if (x === 'bcontact'){
      setOrder({
        ...order,
        action: action_id,
        edit_billing_phone: data.addresses.billing_phone

      })
    }else if (x === 'message' || x === 'notes'){
      setOrder({
        ...order,
        action: action_id,
        edit_message: data.message,
        edit_notes: data.note
      })
    }else if (x == 'cpu_date' || x == 'cpu_hub' || x == 'cpu_time')
      setOrder({
        ...order,
        action: action_id
      })
  }

  // console.log('data', order)

  const {date, time, bname, bcontact, baddress, sname, scontact, saddress, message, notes, hub, paymentmethod, cpu_date, cpu_time ,cpu_hub} = edit
  return (
    <>
    {order !== null &&
    <Page
      css='grd-gp-1 over-hid'
      clickClose={clearSelected}
      label='Order Details'
    >
      <OrderHeader
        paramsFunction={paramsFunction}
        data={data}
        btnshow={order !== null && btnShow()}
        saveClick={handleUpdateOrder}
        history={history}
        clickClose={clearSelected}

      />


      <div className='order_page grd grd-gp-1 over-hid over-y-auto scroll'>
        <OrderDetails
          setBilling={setBilling}
          setShipping={setShipping}
          setInfo={setInfo}
          setCPUInfo={setCPUInfo}
         // setPaymentName={setPaymentName}
          data={order}
          date={date}
          cpuDate={cpu_date}
          cpuTime={cpu_time}
          cpuHub={cpu_hub}
          time={time}
          bname={bname}
          bcontact={bcontact}
          baddress={baddress}
          sname={sname}
          scontact={scontact}
          saddress={saddress}
          paymentmethod={paymentmethod}
          hub={hub}

          click={(x, y) => editHandle(x, y)}
        />
        <OrderNotes
          setInfo={setInfo}
          data={order}
          message={message}
          notes={notes}
          click={(x, y) => editHandle(x, y)}
        />
        <div
          className='grd order_page_add-cont_wrap grd-gp-1'>
          <OrderLogs order={order}/>
          <OrderCSNotes
            order={order}
          />
          <OrderTicket
            orderId={data.order_id}
            clickClose={clearSelected}
          />
        </div>
        <OrderItemList
          total_discounts={data['total_discounts']}
          template='order_page-item-template'
          css='gtr-mfm order_page-item_list'
          data={ order['order_items'] ? order['order_items'][0] : []}
          totalprice={order['total_price']}
          itemlist={
            order['order_items'] && order['order_items'].map((value, key) => {
              return <OrderItemRow
                css='aic order_page-item-template'
                key={key}
                data={value}
                action={true}
              />
            })
          }
          additem={() => setAdd(true)}
          style={{gridRow: '3/-1'}}
        />
      </div>
    </Page>

    }
    {add &&
    <Modal
      label='Add item'
      css='over-hid'
      clickClose={() => setAdd(false)}
      clickSubmit={() => setAdd(false)}
      clickCancel={() => setAdd(false)}
      width='80%'
      height='90%'
    >
      <div className='grd grd-col grd-gp-2 over-hid'>
        <div className='grd grd-gp-1 over-hid' style={{gridTemplateRows: 'min-content min-content 1fr'}}>
          <span className='header-2'>Item list</span>
          <Input
            css='pad-1'
            label='Search item..'
          />
          <div className='over-y-auto scroll'>
            <ProductRow
              data={data && data['order_items'][0]}
              qty={
                <Input type='number' size='2' max='99' min='0'/>
              }
            />
          </div>
        </div>
        <div className='grd gtr-mfm grd-gp-1 over-hid'>
          <span className='header-2'>Added item</span>
          <div className='over-y-auto scroll'>
            <ProductRow
              data={data && data['order_items'][0]}
              added={true}
            />
          </div>
          <div className='grd gtc-mf'>
            <span className='header-3'>TOTAL</span>
            <span className='subheader jse'>&#x20B1; total price</span>
          </div>
        </div>
      </div>
    </Modal>
    }
    }
    </>
  )
}

OrderPage.defaultProps = {
  itemData: {},
}

export default connect(null,{clearSelected, updateOrder, updateLognNotes, loadSelOrder})(OrderPage)