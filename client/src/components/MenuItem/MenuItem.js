import React, { useState } from 'react';
import ArrowButton from '../../molecules/ArrowButton/ArrowButton';
import './MenuItem.css';

const MenuItem = props => {
    const { children, submenuItem, css, onClick, open_ticket_count } = props

    const [itemArrowToggle, setItemArrowToggle] = useState(false)
    
    return (
        <>
            <div 
                className={`menu-item grd aic br-2 point color-white ${css}`} 
                onClick={submenuItem ? () => setItemArrowToggle(!itemArrowToggle) : onClick} >
                <div className='grd gtc-af aic'>
                    <span className='label pad-x-1 space-no-wrap'>{children}</span>
                    {/* { (children === 'Tickets' && open_ticket_count > 0) && <div className='new_item--indicator jss round grd aic jic label'>{open_ticket_count}</div>} */}
                </div>
                {submenuItem  && 
                    <ArrowButton color='white' open={itemArrowToggle} />
                }
            </div>
            {itemArrowToggle && 
                <div>
                    {submenuItem}
                </div>
            }
        </>
    );
};

export default MenuItem;