import React from 'react';

const Container = ({ height, width, children, css, onClick }) => {
    return (
        <div style={{height: height, width: width}} className={`${css} scroll`} onClick={onClick}>
            { children }
        </div>
    );
};

Container.defaultProps = {
    height: '100%',
    width: '100%',
}

export default Container;