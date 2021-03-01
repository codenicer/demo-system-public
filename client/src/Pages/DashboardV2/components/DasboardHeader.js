import React from 'react';
import config from './config.json';

const DasboardHeader = (props) => {
    // array of header from json file
    const { statuses } = config; 


    //================PROPS==============
    //================PROPS==============

    return (
        <div 
            className='grd pad-y-1 grd-col grd-col-f text-ac'>
            <div />
            {
                statuses.map((header, key) => {
                    return <div key={key} className='pad-1' style={{background: header.color}}>{header.label}</div>
                })
            }
        </div>
    )
}

export default DasboardHeader
