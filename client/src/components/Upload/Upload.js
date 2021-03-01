import React, { useRef, useEffect } from 'react';
import IconButton from '../../atoms/IconButton/IconButton';
import { faPlus, faPaperclip } from '@fortawesome/free-solid-svg-icons'
import './Upload.css';
const Upload = ({onChange, css, type}) => {
    const upload = useRef()

    useEffect(() => {
        console.log(upload, 'upload ref')
    }, [upload])

    return (
        <div
        className={`relative upload_btn-wrap ${css}`}>
            <input 
                ref={upload}
                type='file'
                className='absolute size-100 upload-input_file'
                onChange={onChange}
                accept="image/x-png,image/jpeg"
                />
            <IconButton
                wrapcss='upload_btn-icon'
                size='24px'
                icon={type === 'image' ? faPlus : faPaperclip} 
                onClick={() => upload.current.click()}
                />
        </div>
    );
};

Upload.defaultProps = {
    type: 'image',
}

export default Upload;