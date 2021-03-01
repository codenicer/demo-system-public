import React,{useEffect}from 'react';
import FloristQueueHeader from './FloristQueueHeader/FloristQueueHeader';
import FloristQueueRow from './FloristQueueRow/FloristQueueRow';
import {handleLoadFloristJob,updateFloristJob} from '../../../../../scripts/actions/floristjobActions'
// import socket from '../../../../../scripts/utils/socketConnect'
import {connect} from 'react-redux'

const FloristQueue = (props) => {
    const {handleLoadFloristJob,updateFloristJob} = props;
    const {floristjobs} = props

    const webFloristDidUpdate = data=> updateFloristJob(data)
        
    useEffect(()=>{
        //socket tuning needed an update
        // socket.on('WEBFLORISTJOB_DID_UPDATE',webFloristDidUpdate)

        handleLoadFloristJob()
        // return () => socket.off('WEBFLORISTJOB_DID_UPDATE',webFloristDidUpdate)
    },[])


     function rowRenderrer(){
         if(floristjobs !== null && floristjobs.length  < 1){
                 return <h1>NO CONTENT</h1>
        }else if(floristjobs !== null && floristjobs.length  >= 1){
            return floristjobs.map((value, key) => {
                return <FloristQueueRow data={value} key={key}/>
            })
        }else{
            return null
        }
     }

    return (
        <div className='grd size-100 gtr-af slideInRight animate-1'>
            <FloristQueueHeader />
            <div>
            {
                rowRenderrer()
            }
            </div>
        </div>
    );
};

const transferStatetoProps = state => ({
    floristjobs:state.floristJobData.floristjobs
})


export default connect(transferStatetoProps,{handleLoadFloristJob,updateFloristJob})(FloristQueue);