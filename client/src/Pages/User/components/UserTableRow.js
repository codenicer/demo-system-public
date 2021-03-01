import React from 'react';
import TableRow from '../../../atoms/TableRow/TableRow';
import moment from 'moment-timezone';
import Button from "../../../atoms/Button/Button";

const userStatus = ['Active', 'Suspended','Inactive'];

moment.tz.setDefault("Asia/Manila");
const UserTableRow = ({ data, editAction, css }) => {

    console.log('data list row', data);
  

    if(data)
    return (

            <TableRow css={`jic ${css}`} key={data.user_id}>
                <div>{data.user_id}</div>
                <div>{data.role.title}</div>
                <div>{data.first_name}</div>
                <div>{data.last_name}</div>
                <div>{data.email}</div>
                <div>{moment(data.created_at).toString()}</div>
                <div>{userStatus[parseInt(data.status)-1]}</div>
                <div className='grd grd-col grd-gp-1'>
                    <Button color='success' onClick={ () => editAction(data.user_id) }>Edit</Button>
                    <Button color='alert' >Suspend</Button>
                    <Button color='warning' >Terminate</Button>
                </div>
            </TableRow>
    );
    else return '';
};


export default UserTableRow;

