import React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import SubmenuItem from '../Submenuitem/SubmenuItem'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import { clearSelected } from '../../scripts/actions/ordersActions';
import _ from 'lodash';

const Menu = props => {
    const { user, location, clearSelected,ticket_counts ,dispatch_count} = props;


    function createMenu (modules) {
        return _.map(modules, (module, key)=> {
            return (
                <MenuItem
                    key={key}
                    location={location}
                    submenuItem={ _.map(module.module_items, (module_item, i) => {
                        if(module_item && parseInt(module_item.active) === 1){
                            return(
                                     <SubmenuItem
                                        dispatch_count={dispatch_count}
                                        ticket_counts={ticket_counts}
                                        module_item={module_item}
                                        onClick={() => clearSelected()} 
                                        location={location}
                                        to={module_item.url}         
                                        key={i}>
                                        {module_item.title}
                                    </SubmenuItem>
                           )
                        }
                    })}
                >
                    {`${module.title}`}
                </MenuItem>
            );
        });
    };

    return (
        <div>
            <Link className='color-white' to={'/system/dashboard'}>
                <MenuItem
                    onClick={() => clearSelected()} 
                    css={location.pathname === '/system/dashboard' && 'submenu-item--active bg-white label relative'}>
                    DashBoard
                </MenuItem>
            </Link>
            {user !== null && createMenu(user.modules)}
        </div>
    );
};

const transferStatetoProps = state => ({
  user:state.authData.user,
  ticket_counts:state.ticketData.new_tickets_count,
  dispatch_count:state.dispatchData.dispatch_count
})

export default connect(transferStatetoProps, { clearSelected })(Menu);
