import React from 'react';

const AddressCard = ({ data }) => {
    return (
        <div className='grd grd-gp-1 aic '>
            {data['address_1'] && <span>{data['address_1']}</span>}
            {data['address_2'] && <span>{data['address_2']}</span>}
            <div>
                {data['city'] && <span>{data['city']}</span>}
                {data['province'] && <span>{`, ${data['province']}`}</span>}
            </div>
            <div>
                {data['country'] && <span>{data['country']}</span>}
                {data['zip'] && <span>{`, ${data['zip']}`}</span>}
            </div>
            {data['phone'] && <span>{data['phone']}</span>}
        </div>
    );
};

export default AddressCard;