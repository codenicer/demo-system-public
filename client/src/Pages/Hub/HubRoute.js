import React from 'react'
import { Switch ,Route } from 'react-router-dom'
import HubList from './HubList'

export default function outHubRoute({match}) {
    return (
            <Switch>
                <Route path={`${match.path}/list`} component={HubList} exact />
            </Switch>
    )
}