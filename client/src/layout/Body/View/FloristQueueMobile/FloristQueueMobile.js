import React,{ useEffect, lazy,Suspense } from 'react'
import {connect} from 'react-redux'
import './FloristQueueMobile.css'
import {loadJobs,handleLoadInJob,updateJobs,handleLoadHoldJob,updateHoldJob,fitlerTextOnchange} from '../../../../mobile/floristjobs/florisjobsActions'
// import socket from '../../../../scripts/utils/socketConnect'
import {Route,Switch} from 'react-router-dom'
import PagePreloader from '../../../../components/PagePreloader/PagePreloader';
import RowRenderer from './RowRenderer'
import FloristQueueMobileJob from './FloristQueueMobileJob/FloristQueueMobileJob'

// const RowRenderer = lazy(()=>import('./RowRenderer'))
// const FloristQueueMobileJob = lazy(()=>import( './FloristQueueMobileJob/FloristQueueMobileJob'))

const FloristQueueMobile = (props) => {
  const   {match,history,fetch,floristjob:{florist_injob}} = props
  const   {updateJobs,handleLoadInJob,loadJobs,handleLoadHoldJob,updateHoldJob} = props


    useEffect(()=>{

        //socket tuning needed an update
        // socket.on('JOBFLORIST_UPDATE',data=>{
        //          console.log("HERE",data)
        //         updateJobs(data)
        //  })
        // socket.on('HOLD_JOB_LIST_DID_UPDATE',data=>{
        //     console.log("HERE 2",data)
        //      updateHoldJob(data)
        //  })
        loadJobs()
        handleLoadInJob()
        handleLoadHoldJob()
        
        if(history.location.pathname === '/system/dashboard'){
            history.push('/system')
        }
    },[])


    useEffect(()=>{
       if(florist_injob !== null && florist_injob.length > 0){
            history.push(`${match.path}/florist_job`)
       }else if( florist_injob !== null && florist_injob.length < 1){
          loadJobs()
       }
           
    },[florist_injob])

    return (
            <div className='pad-1 over-hid' style={{gridColumn: '1 / -1'}} >
                <Switch>
                  
                        <Route path={`${match.path}/`} component={RowRenderer}  exact />
                        <Route path={`${match.path}/florist_job`} component={FloristQueueMobileJob}  exact />
                  
                    <Route render = {()=>{
                        return<h1>Page Not Found.</h1>
                    }}  /> 
                 </Switch>
                 <PagePreloader
                    isfetching={fetch.isFetching}
                    text='Please wait...'
                 />
            </div>
    )
}

const transferStatetoProps = state => ({
    floristjob:state.m_floristjobData,
    fetch:state.webFetchData
})

export default connect(transferStatetoProps,{loadJobs,handleLoadInJob,updateJobs,handleLoadHoldJob,updateHoldJob,fitlerTextOnchange}) (FloristQueueMobile);

//  <Suspense fallback={ <PagePreloader text='Please wait...' isfetching={true} />  } >
//  </Suspense>
// function floristJobRenderer (props){


//     const [ textFilter, setTextFilter ] = useState('');

//     function handleTextFilterOnChange(value){
//         setTextFilter(value)
//         fitlerTextOnchange(value)
//         //fetch here

//     }


//     return(
//         <div className={ florist_holdjob && florist_holdjob !== null && "order_item_id" in florist_holdjob
//                 ? 'grd grd-gp-1 floristq_mobile-row_wrap_hold over-hid size-100' : 'grd grd-gp-1 gtr-af over-hid size-100'}>
//             { florist_holdjob !== null && "order_item_id" in florist_holdjob  ?
//                 <div>
//                     <span className='header-2'>Item on Hold</span>
//                     <FloristQueueMobileRow
//                         hold='hold'
//                         job={florist_holdjob}
//                     />
//                 </div>
//                 :
//                 null
//             }
//              <Input
//                     type='search'
//                     css='pad-1'
//                     label='Search here...'
//                     value ={textFilter}
//                     onChange={(e)=>handleTextFilterOnChange(e.target.value)}
//                     />
//             <span className='header-2'>Florist Queue</span>

//             <div className='over-y-auto scroll'>
//                 {  florist_job === null ?
//                     <h1>Nothing to display</h1>
//                     :
//                     florist_job.slice(0,3).map((job, key) => {
//                         return <FloristQueueMobileRow
//                                     onhold_job={florist_holdjob}
//                                     key={key}
//                                     job={job}
//                                 />
//                         })
//                 }
//             </div>
//         </div>)
//     }