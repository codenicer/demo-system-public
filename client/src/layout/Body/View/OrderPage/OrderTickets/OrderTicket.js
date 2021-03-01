import React, { useState, useEffect } from "react";
import { fetchOrderTicket } from "../../../../../scripts/actions/ordersActions";
import { connect } from "react-redux";

const OrderTicket = props => {
  const {
    fetchOrderTicket,
    orderTicket,
    orderData: { ticket_info }
  } = props;

  const [ticketOrders, setTicketOrders] = useState([]);

  useEffect(() => {
    fetchOrderTicket(orderTicket);
  }, []);

  useEffect(() => {
    setTicketOrders(ticket_info);
  }, [ticket_info]);

  if (ticketOrders.length > 0) {
    var print = (
      <h2
        style={{
          backgroundColor: "green",
          padding: "10px",
          borderRadius: "20px",
          width: "10%",
          textAlign: "center"
        }}
      >
        Open Tickets: {ticketOrders.length}
      </h2>
    );
  } else {
    var print = (
      <h2
        style={{
          backgroundColor: "orange",
          padding: "10px",
          borderRadius: "20px",
          width: "15%",
          textAlign: "center"
        }}
      >
        No Open Tickets
      </h2>
    );
  }

  console.log("TICKET ORDERSSSS", ticketOrders);
  return (
    <div>
      <div style={{ marginLeft: "auto" }}>{print}</div>
    </div>
  );
};

const MapStateToProps = state => ({
  isFetching: state.webFetchData.isFetching,
  orderData: state.orderData
});

export default connect(
  MapStateToProps,
  { fetchOrderTicket }
)(OrderTicket);
