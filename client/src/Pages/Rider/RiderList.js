import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { fetchAllRiders, fetchSearchRider, activatingRider } from "../../scripts/actions/riderActions";
import Container from "../../atoms/Container/Container";
import Button from "../../atoms/Button/Button";
import TableHeader from "../../atoms/TableHeader/TableHeader";
import RiderTableRow from "./components/RiderTableRow";
import "./RiderList.css";
import Pagination from "../../atoms/Pagination/Pagination";
import _ from 'lodash';
import Input from '../../atoms/Input/Input';



const AllRiders = props => {
  const { fetchAllRiders, allRider,fetchSearchRider, activatingRider } = props;

  const [params, setParams] = useState({
    page: 1,
    pageSize: 30,
    filterall: "",
  });

  const [tableData, setTableData] = useState([]);
  const [activateData, setactivateData] = useState([]);

  const [totalRecCount, setTotalRecCount] = useState(13);

  function fetchData(params) {
    fetchAllRiders(params);
  }

  //ondidmount
  useEffect(() => {
    fetchData(params);
  }, []);

  useEffect(() => {
    console.log("all rider data:", allRider);
    setTableData(allRider.rows);
    setTotalRecCount(allRider.count);
  }, [allRider]);

  const PageClick = x => {
    let retpage = x();
    const newparam = { ...params, page: retpage };
    setParams(newparam);
    fetchData(newparam);
  };

  const activateRider = (id, status) => {
    const newparam = { ...params, activate_id : id,
      activate_status: status };
    
   
      activatingRider(newparam)
  };
  const handleFilterChange = _.debounce(e => {

        
    let textFilter = e;
  setParams({
      ...params,
      search_name: textFilter.trim(),
      page: 1,
      delivery_date: ""
    });
}, 500);
const handleFilterCode = _.debounce(e => {

        
  let textFilter = e;
setParams({
    
    code: textFilter.trim(),
    page: 1,
    pageSize: 30
  });

}, 500);


useEffect(()=>{
  // console.log('search', params)

      fetchSearchRider(params);
  
}, [params]);

  const colHeaders = [
    "ID",
    "First Name",
    "Last Name",
    "Provider",
    "Mobile Number",
    "Date Created",
    "Status",
    "Action"
  ];

  return (
    <Container css="over-hid grd slideInRight animate-2 gtr-af">
      <div>
        <div className="grd grd-gp-2 pad-1 gtc-af">
          <span className="header">Rider List</span>
          <Button
            css="jss"
            color="secondary"
            onClick={() => props.history.push("/system/rider/create")}
          >
            Create New Rider
          </Button>
         
        </div>
        <Input
                        defaultValue= {params.search_name}
                        name="search"
                        type='search'
                        css='pad-1'
                        onChange={(e) => handleFilterChange(e.target.value)}
                        label='Rider Name' />
                        <Input
                        defaultValue= {params.code}
                        name="search_code"
                        type='search_code'
                        css='pad-1'
                        onChange={(e) => handleFilterCode(e.target.value)}
                        label='Rider Code' />
        <TableHeader csswrap="width-100" css="user_list-template jic aic">
          {colHeaders.map((x, y) => {
            return <div key={y}>{x}</div>;
          })}
        </TableHeader>
      </div>
      <div className="over-y-auto scroll">
        {tableData &&
          tableData.map((record, key) => {
            return (
              <RiderTableRow
                css="user_list-template aic jic"
                key={key}
                data={record}
                editAction={id =>
                  props.history.push(`/system/rider/update/${id}`)
                }
                activateRider={activateRider}
              />
            );
          })}
      </div>
      <div className="grd pad-y-1">
        <Pagination
          selPage={params.page}
          rows={params.pageSize}
          count={totalRecCount}
          pageClick={PageClick}
        />
      </div>
    </Container>
  );
};

const MapStateToProps = state => ({
  userData: state.userData,
  isFetching: state.webFetchData.isFetching,
  allRider: state.riderData.all_riders
});

export default connect(
  MapStateToProps,
  { fetchAllRiders, fetchSearchRider, activatingRider }
)(AllRiders);
