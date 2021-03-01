import React, { useState, useEffect } from 'react';
import DispatchDashboardTable from './components/DispatchDashboardTable';

const DispatchDashboardV2 = (props) => {
    //==========PROPS=========
    //==========PROPS=========

    //pass down props
    const { data, hub, category, date } = props;

    return (
        <div>
            <div className='grd gtc-fa pad-1'>
                <div className='grd gtc-fa'>
                    <span className='header-2'>{`Dispatch Orders (${hub})`}</span>
                </div>
            </div>
                { data &&
                    <DispatchDashboardTable 
                        date={date}
                        // payment={payment}
                        // setPayment={setPayment}
                        // setDate={setDate} 
                        category={category}
                        // setCategory={setCategory}
                        // deliveryTime={deliveryTime}
                        // setDeliveryTime={setDeliveryTime}
                        // statuses={statuses}
                        // setStatuses={setStatuses}
                        data={data}
                    />
                }
        </div>
    )
}

  export default DispatchDashboardV2;
