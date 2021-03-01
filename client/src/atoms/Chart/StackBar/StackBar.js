import React from 'react';
import './StackBar.css';

const StackBar = ({data, total, width}) => {

    const barHandler = args => {
        let curWidth = 0;
        let z = args.length
        return args.map((item, key) => {
            curWidth = curWidth + Math.round(item.count / total * 100)
            if(item.count !== 0){
                return(
                    <div
                        className='absolute color-white'
                        style={{
                            fontSize: '.7rem',
                            width: `${curWidth}%`,
                            paddingRight: '.5px',
                            backgroundColor: item.color,
                            left: 0,
                            top: 0,
                            height: 35,
                            zIndex: z--,
                            textAlign: 'end',
                            textShadow: '.5px .5px black'
                        }}
                        key={key}>{item.count !== 0 && item.count}</div>
                )
            }
            return(
                null
            )
        })
    }

    return (
        <div
            style={{width, height: 35, background: 'transparent'}}
            className='relative grd'>
            <div
                className='absolute grd aic text-ac label size-100 italic stack_bar-parent point'
                style={{
                    zIndex: data.length
                }}
            >
                <span>{total}</span>
            </div>
            {data.length &&
            barHandler(data)
            }
        </div>
    )
}

export default StackBar
