import React, { useEffect }  from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

 const Dropzone = (props) => {
    const { dropImage, image, removeImage } = props;
    
    useEffect(() => {
        window.addEventListener('paste', pasteHandler)
        return () => {
            window.removeEventListener('paste', pasteHandler)
        }
    }, [])

    const pasteHandler = (e) => {
        if(e.clipboardData && e.clipboardData.items){
            let data = e.clipboardData.items
            let blob
            let src
            for(let i = 0; i < data.length; i++){
                if (data[i].type.includes('image')) {
                    blob = data[i].getAsFile();
                    src = window.URL.createObjectURL(blob)
                }
            }
            console.log(blob, typeof blob, src)
            dropImage(src, blob)
        } 
    }

    const dragEnterHandler = e => {
        e.preventDefault();
        e.stopPropagation();
    }

    const dragLeaverHandler = e => {
        e.preventDefault();
        e.stopPropagation();
    }

    const dropHandler = e => {
        e.preventDefault();
        e.stopPropagation();
        let reader = new FileReader();
        let url = e.dataTransfer.getData('text/plain');
        if(url){
            return alert("Invalid image, Use COPY image instead.");
        } else {
            let file = e.dataTransfer.files[0];
            reader.onload = e => {
                dropImage(e.target.result, file)
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <>
            {image ?
                <div 
                    style={{background: 'black', height: 300, width: 360}}
                    className='grd aic jic relative'>
                    <div
                        style={{top: 0, right: 0, background: 'rgba(255,255,255,.6)'}} 
                        className='absolute color-white pad-1 point'
                        onClick={() => removeImage()}>
                        Remove
                    </div>
                    <img
                        src={image}
                        alt=''
                        width='auto'
                        height='auto'
                        style={{maxHeight: 300, maxWidth: 360}}
                        onClick={() => window.open(image, '_blank')}
                    />
                </div>
                :
                <div
                    style={{border: '2px dashed #929292', height: 300,}}
                    className='size-100 grd aie jic pad-1 grd-gp-1' 
                    onDragEnter={dragEnterHandler}
                    onDragLeave={dragLeaverHandler}
                    onDrop={dropHandler}
                    onDragOver={e => {e.preventDefault(); e.stopPropagation()}}
                >
                    <FontAwesomeIcon icon={faDownload} style={{fontSize: '30', color: '#929292'}}/>
                    <span className='label ass'>Drop or Paste image here</span>
                </div>
            }
        </>
    )
}

export default Dropzone
