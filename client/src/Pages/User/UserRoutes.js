import React,{lazy ,Suspense} from "react";
import PagePreloader from '../../components/PagePreloader/PagePreloader';
import { Switch, Route } from "react-router-dom";


import UserCreate from "./CreateUser/CreateUser";
import UserList from "./UserList";
import UpdateUser from "./UpdateUser/UpdateUser";

// const UserCreate = lazy(()=>import("./CreateUser/CreateUser"))
// const UserList = lazy(()=>import("./UserList"))
// const UpdateUser = lazy(()=>import("./UpdateUser/UpdateUser"))

export default function DispatchRoute({ match }) {
  console.log("match", match);
  return (
    <Switch>
     
      
      <Route path={`${match.path}/list`} component={UserList} exact />
      <Route path={`${match.path}/create`} component={UserCreate} exact />
      <Route
        path={`${match.path}/update/:userId`}
        component={UpdateUser}
        exact
      />
    </Switch>
  );
}

// <Suspense  fallback={ <PagePreloader text='Please wait...' isfetching={true} />} >
//</Suspense>