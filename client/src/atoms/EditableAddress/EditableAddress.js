import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons'

const EditableAddress = ({data, type, onClick}) => {
  return (
    <div className='order_address-wrap size-100 grd aic' style={{alignContent: 'center'}}>
            <span style={{padding: '2px 0'}}>

              {`${data[`${type}_address_1`] ? data[`${type}_address_1`] : '' }
            ${data[`${type}_address_2`] ? data[`${type}_address_2`] : '' }`}</span>
      <span>
              {`${data[`${type}_city`] ? data[`${type}_city`] : ''}
            ${data[`${type}_province`] ? data[`${type}_province`] : ''}
            `}</span>
      <div className='grd gtc-fa'>
                <span>
                  {`${data[`${type}_country`] ? data[`${type}_country`] : '' }
                 ${data[`${type}_zip`] ? data[`${type}_zip`] : ''  }`}
                 </span>
        <FontAwesomeIcon icon={faPen} onClick={onClick}/>
      </div>
    </div>
  )
}

export default EditableAddress
