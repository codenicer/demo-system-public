import React, { useState } from 'react';
import Print from '../../img/icons/print_ready-icon.png';
import Tooltip from '../../atoms/Tooltip/Tooltip';
import {loadSelOrder} from '../../scripts/actions/ordersActions';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import Balloon from '../../atoms/Balloon/Balloon';

const OrderID = ({ children, css, print, orderid, ticket_id,loadSelOrder, openNotes ,ticketIssueID, noHubTicket,match, history}) => {
    const [state, setState] = useState(false);

    const redirectToTicket = () => {
        history.push(`/system/ticket/${noHubTicket}`)
    }
  
    function handleOnclick(){
        let currentOpenPage = Number(sessionStorage.getItem('openpage'));
        let addPage = currentOpenPage + 1;
        sessionStorage.setItem('openpage', addPage.toString())
        if(noHubTicket)  {
            redirectToTicket() 
        } else{
        
          if( match && match.path === "/system/nohub") {
            loadSelOrder(orderid,ticketIssueID,ticket_id,'nohub')
          }else{
            loadSelOrder(orderid,ticketIssueID,ticket_id)
          }

       }
    }

    return (
        <div
        onClick={handleOnclick}
        className={`link point label grd grd-col aic grd-gp-1 gtc-af space-no-wrap ${css}`}>
            <div 
                className='relative'>
                <span>{children}</span>
                {openNotes > 0 ?
                    <Balloon>{openNotes}</Balloon>
                :''}
            </div>
            {print &&
                <div 
                    className='relative'
                    onMouseOver={() => setState(true)}
                    onMouseLeave={() => setState(false)}
                    onClick={(e) => e.stopPropagation()}
                    >
                    <img style={{cursor: 'help'}} src={Print} alt=''/>
                    {state && <Tooltip type='left' leftposition='15%'>Printout Ready</Tooltip>}
                </div>
            }
        </div>
    );
};

OrderID.propTypes = {
    print: PropTypes.bool,
    openNOtes: PropTypes.number
}

OrderID.defaultProps = {
    print: false,
}

export default connect(null, {loadSelOrder})(OrderID);