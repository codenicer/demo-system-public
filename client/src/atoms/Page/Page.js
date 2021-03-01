import React from 'react';
import PageClose from '../PageClose/PageClose';
import './Page.css';

const Page = ({ css, children, clickClose, size, label }) => {
    return (
        <div 
            style={{zIndex: 100 + Number(sessionStorage.getItem('openpage'))}}
            className={`fixed grd gtr-af pad-1 slideInRight animate-2 page ${css}`}>
            <PageClose clickClose={clickClose} size={size} label={label}/>
            { children }
        </div>
    );
};

export default Page;