import React, { useState, useEffect } from 'react'
import Page from '../../../atoms/Page/Page';
import Input from '../../../atoms/Input/Input';
import HubFilter from '../../../organisms/HubFilter/HubFilter';
import DispatchJobHeader from '../DispatchJob/components/DispatchJobHeader';
import DispatchJobRow from '../DispatchJob/components/DispatchJobRow';
import Virtualizer from '../../../atoms/Virtualizer/Virtualizer';
import Select from 'react-select';
import { fetchJobsForAssignment, addJobItem }  from './../../../scripts/actions/dispatchActions';
import { connect } from 'react-redux';
import { toast } from "react-toastify";
import filter_config from '../../../config.json'
import _ from "lodash";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");

function DispatchAddItem(props) {
    //------------PROPS------------------
    //------------PROPS------------------

    // list of delivey tine came from json confing
    const { deliverytime } = filter_config;

    //redux
    const { dispatchData:{for_assignment}, fetchJobsForAssignment } = props

    // ui props
    const { clickClose, selected_dispatch_job_id, addJobItem, unMount } = props;
    
    //--------------STATES---------------

    //state for data
    const [ data, setData ] = useState(null)
    
    //filter params
    const [ params, setParams ] = useState({
        page:1,
        pageSize: 1000, //by default
        filterall:'',
        deliver_time:'',
        hub_filter: null,
        delivery_date: null,
      });
    
    //--------------FUNCTIONS-------------------

    //passing returnedID from gethubid to componenet state
    const getHubID = (id) => {
        const returnedID = id();
        setParams({
            ...params,
            hub_filter: returnedID
        })
    }

    //add dispatch job
    function addDispatchJob(fsitem) {

        //variable to save match input to redux state
        let match;

        // save params for conditional purpose
        let newFs = fsitem

        if(fsitem.indexOf('-CPU') > -1){
            console.log('test')
            //remove -CPU on input
            newFs = fsitem.slice(0, fsitem.indexOf('-CPU'))
        }

        //check if input exist on redux state
        data.forEach(data => {
            if(data.shopify_order_name === newFs) match = data
        })

        // if there is a match execute addjobitem function else throw an error msg
        if(match){
            console.log(selected_dispatch_job_id, 'selected job id', fsitem, 'fs item')
            addJobItem({
                dispatch_job_id: selected_dispatch_job_id, shopify_order_name: fsitem
            }, msg => {
                fetchJobsForAssignment(params);
                toast.success(msg);
            })
        } else {
            toast.error('Job doesnt exist')
        }
}

    //checker on add item
    const rowChange = (value, key) => {
        console.log(value, 'value', key, 'key')
        const tData = _.clone(data);
        tData[key]["isSelected"] = value;
        if(tData[key]['jobtype'] === 'cash pickup'){
            addDispatchJob(tData[key]['shopify_order_name'] + '-CPU')
        } else {
            addDispatchJob(tData[key]['shopify_order_name'])
        }
    };


    //function on barcode keypress 
    const barcodeEnter = event => {
        if (event.key === "Enter") {
          addDispatchItem(event);
        } else return null;
     };

     //adding FS- on barcode input
    function addDispatchItem(event) {
        let fsitem = event.target.value;
        if (fsitem.indexOf("FS-") > -1) {
        //may FS na
        } else {
        fsitem = `FS-${fsitem}`;
        }
        addDispatchJob(fsitem);
    }

    //--------------USE EFFECT------------------

    //saving fetchdata to component state
    useEffect(() => {
        setData(for_assignment.rows)
    }, [for_assignment])

    useEffect(() => {
        console.log(params, 'params')
        //fetch only when hubfilter return and id
        if(params.hub_filter)
        {
            fetchJobsForAssignment(params);
        }
    }, [params])

    useEffect(() => {
        setParams({
            ...params,
            delivery_date: moment(Date.now()).format('YYYY-MM-DD')
        })
        return () => {
            unMount()
        }
    }, [])


    const item = ({index, style}) => {
        return(
            <div style={style}>
                <DispatchJobRow 
                    data={data[index]}
                    // selected={record['isSelected']}
                    // btnshow={selCount}
                    key={`${data[index]['order_item_id']}_${data[index]['job_id']}_${data[index]['jobtype']}`}
                    // assignClick={() => setModal(true)}
                    onChange={() =>  rowChange(!data[index]['isSelected'], index)}
                    // getPreviewData={getPreviewData}
                />
            </div>
        )
    }

    return (
        <Page
            css='dispatch_add-item over-hid'
            clickClose={clickClose}
        >
            <div
                className='grd grd-gp-1'
            >
                <div
                    style={{gridTemplateColumns: 'auto 400px 1fr'}}
                    className='grd grd-gp-2 aic'
                >
                    <span className='header'>Add Item</span>
                    <Input 
                        // myref={myref}
                        height='50px'
                        fontSize='2rem' 
                        type='search'
                        label='Scan barcode..'
                        autoFocus
                        // value={value}
                        // onChange={inputChange}
                        onKeyPress={e => barcodeEnter(e)}
                    />
                    <HubFilter
                        getHubID={getHubID}
                        maxBadgeCount={8} 
                    />
                </div>
                <div 
                    style={{gridTemplateColumns: 'repeat(2, 1fr)'}}
                    className='grd grd-gp-1'>
                    <Input
                        onChange={e => setParams({...params, [e.target.name]: e.target.value})}
                        name="delivery_date"
                        css='pad-1'
                        type='date'
                        label='Delivery Date' />
                    <Select
                        value={params.deliver_time}
                        name="delivery_time"
                        placeholder='Delivery time'
                        options = {
                            deliverytime.map((rec, key) => {
                                return {value: rec.id, label: rec.id, name: 'delivery_time'}
                            })
                        }
                        onChange={e => setParams({...params, deliver_time: e ? e.value : null})}
                    />
                </div>
                <DispatchJobHeader />
            </div>
                {data ?
                    <Virtualizer
                        itemCount={data.length}
                        itemSize={65}
                    >
                        {item}
                    </Virtualizer>
                    :
                    <div className='grd aic jic size-100'>
                        <span>No Record Found</span>
                    </div>
                }
        </Page>
    )
}

const mapStatetoProps = state => ({
    dispatchData: state.dispatchData,
    isfetching: state.webFetchData.isFetching,
  });

export default connect(mapStatetoProps, {
    fetchJobsForAssignment,
    addJobItem,
})(DispatchAddItem);