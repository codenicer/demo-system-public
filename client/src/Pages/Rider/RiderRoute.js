
import React,{lazy,Suspense} from 'react'
import { Switch ,Route } from 'react-router-dom'
import RiderCreate from './CreateRider/CreateRider';
import RiderList from './RiderList';
// import UserView from './UserView'
import RiderUpdate from './CreateRider/UpdateRider';

import PagePreloader from '../../components/PagePreloader/PagePreloader';

// const RiderCreate = lazy(()=>import('./CreateRider/CreateRider'))
// const RiderList = lazy(()=>import('./RiderList'))
// const RiderUpdate = lazy(()=>import('./CreateRider/UpdateRider'))

export default function DispatchRoute({match}) {
    console.log('match' ,match);
    return (
            <Switch>
               
                    <Route path={`${match.path}/list`} component={RiderList}  exact />
                    <Route path={`${match.path}/create`} component={RiderCreate}  exact />
                    <Route path={`${match.path}/update/:rider_id`} component={RiderUpdate}  exact />
           
          
                
     
            </Switch>
    );
}

// <Suspense fallback={ <PagePreloader text='Please wait...' isfetching={true} />} >
//     </Suspense>