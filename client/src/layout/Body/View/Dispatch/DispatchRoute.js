import React from 'react'
import {Switch ,Route , Redirect} from 'react-router-dom'
import DispatchJob from '../../../../Pages/DispatchJob/DispatchJob'
import DispatchQueue from '../../../../Pages/DispatchQueue/DispatchQueue'
import DispatchList from '../../../../Pages/DispatchList/DispatchList'
import UndeliveredTable from '../../../../Pages/UndeliveredTable/UndeliveredTable'

export default function DispatchRoute({match}) {
    return (
        <div>
            <Switch>
                <Route path={`${match.path}/list`} component={DispatchJob} exact />
                <Route path={`${match.path}/asssigned`} component={DispatchQueue} exact />
                <Route path={`${match.path}/intransit`} component={DispatchList} exact />
                <Route path={`${match.path}/undelivered`} component={UndeliveredTable} exact />
            </Switch>
        </div>
    )
}
//intransit