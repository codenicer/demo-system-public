import React from 'react';
import Button from '../../../../../atoms/Button/Button';
import ImgSrc from '../../../../../atoms/ImgSrc/ImgSrc';
import Paper from '../../../../../atoms/Paper/Paper';
import './FloristQueueMobileRow.css';
import {connect} from 'react-redux'
import {acceptJob,resumeJob} from '../../../../../mobile/floristjobs/florisjobsActions'

const FloristQueueMobileRow = ({ job, hold, onhold_job, acceptJob,resumeJob }) => {

    function btnDisabler(){
        if(onhold_job !== null && "order_item_id" in onhold_job){
            return (onhold_job['status_id'] === 3)
        }else{
            return false
        }
    }

    return (
        <Paper css='grd aic grd-gp-1 pad-1 floristq-mobile--row'>
            <div className='grd gtc-fa grd-gp-1 aic'>
                <span className='header-2'>{job['shopify_order_name']}</span>
                <span className='sublabel jse'>{job['shipping_city']}</span>
                <span className='label italic'>{job['title']}</span>
                {
                    job['notes'] && 
                        <div
                            className='badge badge_color-alert jse'
                            >
                            note
                        </div>
                }
            </div>
            <div className='jsc asc' style={{height: 300, width: 300}}>
                <ImgSrc src={job['img_src']} resolution='300x300' />
            </div>
            {hold === 'hold' ?
                <Button
                    disabled={!(job['status_id'] === 3 )}
                    color='alert'
                    css='mobile-button--position'
                    height='42px'
                    onClick={() =>{
                        resumeJob(job)
                        }}
                    >
                        Resume
                </Button>
                :
                <Button
                    height='42px'
                    color='success'
                    disabled ={btnDisabler()}
                    css='mobile-button--position'
                    onClick={()=>{acceptJob(job)}}
                    >Accept</Button>
            }
        </Paper>
    );
};

export default connect(null,{acceptJob,resumeJob})(FloristQueueMobileRow);
