import React, { useState, useEffect } from "react";
import Container from "../../../atoms/Container/Container";
import Paper from "../../../atoms/Paper/Paper";
import Input from "../../../atoms/Input/Input";
import Select from "../../../atoms/Select/Select";
import Checkbox from "../../../atoms/Checkbox/Checkbox";
import Button from "../../../atoms/Button/Button";
import Upload from "../../../components/Upload/Upload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import _ from "lodash";
import { connect } from "react-redux";
import "./CreateUser.css";

//actions
import { addUser } from "../../../scripts/actions/users";
import { handleLoadHubs } from "../../../scripts/actions/hubActions";
import { fetchRoles } from "../../../scripts/actions/roleActions";

function CreateUser(props) {
  const {
    hubData: { hubs }
  } = props;

  const [thumbnail, setThumbnail] = useState("");
  const { handleLoadHubs, fetchRoles, roleData } = props;

  const [file, setFile] = useState();
  const [roles, setRoles] = useState([]);
  //const [hubs, setHubs] = useState([]);
  const [newHubs, setNewHubs] = useState([]);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    re_password: "",
    first_name: "",
    last_name: "",
    role_id: ""
  });

  //Fetch all the roles and hubs
  useEffect(() => {
    fetchRoles();
    handleLoadHubs();
  }, []);

  //Get all roles list from redux
  useEffect(() => {
    if (roleData) {
      setRoles(roleData);
    }
  }, [roleData]);

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const isValid = () => {
    if (
      !userData.email ||
      !userData.first_name ||
      !userData.last_name ||
      !userData.password ||
      !userData.re_password ||
      !userData.role_id
    ) {
      toast.warn("Please input all fields");
      return false;
    }

    if (userData.password.length < 6 || userData.re_password.length < 6) {
      toast.warn("Password must be at least 6 characters");
      return false;
    }

    if (userData.password !== userData.re_password) {
      toast.warn("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (window.confirm("Do you want to proceed?")) {
      if (isValid()) {
        let userForm = {
          user_form: userData,
          hubs: newHubs
        };

        props.addUser(userForm, file, msg => {
          toast.success(msg);
          props.handleLoadHubs();
          props.history.push("/system/user/list");
        });

        console.log("HANDLE SUBMIT");
      }
    } else {
      return false;
    }
  };

  //Add or remove hubs from an array
  const handleHubs = hub_id => {
    //{"hub_id": 4}
    let hubObj = {
      hub_id
    };

    //console.log(hubObj, newHubs);

    if (_.find(newHubs, hubObj)) {
      let someArray = newHubs.filter(hub => hub.hub_id !== hubObj.hub_id);

      setNewHubs(someArray);
    } else {
      setNewHubs([...newHubs, hubObj]);
    }
  };

  const onChangeImage = e => {
    if (e.target.files[0]) {
      setThumbnail(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  };

  return (
    <Container css="pad-1 grd grd-gp-1 gtr-af over-hid">
      <span className="header">Create User</span>
      <Paper css="grd grd-gp-1 create_user-wrap over-hid over-y-auto scroll">
        <form>
          <div className="grd grd-col asc">
            <div className="grd grd-col aic jic user-wrap">
              {!file ? (
                <div
                  className="round grd aic jic"
                  style={{
                    background: "#929292",
                    height: "200px",
                    width: "200px",
                    fontSize: "120px"
                  }}
                >
                  <FontAwesomeIcon icon={faUser} color="white" />
                </div>
              ) : (
                <img
                  src={thumbnail}
                  alt=""
                  width="200px"
                  height="200px"
                  className="round over-hid"
                  style={{ objectFit: "cover" }}
                />
              )}
              <Upload
                type="file"
                css="ase"
                onChange={e => {
                  onChangeImage(e);
                }}
              />
            </div>
            <div className="grd grd-gp-1 pad-2">
              <span className="label">Email:</span>
              <Input
                type="email"
                css="pad-1"
                name="email"
                onChange={e => handleChange(e)}
              />
              <span className="label">Password:</span>
              <Input
                css="pad-1"
                type="password"
                name="password"
                onChange={e => handleChange(e)}
              />
              <span className="label">Repeat Password:</span>
              <Input
                type="password"
                css="pad-1"
                name="re_password"
                onChange={e => handleChange(e)}
              />
              <span className="label">Firstname:</span>
              <Input
                css="pad-1"
                name="first_name"
                onChange={e => handleChange(e)}
              />
              <span className="label">Lastname:</span>
              <Input
                css="pad-1"
                name="last_name"
                onChange={e => handleChange(e)}
              />
              <span className="label">Role:</span>
              <Select
                css="pad-1"
                name="role_id"
                onChange={e => handleChange(e)}
              >
                <option value="" />
                {roles &&
                  roles.map((value, key) => {
                    return (
                      <option key={key} value={value.role_id}>
                        {value.title}
                      </option>
                    );
                  })}
              </Select>
            </div>
          </div>
          <div className="grd hub-wrap">
            <hr style={{ border: "1px solid black", width: "100%" }} />
            <span className="header-3">Hubs:</span>
            <div
              className="grd pad-2 grd-gp-2"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              {hubs.map((value, key) => {
                return (
                  <Checkbox
                    label={value.name}
                    onChange={() => handleHubs(value.hub_id)}
                    key={key}
                    color="secondary"
                  />
                );
              })}
            </div>
          </div>

          <Button onClick={handleSubmit} color="success">
            Create User
          </Button>
          <Button
            color="warning"
            css="mar-1"
            onClick={() => props.history.push("/system/user/list")}
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
    hubData: state.hubData,
    isFetching: state.webFetchData.isFetching,
    roleData: state.roleData.roles.rows
  };
};

export default connect(
  MapStateToProps,
  { addUser, handleLoadHubs, fetchRoles }
)(CreateUser);
