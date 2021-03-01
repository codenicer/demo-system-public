import React, {useEffect} from 'react';
import Paper from '../../../../../atoms/Paper/Paper';
import LogItem from './LogItem/LogItem.js';
import Spinner from '../../../../../atoms/Spinner/Spinner';
import {loadSelOrderLogs} from  '../../../../../scripts/actions/order_logActions'
import {connect} from  'react-redux'


function OrderLogs(props) {
    const {loadSelOrderLogs} = props
    const {order_id} = props.order
    const {orderLogs:{sel_order_logs},isFetching} = props

    useEffect(()=>{
        loadSelOrderLogs(order_id)
    },[order_id])

    return (
        <Paper css='order_page-logs grd gtr-af grd-gp-2 pad-2 over-hid'>
            <span className='header-3'>Logs</span>
            {isFetching === 'success' ?
                <div 
                    className='grd pad-1 grd-gp-1 acs over-y-auto scroll'>
                    {
                        sel_order_logs  && 
                        sel_order_logs.map((data, key) => {
                            return <LogItem data={data} key={key} />
                        })

                    }
                </div>
                :
                <div 
                    className='grd pad-1 grd-gp-1 aic jic relative'>

                    {
                        isFetching !== 'success' &&
                        <Spinner isFetching={isFetching} />
                    }
                </div>
            }
        </Paper>
    )
}

const mapStatetoProps = state => ({
    orderLogs:state.orderLogsData,
    isFetching:state.orderLogsData.order_logs_state
})

export default connect(mapStatetoProps,{loadSelOrderLogs})(OrderLogs);
