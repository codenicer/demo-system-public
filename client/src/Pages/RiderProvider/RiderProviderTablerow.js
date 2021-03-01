import React from 'react';
import TableRow from '../../atoms/TableRow/TableRow';
import Button from "../../atoms/Button/Button";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");;

const RiderTableRow = ({ data, onClick, css }) => {
    return (
            <>
            { data &&
                <TableRow css={`${css}`} key={data.rider_id}>
                    <div>{data.rider_provider_id}</div>
                    <div>{data.name}</div>
                    <div>{data.address}</div>
                    <div>{moment(data.created_at).toString()}</div>
                    <Button color='success' onClick={onClick}>Edit</Button>
                </TableRow>
            }
            </>
    );
};


export default RiderTableRow;
