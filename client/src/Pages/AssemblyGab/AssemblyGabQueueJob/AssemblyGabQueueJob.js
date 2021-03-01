import React from "react";
import QueueJobItem from "./AssemblyGabQueueJobItem";
import Paper from "../../../atoms/Paper/Paper";
import Button from "../../../atoms/Button/Button";
import TableHeader from "../../../atoms/TableHeader/TableHeader";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");

const DispatchQueueJob = ({
  data,
  failedIds,
  type,
  noteCounts,
  onRemoveItem,
  onRemoveJob,
  onShip,
  itemModal,
  riderModal,
  onQualityCheck,
  setQualityCheck
}) => {
  let view_dispatch_job_details = data || [];

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

  console.log("DATAAAA", data);

  function removeJobItem(dispatch_job_detail_id) {
    if (view_dispatch_job_details.length === 1) {
      onRemoveJob(data.dispatch_job_id);
    } else {
      onRemoveItem(dispatch_job_detail_id);
    }
  }

  //  console.log('data', data)

  // console.log(data.view_dispatch_job_details[0].quality_check, 'dispatch queueu data')
  return (
    <Paper css="pad-2 mar-y-1">
      <div className="grd grd-gp-1">
        <div className="grd grd-gp-1">
          <div>
            <TableHeader
              csswrap="width-100"
              css="jic aic dispatch_queue-header"
            >
              {headerData.map((value, key) => {
                return <span key={key}>{value}</span>;
              })}
            </TableHeader>
              {console.log("VDP", view_dispatch_job_details)}
            {view_dispatch_job_details && (
              <QueueJobItem
                css={`dispatch_queue-row ${view_dispatch_job_details.jobtype ===
                  "delivery" &&
                  view_dispatch_job_details.quality_check === 0 &&
                  "bg-red"}`}
                qualityChecked={view_dispatch_job_details.quality_check}
                //failedIds={failedIds}
                data={view_dispatch_job_details}
                onRemove={removeJobItem}
                onQualityCheck={() => onQualityCheck(view_dispatch_job_details)}
                setQualityCheck={() =>
                  setQualityCheck(view_dispatch_job_details)
                }
              />
            )}
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default DispatchQueueJob;
