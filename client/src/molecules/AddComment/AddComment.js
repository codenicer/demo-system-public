import React  from 'react';
import Input from '../../atoms/Input/Input';
import Button from '../../atoms/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';

const AddComment = ({onKeyPress, onChange, onClick, label, comment, value, disabled}) => {
    
    return (
        <div className='grd gtc-fa grd-gp-2'>
            {disabled ?
                <div 
                    className='jsc asc grd gtc-af grd-gp-1 aic jic pad-y-1 pad-x-2'
                    style={{fontSize: '1.8rem', background: 'var(--disabled-bg', color: 'var(--disabled)'}}
                    >
                    <FontAwesomeIcon icon={faExclamationCircle} />
                    <span style={{fontSize: '.9rem'}}>Comments are disabled for this ticket.</span>
                </div>
                :
                <>
                    <Input
                        css='pad-1' 
                        onKeyPress={onKeyPress}
                        value={value}
                        onChange={onChange}
                        label={`Write ${label}`}/>

                    <Button 
                        onClick={onClick}
                        color='primary'>Add {label}</Button>
                </>
            }
        </div>
    );
};

AddComment.defaultProps = {
    label: 'Comment'
}

AddComment.propTypes = {
    disabled: PropTypes.bool,
}

export default AddComment;