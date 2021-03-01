import React, {useEffect, useState} from 'react';
import StackBar from './StackBar/StackBar';
import Legend from './Legend/Legend';
import './BarChart.css';

const BarChart = ({data, type}) => {
    const [ highestValue, setHighestValue ] = useState(null);
    const [ chartMax, setChartMax ] = useState(null);
    const [ chartDivider, setChartDivider ] = useState(null);

    useEffect(() => {
        if(data.length){
            let arr = [];
            data.map(data => arr.push(data.count))
            setHighestValue(Math.max(...arr))
        }
    }, [data])

    useEffect(() => {
        if(highestValue){
            // console.log(highestValue, 'highest')
            setChartDivider(Math.ceil((highestValue / 5) / 5) * 5);
        }
    }, [highestValue])

    useEffect(() => {
        if(chartDivider){
            // console.log(chartDivider, 'chartDivider')
            setChartMax(chartDivider * 5)
        }
    }, [chartDivider])

    useEffect(() => {
        if(chartMax) {
            // console.log(chartMax, 'chartMax')
        }
    },  [chartMax])

  

    return (
        <div className='grd gtc-af grd-gp-1 size-100'>
            <div
                style={{alignContent: 'end'}} 
                className='grd jse'>
                <span className='label'>Legends:</span>
                {data[0] && 
                    data[0].items.map((item, key) => {
                        return <Legend key={key} color={item.color} label={item.name} count={item.count}/>
                    })
                }
            </div>
            <div 
                style={{gridTemplateColumns: 'auto 1fr', gridTemplateRows: '1fr 10px' }}
                // style={{borderLeft: '1px solid black', borderBottom: '1px solid black'}}
                className='size-100 grd'> 
                <div
                    style={{gridRow: '1 / 2', gridColumn: '1 / 2'}}
                    className='grd aic'
                >
                    {data &&
                        data.map((item, key) => {
                            return <div key={key} className='barchart_item-label grd grd-gp-1 jie'>{item.name}</div>
                            
                        })
                    }
                </div>
                <div
                    style={{borderLeft: '1px solid black',  borderBottom: '1px solid black'}}
                    className='grd aic jis'
                >
                    {data && 
                        data.map((item, key) => {
                            // return <div key={key} style={{width: `${Math.round(item.count / chartMax * 100)}%`}} className='barchart_item grd aic jic color-white'>{item.count}</div>
                            return <StackBar
                                width={`${Math.round(item.count / chartMax * 100)}%`}
                                data={item.items} 
                                total={item.count} 
                                key={key} 
                                />
                        })
                    }
                </div>
                <div
                    style={{gridRow: '2 / -1', gridColumn: '2 / -1'}}
                    className='barchart_value-wrap grd grd-col grd-col-f jie'
                >
                    {
                        Array.from(Array(5), (value, key) => {
                            return <div key={key} className='relative'>
                                        <span className='barchart_value-item'>{chartDivider * (key + 1)}</span>
                                    </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default BarChart
