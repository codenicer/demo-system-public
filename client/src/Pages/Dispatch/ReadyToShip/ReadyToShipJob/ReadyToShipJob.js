import React from "react";
import QueueJobItem from "./ReadyToShipItem";
import Paper from "../../../../atoms/Paper/Paper";
import Button from "../../../../atoms/Button/Button";
import TableHeader from "../../../../atoms/TableHeader/TableHeader";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");;

const ReadyToShipJob = ({
  data,
  failedIds,
  type,
  noteCounts,
  index,
  onRemoveItem,
  onRemoveJob,
  onShip,
  itemModal,
  riderModal,
  onQualityCheck,
  setQualityCheck,
  paymentHighlight
}) => {
  let view_dispatch_job_details = data.view_dispatch_job_details || [];

  const headerData = [
    "Order ID",
    "Job Type",
    "Product/Item",
    "Delivery Time",
    "Payment Type",
    "Contact Person",
    "Address",
    "Action"
  ];

  function removeJobItem(dispatch_job_detail_id) {
    if (view_dispatch_job_details.length === 1) {
      onRemoveJob(data.dispatch_job_id);
    } else {
      onRemoveItem(dispatch_job_detail_id);
    }
  }
//  console.log('data', data)
  return (
    <Paper css="pad-2 mar-y-1">
      <div className="grd grd-gp-1">
        <div
          className="grd grd-gp-2"
          style={{ gridTemplateColumns: "1fr auto auto" }}
        >
          <span className="ass header">
            <a id={data.tracking_no} href={`#${data.tracking_no}`} > </a>
             Dispatch Tracking #: {data.tracking_no}
            <div>Datetime Created: {moment(data.created_at).format('LLL')}</div>

          </span>
          {type === 'advance'?
            <Button
              color='success'
              height='42px'
              css='pad-x-2'
              onClick={() => riderModal(data.dispatch_job_id, data.tracking_no)}
            >
                Assign to Rider
            </Button>
            :
            <Button
              color="success"
              height="42px"
              css="pad-x-2"
              disabled={data.rider_id <= 0}
              onClick={() => {
                onShip(data);
              }}
            >
              Ship Item(s)
            </Button>
          }
        </div>
        {type !== 'advance' &&
          <>
          <span className="header-2">Rider Information</span>
          <div className="grd jss grd-col grd-gp-1">
            <span className="sublabel">Rider:</span>
            <span className="label">
              {data.rider_first_name} {data.rider_last_name}
            </span>
            <span className="sublabel">Contact #:</span>
            <span className="label">{data.rider_mobile_number}</span>
            <span className="sublabel">Provider</span>
            <span className="label">{data.rider_provider_name}</span>
          </div>
          </>
        }
        <div className="grd gtc-af grd-gp-1">
          {
            <div
              className="grd grd-gp-1 ass"
              style={{ gridTemplateRows: "1fr min-content 1fr" }}
            >
              <Button
                css="ase"
                color="warning"
                onClick={() => onRemoveJob(data.dispatch_job_id)}
              >
                Cancel
              </Button>
              <Button
                color="success"
                onClick={() => itemModal(data.dispatch_job_id)}
              >
                Add Item
              </Button>
              {type !== 'advance' &&
                <Button
                  css="ass"
                  color="secondary"
                  onClick={() => riderModal(data.dispatch_job_id, data.tracking_no, index)}
                >
                  Change Rider
                </Button>
              }
            </div>
          }
          <div>
            <div>
              <span className="header-3">
                {view_dispatch_job_details.length === 1
                  ? "Item: " + view_dispatch_job_details.length
                  : "Items: " + view_dispatch_job_details.length}
              </span>
              <TableHeader 
                csswrap='width-100'
                css="jic aic dispatch_queue-header">
                {headerData.map((value, key) => {
                  return <span key={key}>{value}</span>;
                })}
              </TableHeader>
            </div>
            {view_dispatch_job_details &&
              view_dispatch_job_details.map((record, key) => {
             //   console.log(record, 'asldjaskdhasjhd')
                return (
                  <QueueJobItem
                    paymentHighlight={paymentHighlight}
                    css={`dispatch_queue-row ${record.jobtype === 'delivery' && record.quality_check  === 0 && 'bg-red'}`}
                    qualityChecked={record.quality_check}
                    //failedIds={failedIds}
                    key={key}
                    data={record}
                    onRemove={removeJobItem}
                    onQualityCheck={()=>onQualityCheck(record)}
                    setQualityCheck={()=>setQualityCheck(record)}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default ReadyToShipJob;
