import React, { useState, useRef } from 'react';
import AvatarImg from '../../atoms/AvatarImg/AvatarImg';
import Dropdown from '../../atoms/Dropdown/Dropdown';
import ArrowButton from '../../molecules/ArrowButton/ArrowButton';
import {userLogout} from '../../scripts/actions/authActions'
import {connect} from 'react-redux'


const Avatar = props => {
    
    const { firstname, lastname, user,userLogout } = props;
    const [arrowClick, setArrowClick] = useState(false)
    const arrow = useRef();

    const userValidator = (role, style) => {
        if(role){
            if( role === 3 || role === 7 || role === 8 || role === 4){
                return style
            }
        } else {
            return null
        }
    }

    return (
        <div className='grd jse gtc-mfm aic grd-gp-2'>
            <AvatarImg user={user && user['user_info']['role_id']} firstname={firstname} lastname={lastname} img_src={user && user['user_info']['img_src']} status='available' />
            <span 
                className={userValidator(user && user['user_info']['role_id'], 'color-white')}
                >{`${firstname} ${lastname}`}</span>
            <div
                className='relative point pad-1'
                tabIndex='0'
                ref={arrow} 
                onBlur={() => setArrowClick(false)}
                onClick={() => {setArrowClick(!arrowClick); arrow.current.focus()}}
            >
                <ArrowButton 
                    open={arrowClick} 
                    size='20px'
                    color={userValidator(user && user['user_info']['role_id'], 'white')}
                    />
                    {arrowClick && 
                    <Dropdown css='above-all'>
                    <span onClick={()=>{userLogout(user['user_info'])}} className='arrow-logout'>Log Out</span>
                    </Dropdown>}
            </div>
        </div>
    )
    
}

const transferStatetoProps = state => ({
    user:state.authData.user
})




export default connect(transferStatetoProps,{userLogout})(Avatar);