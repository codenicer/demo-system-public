import {WEB_SUCCESS, WEB_ERROR} from '../types/webfetchTypes'
import {USER_LOGOUT} from '../types/auth';
import {toast} from 'react-toastify';

//NOTE : for the meantime DRY approach for dispatching error
export async function dispatchError(err,dispatch,callback){
    let errMsg = '';//err.message
    try{

        if(err.response){
            if(err.response.status === 401){
                try{
                  toast.error('401 error here');
                }catch(e){
                    alert('401 error here');
                }


                await dispatch({type:USER_LOGOUT})
            }else{
                if(err.response.data.msg) {
                    errMsg = err.response.data.msg
                }
            }
        }else if(err.request){
            console.log('error request.', err.request);
            errMsg = err.message;
        }
        dispatch({type:WEB_ERROR});

        if(callback){
            callback('error',errMsg);
        }else{
            console.log('error', err);
            if(errMsg){
              try{
                toast.error(errMsg);
              }catch(e){
                alert(errMsg);
              }
            }
        }
    }catch(er){
        console.log('Unhandled error:',er);
        //alert('Unhandled error.');
    }

}

// ************ NEXT LINE ************ //

export function dispatchSuccess(res,dispatch,callback){
    dispatch({type:WEB_SUCCESS})
    if(callback){
        callback('success',res.data.msg)
    }else{

      try{
        toast.error(res.data.msg);
      }catch(e){
        alert(res.data.msg);
      }

    }

}