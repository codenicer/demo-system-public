import React,{useEffect} from 'react'
import {connect} from 'react-redux'
import {loadSinglePageTicket,updateSilglePageTicket} from '../../../../scripts/actions/ticketsActions'
import TicketPage from '../TicketTable/TicketPage/TicketPage'
// import socket from '../../../../scripts/utils/socketConnect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadTear } from '@fortawesome/free-solid-svg-icons';

const TicketSinglePage = (props) => {

    const {match,history} = props
    const {loadSinglePageTicket,updateSilglePageTicket} = props
    const {ticket:{single_page_ticket}} = props

    const selTicketDidUpdate = data => updateSilglePageTicket(data)


    useEffect(()=>{
         
        //Deleted on socket tuning.
        // socket.on('SEL_TICKET_DID_UPDATE',selTicketDidUpdate)
       
        // return () => socket.off('SEL_TICKET_DID_UPDATE',selTicketDidUpdate)

        
        loadSinglePageTicket(match.params.ticket_id)

    },[])
    
    // useEffect(() => {
    //     console.log(single_page_ticket, 'data')
    // }, [single_page_ticket])

    return (
        <div className='pad-1 above-all'>
            { single_page_ticket && single_page_ticket.length !== 0 ?
                    <TicketPage 
                    match={match}
                    history={history}
                    data = {single_page_ticket[0]}/>
                    :
                    <div className='grd size-100'>
                        <div 
                            className='jsc asc grd gtc-af grd-gp-2 aic jic pad-y-1 pad-x-2'
                            style={{fontSize: '4rem', background: 'var(--disabled-bg', color: 'var(--disabled)'}}
                            >
                            <FontAwesomeIcon icon={faSadTear} />
                            <span style={{fontSize: '1.5rem'}}>Ticket not found.</span>
                        </div>
                    </div>
            }
        </div>
    )
}

const transferStatetoProps = state => ({
    ticket:state.ticketData,
})

export default connect(transferStatetoProps,
    {loadSinglePageTicket,updateSilglePageTicket}
)(TicketSinglePage)
