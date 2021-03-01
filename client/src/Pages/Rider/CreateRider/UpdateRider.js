import React, { useState, useEffect } from "react";
import Container from "../../../atoms/Container/Container";
import Paper from "../../../atoms/Paper/Paper";
import Input from "../../../atoms/Input/Input";
import Select from "../../../atoms/Select/Select";
import Button from "../../../atoms/Button/Button";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import "./CreateRider.css";

//actions
import {
  updateRider,
  fetchRider,
} from "../../../scripts/actions/riderActions";

import {
  fetchRiderProviders

} from "../../../scripts/actions/riderProviderActions";


function UpdateRider(props) {
  const {
    updateRider,
    fetchRiderProviders,
    fetchRider,
    riderData: { rider_info  },
    riderProviderData: { rider_providers  }
  } = props;


  const [riderForm, setRiderForm] = useState({
    id:0,
    first_name: '',
    last_name: '',
    mobile_number: '',
    rider_provider_id: 0
  });


  const [ riderProviderList, setRiderProviderList] = useState([]);

  useEffect(() => {
      setRiderProviderList(rider_providers);
  }, [rider_providers]);

  useEffect(() => {
    fetchRiderProviders();
  }, []);

  useEffect(() => {
    const rider_id  = props.match.params.rider_id;
    fetchRider(rider_id);
  }, []);

  useEffect(() => {
    console.log('rider_info', rider_info);
    setRiderForm(rider_info);
  }, [rider_info]);


  const handleChange = e => {
    setRiderForm({ ...riderForm, [e.target.name]: e.target.value });
  };

  const isValid = () => {
    if (
      !riderForm.first_name ||
      !riderForm.last_name ||
      !riderForm.mobile_number ||
      !riderForm.rider_provider_id
    ) {
      toast.warn("Please input all fields");
      return false;
    }

    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (window.confirm("Do you want to proceed?")) {
      if (isValid()) {

        updateRider(riderForm, msg => {
          toast.success(msg);
          props.history.push("/system/rider/list");
        });
      }
    } else {
      return false;
    }
  };


  return (
    <Container css="pad-1 grd grd-gp-1 gtr-af over-hid">
      <span className="header">Update User</span>
      <Paper css="grd grd-gp-1 create_user-wrap over-hid over-y-auto scroll">
        <form>
          <div className="grd grd-col asc">

            <div className="grd grd-gp-1 pad-2">
              <span className="label">Firstname:</span>
              <Input
                css="pad-1"
                name="first_name"
                value={ riderForm ?  riderForm.first_name : ''}
                onChange={e => handleChange(e)}
              />
              <span className="label">Lastname:</span>
              <Input
                css="pad-1"
                name="last_name"
                value={ riderForm ? riderForm.last_name : '' }
                onChange={e => handleChange(e)}
              />
              <span className="label">Mobile Number:</span>
              <Input
                css="pad-1"
                name="mobile_number"
                value={riderForm ? riderForm.mobile_number : ''}
                onChange={e => handleChange(e)}
              />

              <span className="label">Code:</span>
              <Input
                css="pad-1"
                name="code"
                value={ riderForm ? riderForm.code : '' }
                onChange={e => handleChange(e)}
              />
              <span className="label">Rider Provider:</span>
              <Select
                css="pad-1"
                name="rider_provider_id"
                value={ riderForm ?  riderForm.rider_provider_id : 0}
                onChange={e => handleChange(e)}
              >
                <option value="" />
                { riderProviderList && riderProviderList.map((value, key) => {
                  return (
                    <option key={key} value={value.rider_provider_id}>
                      {value.name}
                    </option>
                  );
                })}
              </Select>
            </div>
          </div>
          <div className="grd hub-wrap">
            <hr style={{ border: "1px solid black", width: "100%" }} />

            <div
              className="grd pad-2 grd-gp-2"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            />
          </div>

          <Button onClick={handleSubmit} color="success">Update Rider</Button>

          <Button
            color="warning"
            css="mar-1"
            onClick={() => props.history.push("/system/rider/list")}
          >
            Cancel
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

const MapStateToProps = state => {
  return {
    riderData: state.riderData,
    isFetching: state.webFetchData.isFetching,
    riderProviderData: state.riderProviderData,
  };
};

export default connect(
  MapStateToProps,
  { updateRider, fetchRider, fetchRiderProviders }
)(UpdateRider);
