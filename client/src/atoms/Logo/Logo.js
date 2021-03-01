import React from 'react';
import WebLogo from '../../img/icons/e2e-sample-logo5.png';
import MobileLogo from '../../img/icons/e2e-sample-logo7.png';

const logoHandler = (x) => {
    switch(x){
        case 'web':
            return WebLogo;
        case 'mobile':
            return MobileLogo;
        default:
            return WebLogo;
    }
}

const Logo = (props) => {
    const { alt, logo, width, height, css } = props;
    return (
        <img alt={alt} src={logoHandler(logo)} className={`${css ? css :''}`} width={width} height={height} />
    );
};

Logo.defaultProps = {
    alt: 'e2e',
    logo: 'web',
}

export default Logo;