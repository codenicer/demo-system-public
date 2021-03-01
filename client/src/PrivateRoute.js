import React,{useEffect} from 'react'
import {Route,Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import {handleLoadUser} from './scripts/actions/authActions'
import {loadDisposition} from './scripts/actions/dispositionActions'
import {getNewTicketsCount} from './scripts/actions/ticketsActions'
import {getDispatchCount} from './scripts/actions/dispatchActions'
import setAuthToken from './scripts/utils/setAuthToken';
let onces = 1

if(localStorage.token)setAuthToken(localStorage.token)


const PrivateRouter = ({component:Component , ...rest}) =>{
   
    const {auth:{isAuthenticated,fetching,token , logout},handleLoadUser,loadDisposition,getNewTicketsCount,getDispatchCount} = rest
     if(onces ===1 ){
        handleLoadUser((user)=>{
            if ( ![8,3].includes(user.user_info.role_id)) {
                getNewTicketsCount(user.user_info.hubs)
                getDispatchCount(user.user_info.hubs)
            }
        })
       
            onces++
     }
     useEffect(()=>{
        loadDisposition()
        return ()=>{
            onces = 1
        }
     },[token])

    return(
        <Route {...rest} 
            render={ props => isAuthenticated === false && fetching === false ? (


                 <Redirect to={`/?action=${logout === true ? 'logout' : 'expired'}`} />


                ):(
                 <Component {...props} />
                )
            }

        />
    )
}

const transferStatetoProps = state => ({
    auth:state.authData
})

export default connect(transferStatetoProps,{handleLoadUser,loadDisposition,getNewTicketsCount,getDispatchCount})(PrivateRouter)

// 