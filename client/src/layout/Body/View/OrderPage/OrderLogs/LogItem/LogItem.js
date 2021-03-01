import React from 'react'
import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Manila");

function LogItem({data}) {
    return (
        <div 
            style={{gridTemplateColumns: '150px 1fr'}}
            className='grd grd-gp-1'>
            <span 
                className='jse italic sublabel emp' 
                title={data.user ? `${data['user']['first_name']} ${data['user']['last_name']}` : ''}
                >
                {moment(data['created_at']).format('MMM. DD, YYYY hh:mm:ss A')}
            </span>
            <span>{data['action']}</span>
        </div>
    )
}

export default LogItem
