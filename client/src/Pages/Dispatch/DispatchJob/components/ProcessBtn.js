import React, { useState } from 'react';
import ConfirmationModal from '../../../ConfirmationModal/ConfirmationModal';
import SelectedItem from '../SelectedItem';
import Button from '../../../../atoms/Button/Button';

//redux
import { connect } from 'react-redux' 
import { createAdvanceBooking, createRiderAssignment, fetchJobsForAssignment } from './../../../../scripts/actions/dispatchActions';

//package
import moment from 'moment-timezone';
import {toast} from 'react-toastify';
moment.tz.setDefault("Asia/Manila");

const ProcessBtn = (props) => {
    //=======PROPS=======
    //=======PROPS=======

    // pass down props
    const { type, selectedData, setSelectedData, riderForm, color, setRiderForm, getTrackingNo} = props;

    //redux props
    const { process_fetch, createAdvanceBooking, createRiderAssignment, fetchJobsForAssignment} = props;

    //=======STATE=======
    //=======STATE=======

    //state to show and hide the confirmation modal
    const [ show, setShow ] = useState(false);
    
    //=======FUNCTION=========
    //=======FUNCTION=========

    const processHandler = type => {

        let dataSubmit = {
            selectedData,
            riderForm,
            tracking_no: riderForm.tracking_no
        }

        console.log(riderForm, 'riderForm')

        // check if user generate a tracking no
        // if not throw an error msg
        if(!riderForm.tracking_no){
            toast.error('Please generate a tracking no.')
        } else {

            if(type === 'Advance Booking'){
                // clear selected data on submit
                createAdvanceBooking(dataSubmit, msg => {
                    toast.success(msg);
                    getTrackingNo();
                });
                fetchJobsForAssignment({
                    page:1,
                    pageSize: 1000, //by default
                    filterall:'',
                    shopify_order_name:'',
                    hub_filter: [],
                    listCity:1,
                    city_filter:'',
                    deliver_time:'',
                    delivery_date:moment().format('YYYY-MM-DD'),
                    payment_method: ''
                });
                setSelectedData([]);
                setRiderForm({
                    ...riderForm,
                    rider_id:0,
                    rider_provider_id:0,
                    rider_provider_name:'',
                    first_name:'',
                    last_name:'',
                    mobile_number:'',
                    tracking_no: '',
                })
            } else {
                
                if(!Object.values(riderForm).includes('')){
                    // clear selected data on submit
                    
                    createRiderAssignment(dataSubmit, msg => {
                        toast.success(msg);
                        fetchJobsForAssignment({
                            page:1,
                            pageSize: 1000, //by default
                            filterall:'',
                            shopify_order_name:'',
                            hub_filter: [],
                            listCity:1,
                            city_filter:'',
                            deliver_time:'',
                            delivery_date:moment().format('YYYY-MM-DD'),
                            payment_method: ''
                        });
                        setRiderForm({
                            ...riderForm,
                            rider_id:0,
                            rider_provider_id:0,
                            rider_provider_name:'',
                            first_name:'',
                            last_name:'',
                            mobile_number:'',
                            tracking_no: '',
                        })
                        setSelectedData([]);
                    })
                } else {
                    toast.error('Please fill up all rider form fields')
                }
            }
        } 

        //manual clean up
        dataSubmit = null;
    }

    return (
        <>
            <Button
                width='136px'
                css='jse'                        
                color={color}
                disabled={process_fetch}
                onClick={() => setShow(true)}
            >
                {type}
            </Button>
            {show &&
                <ConfirmationModal
                    disabled={process_fetch}
                    clickClose={() => setShow(false)}
                    clickCancel={() => setShow(false)}
                    clickSubmit={() => processHandler(type) }
                    submitlabel='Process'
                    submitcolor='success'
                    label={`${type === 'Advance Booking' ? 'Advance booking of' : 'Assign'} 
                            ${selectedData.length} ${selectedData.length === 1 ? 'item' : 'items'} 
                            ${type === 'Assign to Rider' ? `to ${riderForm.first_name} ${riderForm.last_name} of ${riderForm.rider_provider_name}` : null}
                        `}
                    body={
                        <div 
                            className='grd jic'>
                            {
                                selectedData.map((record, key) => {
                                    return <SelectedItem key={key} data={record} />
        
                                })
                            }
                        </div>
                    }
            />
            }
        </>
    )
}

const mapStatetoProps = state => ({
    process_fetch: state.dispatchData.process_fetch,
  });

export default connect(mapStatetoProps,{ createAdvanceBooking, createRiderAssignment, fetchJobsForAssignment})(ProcessBtn);
  
  