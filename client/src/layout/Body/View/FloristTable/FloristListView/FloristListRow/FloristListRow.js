import React, { useState ,useEffect} from 'react';
import Status from '../../../../../../atoms/Status/Status';
import TableRow from '../../../../../../atoms/TableRow/TableRow';
import ProductPreview from '../../ProductPreview/ProductPreview';
import AvatarImg from '../../../../../../atoms/AvatarImg/AvatarImg';
import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Manila");


const FloristListRow = ({data, elapsedTime}) => {
    const [preview, setPreview] = useState(false);
    const [time, setTime] = useState({time:null});
    
    let intervalStart = null

    const previewHandler = () => {
        setPreview(!preview)
    }

    function tick(){
        const hr = moment.duration(moment(moment( Date.now()).tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss')).diff( moment.utc(elapsedTime).format("YYYY-MM-DD HH:mm:ss"))).hours()
        const min = moment.duration(moment(moment( Date.now()).tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss')).diff( moment.utc(elapsedTime).format("YYYY-MM-DD HH:mm:ss"))).minutes()
        const sec = moment.duration(moment(moment( Date.now()).tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss')).diff( moment.utc(elapsedTime).format("YYYY-MM-DD HH:mm:ss"))).seconds()
           setTime({time:`${hr}:${min}:${sec}`})
    }
  
    useEffect(() => {
        if(moment.utc(elapsedTime) !== null ){
            const hr =  moment.duration(moment(moment( Date.now()).tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss')).diff( moment.utc(elapsedTime).format("YYYY-MM-DD HH:mm:ss"))).hours()
            const min =   moment.duration(moment(moment( Date.now()).tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss')).diff( moment.utc(elapsedTime).format("YYYY-MM-DD HH:mm:ss"))).minutes()
            const sec =  moment.duration(moment(moment( Date.now()).tz("Asia/Manila").format('YYYY-MM-DD HH:mm:ss')).diff( moment.utc(elapsedTime).format("YYYY-MM-DD HH:mm:ss"))).seconds()
            setTime({time:`${hr}:${min}:${sec}`})
            intervalStart = setInterval(function(){
                tick()
           },1000) 
        }
        return ()=>clearInterval(intervalStart)
    },[elapsedTime])

    return (
        <>
            <TableRow 
                css={`aic jic florist-live_template ${data['user_info']['status'] === 1 && 'florist_q_row-off'}`}>
                <AvatarImg css='jsc' firstname={data['user_info']['first_name']} lastname={data['user_info']['last_name']}/>
                <div>{`${data['user_info']['first_name']} ${data['user_info']['last_name']}`}</div>
                <div>
                    <Status status={data['user_info']['status']} />
                </div>
                <div
                    className={`emp ${data['job'] && 'point'}`}
                    onMouseEnter={previewHandler}
                    onMouseLeave={previewHandler}
                    >
                    {data['job'] && data['job']['order_item_id']}
                </div>
                <div>
                    {data['job'] &&
                        <div>
                            {data['job']['title']}
                        </div>
                    }
                </div>
                <div>
                    {elapsedTime !== null ? time.time:null}
                </div>
            </TableRow>
            {data['job'] &&
                preview &&
                <ProductPreview 
                    data={data['job']}
                />
            }
        </>
    );
};

export default FloristListRow;