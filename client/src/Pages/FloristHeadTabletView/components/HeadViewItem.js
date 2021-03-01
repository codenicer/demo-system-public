import React, {useState} from 'react'
import ImgSrc from '../../../atoms/ImgSrc/ImgSrc'
import Batch from '../../../atoms/Batch/Batch';

let timer;

const HeadViewItem = (props) => {
    //------------PROPS--------------
    //pass down props
    const   {data, selected, onClick, onHold } = props

    //-----------STATE--------------
    //state for showing a progress bar on onhold 
    const [ loading, setLoading ] = useState(false)

    //variable for timer initiate and clearing timer

    //--------------FUNCTIONS-------
    // initiate timer and showing a progress bar
    const holdStart = () => {
        setLoading(true)
        timer = window.setTimeout(() => onHold(data.title), 3000)
    }

    // clearing timer variable
    const timerClear = () => {
        window.clearTimeout(timer);
        setLoading(false)
    }
    
    return (
        <div
            onClick={loading ? () => {} : onClick}
            onMouseDown={() => {
                holdStart()
            }}
            onMouseUp={() => {
                timerClear()
            }}
            onTouchStart={() => {
                holdStart()
            }}
            onTouchEnd={() => {
                timerClear()
            }}
            onMouseLeave={() => {
                timerClear()
            }}
            onTouchMove={() => {
                timerClear()
            }}
            className={`relative _florist-head-view_item grd grd-col grd-gp-2 aic bg-white br-2 shadow point ${selected && '_florist-head-view_item-sel sunken'}`}>
            {loading &&
                <div className='_florist-head-view_item-progress absolute above-all'></div>
            }
            <div 
                className='relative grd aic jic size-100' 
                >
                <ImgSrc 
                    src={data && data.img_src}
                    resolution={true ? '80x80' : '60x60'}
                    />
                {false && <div 
                    className='color-white grd aic jic br-2 pad-x-1' 
                    style={{background: 'var(--yellow)', height: 20}}
                >notes</div>}
            </div>
            <div className='grd grd-gp-1 pad-1'>
                <span className='label'>{data.shopify_order_name}</span>
                <div className='over-hid text-over-ell space-no-wrap'>{data.title}</div>
                <Batch css='jss' batch={data.delivery_time} />
                <div>{data.delivery_date}</div>
            </div>
        </div>
    )
}

export default React.memo(HeadViewItem)