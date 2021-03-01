import React from 'react'

function Legend({color, label, count}) {
    return (
        <div 
            className='grd grd-gp-1 aic gtc-af'>
            <div style={{height: 10, width: 10, backgroundColor: color}}></div>
            <span
                >
                {label}
            </span>
        </div>
    )
}

export default Legend
