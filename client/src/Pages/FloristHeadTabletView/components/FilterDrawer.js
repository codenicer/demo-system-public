import React, { useState } from 'react';
import filter from '../FloristList/filter.json';
import FilterBadge from './FilterBadge.js';
import Button from '../../../atoms/Button/Button.js';
import DeliveryDateModal from './DeliveryDateModal.js';

const FilterDrawer = (props) => {
    //=============PROPS============
    //=============PROPS============

    // json file of letter filters
    const { moreFilters } = filter

    // pass down props
    const { onClick, active, clickClose, dateFilter} = props;
    
    return (
        <div className='_florist_head-filter_drawer absolute grd size-100'>
            <div className='size-100' onClick={e => { e.stopPropagation(); clickClose()}}/>
            <div className='bg-white pad-1'>
                <span className='sublabel'>Filter by</span>
                <div className='grd grd-gp-3 pad-2'>
                    <DeliveryDateModal 
                        dateFilter={dateFilter}
                    />
                    {
                        moreFilters.map((value, key) => {
                            return <FilterBadge
                                active={active === value.label} 
                                onClick={() => onClick(value.label)}
                                key={key}>{value.label}</FilterBadge>
                        })
                    }
                    <Button
                        height='42px'
                        disabled={active !== null ? false : true}
                        color='warning'
                        onClick={() => onClick(null)}
                    >
                        Clear filter
                    </Button>
                </div>
            </div>
        </div>
)
}

export default FilterDrawer
