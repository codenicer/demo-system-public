import React from 'react';
import AvatarImg from '../../atoms/AvatarImg/AvatarImg';

const SearchResult = (props) => {
    const { category, firstname, lastname, imgsrc, title, header, sublabel} = props;
    return (
        <div {...props} className='grd grd-gp-1 aic pad-1 br-2' style={{gridTemplateColumns: 'auto 1fr', gridTemplateRows: '1fr 1fr'}}>
            <div style={{gridRow: '1/-1'}}>
                {category === 'Order' && <i className='fas fa-shopping-cart' style={{fontSize: '26px'}}></i>}
                {category === 'Customer' && <AvatarImg firstname={firstname} lastname={lastname}/>}
                {category === 'Product' && <img src={imgsrc} alt={title} height='auto' width='50px' />}
            </div>
            <span className='header-3'>{header}</span>
            <span className='sublabel italic'>{sublabel}</span> 
        </div>
    );
};

export default SearchResult;