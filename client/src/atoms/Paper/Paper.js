import React from 'react';

const Paper = (props) => {
    const { children, height, width, css, background } = props;
    return (
        <div {...props} className={`br-2 ${css}`} style={{height: height, width: width, background: background}}>
            {children}
        </div>
    );
};

Paper.defaultProps = {
    height: 'auto',
    width: 'auto',
    background: 'white',
}

export default Paper;