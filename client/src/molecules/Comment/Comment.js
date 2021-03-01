import React from 'react';
import './Comment.css';
import AvatarImg from '../../atoms/AvatarImg/AvatarImg';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");;

const Comment = ({ firstname, lastname, time, content, type }) => {
    return (
        <div className='comment grd pad-2 grd-gp-1'>
            <div className='comment_header grd grd-gp-1 aic'>
                <AvatarImg firstname={firstname} lastname={lastname} height='28px'/>
                <span className='label'>{`${firstname} ${lastname}`}</span>
                <span 
                    style={{gridColumn: type && '1/-1'}}
                    className='sublabel italic'>{moment(time).format('MMM. DD, YYYY hh:mm:ss A')}</span>
            </div>
            <div 
                style={{maxWidth: 300}}
                className='over-hid text-break'
                >{content}</div>
        </div>
    );
};



export default Comment;