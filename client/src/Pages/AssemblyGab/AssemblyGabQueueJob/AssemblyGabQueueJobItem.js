import React, { useState, useRef } from "react";
import OrderID from "../../../molecules/OrderID/OrderID";
import IconButton from "../../../atoms/IconButton/IconButton";
import TableRow from "../../../atoms/TableRow/TableRow";
import Modal from "../../../template/Modal/Modal";
import Dropdown from "../../../atoms/Dropdown/Dropdown";
import Checkbox from "../../../atoms/Checkbox/Checkbox";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Customer from "../../../atoms/Customer/Customer";
import "./AssemblyGabQeueJobItem.css";
import Batch from "../../../atoms/Batch/Batch";
import Button from "../../../atoms/Button/Button";

const QueueJobItem = ({
  data,
  failedIds,
  noteCounts,
  onRemove,
  css,
  qualityChecked,
  onQualityCheck,
  setQualityCheck
}) => {
  let type = 1;
  const [modal, setModal] = useState({ undelivered: false, close: false });
  const [dropdown, setDropdown] = useState(false);
  const myref = useRef();

  return (
    <>
      <TableRow height="auto" css={`jic aic pad-1 ${css}`}>
        <OrderID
          //pass the number of open notes
          openNotes={data.open_tickets}
          orderid={data["order_id"]}
        >
          {data.shopify_order_name}
        </OrderID>
        <div style={{ display: "flex" }}>
          <div>
            <p>{data["jobtype"]}</p>{" "}
          </div>
        </div>
        <span className="text-ac">
          {data["jobtype"] === "delivery" ? data["title"] : data["total"]}
        </span>
        <div className="grd grd-gp-1">
          <div>{data["delivery_date"]}</div>
          <Batch batch={data["delivery_time"]} />
        </div>
        <span>{data["payment_method"]}</span>
        <div className="grd jic space-no-wrap">
          <Customer
            id={data["customer_id"]}
            firstname={data["first_name"]}
            lastname={data["last_name"]}
          />
          <span className="">{data["phone"]}</span>
        </div>
        <div className="sublabel grd text-ac">
          {data["address_1"] && <span>{data["address_1"]}</span>}
          {data["address_2"] && <span>{data["address_2"]}</span>}
          {data["city"] && <span>{data["city"]}</span>}
          {data["province"] && <span>{data["province"]}</span>}
          {data["country"] && <span>{data["country"]}</span>}
        </div>
        <div
          ref={myref}
          tabIndex="0"
          onBlur={() => setDropdown(false)}
          className="relative"
        >
          {type === "assigned" ? (
            <>
              <i
                className="fas fa-ellipsis-h point"
                onClick={() => {
                  setDropdown(!dropdown);
                  myref.current.focus();
                }}
                style={{ fontSize: "20px" }}
              />
              {dropdown && (
                <Dropdown>
                  <span
                    onClick={() => {
                      setModal({ ...modal, close: true });
                      setDropdown(false);
                    }}
                    className="point"
                  >
                    Close
                  </span>
                  <span
                    onClick={() => {
                      setModal({ ...modal, undelivered: true });
                      setDropdown(false);
                    }}
                    className="point"
                  >
                    Undelivered
                  </span>
                  <span className="point">Delivered</span>
                </Dropdown>
              )}
            </>
          ) : (
            <div className="grd grd-col grd-gp-2 aic">
              <IconButton
                icon={faTimes}
                color="#F86C6B"
                size="18px"
                onClick={() => onRemove(data.view_dispatch_job_detail_id)}
              />
              {qualityChecked === 0 && data.jobtype === "delivery" && (
                <Button color="success" onClick={onQualityCheck}>
                  Quality Check
                </Button>
              )}
            </div>
          )}
        </div>
      </TableRow>
      {modal.undelivered && (
        <Modal
          width="400px"
          clickClose={() => setModal({ ...modal, undelivered: false })}
          clickCancel={() => setModal({ ...modal, undelivered: false })}
          clickSubmit={() => alert("click submit props on modal")}
          label="Undeliver item"
        >
          <div className="grd grd-gp-1">
            <span className="label">Reason</span>
            <textarea className="br-2 pad-1" rows="7" />
            <Checkbox
              color="secondary"
              label="Send to redispatch"
              checked={true}
            />
          </div>
        </Modal>
      )}
      {modal.close && (
        <Modal
          width="400px"
          clickClose={() => setModal({ ...modal, close: false })}
          clickCancel={() => setModal({ ...modal, close: false })}
          clickSubmit={() => alert("click submit props on modal")}
          label="Close Item"
        >
          <div className="grd grd-gp-1">
            <span className="label">Reason</span>
            <textarea className="br-2 pad-1" rows="7" />
          </div>
        </Modal>
      )}
    </>
  );
};

export default QueueJobItem;
