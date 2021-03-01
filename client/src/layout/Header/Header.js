import React from 'react';
import Avatar from '../../components/Avatar/Avatar';
import Logo from '../../atoms/Logo/Logo'
import UniversalSearchHolder from './UniversalSearchHolder';
import './Header.css';
import {connect} from 'react-redux'

const Header = (props) => {
    const { history, status, user, role } = props;
    
    return (
        <div className={role === 3 || role === 7 || role === 8 || role === 4 ? 'header-mobile grd aic grd-gp-2 bg-primary pad-x-2' : 'header-web grd aic grd-gp-2 pad-x-2 bg-white'}>
            { role === 3 || role === 7 || role === 8 || role === 4 ?  
                <Logo logo='mobile' height='50px' css='jsc'/>
                : 
                <>
                    <div  className='grd aic jis'> 
                        <Logo height='50px' width='auto' />
                    </div>
                    <UniversalSearchHolder match={props.match} history={props.history}/>
                </>
            }
            <Avatar  
                history={history} 
                firstname={
                    user !== null && user['user_info']['first_name']
                    } 
                lastname={user !== null && user['user_info']['last_name']}
                status={status}/>
        </div>
    );
};

const transferStatetoProps = state => ({
    user:state.authData.user
})

export default  connect(transferStatetoProps)(Header)
