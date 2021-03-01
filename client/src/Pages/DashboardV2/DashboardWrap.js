import React, { useState, useEffect } from 'react'
import DispatchDashboardV2 from './DispatchDashboardV2';


//aesthetics
import './components/DashBoardV2.css'

//redux
import { connect } from "react-redux";
import { fetchDispatchDashboard } from '../../scripts/actions/dashboardActions';
import Input from '../../atoms/Input/Input';

const DashboardWrap = (props) => {
    //=======VARIABLE=======
    //=======VARIABLE=======
    
    //=======PROPS===========
    //=======PROPS===========

    //redux
    const { dashboardData, fetchDispatchDashboard, user_hub } = props;

    //==========STATE=========
    //==========STATE=========

    // //state for changing the category of data show on table initial category is delivery time
    // // caterogy can be change to payment or delivery_time
    // const [ category, setCategory ] = useState('delivery_time')

    // // state for delivery time filter
    // // emplty array means get all the delivery time
    // const [ deliveryTime, setDeliveryTime ] = useState(['']);

    // // state for order statuses filter
    // // empty array means get all the statuses
    // const [ statuses, setStatuses ] = useState([''])

    // // state for payment method filter
    // // empty arras means get all the payment method
    // const [ payment, setPayment ] = useState([]);

    //state for date filter
    // null or undefineds means today
    const [ date, setDate] = useState(null);

    // state for hub filter
    const [ hub, setHub ] = useState(null)

    // state for hub options
    const [ hubOptions, setHubOptions ] = useState([]);

    //===========USE EFFECT==========
    //===========USE EFFECT==========

    // component did mount and unmount 
    // adding fetching data every 5 minutes
    // useEffect(() => {
            
    // }, [])

    useEffect(() => {
        if(hub){
            fetchDispatchDashboard({
                today_date: date,
                hub_id: hub,
                category: 'delivery_time',
                params: {
                    delivery_time: '',
                    payment_id: [],
                    status: ''
                }
            })
            console.log(hub, 'hub')
        }
    }, [hub, date])

    useEffect(() => {
        if(user_hub.length){
            let arr = []
            let allhub = []
            user_hub.forEach(hub => {
                arr.push({
                    label: hub.name,
                    id: [hub.user_hub.hub_id],
                })
                allhub.push(hub.user_hub.hub_id)
            })
            
            if(allhub.length > 1){
                setHubOptions([{label: 'All', id: allhub}, ...arr])
            } else {
                setHubOptions(arr);
            }
        } 
    }, [user_hub])


    useEffect(() => {
        if(hubOptions.length > 0){
            if(hubOptions.length > 1){
                setHub(hubOptions[1].id)
            } else {
                setHub(hubOptions[0].id)
            }
        }
    }, [hubOptions])

    return (
        <div className='grd pad-1 bg-white gtr-af size-100 over-hid'>
            <div 
                className='grd grd-gp-1 pad-y-1 aic'
                style={{gridTemplateColumns: '1fr auto auto'}}
                >
                <span className='header'>Dashboard</span>
                <Input
                    css='pad-1'
                    label='Delivery date' 
                    type='date'
                    name='today_date'
                    value={date ? date : ''}
                    onChange={e => setDate(e.target.value)}
                />
                <select
                    className='pad-1'
                    value={JSON.stringify({arr: hub})}
                    // onChange={e => setHub(e.target.value.arr)}
                    onChange={e => setHub(JSON.parse(e.target.value).arr)}
                >
                    {hubOptions.length > 0 &&
                        hubOptions.map(hub => {
                            return <option key={hub.id} value={JSON.stringify({arr: hub.id})}>{hub.label}</option>
                        })
                    }
                </select>
            </div>
            <div className='over-y-auto scroll'>
                { dashboardData.length > 0 &&
                    Object.keys(dashboardData[0]).map(hub => {
                        return <DispatchDashboardV2
                            key={hub} 
                            data={dashboardData[0][hub]}
                            category='delivery_time'
                            date={date}
                            hub={hub}
                        />
                    })
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        dashboardData: state.dashboardData.dispatch_dashboard,
        user_hub: state.authData.user.user_info.hubs
    };
  };

export default connect(mapStateToProps, { fetchDispatchDashboard } )(DashboardWrap)
