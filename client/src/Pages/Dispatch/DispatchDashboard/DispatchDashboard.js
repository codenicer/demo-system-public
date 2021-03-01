import React, { useState, useEffect } from "react";
import Input from "../../../atoms/Input/Input";
import HubFilter from '../../../organisms/HubFilter/HubFilter';
import { connect } from "react-redux";
import { fetchDashboard } from "../../../scripts/actions/dispatchActions";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");;
import Dashboard from "./Dashboard";


function DispatchDashboard(props) {
  const {
    dispatchData: { dashboard_data },
    fetchDashboard
  } = props;

  const [ once, setOnce ] = useState(0);

  const [params, setParams] = useState({
    first_date: moment(Date.now()).format('YYYY-MM-DD'),
    second_date: moment(new Date().setDate(new Date().getDate()+1)).format('YYYY-MM-DD'),
    hub: null
  })

  useEffect(() => {
    setOnce(1);
  }, [])

  useEffect(() => {
    if(once){
      if(params){
        const { first_date, second_date, hub} = params;
        fetchDashboard(first_date, second_date, hub)
      }
    }
  }, [params])

  useEffect(() => {
    console.log(dashboard_data, 'dashboard_data')
  }, [dashboard_data])

    // get the returned params from hubfilter
    const getHubID = (id) => {
      const returnedID = id();
        setParams({
          ...params,
          hub: returnedID
      })
  }
  
  return (
    <div className="grd gtr-af grd-gp-1 pad-y-1 over-hid size-100">
      <div 
        style={{gridTemplateColumns: 'auto auto 1fr'}}
        className='grd jis grd-gp-1'>
        <span className="asc header">Dashboard</span>
        <Input type='date' label='Filter date...' onChange={e =>
          {if(e.target.value){
            setParams({
              first_date: moment(e.target.value).format('YYYY-MM-DD'), 
              second_date: moment(new Date(e.target.value).setDate(new Date(e.target.value).getDate()+1)).format('YYYY-MM-DD')
          })}}}/>
        <HubFilter 
          getHubID={getHubID}
          maxBadgeCount={6}
        />
      </div>
      <div 
        style={{gridTemplateColumns: '50% 50%'}}
        className='grd relative grd-gp-1 over-hid grd-col scroll over-y-auto'>
        { dashboard_data.length !== 0 &&
          <>
            <Dashboard data={dashboard_data[0].today.length !== 0 && dashboard_data[0].today} date={params.first_date}/>
            <Dashboard data={dashboard_data[0].tomorrow !== 0 && dashboard_data[0].tomorrow} date={params.second_date}/>
          </>
        }
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    dispatchData: state.dispatchData
  };
};

export default connect(
  mapStateToProps,
  { fetchDashboard }
)(DispatchDashboard);