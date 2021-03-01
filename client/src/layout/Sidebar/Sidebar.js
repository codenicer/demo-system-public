import React from 'react';
import './Sidebar.css';
import Menu from '../../components/Menu/Menu';

const Sidebar = (props) => {
    const { role, location } = props;
    return (
        <>
        {role === 3 || role === 7 || role === 8 || role === 4? null :
            <div className='sidebar grd gtr-af bg-primary br-2 over-y-auto scroll'>
                <Menu location={location}/>
            </div>
        }
        </>
    );
};

export default Sidebar;