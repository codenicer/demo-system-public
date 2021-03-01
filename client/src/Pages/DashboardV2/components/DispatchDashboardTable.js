import React, { useEffect, useState } from 'react';
import DashboardHeader from './DasboardHeader';
import DashboardRow from './DashboardRow';
import Input from '../../../atoms/Input/Input';
import FilterTable from './FilterTable';
import moment from 'moment-timezone';
import DashboardTotalTable from './DashboardTotalTable';

moment.tz.setDefault("Asia/Manila");
const DispatchDashboardTable = (props) => {
    //=========STATE========
    //=========STATE========

    //state for getting the total orders for 1st date and 2nd date
    const [ todayTotal, setTodayTotal ] = useState(0);
    const [ tomTotal, setTomTotal ] = useState(0);


    //===========PROPS=========
    //===========PROPS=========
    
    //pass down props 
    const { data, category, setCategory, deliveryTime, setDeliveryTime, statuses, setStatuses, date, setDate, payment, setPayment } = props;

    //==========USE EFFECT========
    //==========USE EFFECT========


    //reset state when category change 
    // useEffect(() => {
    //     setTodayTotal(0);`
    //     setTomTotal(0);
    // }, [category])

    //get the total orders per day
    useEffect(() => {
        let tot = 0;
        let tot2 = 0
        if(data){
            data.today.forEach((data) => {
                Object.entries(data).forEach((num) => {
                    if(!isNaN(num[1]) && num[0] !== 'hub_id' && num[0] !== 'order_count'){
                        tot = tot + Number(num[1]);
                    }
                })
            })
            setTodayTotal(tot);

            data.tomorrow.forEach((data) => {
                Object.entries(data).forEach((num) => {
                    if(!isNaN(num[1]) && num[0] !== 'hub_id' && num[0] !== 'order_count' ){
                        tot2 = tot2 + Number(num[1]);
                    }
                })
            })
            setTomTotal(tot2)
        }
    }, [data])

    return (
        <div className='bg-white pad-1 grd grd-gp-1'>
            <div 
                style={{gridTemplateColumns: 'auto 1fr auto'}}
                className='grd grd-gp-1'>
                {/* <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value='delivery_time'>Delivery time</option>
                    <option value='payment'>Payment</option>
                </select> */}
                {/* <Input
                    label='Date' 
                    type='date'
                    value={date ? date : ''}
                    onChange={e => setDate(e.target.value)}
                /> */}
                {/* <FilterTable
                    payment={payment}
                    setPayment={setPayment} 
                    category={category}
                    setCategory={setCategory}
                    deliveryTime={deliveryTime}
                    setDeliveryTime={setDeliveryTime}
                    statuses={statuses}
                    setStatuses={setStatuses}
                /> */}
            </div>
            <span className='header-3'>{date ? moment(date).format('MMM. DD, YYYY') : moment(Date.now()).format('MMM. DD, YYYY')}</span>
            <div 
                style={{gridTemplateColumns: '2.5fr 1fr'}}
                className='grd grd-gp-3'>
                <div>
                    <DashboardHeader />
                    <div className='_dashboard-table_wrap'>
                    {data &&
                        data.today.map((data, key) => {
                            return <DashboardRow category={category} data={data} key={key} />
                        })
                    }
                    </div>
                    <div className='grd gtc-fa grd-gp-1 aic'>
                        <span className='sublabel jse'>TOTAL :</span>
                        <span className='header-3 italic'>{todayTotal}</span>
                    </div>
                </div>
                <div className='_dashboard-table_wrap'>
                    {data &&
                        <DashboardTotalTable data={data.today} />
                    }
                </div>
            </div>
            <br />
            <span className='header-3'>{date ? moment(new Date(date).setDate(new Date(date).getDate()+1)).format('MMM. DD, YYYY') : moment(new Date().setDate(new Date().getDate()+1)).format('MMM. DD, YYYY')}</span>
            <div
                style={{gridTemplateColumns: '2.5fr 1fr'}}
                className='grd grd-gp-3'>
                <div>
                    <DashboardHeader />
                    <div className='_dashboard-table_wrap'>
                    {data &&
                        data.tomorrow.map((data, key) => {
                            return <DashboardRow category={category} data={data} key={key} />
                        })
                    }
                    </div>
                    <div className='grd gtc-fa grd-gp-1 aic'>
                        <span className='sublabel jse'>TOTAL :</span>
                        <span className='header-3 italic'>{tomTotal}</span>
                    </div>
                </div>
                <div>
                    {data &&
                        <DashboardTotalTable data={data.tomorrow} />
                    }
                </div>
            </div>
        </div>
    )
}

export default DispatchDashboardTable
