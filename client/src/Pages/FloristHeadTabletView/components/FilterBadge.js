import React from 'react'
import PropTypes from 'prop-types';

const FilterBadge = ({children, active, onClick}) => {
    return (
        <div
            onClick={onClick} 
            className={`text-ac br-2 pad-1 point space-no-wrap ${active ? '_florist-header_filter-badge shadow color-white' : '_florist-header_filter-badge_off'}`} >
            {children}
        </div>
    )
}

FilterBadge.propTypes = {
    active: PropTypes.bool.isRequired,
}

export default FilterBadge
