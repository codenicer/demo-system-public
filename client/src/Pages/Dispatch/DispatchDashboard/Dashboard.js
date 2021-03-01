import React, { useState, useEffect} from 'react'
import PieChart from "../../../atoms/Chart/PieChart";
import BarChart from "../../../atoms/Chart/BarChart";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSadCry } from '@fortawesome/free-solid-svg-icons'

const arrColor = {
    'No Delivery Time': "var(--disabled)",
    'Anytime': "var(--green)",
    'Anytime ': "var(--green)",
    '9am - 1pm': "var(--yellow)",
    '1pm - 5pm': "var(--blue)",
    '5pm - 8pm': "var(--warning)"
  }
  
  const arColor = [
    "#E24B26",
    "#FFDB6B",
    "#F18226",
    "#00828E",
    "#7CC1F7",
    "#3B8AD9",
    "#61737B"
  ];

const Dashboard = (props) => {
    const { data, date } = props;

    const [ procData, setProcData ] = useState([]);
    const [ total, setTotal ] = useState(0);
    const [ shipped, setShipped ] = useState(0);

    // useEffect(() => {
    //     console.log('i unmount')
    // }, [])

    useEffect(() => {
        setProcData([]);
        if(data && data.length) {
          let copyData = [...data];
          // main array of state
          let arr = [];
          // total count of order
          let tot = 0;
          copyData.forEach((item) => {
              // variable for total of orders based on delivery time
              let num = 0;
              // sub array of state
              let ar = [];
              // variable for index of arColor array;
              let index = 0;
              // variable for accomplished for each delivery time
              let acc = 0;
              Object.entries(item).forEach(data => {
                //get the count of acc orders
                if (data[0] === "shipped" || data[0] === "delivered") {
                  acc = Number(data[1]) + acc;
                }
                //get the sum of possible integer inside the object and create a breakdown of order depending on status
                if (isNaN(data[1]) === false ) {
                  num = Number(data[1]) + num;
                  ar.push({
                    name: data[0],
                    count: Number(data[1]),
                    color: arColor[index++] || "var(--primary)"
                  });
                }
              });
              let obj = {
                name: item.delivery_time,
                color: arrColor[item.delivery_time],
                count: num,
                items: ar,
                shipped: acc
              };
              tot = tot + num;
              arr.push(obj);
            });
            setProcData(arr);
            setTotal(tot);
          } 

    }, [data]);

    useEffect(() => {
        if (procData && procData.length !== 0) {
          // console.log(procData, 'data dashboard')
          let acc = 0;
          procData.forEach(item => {
            acc = acc + item.shipped;
          });
          setShipped(acc);
        //   setLoading(false);
        }
      }, [procData]);

    if(!procData.length){
        return (
            <div className='relative shadow bg-white pad-1'>
                <div className='grd aic jic' style={{position: 'sticky', left: 0, top: 10, height: '70vh'}}>
                    <div className='grd gtc-af grd-gp-1 aic'>
                        <FontAwesomeIcon icon={faSadCry} style={{fontSize: '50px', color: 'var(--yellow)'}}/>
                        <span className='header-3'>No placed orders</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
        <div className='shadow bg-white pad-1'>
          <span className='header-2'>{date === moment(Date.now()).format('YYYY-MM-DD') ? 'Today' : date}</span>
          <div className="grd gtr-af grd-gp-1 aic jic pad-2 br-2">
            <PieChart size={190} type="multiple" data={procData} />
          <div 
            style={{gridTemplateColumns: '1fr 1fr', gridTemplateRows: '180px 180px'}}
            className='grd grd-gp-1'>
            {
              procData.map((item, key) => {
                if(item.name !== 'No Delivery Time'){
                  return (
                    <PieChart
                        legend={false}
                        size={90}
                        type='multiple'
                        key={key}
                        data={item.items}
                        label={
                          <span className='label'>{item.name !== 'Anytime' ? item.name.slice(0, item.name.indexOf(':')) : item.name}</span>
                        } 
                    />
                  )
              } else {
                 return null
              }
            })
          }
        </div>
          <div
              className="grd gtr-af grd-gp-2"
            >
              <PieChart
                // check css variables on index.css
                color="var(--primary)"
                //size of the chart
                size={150}
                //count of to be compared
                count={shipped}
                //total of data
                total={total}
                //to becompared based on total
                comparisonlabel="Pending"
                label={
                  <>
                    <span className='header'>{`${shipped} / ${total}`}</span>
                    <span className='header-2'>Shipped Order</span>
                  </>
                }
                labelonhover={
                  <span className='header'>{`${Math.round(shipped / total * 100)} %`}</span>
                }
                title="Total Order"
              />
              <div
                style={{ gridTemplateColumns: "1fr 1fr" }}
                className="grd grd-gp-2"
              >
                {procData.map((item, key) => {
                    if(item.name !== 'No Delivery Time'){
                      return (
                        <PieChart
                          key={key}
                          // check css variables on index.css
                          color={item.color}
                          //size of the chart
                          size={90}
                          //count of to be compared
                          count={item.shipped}
                          //total of data
                          total={item.count}
                          comparisonlabel="Pending"
                          label={
                            <>
                              <span className='label'>{`${item.shipped} / ${item.count}`}</span>
                              <span className='label'>Shipped</span>
                            </>
                          }
                          labelonhover={
                            <span className='label'>{`${Math.round(item.shipped / item.count * 100)} %`}</span>
                          }
                          title={item.name}
                        />
                      );
                    } else { return null }
                })}
              </div>
            </div>
          </div>
          <div style={{ height: 300 }} className="pad-2 br-2">
            <BarChart data={procData} />
          </div>
        </div>
        </>
    )
}

export default Dashboard
