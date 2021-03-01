export const  colHeaders = [
    "ID",
    "Order ID",
    "Amount",
    "Status",
    "Date Requested",
    "Date Processed",
    "Refund Type",
    "Refund Status",
  ];


  export const  refundType = [
    {
      label:"Partial Refund",
      id:"Partial "
    },
    {
      label:"Full Refund",
      id:"Full"
    },


  ]
  export const  refundStatus = [
    {
      id:0,
      label:"For Approval"
    },
    {
      id:1,
      label:"Approved"
    },
    {
      id:2,
      label:"Declined"
    },
  ]