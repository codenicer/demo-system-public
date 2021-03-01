import React from 'react';
import TableRow from '../../../atoms/TableRow/TableRow';
import moment from 'moment-timezone';
import Button from "../../../atoms/Button/Button";

const userStatus = ['Active', 'Suspended','Inactive'];

moment.tz.setDefault("Asia/Manila");
const RiderTableRow = ({ data, editAction,activateRider, css }) => {

    // console.log('data list row', data);
    let active_data
    if (data.status == 1){
        active_data = 3
    }else{
        active_data = 1
    }
    
    if(data)
    return (

            <TableRow css={`jic ${css}`} key={data.rider_id}>
                <div>{data.rider_id}</div>
                <div>{data.first_name}</div>
                <div>{data.last_name}</div>
                <div>{data.rider_provider.name}</div>
                 <div>{data.mobile_number}</div>
                <div>{moment(data.created_at).toString()}</div>
                {/* <div>{userStatus[parseInt(data.status)-1]}</div> */}
                
                <div className='grd grd-col grd-gp-1'>
                    <Button color={data.status == 1 ?'success' : 'warning'} onClick={ () => activateRider(data.rider_id, active_data) }>{userStatus[parseInt(data.status)-1]}</Button>
                </div>
                <div className='grd grd-col grd-gp-1'>
                    <Button color='success' onClick={ () => editAction(data.rider_id) }>Edit</Button>
                </div>
            </TableRow>
    );
    else return '';
};


export default RiderTableRow;
