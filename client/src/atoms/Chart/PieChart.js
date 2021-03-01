import React, {useEffect, useState} from 'react'
import Legend from './Legend/Legend';
import './PieChart.css';

function Chart(props) {
    const { size, count, total, label, color, comparisonlabel, title, type, data, labelonhover, showtotal} = props

    const [ multiTotal, setMultiTotal ] = useState(null);
    const [ arrLength, setArrLength ] = useState(null);
    const [ arrString, setArrString ] = useState([]);
    
    useEffect(() => {
        if(data){
            setArrLength(data.length)
        }
    }, [data])

    useEffect(() => {
        if(arrLength){
            let getTotal = 0;
            let lengtharr = arrLength
            if(data !== undefined){
                    data.forEach((item) => {
                        getTotal = getTotal + item.count; 
                        lengtharr--;
                    })}
            setArrLength(lengtharr)
            setMultiTotal(getTotal)
        }
    }, [arrLength])

    useEffect(() => {
        if(multiTotal){
            let arr = []
            if(arrLength === 0){
                let prev = 0
                data.forEach((item) => {
                        arr.push(`${item.color} 0deg ${Math.round(item.count / multiTotal * 100) + prev}%`);
                        prev = Math.round(item.count / multiTotal * 100) + prev;
                })
            }
            setArrString(arr)
        }
    }, [multiTotal])

    return (
        <div 
            className={`grd ${type === 'two' ? '' : 'gtc-af'} grd-gp-2`}>
            {data &&
                <div
                    className='grd grd-gp-1 asc'
                    >
                    {data.map((item, key) => {
                            if(item.count > 0){
                            return(
                                <div
                                    style={{gridTemplateColumns: 'auto 1fr'}}    
                                    className='grd grd-gp-1'
                                    key={key} >
                                    <div 
                                        className='relative jse point'>
                                        {/* <div className='label'>{`${item.count} / ${multiTotal}`}</div>
                                        <div className='absolute _chart-label_hide size-100'>{`${Math.floor(item.count / multiTotal * 100)} %`}</div> */}
                                        {showtotal ? 
                                            <span className='label'>{`${item.count} / ${multiTotal}`}</span>
                                            :
                                            <span className='label'>{item.count}</span>
                                        }
                                        <div 
                                            style={{left: 0, top: 0}}
                                            className='absolute _chart-label_hide size-100 bg-white label text-ac'>
                                            {`${Math.round(item.count / multiTotal * 100)} %`}
                                        </div>
                                    </div>
                                    <Legend key={key} color={item.color} label={item.name} count={item.count}/>
                                </div>
                            )}
                        })
                    }
                </div>
            }
            <div
                className='asc grd grd-gp-2'
                style={{gridTemplateRows: `${size} auto auto`}}
                >
                <div
                    style={{display: 'inline-block', '--size': size}} 
                    className='_chart-wrap relative jsc'>
                    <div
                        style={type === 'multiple' ? {backgroundImage: `conic-gradient(${arrString.join(',')})`} : {'--value': `${Math.round(count / total * 100)}%`, '--chartcolor': color}}
                        className={`_chart _chart-${type} round`}>
                    </div>
                    {label &&
                        <div 
                            className='absolute bg-white _chart-center round grd jic aic'>
                            <div className='grd aic jic relative size-100'>
                                <div className='grd aic jic'>
                                    {label}
                                </div>
                                {labelonhover &&
                                    <div className='grd aic jic absolute _chart-label_hide size-100 bg-white round'>
                                        {labelonhover}
                                    </div>
                                }
                            </div>
                        </div>
                    }
                </div>
                {comparisonlabel && <span className='sublabel jsc'>{`${comparisonlabel}: ${total - count}`}</span>}
                {title && <span className={size > 91 ? 'header-2 jsc' : 'label jsc'}>{title}</span>}
            </div>
        </div>
    )
}

Chart.defaultProps = {
    type: 'two',
    showtotal: true,
}

export default Chart
