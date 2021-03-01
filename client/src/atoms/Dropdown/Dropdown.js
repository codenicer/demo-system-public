import React from 'react';
import Paper from '../Paper/Paper';
import './Dropdown.css';

const Dropdown = (props) => {
    const { css, children, width } = props;
    return (
        <Paper {...props} css={`dropdown mar-y-1 absolute grd grd-gp-1 jie br-2 pad-1 zoomIn animate-1 shadow space-no-wrap ${css}`} width={width} >
            {children}
        </Paper>
    );
};

Dropdown.defaultProps = {
    width: 'auto'
}


export default Dropdown;