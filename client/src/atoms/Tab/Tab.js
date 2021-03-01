import React from 'react';
import './Tab.css';

const Tab = ({children, active, onClick}) => {
    return (
        <div 
            onClick={onClick}
            className={`tab pad-x-2 pad-y-1 point ${active && 'tab_active label'}`}>
            {children}
        </div>
    );
};

export default Tab;