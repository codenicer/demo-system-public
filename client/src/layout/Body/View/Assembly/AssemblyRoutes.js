import React from 'react'
import {Switch ,Route} from 'react-router-dom'
import {handleLoadAssemblyJob,handleLoadMyJob} from '../../../../scripts/actions/assemblyActions'
import {connect} from 'react-redux'
import AssemblerJob from '../../../../Pages/AssemblerJob/AssemblerJob';
import AssemblerJobPage from '../../../../Pages/AssemblerJob/AssemblerJobPage/AssemblerJobPage';
import AssemblyGabTry from '../../../../Pages/AssemblyGab/AssemblyGabQueue';
 const AssemblyRoutes = (props) => {
    const {match} = props
    return (
        <Switch>
            <Route path={`${match.path}/list`} component={AssemblerJob} exact />
            <Route path={`${match.path}/myjob`} component={AssemblerJobPage}  exact />
            <Route path={`${match.path}/gab`} component={AssemblyGabTry}  exact />
        </Switch>
    )
}

export default connect(null,{handleLoadMyJob,handleLoadAssemblyJob})(AssemblyRoutes)

//<Suspense fallback={<h1>LOADING...</h1>}>  
 //</Suspense>