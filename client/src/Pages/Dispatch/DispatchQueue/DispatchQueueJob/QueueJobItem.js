import React, { useState, useRef } from "react";
import OrderID from "../../../../molecules/OrderID/OrderID";
import Batch from "../../../../atoms/Batch/Batch";
import IconButton from "../../../../atoms/IconButton/IconButton";
import Button from "../../../../atoms/Button/Button";
import TableRow from "../../../../atoms/TableRow/TableRow";
import Modal from "../../../../template/Modal/Modal";
import Dropdown from "../../../../atoms/Dropdown/Dropdown";
import Checkbox from "../../../../atoms/Checkbox/Checkbox";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Customer   from "../../../../atoms/Customer/Customer";
import "./QeueJobItem.css";

const QueueJobItem = ({ data, failedIds, noteCounts, onRemove, css, qualityChecked, onQualityCheck, paymentHighlight, hubs, payment_methods }) => {
  let type = 1;
  const [modal, setModal] = useState({ undelivered: false, close: false });
  const [dropdown, setDropdown] = useState(false);
  const myref = useRef();

    const getPaymentOptions = (x) => {
      try{
          if(x){
              let h = payment_methods.filter( r => parseInt(r.id) === parseInt(x) || r.value === x);
              if(h){
                  return h[0].value
              }
          }
      } catch(e){
        console.log('error', e);
      }
        return '';
    }

  return (
    <>
      <TableRow 
        height='auto'
        css={`jic aic pad-1 ${css}`}>
        <OrderID
          
          //pass the number of open notes 
         // openNotes={data.open_tickets}
          orderid={data["order_id"]}>{data.job_item_type === 'delivery' ? data.shopify_order_name : `${data.shopify_order_name}-CPU`}</OrderID>
        <div style={{ display: "flex" }}>
          <div>
            <p>{data["job_item_type"]}</p>{" "}
          </div>
        </div>
        <span className='text-ac'>
          {data["job_item_type"] === "delivery" ? data["item"] : data["item"]}
        </span>
        <div className="grd grd-gp-1">
          <div>{data["delivery_date"]}</div>
          <Batch batch={data["delivery_time"]} />
        </div>
        <div
          className='pad-x-1' 
          style={{background: paymentHighlight === data['payment_id'] && 'var(--yellow)'}}>{getPaymentOptions(data['payment_id'])}</div>
        <div className="grd jic space-no-wrap">
          <Customer
            id={data["dispatch_job_id"]}
            firstname= " "
            lastname={data["shipping_name"]}
          />
          <span className=''>{data["shipping_phone"]}</span>
        </div>
        <div className="sublabel grd text-ac">
          {data["shipping_address_1"] && <span>{data["shipping_address_1"]}</span>}
          {data["shipping_address_2"] && <span>{data["shipping_address_2"]}</span>}
          {data["shipping_city"] && <span>{data["shipping_city"]}</span>}

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
          <div className='grd grd-col grd-gp-2 aic'>
              <IconButton
                icon={faTimes}
                color="#F86C6B"
                size="18px"
                onClick={() => onRemove(data.dispatch_job_detail_id)}
              />
              {qualityChecked === '0' && data.job_item_type === 'delivery' &&
                <Button
                  color='success'
                  onClick={onQualityCheck}
                  >Quality Check</Button>
              }
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
