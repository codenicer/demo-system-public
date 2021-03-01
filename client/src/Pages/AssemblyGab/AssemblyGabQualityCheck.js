import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Page from "../../atoms/Page/Page";
import Button from "../../atoms/Button/Button";
import { fetchOrderByOrderName } from "../../scripts/actions/ordersActions";
import Checkbox from "../../atoms/Checkbox/Checkbox";
import _ from "lodash";
import { toast } from "react-toastify";
import AssemblerJobItem from "../AssemblerJob/AssemblerJobPage/AssemblerJobItem/AssemblerJobItem";

const DispatchQualityCheck = props => {
  const [qcOrder, setQcOrder] = useState(null);
  const [checkList, setCheckList] = useState({});
  const { fetchOrderByOrderName } = props;
  const { clickClose, onQualityCheck, setQualityCheck, data } = props;
  const {
    orderData: { order }
  } = props;
  console.log("DATA QUALITY CHECK", data);
  useEffect(() => {
    console.log("got data");
    console.log("got data");
    console.log("got data");
    console.log("got data");
    console.log("got data");
    console.log("got data", data["shopify_order_name"]);
    if (data["shopify_order_name"]) {
      fetchOrderByOrderName(data["shopify_order_name"]);
    }
  }, [data]);

  useEffect(() => {
    setQcOrder(order);

    if (order) {
      if (order.length) {
        setCheckList({
          [`${order[0]["order_id"]}-DAR`]: false,
          [`${order[0]["order_id"]}-MSG`]: false
        });
        _.each(order[0]["order_id"], (rec, i) => {
          setCheckList({
            [rec["order_item_id"]]: false
          });
        });
      }
    }
  }, [order]);

  function checkAssembly() {
    //onQualityCheck

    _.each(checkList, item => {
      if (item === false) {
        toast.error(
          "Please make sure that all items are ready and properly accounted for."
        );
        return false;
      }
    });

    setQualityCheck(qcOrder[0]["order_id"]);
    return true;
  }

  function setCheckbox(e) {
    console.log("setCheckbox", e.target.value);
    console.log("setCheckbox selected", e.target.checked);
    if (e.target.checked) {
      setCheckList({
        ...checkList,
        [e.target.value]: [e.target.checked]
      });
    }
  }

  console.log("this:", qcOrder);
  return (
    <Page clickClose={clickClose}>
      <div
        style={{ gridTemplateRows: "auto auto 1fr" }}
        className="pad-1 bg-white br-2 grd"
      >
        <div className="mar-y-1 header">Quality Check</div>

        {qcOrder !== null ? (
          <>
            <div className="grd gtc-fa pad-x-2">
              <span className="header-2">
                {qcOrder[0]["shopify_order_name"]}
              </span>
              <Button color="warning" onClick={clickClose}>
                Cancel
              </Button>{" "}
              <Button color="success" onClick={checkAssembly}>
                Submit
              </Button>
              {qcOrder !== null ? (
                <span className="header-3 pa-x-1">
                  {qcOrder[0]["order_items"].length > 1
                    ? `Items:${qcOrder[0]["order_items"].length}`
                    : `Item:${qcOrder[0]["order_items"].length}`}
                </span>
              ) : (
                ""
              )}
            </div>
            <div style={{ padding: "0 10%" }} className="over-y-auto scroll">
              <div
                className="job_page-wrap grd grd-gp-2 aic"
                style={{ gridTemplateColumns: "auto 1fr auto" }}
              >
                {qcOrder ? (
                  <Checkbox
                    color="secondary"
                    value={`${qcOrder[0]["order_id"]}-DAR`}
                    onChange={setCheckbox}
                  />
                ) : (
                  ""
                )}
                <span className="label">DAR</span>
                <Button color="neutral" css="jse">
                  Reprint
                </Button>
              </div>

              <div
                className="grd grd-col grd-gp-2 aic"
                style={{ gridTemplateColumns: "auto 1fr auto" }}
              >
                {qcOrder !== null ? (
                  <Checkbox
                    color="secondary"
                    value={`${qcOrder[0]["order_id"]}-MSG`}
                    onChange={setCheckbox}
                  />
                ) : (
                  ""
                )}
                <span className="label">Message</span>
                <Button color="neutral" css="jse">
                  Reprint
                </Button>
              </div>

              {qcOrder !== null &&
                qcOrder[0].order_items.map((row, i) => (
                  <AssemblerJobItem data={row} key={i} onChange={setCheckbox} />
                ))}
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </Page>
  );
};

const mapStatetoProps = state => ({
  orderData: state.orderData
});

export default connect(
  mapStatetoProps,
  {
    fetchOrderByOrderName
  }
)(DispatchQualityCheck);
