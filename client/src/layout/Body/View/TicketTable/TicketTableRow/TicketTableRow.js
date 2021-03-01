import React from 'react';
import Paper from '../../../../../atoms/Paper/Paper';
import './TicketTableRow.css';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");;

const statusHandler = (x) => {
    switch(x){
        case 1:
            return 'Open';
        case 2:
            return 'Closed';
        case 3:
            return 'Resolved';
        default:
            return null
    }
}

const TicketTableRow = ({ data, onClick, getSelTicket, selTicket }) => {
    return (
        <Paper 
            background={data.viewed ? '#ECF0F1' : 'white'}
            onClick={() => {onClick(data); getSelTicket(() => {
                    return data['ticket_id'];
            })}} 
            css={`ticket_row grd grd-gp-1 pad-2 gtr-fm aic point btn-shadow
            ${selTicket === data['ticket_id'] && 'sunken ticket_row-sel'} 
            ${!data.viewed && 'ticket_row--new'}`}>
            <span className='header-3 clr-primary'>{`#${data['ticket_id']}`}</span>
            <div className='grd gtc-af aic grd-gp-1'>
                <span className='header-2 clr-secondary text-over-ell jss over-hid space-no-wrap'>{data['disposition_name']}</span>
                {!data.viewed &&
                    <span className='badge_ticket jss ass'>new</span>
                }
            </div>
            <span className='label space-no-wrap ass'>{data['shopify_order_name']}</span>
            <div className='ticket_row-bottom_wrap grd aic grd-gp-1'>
                <i className='fas fa-user' style={{fontSize: '18px'}}></i>
                <span className='sublabel'>{`created by : ${ data['created_by_firstname'] ? data['created_by_firstname'] : "- - -"} ${ data['created_by_last'] ? data['created_by_last'] : "- - -"}`}</span>
                <span className='sublabel jse'>{moment(data['created_at']).format('MMM. DD, YYYY')}</span>
                <span className='space-no-wrap jse'>{statusHandler(data['status_id'])}</span>
            </div>
        </Paper>
    );
};

export default TicketTableRow;