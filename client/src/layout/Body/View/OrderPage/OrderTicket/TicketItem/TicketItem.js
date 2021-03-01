import React from 'react'
import {Link} from 'react-router-dom';
import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Manila");



const arrStatus = ['Pending','Open','Closed','Resolved'];


const TicketItem = ({data}) => {

    const openPageHandler = () => {
        let currentOpenPage = Number(sessionStorage.getItem('openpage'));
        let addPage = currentOpenPage + 1;
        sessionStorage.setItem('openpage', addPage.toString())
    }
    
    const { ticket_id,  updated_at, status_id } = data;
    return (
        <div className='pad-y-1'>
            <Link
                to={`/system/ticket/${ticket_id}`}
                onClick={openPageHandler}
            >
                <div
                    className='grd aic grd-col grd-col-f'>
                    <div >
                        { moment(updated_at).format('MMM. DD, YYYY')}
                        <br/>
                        { moment(updated_at).format('hh:mm:ss A')}
                    </div>
                    <span > {`${data.created_by_last} ${data.created_by_firstname}`} </span>
                    <span> Ticket #{ticket_id}</span>
                    <span>  {`(${arrStatus[status_id]})`}</span>
                    <span>{data.notes}</span>
                    <span>{data.disposition_name}</span>
                </div>
            </Link>
        </div>
    )
}

export default TicketItem
