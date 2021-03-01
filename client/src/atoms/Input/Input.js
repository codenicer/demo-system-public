import React, { useState } from 'react';
import './Input.css';

const Input = (props) => {
    const { label, disabled, color, css, myref, type,height ,fontSize, onChange, autoComplete} = props;
    const [ dateType, setDateType ] = useState('text');
    return (
        <>
        {type === 'date' ?
            <input 
            {...props}
            // ref={date}
            onChange={onChange}
            type={dateType}
            onFocus={() => setDateType('date')}
            className={`br-2 input input-color--${color} input-state--${disabled} ${css}`} 
            placeholder={label}
            />
            :
            <input
            {...props}
            autoComplete={autoComplete}
            ref={myref}
            onChange={onChange}
            placeholder={label}
            style={{height: height, fontSize: fontSize}}  
            className={`br-2 input input-color--${color} input-state--${disabled} ${css}`} />
        }
        </>
    );
};

Input.defaultProps = {
    color: 'default',
}

export default Input;
