import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tooltip from '../Tooltip/Tooltip';
import PropTypes from 'prop-types';

const IconButton = ({ icon, css, label, tooltip, size, color, tooltiptype, leftposition, rightposition, onClick, shadow, wrapcss }) => {
    const [hover, setHover] = useState(false);
    return (
        <div 
            className={`relative round ${shadow && 'btn-shadow pad-1 '} ${wrapcss}`} 
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            >
            <div
                style={{fontSize: size}}
                onClick={onClick} 
                className={`point grd aic jic outline ${css}`}>
                <FontAwesomeIcon icon={icon} color={color} />
            </div>
            { tooltip && hover &&
                <Tooltip type={tooltiptype} top='10px' leftposition={leftposition} rightposition={rightposition} >{label}</Tooltip>
            }
        </div>
    );
};

IconButton.propTypes = {
    tooltip: PropTypes.bool,
    shaodw: PropTypes.bool
}

IconButton.defaultProps = {
    tooltip: false,
    size: '12px',
    color: 'black'
}

export default IconButton;