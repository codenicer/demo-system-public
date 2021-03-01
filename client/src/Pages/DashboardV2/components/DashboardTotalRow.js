import React, { useEffect, useState } from 'react'

const DashboardTotalRow = (props) => {
    //===========STATE===========
    //===========STATE===========

    const [ notShipped, setNotShipped ] = useState(0);
    const [ toBeShipped, setToBeShipped ] = useState(0);

    //==========PROPS=======
    //==========PROPS=======
    
    //pass down props
    const { data } = props

    //==========USE EFFECT===========
    //==========USE EFFECT===========

    useEffect(() => {
        if(data){
            let notshipped = 0;
            let pending = data.pending ? Number(data.pending) : 0;
            let booking = data.booking ? Number(data.booking) : 0;
            let rider = data.rider_assigned ? Number(data.rider_assigned) : 0
            notshipped = pending + booking + rider
            setNotShipped(notshipped)
            let tot = 0;
            Object.entries(data).forEach(x => {
                if(!isNaN(x[1]) && x[0] !== 'hub_id' && x[0] !== 'order_count' && x[0] !== 'cancelled' && x[0] !== 'hold'){
                    tot = tot + Number(x[1]);
                }
            });
            setToBeShipped(tot);
        }
    }, [data])

    return (
        <div 
            style={{borderBottom: '1px solid black'}}
            className='grd grd-col grd-col-f pad-y-1 grd-gp-1'>
            <div>{data.delivery_time}</div>
            <div className='jse'>{notShipped}</div>
            <div className='jse'>{toBeShipped}</div>
        </div>
    )
}

export default DashboardTotalRow
