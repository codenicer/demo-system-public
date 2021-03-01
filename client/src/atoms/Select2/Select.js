import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import './Select.css';

const Select = ({ children, value, clear, label, width}) => {
    const [ dropdown, setDropdown ] = useState(false);
    //const [ svalue, setSvalue ] = useState('')

    // const filChildren = React.Children.toArray(children).filter(x => x.props.value.includes(filter));


    // useEffect(() => {
    //     setSvalue(value);
    // }, [value])

    return (
        <div
            tabIndex='0'
            onBlur={() => setDropdown(false)} 
            className='relative bg-white _select-cont br-2 grd aic'
            onClick={() => setDropdown(!dropdown)}
            >
            <div className='_select-wrap grd grd-gp-1'>
                <div
                style={{minWidth: width}}
                >
                    {value ? value : label}
                </div>
                <div 
                    onClick={(e) => {e.stopPropagation(); clear()}}
                    className='_select-btn_wrap grd aic jic point'>
                    {value && <FontAwesomeIcon icon={faTimes} />}
                </div>
                <div className='_select-btn_wrap grd aic jic point' >
                    <FontAwesomeIcon icon={ dropdown ? faCaretUp : faCaretDown} />
                </div>
            </div>
            {dropdown &&
                <div
                    style={{maxHeight: 250}}
                    className='_select-dropdown over-hid over-y-auto mar-y-1 absolute grd br-2 zoomIn animate-1 space-no-wrap bg-white scroll'>
                    {
                        children
                    }
                </div>
            }
        </div>
    );
};

Select.defaultProps = {
    width: 90,
}

export default Select;