import React from 'react';
import TableRow from '../../../atoms/TableRow/TableRow';
import Button from "../../../atoms/Button/Button";

const aStatus = ['Suspended','Active', 'Suspended','Inactive'];

const RoleTableRow = ({ data, editAction, suspendAction, activateAction, setPermissions, css }) => {
    if(data)
    return (

            <TableRow css={`jic ${css}`} key={data.role_id}>
                <div>{data.role_id}</div>
                <div>{data.title}</div>
                <div>{data.description}</div>
                <div>{aStatus[parseInt(data.active)]}</div>
                <div className='grd grd-col grd-gp-1'>
                  <Button color='alert' onClick={ () => setPermissions(data.role_id) }>Set Permission</Button>
                  <Button color='success' onClick={ () => editAction(data.role_id) }>Edit</Button>
                  { data.active
                    ? <Button color='warning' onClick={ () => suspendAction(data.role_id) }>Suspend</Button>
                    : <Button color='success' onClick={ () => activateAction(data.role_id) }>Activate</Button>
                  }

                </div>
            </TableRow>
    );
    else return '';
};


export default RoleTableRow;

