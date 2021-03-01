import React,{lazy,Suspense} from 'react'
import {Switch ,Route } from 'react-router-dom';
import PagePreloader from '../../components/PagePreloader/PagePreloader';
import RoleList from './List/RoleList';
import RoleCreate from './CreateRole/CreateRole';
import RoleEdit from './EditRole/EditRole';
import PermissionList from './Permissions/ModuleList/PermissionList';
// const RoleList = lazy(()=>import('./List/RoleList'))
// const RoleCreate = lazy(()=>import('./CreateRole/CreateRole'))
// const RoleEdit = lazy(()=>import('./EditRole/EditRole'))
// const PermissionList = lazy(()=>import('./Permissions/ModuleList/PermissionList'))

export default function RoleRoute({match}) {
    return (
            <Switch>
               
                        <Route path={`${match.path}/list`} component={RoleList} exact />
                        <Route path={`${match.path}/create`} component={RoleCreate} exact />
                        <Route path={`${match.path}/set_permission/:role_id`} component={PermissionList} exact />
                        <Route path={`${match.path}/edit/:role_id`} component={RoleEdit} exact />
             
            </Switch>
    )
}

// <Suspense fallback={ <PagePreloader text='Please wait...' isfetching={true} />} >
//   </Suspense>