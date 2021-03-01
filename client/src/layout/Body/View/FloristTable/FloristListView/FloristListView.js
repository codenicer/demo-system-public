import React,{ useEffect } from 'react';
import FloristListRow from './FloristListRow/FloristListRow';
import FloristListHeader from './FloristListHeader/FloristListHeader';
import {handleLoadFlorist,updateFlorist} from '../../../../../scripts/actions/floristActions'
// import socket from '../../../../../scripts/utils/socketConnect'
import {connect} from 'react-redux'


const FloristListView = (props) => {
    const {handleLoadFlorist , florist,updateFlorist} = props

    const floristDidUpdate = data=> updateFlorist(data)

    useEffect(()=>{
        //socket tuning needed an update
        // socket.on('FLORIST_DID_UPDATE',floristDidUpdate)
        handleLoadFlorist()
        // return () =>  socket.off('FLORIST_DID_UPDATE',floristDidUpdate)
    },[])

    return (
            <div className='grd size-100 gtr-af slideInRight animate-1'>
                <FloristListHeader />  
                <div>
                {florist !== null ?
                   florist.map((value, key)=>{
                    return <FloristListRow 
                                key={key}
                                data={value}
                                elapsedTime={value['job'] && value['job']['accepted_at']}
                            />
                   }) 
                   :
                   null
                }
                </div>
            </div>
    );
};

const transferStatetoProps = state => ({
   florist:state.floristData.florist
})

export default connect(transferStatetoProps,{handleLoadFlorist,updateFlorist})(FloristListView);
