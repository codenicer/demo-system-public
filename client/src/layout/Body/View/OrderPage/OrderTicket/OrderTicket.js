import React,{useEffect} from 'react'
import TicketItem from './TicketItem/TicketItem';
import {connect } from 'react-redux';
import {loadOrderTickets,updateOrdetTicket} from '../../../../../scripts/actions/ordersActions';
// import socket from '../../../../../scripts/utils/socketConnect'



const OrderTicket = (props) => {
    const {clickClose,orderId} = props

    const {loadOrderTickets,updateOrdetTicket} = props
    const {sel_order_tickets} = props


    //deleted on socket tuning.
    // useEffect(()=>{
        //socket tuning needed an update
        // socket.on('SEL_TICKET_DID_UPDATE',data=>{
            // updateOrdetTicket(data)
        // })
    // },[])

    useEffect(()=>{
            orderId && loadOrderTickets(orderId)
            
    },[orderId])
    
    if(sel_order_tickets.length === 0){
       return null
    }
    return (
        <div className='order_page-ticket grd gtr-af size-100 bg-white br-2 pad-2 over-hid'>
            <span className='header-3'>Tickets</span>
            <div className='pad-1 over-y-auto relative'>
            <div class='grd aic grd-col grd-col-f label'>
                <div>Created at</div>
                <div>Created by</div>
                <div>Ticket #</div>
                <div>Status</div>
                <div>Description</div>
                <div>Disposition</div>
            </div>
                {sel_order_tickets &&
                    sel_order_tickets.map((data) => {
                        return (
                            <TicketItem
                                key={data.ticket_id}
                                data={data}
                                clickClose={clickClose}
                            />
                        )
                    })}
            </div>
        </div>
    )
}


const mapStateToProps =({orderData})=> ({
    sel_order_tickets:orderData.sel_order_tickets
});

export default connect(mapStateToProps,{loadOrderTickets,updateOrdetTicket})(OrderTicket)

    

