import { combineReducers } from 'redux';

import hubReducer from './hubReducer';
import authReducer from './authReducer'
import ordersReducer from './ordersReducer'
import gsearchReducer from './gsearchReducer'
import dispositionReducer from './dispositionReducer'
import customersReducer from './customersReducer';
import webfetchReducer from './webfetchReducer';
import productReducer from './productReducer';
import floristReducers from './floristReducers';
import floristJobsReducer from './floristJobsReducer';
import ticketsReducer from './ticketsReducer';
import annotationReducers from './annotationReducers';
import assemblyReducers from './assemblyReducers';
import dispatchReducer from './dispatchReducer';
import riderReducer from './riderReducer';
import riderProviderReducer from './riderProviderReducer';
import reinstatementReducer from './order_reinstatementReducer';
import userReducer from './userReducer';
import roleReducer from './roleReducer';
import orderNoteReducer from './order_notesReducers'
import orderLogs from './order_logReducers'
import dashboardReducers from './dashboardReducers';
import refundReducers from './refundReducers'

//// MOBILE //////////////////
import mfloristjobsReducer from '../../mobile/floristjobs/floristjobsReducer'
import fetchReducer from '../../mobile/fetchReducers'



const rootReducer = combineReducers({
     hubData:hubReducer,
     authData:authReducer,
     orderData:ordersReducer,
     gsearchData:gsearchReducer,
     dispoData:dispositionReducer,
     customerData:customersReducer,
     webFetchData:webfetchReducer,
     productData:productReducer,
     floristJobData:floristJobsReducer,
     floristData:floristReducers,
     ticketData:ticketsReducer,
     annotationData:annotationReducers,
     assemblyData:assemblyReducers,
     dispatchData:dispatchReducer,
     riderData:riderReducer,
     riderProviderData:riderProviderReducer,
     userData:userReducer,
     roleData:roleReducer,
     orderNoteData:orderNoteReducer,
     orderReinstatementData:reinstatementReducer,
     orderLogsData:orderLogs,
     dashboardData: dashboardReducers,
     refundData:refundReducers,
     // ************ NEXT LINE ************ //

     //  MOBILE ////////////////////
     m_floristjobData:mfloristjobsReducer,
     m_fetchData:fetchReducer
});

export default rootReducer;