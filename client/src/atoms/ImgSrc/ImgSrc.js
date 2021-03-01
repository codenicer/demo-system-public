import React, {useEffect, useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import './ImgSrc.css';


const ImgSrc = (props) => {
    const { src, resolution } = props;

    const [ reSrc, setReSrc ] = useState(null);
    const [ status, setStatus ] = useState('loading'); 

    useEffect(() => {
        if(src && resolution){
            let resize = src
            .replace(/_(pico|icon|thumb|small|compact|medium|large|grande|original|1024x1024|2048x2048|master)+\./g, '.')
            .replace(/\.jpg|\.png|\.gif|\.jpeg|\.JPG|\.PNG|\.JPEG/g, () => {
            let match;    
            ['.jpg', '.JPG', '.png', '.PNG', '.jpeg', '.JPEG']
            .forEach((ext) => {
                if(src.search(ext) !== -1)
                {
                    match = ext
                }
               
            })
            return '_'+resolution+match});
            setReSrc(resize);
            let x = new Image();
            x.src = resize;
            x.onload = () => {
                setStatus('loaded');
            }
            x.onerror = () => {
                setStatus('error');
            }
        } else if(src && resolution === undefined){
            let y = new Image();
            y.src = src;
            y.onload = () => {
                setStatus('loaded');
            }
            y.onerror = () => {
                setStatus('error');
            } 
        } else if(src === null){
            setStatus('no url')
        }
    }, [src])

    return (
        <>
            { status === 'loading' ?
                <div className='grd aic jic size-100' style={{fontSize: '20px', color: 'var(--primary)'}}>
                    <FontAwesomeIcon className='_img_src-spinner' icon={faCircleNotch} />
                </div>
                :
                status === 'loaded' ?
                    <img src={reSrc === null ? src : reSrc} alt="" />
                    :
                    <div className='grd aic jic size-100'>
                        <span className='_no_img-label pad-1 br-2 color-white label'>
                            {status === 'no url' ?
                                <span>No Url</span>
                                :
                                <span>No Img</span>
                            }
                        </span>
                    </div>
                
            }
        </>
    )
}

export default ImgSrc
