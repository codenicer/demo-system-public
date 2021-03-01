import React, { useState, useEffect } from 'react'
import AvatarImg from '../../../atoms/AvatarImg/AvatarImg';
import Status from '../../../atoms/Status/Status';
import Button from '../../../atoms/Button/Button';
import TableHeader from '../../../atoms/TableHeader/TableHeader';
import ModalHoldMobile from '../../ModalHoldMobile/ModalHoldMobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import {cancelAssignedTablet,completeJobTablet,holdJobTablet} from '../../../mobile/floristjobs/florisjobsActions'
import {connect} from 'react-redux';
import FloristHeadRow from './FloristHeadRow';
import {toast} from 'react-toastify'
import {statuses} from './statuses.json'

const header = ['', 'Order ID', 'Title', 'Action']

const FloristHeadUserCard = (props) => {
    const [ showDrawer, setShowDrawer ] = useState(false);
    const [ modal, setModal ] = useState(false);
    const [currentJob,setCurrentJob] = useState(null)
    const [pendingJobs,setPendingJobs] = useState(null)
    const {data, jobs, count, onClick, active, head } = props
    const {first_name, last_name,status} = data

    
    // ======================== PROPS FROM REDUX =====================
    // ======================== PROPS FROM REDUX =====================

    const {cancelAssignedTablet,completeJobTablet,holdJobTablet} = props

  

    // =========================== USE EFFECTS ======================
    // =========================== USE EFFECTS ======================

    //details:
    useEffect(() => {
        if(count > 0){
            setShowDrawer(false);
        }
    }, [count])

    //details:
    useEffect(()=>{
        checkCurrentJob()
    },[data])

    // ================== FUNCTIONS CONNECTED TO REDUX ACTIONS =======================
    // ================== FUNCTIONS CONNECTED TO REDUX ACTIONS =======================

    //detail: cancelassigned handler
    function handleCancelAssignedTablet (order_item_id){
        cancelAssignedTablet(order_item_id,data.user_id,(type,text)=>{
            toast[type](text)
        })
    }
    //details: completejob handle
    function handleCompleteJobTablet (order_item_id,user_id){
        completeJobTablet(order_item_id,user_id,(type,text)=>{
            toast[type](text)
        })
    }
 
    // ========================= LOCAL FUNCTIONS =======================
    // ========================= LOCAL FUNCTIONS =======================

    //details: filter and set jobs that are ongoing and pendings
    function checkCurrentJob(){
            const [current] = jobs.filter(j=>j.status === 1)
            const pendings = jobs.filter(j=>j.status !== 1)
            setCurrentJob(current)
            setPendingJobs(pendings)
    }

    return (
        <>
            <div
                style={{minWidth: 76, maxWidth: 76}}
                className={`_florist-head-view_user-card_wrap bg-white br-2 shadow grd point ${active && 'sunken'}`}
                onClick={!count ? () => setShowDrawer(true) : onClick}
                >
                <div className='jsc pad-y-1'>
                    <AvatarImg 
                        firstname={first_name}
                        lastname={last_name}
                        height={50}
                        width={50}
                        round={false}
                    />
                </div>
                <span className='jsc label'>{first_name}</span>
                <div 
                    className='asc jsc grd text-ac'>
                    <span className='_florist-head-view_user-card_assigned italic'>Assigned: {jobs.length}</span>
                    <Status status={status} dot={false} fontSize='.8rem'/>
                </div>
            </div>
            { showDrawer &&
                <div className='_florist-head-view_user-card_drawer grd grd-gp-1 bg-white absolute pad-2 size-100'>
                    <div className='grd aic gtc-af'>
                        <span className='header'>{first_name} {last_name}</span>
                        <div
                            onClick={() => setShowDrawer(false)} 
                            style={{fontSize: 24}}
                            className='jse point'>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </div>
                    </div>
                    <div className='_florist-head-view_user-card_left-body grd grd-gp-1 ass'>
                        <div className='grd gtc-af grd-gp-1'>
                            <span className='sublabel'>Status :</span>
                            <Status status={status} css='jse' dot={false}/>
                            <span className='sublabel'>Pending Item/s :</span>
                            <span className='label jse'>{pendingJobs.length}</span>
                            <Button height='42px' css='_florist-head-view_user-left-body_btn jse' color='secondary' onClick={() => setModal(true)}>Change Status</Button>
                        </div>
                    </div>
                    <div className='_florist-head-view_user-card_right-body over-hid grd'>
                        <div className='pad-y-1 header-3'>Job list</div>
                        <TableHeader css='_florist-head-view_user-card_template aic jic'>
                            {
                                header.map((value, key) => {
                                    return <div key={key} >{value}</div>
                                })
                            }
                        </TableHeader>
                        <div className='over-y-auto scroll'>{
                            jobs.map(job=>{
                                return <FloristHeadRow
                                             head={head} 
                                             holdJobTablet={holdJobTablet}
                                             cancelAssignedTablet={handleCancelAssignedTablet}
                                             completeJobTablet={handleCompleteJobTablet}
                                             key={job.job_florist_id} 
                                             job={job}
                                             css='_florist-head-view_user-card_template pad-y-1 aic jic'/>
                            })
                        }
                        </div>
                    </div>
                </div>
            }
            { modal && 
                <ModalHoldMobile
                    label='Change status'
                    width='80%'
                    clickClose={() => setModal(false)}
                    clickBack={() => setModal(false)}
                >
                    {
                        statuses.map((status) => {
                            return <Button
                                height='42px'
                                key={status.id}
                                color={status.color}
                            >
                                {status.name}
                            </Button>
                        })
                    }
                </ModalHoldMobile>
            }
        </>
    )
}

export default React.memo( connect(null,{cancelAssignedTablet,holdJobTablet,completeJobTablet})(FloristHeadUserCard))
