import React from "react";
function DispatchRider(props) {

  const { dispatch_info } = props;
  return (
    <div>
      <span>{dispatch_info ? dispatch_info[0].dispatch_job.rider_first_name + " "
        + dispatch_info[0].dispatch_job.rider_last_name : "No Dispatch Available"}</span>
    </div>
  );
}

export default DispatchRider;
