import React from 'react'
import DispatchJob from './DispatchJob/DispatchJob'
import DispatchQueue from './DispatchQueue/DispatchQueue'
import DispatchAdvance from './DispatchAdvance/DispatchAdvanceQueue'
import DispatchIntransit from './DispatchIntransit/DispatchIntransit'
import DispatchHistory from './DispatchHistory/DispatchHistoryQueue'
import CpuOrders from './CpuOrders/CpuOrders'
import UndeliveredJobItem from './UndeliveredJob/UndeliveredJobItem'
import {Switch ,Route} from 'react-router-dom'
import ReadyToShip from './ReadyToShip/ReadyToShip'


export default function DispatchRoute({match}) {
    return (
        <>
            <Switch>
             
                    <Route path={`${match.path}/list`} component={DispatchJob} exact />
                    <Route path={`${match.path}/assigned`} component={DispatchQueue} exact />
                    <Route path={`${match.path}/readytoship`} component={ReadyToShip} exact />
                    <Route path={`${match.path}/advance`} component={DispatchAdvance} exact />
                    <Route path={`${match.path}/intransit`} component={DispatchIntransit} exact />
                    <Route path={`${match.path}/history`} component={DispatchHistory} exact />
                    <Route path={`${match.path}/undelivered`} component={UndeliveredJobItem} exact />
              <Route path={`${match.path}/cpuOrder`} component={CpuOrders} exact />
             
            </Switch>
        </>
    )
}



/* <Route path={[`${match.path}/list`,`${match.path}/list/:shopify_order_name`]} component={DispatchJob} exact />
<Route path={[`${match.path}/assigned`,`${match.path}/assigned/:shopify_order_name`]} component={DispatchQueue} exact />
<Route path={[`${match.path}/advance`,`${match.path}/advance/:shopify_order_name`]} component={DispatchAdvance} exact />
<Route path={[`${match.path}/intransit`,`${match.path}/intransit/:shopify_order_name`]} component={DispatchIntransit} exact /> */