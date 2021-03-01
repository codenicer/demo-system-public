import React from 'react';
import './Batch.css';

const Batch = ({batch, css}) => {
        
    const batchSplit = (batch) => {
        if(batch.length <= 10) {
            return batch;
        }else
        return batch.substring(batch.indexOf(':') + 1);
    }
        
    return (
        <span className={`batch label space-no-wrap batch ${css}`}>
            {batch && batchSplit(batch)}
        </span>
    );
};

Batch.defaultProps = {
    batch: '',
}

export default Batch;