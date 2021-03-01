import React, { useRef, useState, useEffect } from 'react';
import { FixedSizeList as List} from 'react-window';

const Virtualizer = (props) => {
    const { itemCount, itemSize, children, onItemsRendered, myref } = props;

    const wrap = useRef(null);
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setHeight(wrap.current.offsetHeight);
        setWidth(wrap.current.offsetWidth);
    }, [])

    return (
        <div
            className='size-100'
            ref={wrap}
        >   
            {wrap &&
                <List
                    onItemsRendered={onItemsRendered}
                    ref={myref}
                    className='scroll'
                    height={height}
                    width={width}
                    itemCount={itemCount}
                    itemSize={itemSize}
                >
                    {children}
                </List>
            }
        </div>
    )
}

export default React.memo(Virtualizer) 
