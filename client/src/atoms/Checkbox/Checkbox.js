import React,{useRef} from 'react';
import './Checkbox.css';

const Checkbox = (props) => {
    const {size, color, label, labelsize, checked} = props
    return (
        <div className='grd grd-gp-1 aie gtc-mf'>
            <input
              
                checked={checked}
                style={{width: '16px', height: '16px'}}
                {...props} 
                type='checkbox' className={`checkbox checkbox-color--${color} checkbox-size--${size} relative point jss`}/>
            {label && <span style={{fontSize: labelsize}}>{label}</span>}
        </div>
    );
};


export default Checkbox