import React from 'react';
import {Link} from 'react-router-dom'
import './SubmenuItem.css';

const SubmenuItem = props => { 
    const { to, location, children, onClick, module_item, ticket_counts ,dispatch_count} = props;

    
    const counts = {
        ...ticket_counts,
        ...dispatch_count
    }

    
    function switchID(id){
        switch (id) {
            case 8:
                return 'open_ticket'
            case 17:
                return 'returns_count'
            case 29:
                return 'no_hub'    
            case 30:
                return 'no_datentime'   
            case 12:
                return 'list_count' 
            case 13:
                return 'jobAssigned_count' 
            case 16:
                return 'advance_count'
            case 32:
                return 'orders_on_hold_count'
            case 33:
                return 'unpaid_orders_count'
            case 34:
                return 'sympathy_count'
            default:
                return 0
        }
    }


    return (
        <Link to={to} >
            <div
                onClick={onClick} 
                className={`submenu-item color-white pad-y-2 relative slideInLeft animate-1 ${location.pathname === to && 'submenu-item--active bg-white label '}`}>
                <div className={["Tickets","Dispatch"].includes(module_item.module.title) && counts[switchID(module_item.module_item_id)] > 0? 'submenu_text_wrap' : 'pad-x-1'}>
                     {children}
                </div>
                {
                ["Tickets","Dispatch"].includes(module_item.module.title) && counts[switchID(module_item.module_item_id)] > 0 &&

                <div className='absolute mar-x-1 new_item--indicator jss round grd aic jic label'>
                    {counts[switchID(module_item.module_item_id)]}
                </div>

                }
            </div>
        </Link>
    );
}

export default SubmenuItem;