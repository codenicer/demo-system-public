import React, { useState } from "react";
import TableRow from "../../atoms/TableRow/TableRow";
import moment from 'moment-timezone';
import OrderID from "../../molecules/OrderID/OrderID";
import OrderQty from "../../molecules/OrderQty/OrderQty";
import OrderItemList from "../../template/OrderItemList/OrderItemList";
import OrderItemRow from "../../organisms/OrderItemRow/OrderItemRow";
import Batch from "../../atoms/Batch/Batch";
import IconButton from '../../atoms/IconButton/IconButton';
import { faCheck,faBan} from '@fortawesome/free-solid-svg-icons'
import Customer from "../../atoms/Customer/Customer";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import {
  updateReinstatement,
  getReinstatementData
  
} from "../../scripts/actions/ordersActions";

moment.tz.setDefault("Asia/Manila");
function OrderHistoryRow(props) {
  const { selectedorder, css, updateReinstatement,getReinstatementData, param } = props;
  const [itemPreview, setItemPreview] = useState(false);

  const confirmReinstatement = (data) =>{
    if (window.confirm("Do you want to proceed?")) {
      var finalData = {
        order_reinstatement_request_id: data.order_reinstatement_request_id,
        status: 1,
        order_status_id : 3,
        order_id: data.order_id,
        delivery_date : data.delivery_date,
        delivery_time : data.delivery_time,
        payment_status_id : selectedorder.payment_status_id,
        payment_id : selectedorder.payment_id
      }

      updateReinstatement(finalData, (msg) => {
        toast.success(msg);
        getReinstatementData(param)
        // props.history.push("/system/closedorders");
      })
    }
  }


  const declineReinstatement = (data) =>{

    if (window.confirm("Are you sure you want to cancel this request?")){
      var finalData = {
        order_reinstatement_request_id : data.order_reinstatement_request_id,
        status : 2,
        order_id: data.order_id,
      }

      updateReinstatement(finalData, (msg) => {
        toast.success(msg);
        getReinstatementData(param)
        // props.history.push("/system/closedorders");
      })
    }


  }

  console.log("HERE:",selectedorder.reinstatements)

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
        <div>{moment(selectedorder.reinstatements[0]["created_at"]).format("YYYY-MM-DD")}</div>
        <div className="grd aic grd-gp-1 jis">
          <div>
            {moment(selectedorder.reinstatements[0]["delivery_date"]).format("MMM. DD, YYYY")}
          </div>
          <Batch batch={selectedorder.reinstatements[0]["delivery_time"]} />
        </div>
        <Customer
          id={selectedorder.customer["customer_id"]}
          firstname={selectedorder.customer["first_name"]}
          lastname={selectedorder.customer["last_name"]}
        />
        <span className="header-3">
          &#x20B1; {selectedorder["total_price"]}
        </span>
        <span>
          {selectedorder.hub != null ? selectedorder.hub["name"] : "" }
        </span>

        <span>{selectedorder.reinstatements[0].order_id ? selectedorder.reinstatements[0].remarks : ""}</span>
        <span>{ selectedorder.reinstatements && selectedorder.reinstatements[0] && selectedorder.reinstatements[0] &&selectedorder.reinstatements[0].user && selectedorder.reinstatements[0].user.first_name ? selectedorder.reinstatements[0].user.first_name + " " + selectedorder.reinstatements[0].user.last_name : "Missing User ID"}</span>
        <div className={`jsc aic grd grd-col jic grd-gp-1 ${css}`}>

             <IconButton
              icon={faCheck}
              size='18px'
              shadow={true}
              tooltip
              tooltiptype='right'
              rightposition='50%'
              label='Confirm request'
               onClick={() => confirmReinstatement(selectedorder.reinstatements[0])}

            />
        <IconButton
        icon={faBan}
        size='18px'
        shadow={true}
        tooltip
        tooltiptype='right'
        rightposition='50%'
        label='Decline Request'
        onClick={() => declineReinstatement(selectedorder.reinstatements[0])}

        />

        </div>
      </TableRow>
      {itemPreview ? (
        <OrderItemList
          css="slideInLeft animate-1"
          data={selectedorder["order_items"][0]}
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


export default connect(
  transferStatetoProps,
  {
    updateReinstatement,
    getReinstatementData
  }
)(OrderHistoryRow);