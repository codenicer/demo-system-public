import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { getRefundList,declineRefundRequest ,acceptRefundRequest} from "../../../scripts/actions/refundActions";
import Container from "../../../atoms/Container/Container";
import Button from "../../../atoms/Button/Button";
import Select from 'react-select';
import TableHeader from "../../../atoms/TableHeader/TableHeader";
import RefundTableRow from "./components/RefundTableRow";
import "./RiderList.css";
import Pagination from "../../../atoms/Pagination/Pagination";
import _ from 'lodash';
import Input from '../../../atoms/Input/Input';
import {colHeaders,refundStatus,refundType} from './RefundPageSettings'


const RefundList = props => {

  const {getRefundList,declineRefundRequest,acceptRefundRequest,refund_list} = props

  const [params, setParams] = useState({
    page: 1,
    pageSize: 30,
    refund_type: "",
    date_requested:"",
    date_processed:"",
    status:"",
    order_number:""

  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
      getRefundList(params)
  }, [params]);

  const PageClick = x => {
    let retpage = x();
    const newparam = { ...params, page: retpage };
    setParams(newparam);
    return true;
  };

useEffect(()=>{
    setTableData(refund_list ? refund_list.rows : [])
}, [refund_list]);


  function handleSelectChange (data, key){

    return setParams({
        ...params,
        [key]: data,
        page: 1
    })
}


function handleChange (event){
  return setParams({
      ...params,
      [event.target.name]: event.target.value,
      page:1
  })
}

function handleFilterChange(e){
  let text = e.trim()
  return setParams({
      ...params,
      'order_number': text,
      page:1
  })
}

  return (
    <Container css="over-hid grd slideInRight animate-2 gtr-af">
      <div>
        <div className="grd grd-gp-2 pad-1 gtc-af">
          <span className="header">Refund List</span>
        </div>
        <div
          style={{
            gridTemplateColumns: 'repeat(7, 1fr)', 
            borderBottom:'1px solid #A9A9A9',
            marginBottom:'1rem',
            paddingBottom:'1rem'

          }}
          className='grd grd-gp-1'  
        >
             <Select
                value={params.refund_type.label || ''}
                name="refund_typed"
                placeholder='Refund Type'
                options = {
                    refundType.map((rec, key) => {
                        return {value: rec.label ,label:rec.label, id: rec.id}
                    })
                }
                onChange={(selecteditem)=>handleSelectChange(selecteditem ? selecteditem : {value:null,label:null,id:null},'refund_type')}
              />
               <Select
                value={params.status.label || ''}
                name="refund_status"
                placeholder='Status'
                options = {
                    refundStatus.map((rec, key) => {
                        return {id: rec.id, value:rec.label,label:rec.label}
                    })
                }
                   onChange={(selecteditem)=> handleSelectChange(selecteditem ?selecteditem: {id:null,value:null,id:null}, 'status')}
              />
              <Input
                       value={params.date_requested}
                      onChange={handleChange}
                      name="date_requested"
                      css='pad-1'
                      type='date'
                      label='Date Requested' 
              />
              <Input
                  value={params.date_processed}
                  onChange={handleChange}
                  name="date_processed"
                  css='pad-1'
                  type='date'
                  label='Date Processed' 
              />

              <Input
                    defaultValue= {params.order_number}
                    name="shopify_order_name"
                    type='search'
                    css='pad-1'
                    onChange={(e) => handleFilterChange(e.target.value)}
                    label='Order Number'
               />      

        </div>
      
        <TableHeader csswrap="width-100" css="r-user_list-template jic aic">
          {colHeaders.map((x, y) => {
            return <div key={y}>{x}</div>;
          })}
        </TableHeader>
      </div>
      <div className="over-y-auto scroll">
        {tableData &&
          tableData.map((record, key) => {
            return (
              <RefundTableRow
                css="r-user_list-template aic jic"
                key={key}
                data={record}
                declineRefund={declineRefundRequest }
                acceptRefundRequest={acceptRefundRequest}
                getRefundList={ ()=>getRefundList(params)}
              />
            );
          })}
      </div>
      <div className="grd pad-y-1">
        <Pagination
          selPage={params.page}
          rows={params.pageSize}
          count={refund_list ? refund_list.count : 0}
          pageClick={PageClick}
        />
      </div>
    </Container>
  );
};

const MapStateToProps = state => ({
  userData: state.userData,
  isFetching: state.webFetchData.isFetching,
  refund_list: state.refundData.refund_list
});

export default connect(
  MapStateToProps,
  {getRefundList,declineRefundRequest,acceptRefundRequest }
)(RefundList);
