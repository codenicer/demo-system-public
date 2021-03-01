import React, { useEffect, useState } from 'react'
import DashboardTotalRow from './DashboardTotalRow';

const DashboardTotalTable = (props) => {
    //=========STATE=========
    //=========STATE=========

    // state for total shipped and to be shipped
    const [ totalNotShipped, setTotalNotShipped ] = useState(0);
    const [ totalToBeShipped, setTotalToBeShipped ] = useState(0);


    //=====PROPS=======
    //=====PROPS=======

    // pass down props 
    const { data } = props;

    //==========USE EFFECT===========
    //==========USE EFFECT===========
    useEffect(() => {
        let notshipped = 0;
        let tobeshipped = 0;   
        if(data){
            data.forEach(data => {
                if(data.delivery_time !== 'No Delivery Time'){
                    Object.entries(data).forEach((x) => {
                        if(x[0] === 'pending' || x[0] === 'booking' || x[0] === 'rider_assigned'){
                            notshipped = notshipped + Number(x[1])
                        }})
                    Object.entries(data).forEach(x => {
                        if(!isNaN(x[1]) && x[0] !== 'hub_id' && x[0] !== 'order_count' && x[0] !== 'cancelled' && x[0] !== 'hold'){
                            tobeshipped = tobeshipped + Number(x[1])
                        }
                    })
                }
            setTotalNotShipped(notshipped);
            setTotalToBeShipped(tobeshipped);
            })
        }
    }, [data])

    return (
        <div>
            <div className='grd grd-col grd-col-f grd-gp-1'>
                <div></div>
                <div>Not Yet Shipped</div>
                <div>Total Shipped / To be shipped</div>
            </div>
            {data && 
                data.map((data, key) => {
                    if(data.delivery_time !== 'No Delivery Time'){
                        return <DashboardTotalRow data={data} key={key}/>
                    }
                })            
            }
            <div className='grd grd-col grd-col-f pad-y-1'>
                <div className='sublabel'>TOTAL</div>
                <div className='jse label'>{totalNotShipped}</div>
                <div className='jse label'>{totalToBeShipped}</div>
            </div>
        </div>
    )
}

export default DashboardTotalTable
