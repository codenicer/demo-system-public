import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import Container from "../../atoms/Container/Container";
import DispatchQueueJob from "./AssemblyGabQueueJob/AssemblyGabQueueJob";
import Input from "../../atoms/Input/Input";
import { fetchAssemblyJobsTwo } from "../../scripts/actions/assemblyActions";
import { setQualityCheck } from "../../scripts/actions/ordersActions";
import { toast } from "react-toastify";
import _ from "lodash";
import HubFilter from "../../organisms/HubFilter/HubFilter";
import Pagination from "../../atoms/Pagination/Pagination";

import {
  checkCPUDelivery,
  countNotes
} from "../../scripts/actions/dispatchActions";
import DispatchQualityCheck from "./AssemblyGabQualityCheck";

const DispatchQueue = props => {
  // state for quality check modal
  const [qualityCheckModal, setQualityCheckModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const [failedIds, setFailedIds] = useState([]);
  const [noteCounts, setNoteCounts] = useState([]);
  const [once, setOnce] = useState(true);
  const [riderList, setRiderList] = useState([]);
  // dispatchjob data

  const {
    fetchAssemblyJobsTwo,
    deleteJob,
    checkCPUDelivery,
    failCPUs,
    countNotes,
    noteCountsData,
    setQualityCheck
  } = props;

  const {
    assemblyData: { assembly_jobs_two }
  } = props;

  // data of assigned job
  const [tableData, setTableData] = useState([]);

  // data of job for assignment
  const [itemList, setItemList] = useState([]);

  //state for barcode input
  const [barcodeValue, setBarcodeValue] = useState("");

  //ref of barcode for focus
  const inputBarcode = useRef();

  //assigned job params
  const [ajParams, setAjParams] = useState({
    page: 1,
    pageSize: 20, //by default
    filterall: {},
    hub_filter: [],
    shopify_order_name: "",
    riderFilter: ""
  });

  // get the returned params from hubfilter of assigned jobs
  const getHubID = id => {
    const returnedID = id();
    setAjParams({
      ...ajParams,
      hub_filter: returnedID
    });
  };

  //get selected page of assigned jobs
  const PageClick = x => {
    let retpage = x();
    setAjParams({
      ...ajParams,
      page: retpage
    });
  };

  //checker on add item
  const stateHandler = (value, key) => {
    const tData = _.clone(itemList);
    tData[key]["isSelected"] = value;

    inputBarcode.current.focus();
  };

  //barcode input handler
  const barcodeEnter = event => {
    if (event.target.value.length > 7 || event.key === "Enter") {
      onBarcodeTextChange(event.target.value);
    } else return null;
  };

  function showQualityCheck(rec) {
    setQualityCheckModal(true);
    setSelectedData(rec);
  }

  useEffect(() => {
    if (ajParams.hub_filter.length > 0 && once) {
      fetchAssemblyJobsTwo(ajParams);
      setOnce(false);
    } else if (!once) {
      fetchAssemblyJobsTwo(ajParams);
    }
  }, [ajParams]);

  useEffect(() => {
    // setTableData(for_assignment)
    // console.log("assigned jobs:", assembly_jobs_two);
    // console.log('dispatch data', props.assemblyData)
    // if(assembly_jobs_two.rows.length){
    setTableData(assembly_jobs_two.rows);
    //  }
    //setTableData(assembly_jobs_two.rows)

    if (assembly_jobs_two.rows.length) {
      //FOR CPU ONLY TO CHECK IF DELIVERY IS SUCCESS
      let cpu_order_ids = [];
      _.map(assembly_jobs_two.rows, obj => {
        if (obj) {
          if (obj.payment_method === "CPU") {
            cpu_order_ids.push(obj.order_id);
          }
        }
      });

      if (assembly_jobs_two.rows.length && !riderList.length) {
        setRiderList(
          _.map(assembly_jobs_two.rows, rec => {
            return {
              value: `${rec.rider_id}`,
              label: `${rec.rider_first_name} ${rec.rider_last_name}`
            };
          })
        );
      }

      checkCPUDelivery(cpu_order_ids);
      //END

      //CHECK ALL NOTES
      let order_ids = [];
      _.map(assembly_jobs_two.rows, obj => {
        if (obj) {
          order_ids.push(obj.order_id);
        }
      });

      countNotes(order_ids);

      //END
    }

    //RED IF NOT ORDER_STATUS = 9 OR 10
    //GET ALL ORDER IDS FROM ASSIGNED JOBS CHECK IF CPU
  }, [assembly_jobs_two]);

  useEffect(() => {
    //Fetch all fail cpus
    if (failCPUs) {
      setFailedIds(failCPUs.failedIds);
    }
  }, [failCPUs]);

  useEffect(() => {
    //Fetch all note counts
    if (noteCountsData) {
      setNoteCounts(noteCountsData);
    }
  }, [noteCountsData]);

  function onRemoveJob(dispatch_job_id) {
    if (
      window.confirm(
        "You are about to delete the Dispatch Job. Click OK to proceed"
      )
    ) {
      deleteJob({ dispatch_job_id }, msg => {
        fetchAssemblyJobsTwo(ajParams);
        toast.success(msg);
      });
    }
  }

  function onSetQualityCheck(order_id) {
    //set quality check
    // console.log('call onSetQualityCheck');
    setQualityCheck({ order_id }, msg => {
      //   console.log('quality checking for order', order_id);
      toast.success(msg);
    });
    setQualityCheckModal(false);
    fetchAssemblyJobsTwo(ajParams);
  }

  const onFilterTextChange = _.debounce(e => {
    let textFilter = e;

    setAjParams({ ...ajParams, shopify_order_name: textFilter });
  }, 1000);

  const onBarcodeTextChange = _.debounce(e => {
    let textFilter = e;

    setAjParams({ ...ajParams, shopify_order_name: textFilter });
  }, 300);

  return (
    <>
      <Container css="grd grd-gp-2 dispatch-q-template slideInRight animate-1 relative over-hid">
        <div
          style={{ gridTemplateColumns: "auto 1fr" }}
          className="grd grd-gp-1"
        >
          <span className="header asc">Assembler Job</span>
          <Input
            height={"50px"}
            fontSize={"2rem"}
            type="search"
            label="Scan barcode.."
            maxLength="10"
            autoFocus
            onKeyPress={barcodeEnter}
          />
        </div>
        <div className="grd grd-col grd-col-f grd-gp-1">
          <Input
            css="pad-1"
            type="search"
            label="Filter..."
            onChange={e => onFilterTextChange(e.target.value, 1000)}
          />

          {/* {riderList.length !== 0 && (
            <Select
              options={riderList}
              value={ajParams.riderFilter}
              name="riderFilter"
              placeholder="Rider Filter"
              simpleValue
              onChange={selecteditem =>
                setAjParams({
                  ...ajParams,
                  riderFilter: selecteditem ? selecteditem : "",
                  page: 0,
                  pageSize: 10
                })
              }
            />
          )} */}

          <HubFilter getHubID={getHubID} maxBadgeCount={8} />
        </div>
        <div className="over-y-auto scroll pad-1">
          {once ? (
            <span>Spinner</span>
          ) : tableData.length ? (
            <>
              {tableData.map((record, key) => {
                return (
                  <DispatchQueueJob
                    noteCounts={noteCounts}
                    failedIds={failedIds}
                    key={key}
                    data={record}
                    onRemoveItem={() => false}
                    onRemoveJob={() => false}
                    onQualityCheck={showQualityCheck}
                  />
                );
              })}
              {/* pagination of assigned jobs */}
              <div className="grd">
                <Pagination
                  selPage={ajParams.page}
                  pageClick={PageClick}
                  count={assembly_jobs_two.count}
                  rows={ajParams.pageSize}
                />
              </div>
            </>
          ) : (
            <div className="grd aic jic size-100">
              <span>No Record Found</span>
            </div>
          )}
        </div>
        {qualityCheckModal && (
          <DispatchQualityCheck
            data={selectedData}
            setQualityCheck={onSetQualityCheck}
            clickClose={() => setQualityCheckModal(false)}
          />
        )}
      </Container>
    </>
  );
};

const mapStatetoProps = state => ({
  assemblyData: state.assemblyData,
  isfetching: state.webFetchData.isFetching,
  orderData: state.orderData
});

export default connect(
  mapStatetoProps,
  {
    fetchAssemblyJobsTwo,
    checkCPUDelivery,
    countNotes,
    setQualityCheck
  }
)(DispatchQueue);
