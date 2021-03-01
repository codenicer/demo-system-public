import React,{useState,useEffect} from 'react';
import TableRow from '../../../../../../atoms/TableRow/TableRow';
import OrderID from '../../../../../../molecules/OrderID/OrderID';
import Batch from '../../../../../../atoms/Batch/Batch';
import moment from 'moment-timezone';

const Timer = (props) =>{
    const [time, setTime] = useState({time:null});
    const {data} = props
    let intervalStart = null
    
    function tick(){
         console.log(data, 'date accepted')
         console.log(moment(Date()).tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss'), moment(data).format("YYYY-MM-DD HH:mm:ss"));

        const base = moment.duration(moment(moment( Date()).tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss')).diff( moment(data).format("YYYY-MM-DD HH:mm:ss")));
         const hr =  base.hours();
         const min =  base.minutes();
         const sec =   base.seconds();
         setTime({time:`${hr}:${min}:${sec}`})
    }
    
    useEffect(()=>{
    if(data !== null ){
        const base2 =  moment.duration(moment(moment( Date()).tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss')).diff( moment(data).format("YYYY-MM-DD HH:mm:ss")));
      const hr =   base2.hours()
      const min =     base2.minutes()
      const sec =    base2.seconds()
      setTime({time:`${hr}:${min}:${sec}`})
      intervalStart = setInterval(function(){
          tick()
     },1000) 
    }
    return ()=>clearInterval(intervalStart)

    },[data])

    return <div >{data === null ? '---': time['time']}</div>
}

const FloristQueueRow = (props) => {
    const { data } = props;
    return (
        <TableRow
            data={data}
            css='jic aic _florist_queue-template'    
        >
                <OrderID css='florist_q_row-id' orderid={data['order_id']}>{data['shopify_order_name']}</OrderID>
          <div>{data['title']}</div>
          <div>{moment(data['delivery_date']).format('MMM. DD, YYYY')}</div>
          <Batch batch={data['delivery_time']} />
          <div>{data['shipping_city']}</div>
                <div>{`${data['first_name']} ${data['last_name']}`}</div>
                <Timer data={data['accepted_at']}/>
        </TableRow>
    );
};

export default FloristQueueRow;