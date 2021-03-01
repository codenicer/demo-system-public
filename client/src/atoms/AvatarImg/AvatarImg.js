import React from 'react';
import './AvatarImg.css';

const AvatarImg = ({ user, firstname, lastname, img_src, status, css, height, round }) => {
    return (
        <>
        {img_src ?
            <img 
                src={img_src}
                alt={`${firstname} ${lastname}`}
                height={height}
                width={height}
                style={{ objectFit: "cover" }}
                className={`${round ? 'round' : 'br-2'} avatar_img avatar_img-${status} ${css}`}
            />
            :
            <div
                className={`${round ? 'round' : 'br-2'} grd aic jic avatar_img avatar_img-${status} ${css} ${user === 3 || user === 7 || user === 8 || user === 4 ? 'avatar_no-img-mobile' : 'avatar_no-img-web'}`}
                style={{width: height, height}}
            >
                <span
                    className='label' 
                    style={{fontSize: height * .35}}>{firstname.toString().substring(0,1).toUpperCase() + lastname.toString().substring(0,1).toUpperCase()}</span>
            </div>
        }
        </>
    );
};

AvatarImg.defaultProps = {
    height: 45,
    round: true
}

export default AvatarImg;