import React,{ useState, useEffect } from 'react';
import Button from  '../../../../../atoms/Button/Button';
import Batch from '../../../../../atoms/Batch/Batch';
import ImgSrc from '../../../../../atoms/ImgSrc/ImgSrc';
import Comment from '../../../../../molecules/Comment/Comment';
import ModalHoldMobile from '../../../../../Pages/ModalHoldMobile/ModalHoldMobile';
import ConfirmationModal from '../../../../../Pages/ConfirmationModal/ConfirmationModal';
import {completeJob,holdJob,cancelAccept} from '../../../../../mobile/floristjobs/florisjobsActions'
import {connect} from 'react-redux'
import moment from 'moment-timezone'
import './FloristQueueMobileJob.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import config from '../../../../../config.json';
moment.tz.setDefault("Asia/Manila");

const FloristQueueMobileJob = (props) => {
    const {floristjob:{florist_injob,florist_holdjob},fetch:{isFetching},history,holdJob,completeJob,cancelAccept} = props
    const [hold, setHold] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const { floristDisposition } = config;
      let myJob = null
      if(florist_injob !== null) myJob = florist_injob[0]
      

     const [form,setSelected] = useState({
         notes:null,
         disposition_id:null,
     })


    useEffect(()=>{
        if(florist_injob !== null && florist_injob.length < 1 && isFetching === false){
            console.log("HERERERERE")
            history.replace('/system')
           
        }
    },[isFetching,florist_injob])

    return ( 
        florist_injob !== null && florist_injob.length > 0 && isFetching === false ?
        <>
            <div className='floristq-mobile--job grd size-100 grd-gp-1 over-hid'>
                <div onClick={() => cancelAccept(myJob)} className='grd gtc-af aic grd-gp-1 point'> 
                    <FontAwesomeIcon icon={faChevronLeft} style={{fontSize: 20}} />
                    <span className='subheader italic'>Back</span>
                </div>
                <div className='grd aic jic bg-white'>
                    <ImgSrc src={myJob['img_src']} resolution='300x300'/>
                </div>
                <div className={`grd grd-gp-1 over-hid ${myJob['notes'] && 'floristq-mobile--job_w-notes'}`}>
                    <div className='grd aic mobile-job--tableWrap bg-white br-2 pad-1'>
                    {Object.values(myJob).length > 0 &&
                        <>
                            <span className='label jse'>Order ID</span>
                            <span>{myJob['shopify_order_name']}</span>
                            <span className='label jse'>Title:</span>
                            <span>{myJob['title']}</span>
                            <span className='label jse'>Del. Date:</span>
                            <span>{moment(myJob['delivery_date']).format('MMM. DD, YYYY')}</span>
                            <span className='label jse'>Del. Time:</span>
                            <Batch css='jss' batch={myJob['delivery_time']}/>
                        </>
                    }
                    </div>
                    {myJob['notes'] &&
                        <div 
                            style={{gridAutoRows: 'auto'}}
                            className='grd grd-gp-1 pad-1 bg-white br-2 over-y-auto scroll'>
                            <span className='header-3'>Notes</span>
                            {
                                myJob['notes'].map((notes, key) => {
                                    return <Comment
                                        key={key}
                                        type='mobile' 
                                        firstname={notes['first_name']}
                                        lastname={notes['last_name']}
                                        time={notes['created_at']}
                                        content={notes['note']}
                                    />
                                })
                            }
                        </div>
                    }
                </div>
                <div className='grd grd-gp-1 mobile-job--button_wrap pad-x-2'>
                    <Button 
                        onClick={()=>{
                            completeJob(myJob)
                        } }
                        color='success'
                        >Done</Button>
                    <Button
                         disabled={florist_holdjob !== null}
                        onClick={() => setHold(true)}
                        color='warning'>
                        Hold
                    </Button>
                </div>
            </div>
            {hold  &&
                <ModalHoldMobile
                    clickClose={() => setHold(false)}
                    clickBack={() => setHold(false)}
                >
                    {
                        floristDisposition.map((value, key) => {
                            return <Button 
                                        height='42px'
                                        color='warning' 
                                        onClick={() =>{
                                            setSelected({
                                                notes:value['name'],
                                                disposition_id:value['id']
                                            })
                                            setConfirm(true)
                                            }} 
                                        key={key}>{value['name']}</Button>
                        })
                    }
                </ModalHoldMobile>
            }
            {confirm && 
                <ConfirmationModal 
                    mobile={true}
                    label='Are you sure you want to hold the item ?'
                    submitlabel='Yes, hold the item'
                    submitcolor='warning'
                    clickSubmit={() => holdJob(myJob, form)}
                    clickCancel={() => {setConfirm(false); setHold(false)}}
                />
            }
        </>
        :
        null
    );
};

const transferStatetoProps = state => ({
    floristjob:state.m_floristjobData,
    fetch:state.webFetchData
})


export default connect(transferStatetoProps,{completeJob,holdJob,cancelAccept})(FloristQueueMobileJob);