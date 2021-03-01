import React from 'react';
import './RowPreloader.css';

const RowPreloader = ({title, height}) => {
    return (
        <div className='absolute grd aic jic label size-100 row-preloader' style={{height: height}}>
            {title}
        </div>
    );
};

RowPreloader.defaultProps = {
    height: 60,
    title: 'Updating..',
}

export default RowPreloader;