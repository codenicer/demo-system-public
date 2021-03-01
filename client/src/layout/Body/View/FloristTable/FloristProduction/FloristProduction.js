import React, { useEffect, useState } from "react";
import FloristProductionHeader from "./FloristProductionHeader/FloristProductionHeader";
import FloristProductionRow from "./FloristProductionRow/FloristProductionRow";
import { connect } from "react-redux";
import { loadFloristPending } from "../../../../../mobile/floristjobs/florisjobsActions";
import Pagination from "../../../../../atoms/Pagination/Pagination";
import Input from "../../../../../atoms/Input/Input";
import Select from "react-select/lib/Select";
import _ from "lodash";
import filter_config from "../../../../../config.json";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");

const FloristProduction = props => {
  const { loadFloristPending, florist_pending } = props;

  const [params, setParams] = useState({
    page: 1,
    pageSize: 200,
    filterall: "",
    shippingCity: "",
    deliveryDate: moment().format("YYYY-MM-DD"),
    deliveryTime: "",
    shopifyOrderName: "",
    payment_id: ""
  });

  const [cityList, setCityList] = useState([]);
  const [floristData, setFloristData] = useState(null);
  const [totalRecCount, setTotalRecCount] = useState(13);
  const { deliverytime, paymentMethod } = filter_config;

  useEffect(() => {
    loadFloristPending(params);
  }, []);

  useEffect(() => {
    if (params.hub_filter !== "-1") {
      loadFloristPending(params);
    }
  }, [params]);

  useEffect(() => {
    if (florist_pending) {
      setFloristData(florist_pending.rows);
      if (florist_pending.hasOwnProperty("cities")) {
        if (florist_pending.cities.length > 0) {
          setCityList(
            _.map(florist_pending.cities, rec => {
              return { value: rec.city, label: rec.city };
            })
          );
        }
      }
    }
  }, [florist_pending]);

  useEffect(() => {
    if (florist_pending) {
      setTotalRecCount(florist_pending.count);
    }
  }, [florist_pending]);

  const PageClick = x => {
    let retpage = x();
    const newparam = { ...params, page: retpage };
    setParams(newparam);
    loadFloristPending(newparam);
  };

  function rowRenderrer() {
    if (floristData) {
      if (floristData == null) {
        return <h1>NO CONTENT</h1>;
      } else if (floristData !== null && floristData.length >= 1) {
        return floristData.map((value, key) => {
          return <FloristProductionRow data={value} key={key} />;
        });
      } else {
        return null;
      }
    }
  }
  
  //This is for select time
  function handleSelectChange(data, key) {
    setParams({
      ...params,
      [key]: data
    });
  }

  function handleChange(event) {
    setParams({
      ...params,
      [event.target.name]: event.target.value,
      page: 1,
      pageSize: 200
    });
  }

  return (
    <div className="grd size-100 gtr-af over-hid slideInRight animate-1">
      <div className="grd grd-col grd-col-f grd-gp-1">
        <Input
          css="pad-1"
          name="shopifyOrderName"
          type="search"
          label="Filter..."
          onChange={handleChange}
        />
        {cityList.length > 0 && (
          <Select
            value={params.shippingCity}
            name="shippingCity"
            placeholder="City Filter"
            options={cityList}
            simpleValue
            onChange={selecteditem =>
              setParams({
                ...params,
                shippingCity: selecteditem ? selecteditem : "",
                page: 0,
                pageSize: 200
              })
            }
          />
        )}
        
        <Select
          value={params.payment_id}
          name="payment_id"
          placeholder="Payment Method"
          options={paymentMethod.map((rec, key) => {
            return { value: rec.id, label: rec.name };
          })}
          onChange={selecteditem =>
            handleSelectChange(
              selecteditem ? selecteditem.value : 0,
              "payment_id"
            )
          }
        />

        <Input
          value={params.deliveryDate}
          onChange={handleChange}
          name="deliveryDate"
          css="pad-1"
          type="date"
          label="Delivery Date"
        />
        <Select
          value={params.deliveryTime}
          name="deliveryTime"
          placeholder="Delivery time"
          options={deliverytime.map((rec, key) => {
            return { value: rec.id, label: rec.id };
          })}
          onChange={selecteditem =>
            handleSelectChange(
              selecteditem ? selecteditem.value : "",
              "deliveryTime"
            )
          }
        />
      </div>
      <div className="grd size-100 gtr-af slideInRight animate-1 over-y-auto">
        <FloristProductionHeader />
        <div className="over-y-auto">{rowRenderrer()}</div>
      </div>
      <div className="grd jie">
        <Pagination
          selPage={params.page}
          rows={params.pageSize}
          count={totalRecCount}
          pageClick={PageClick}
        />
      </div>
    </div>
  );
};

const transferStatetoProps = state => ({
  florist_pending: state.m_floristjobData.florist_pending
});

export default connect(
  transferStatetoProps,
  { loadFloristPending }
)(FloristProduction);