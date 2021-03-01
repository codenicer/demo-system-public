import React,{ useEffect,useState } from 'react'
import FloristQueueMobileRow from './FloristQueueMobileRow/FloristQueueMobileRow'
import {connect} from 'react-redux'
import './FloristQueueMobile.css'
import {loadJobs,handleLoadInJob,updateJobs,handleLoadHoldJob,updateHoldJob,fitlerTextOnchange} from '../../../../mobile/floristjobs/florisjobsActions'
import Input from '../../../../atoms/Input/Input';
import Virtualizer from '../../../../atoms/Virtualizer/Virtualizer'
import Error from '../../../../atoms/Error/Error'

function floristJobRenderer (props){
    const   {floristjob:{florist_job_mobile,florist_holdjob}} = props
    const   {fitlerTextOnchange} = props
  
    
    const [ textFilter, setTextFilter ] = useState('');
    
    function handleTextFilterOnChange(value){
        setTextFilter(value)
        fitlerTextOnchange(value)
        //fetch here
      
    }

    useEffect(() => {
        if(florist_job_mobile){console.log(florist_job_mobile.length, 'total floriost job', typeof florist_job_mobile)}
    }, [florist_job_mobile])

    
    const item = ({index, style}) => {
        return <div style={style}>
            <FloristQueueMobileRow 
                onhold_job={florist_holdjob}
                job={florist_job_mobile[index]}/>
        </div>
    }

    return(
        <div className='grd grd-gp-1 gtr-af over-hid size-100'>
            <div className='grd grd-gp-1'>
                <Input 
                    type='search'
                    css='pad-1'
                    label='Search here...'
                    value ={textFilter}
                    onChange={(e)=>handleTextFilterOnChange(e.target.value)}
                    />
                <span className='header-2'>Florist Queue</span>
            </div>
            {florist_job_mobile !== null &&
                florist_job_mobile.length > 0 ?
                <Virtualizer
                    itemCount={florist_job_mobile.length}
                    itemSize={415}
                >
                    {item}
                </Virtualizer>
                :
                <Error label='No records found' />
            }
            {/* <div className='over-y-auto scroll'>
                 { florist_holdjob !== null && "order_item_id" in florist_holdjob  ? 
                    <div>
                        <span className='header-2'>Item on Hold</span>
                        <FloristQueueMobileRow 
                            hold='hold' 
                            job={florist_holdjob}
                        />
                    </div>
                    :
                    null 
                }
                {  florist_job_mobile === null ?
                    <h1>Nothing to display</h1>
                    :
                    florist_job_mobile.map((job, key) => {
                        return <FloristQueueMobileRow
                                    onhold_job={florist_holdjob}
                                    key={key}
                                    job={job}
                                />
                        })
                }
            </div> */}
        </div>)
    }
    
    
const transferStatetoProps = state => ({
    floristjob:state.m_floristjobData,
    fetch:state.webFetchData
})

    
export default connect(transferStatetoProps,{loadJobs,handleLoadInJob,updateJobs,handleLoadHoldJob,updateHoldJob,fitlerTextOnchange}) (floristJobRenderer);
