import React, { useState, useRef } from "react";
import TableRow from "../../atoms/TableRow/TableRow";
import OrderStatus from "../../atoms/OrderStatus/OrderStatus";
import OrderID from "../../molecules/OrderID/OrderID";
import OrderQty from "../../molecules/OrderQty/OrderQty";
import OrderItemList from "../../template/OrderItemList/OrderItemList";
import OrderItemRow from "../../organisms/OrderItemRow/OrderItemRow";
import PaymentStatus from '../../atoms/PaymentStatus/PaymentStatus';
import Batch from "../../atoms/Batch/Batch";
import IconButton from '../../atoms/IconButton/IconButton';
import {faBan} from '@fortawesome/free-solid-svg-icons'
import Customer from "../../atoms/Customer/Customer";
import { connect } from "react-redux";
import DispatchRider from "../DispatchRider/DispatchRider";
import {formatMoney} from "accounting-js";
import moment from 'moment-timezone';

moment.tz.setDefault("Asia/Manila");
function OrderHistoryRow(props) {
  const { selectedorder, onclick, dispatchRiders } = props;
  const [itemPreview, setItemPreview] = useState(false);
  const subRow = useRef();

  return (
    <>
      <TableRow css="grd-col aic jic grd-col-f">
        <OrderID orderid={selectedorder["order_id"]}>
          {selectedorder["shopify_order_name"]}
        </OrderID>
        <OrderQty
          style={{ gridColumn: "2/3" }}
          qty={selectedorder["order_items"].length}
          open={itemPreview}
          onClick={() => {
            setItemPreview(!itemPreview);
          }}
        />
        <div>{moment(selectedorder["created_at"]).format("YYYY-MM-DD")}</div>
        <div className="grd aic grd-gp-1 jis">
          <div>
            {moment(selectedorder["delivery_date"]).format("MMM. DD, YYYY")}
          </div>
          {selectedorder["delivery_time"] ?  <Batch batch={selectedorder["delivery_time"]} /> : "" }
        </div>
        {selectedorder.customer ?  <Customer
          id={selectedorder.customer["customer_id"]}
          firstname={selectedorder.customer["first_name"]}
          lastname={selectedorder.customer["last_name"]}
        /> : "" }

        <span className="header-3">

            {formatMoney(selectedorder['total_price'], { symbol: '₱ ', precision: 2 })}
        </span>
        {selectedorder.hub ? <span>{selectedorder.hub.name}</span> : "No Hub"
        }
        <span>
          {selectedorder.payment ? <span>{selectedorder.payment.name}</span> : "No Payment"
          }
        </span>
        <PaymentStatus paymentstatus={selectedorder['payment_status_id']}/>
        <div>
          <OrderStatus orderStatus={selectedorder["order_status_id"]} />
        </div>
        <div>
        <IconButton
        icon={faBan}
        size='18px'
        shadow={true}
        tooltip
        tooltiptype='right'
        rightposition='50%'
        label='Reinstatement Request'
        onClick={() =>onclick(selectedorder)}
    /> 

        </div>
      </TableRow>
      {itemPreview ? (
        <OrderItemList
          template='order_item-row-template'
          css="slideInLeft animate-1"
          data={selectedorder["order_items"][0]}
          myref={subRow}
          totalprice={selectedorder["total_price"]}
          itemlist={Object.values(selectedorder["order_items"]).map(
            (order, key) => {
              return (
                <OrderItemRow
                  css="order_item-row-template"
                  key={key}
                  data={order}
                />
              );
            }
          )}
        />
      ) : null}
    
    </>
  );
}

const transferStatetoProps = state => ({
  orders: state.orderData,
  isfetching: state.webFetchData.isFetching
});

export default connect(transferStatetoProps)(OrderHistoryRow);
