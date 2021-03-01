import React,{useEffect, useState} from 'react';
import Logo from '../../atoms/Logo/Logo';
import Paper from '../../atoms/Paper/Paper';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import {connect} from 'react-redux';
import {submitLogin,handleLoadUser} from '../../scripts/actions/authActions'
//css and artifacts
import './LogIn.css';
import { faUser, faKey} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LogIn = (props) => {
    const {auth, history, submitLogin} = props;
    const { isAuthenticated, user } = auth;  
    const [userForm,setUserForm] = useState({username:'', password:''});
    const [state,setState] = useState(false)

    const [errorMsg,setErrorMsg] = useState(null)
    const action = props.history.location.search;

    function handleChange(event){
      setUserForm({...userForm, [event.target.name]:event.target.value});
    }

    const handleKeyPress = (e) =>{
       if(e.charCode === 13 && state === false) {
            setState(true)
            submitLogin({email:userForm.username,password: userForm.password},()=>{
                setState(false)
            },  (msg) => {
              setState(false)
              try{
                setErrorMsg(msg);
              }catch(e){
                console.log('error login:',e);
              }

            })
       }      
    }
    
    
    const handleSubmit = () =>{
        setState(true)
        submitLogin({email:userForm.username,password: userForm.password},()=>{
            setState(false)
        }, (msg) => {
          setState(false)
            try{
                setErrorMsg(msg);
            }catch(e){
                console.log('error login:',e);
            }

        })
    }
   
    useEffect(()=>{
      //  if(localStorage.token) handleLoadUser()
        if(isAuthenticated === true && user){
            if(user.user_info.role_id === 3 ||
               user.user_info.role_id === 7 ||
               user.user_info.role_id === 8 ||
               user.user_info.role_id === 4 ) {
              history.push('/system')} else {
            history.push('/system/dashboard')
        }}

    },[isAuthenticated])

    useEffect(()=>{
        if(action==='?action=expired'){
          setErrorMsg('Your token may have expired. Please login again.');
        }
        if(localStorage.token){
          history.push('/system/dashboard')
        }
    },[])
    
    return (
        <div className='login-wrap relative grd aic jic over-hid cont shadow'>
            <Paper width='300px' css='login-form-wrap grd grd-gp-2 pad-2'>
                <Logo css='jsc' logo='web' height='100px' width='auto' />
                <div className='grd grd-gp-1 aic br-2 login-input-wrap'>
                  <FontAwesomeIcon icon={faUser} style={{fontSize: '15px'}} className='jse clr-primary'/>
                  <Input onKeyPress={handleKeyPress} 
                      readOnly={state}
                      name="username"
                      onChange={handleChange}
                      value={userForm ? userForm.username: ''} label='Username' type='text' css='login-username pad-1' />
                </div>
                <div className='grd grd-gp-1 aic br-2 login-input-wrap'>
                  <FontAwesomeIcon icon={faKey} style={{fontSize: '13.13px'}} className='jse clr-primary'/>
                  <Input onKeyPress={handleKeyPress} 
                      readOnly={state}
                        name="password"
                      onChange={handleChange}
                      label='Password' type='password' value={userForm ? userForm.password: ''} css='login-password pad-1'/>
                </div>
                     
                { errorMsg && <span style={{color: 'var(--warning)'}} className="jsc label">{errorMsg}</span> }
                <Button 
                    css='login-button' 
                    disabled={state}
                    loading={state ? 'loading' : null}
                    color='primary' onClick={()=>handleSubmit()   
                    }> { !state ? 'Login' : 'Please wait...'
                    }
                </Button>
            </Paper>
        </div>
    );
};

const transferStatetoProps = state => ({
    auth:state.authData
})

export default connect(transferStatetoProps,{submitLogin,handleLoadUser})(LogIn) 