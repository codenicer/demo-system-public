import React from 'react'

const ProgressivePieChart = () => {
    return (
        <div
            className='grd grd-gp-2'
            style={{gridTemplateRows: `200px auto auto`}}
            >
            <div
                style={{display: 'inline-block', '--size': 200}} 
                className='_chart-wrap relative jsc'>
                <div
                    style={{backgroundImage: `conic-gradient(green 0deg 25%, red 0deg 50%, rgba(0,0,0,.1), 0%, rgba(0,0,0,.1))`}}
                    className='_chart _chart-donut round'>
                </div>
                    <div 
                        className='absolute bg-white _chart-center round grd jic aic'>
                        <div className='grd aic jic relative size-100'>
                            <div className='grd aic jic'>
                                <span className='label'>Too Late</span>
                                <span className='label'>Tell me why</span>
                            </div>
                            <div className='grd aic jic absolute _chart-label_hide size-100 bg-white round'>
                                <span className='label'>i want it that whay</span>
                            </div>
                        </div>
                    </div>
            </div>
            <span className='sublabel jsc'>tell me why</span>
            <span className='label jsc'>i want it that way</span>
        </div>
    )
}

export default ProgressivePieChart
