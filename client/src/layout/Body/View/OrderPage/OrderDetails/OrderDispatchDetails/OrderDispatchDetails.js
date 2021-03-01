import React, { useEffect } from 'react';
import { dispatchStatus } from "../../../../../../scripts/actions/ordersActions";
import { connect } from 'react-redux';
import OrderStatus from '../../../../../../atoms/OrderStatus/OrderStatusLabel';
import moment from 'moment-timezone'
moment.tz.setDefault("Asia/Manila");

const OrderDispatchDetails = (props) => {
    //==========PROPS========
    //==========PROPS========

    //pass down props
    const { data } = props

    //props from redux
    const { dispatchData, dispatchStatus } = props

    //destructuring dispatch status delivery type dispatch job
    //const { rider_first_name, rider_last_name, tracking_no, rider_mobile_number, rider_provider_name } = dispatchData;

    //========USE EFFECT======
    //========USE EFFECT======

    //load dispatch status on did mount
    useEffect(() => {
        dispatchStatus(data["shopify_order_name"]);
      }, [data]);


    useEffect(() => {
        // console.log(dispatchData, 'LALALLALALALAL')
    },  [dispatchData])

    return (
        <>
            {dispatchData ? 
                    dispatchData['deliveryRiderInfo'] &&
                    <div className='grd grd-gp-1 gtc-af aic size-100' style={{gridTemplateRows: 'min-content auto auto', gridTemplateColumns: 'auto 1fr auto 1fr'}}>
                        <div className='header-3' style={{gridColumn: '1 / -1'}}>Dispatch Details</div>
                        <span className='sublabel space-no-wrap'>Status:</span>
                        <OrderStatus orderStatus={dispatchData['deliveryRiderInfo'].status} />
                        <span className='sublabel space-no-wrap'>Job Date:</span>
                        <span>{moment(dispatchData['deliveryRiderInfo'].created_at).format('MMM. DD, YYYY')}</span>
                        <span className='sublabel space-no-wrap'>Tracking #:</span>
                        <span>{dispatchData['deliveryRiderInfo'].dispatch_job.tracking_no}</span>
                        <span className='sublabel space-no-wrap'>Rider:</span>
                        <span>{`${dispatchData['deliveryRiderInfo'].dispatch_job.rider_first_name} ${dispatchData['deliveryRiderInfo'].dispatch_job.rider_last_name}`}</span>
                        <span className='sublabel space-no-wrap'>Contact #:</span>
                        <span>{dispatchData['deliveryRiderInfo'].dispatch_job.rider_mobile_number}</span>
                        <span className='sublabel space-no-wrap'>Provider:</span>
                        <span>{dispatchData['deliveryRiderInfo'].dispatch_job.rider_provider_name}</span>
                    </div>
                :
                null
            }

            {dispatchData ? 
                    dispatchData['CPURiderInfo'] &&
                    <div className='grd grd-gp-1 gtc-af aic size-100' style={{gridTemplateRows: 'min-content auto auto', gridTemplateColumns: 'auto 1fr auto 1fr'}}>
                        <div className='header-3' style={{gridColumn: '1 / -1'}}>CPU Dispatch Details</div>
                        <span className='sublabel space-no-wrap'>Status:</span>
                        <OrderStatus orderStatus={dispatchData['CPURiderInfo'].status} />
                        <span className='sublabel space-no-wrap'>Job Date:</span>
                        <span>{moment(dispatchData['CPURiderInfo'].created_at).format('MMM. DD, YYYY')}</span>
                        <span className='sublabel space-no-wrap'>Tracking #:</span>
                        <span>{dispatchData['CPURiderInfo'].dispatch_job.tracking_no}</span>
                        <span className='sublabel space-no-wrap'>Rider:</span>
                        <span>{`${dispatchData['CPURiderInfo'].dispatch_job.rider_first_name} ${dispatchData['CPURiderInfo'].dispatch_job.rider_last_name}`}</span>
                        <span className='sublabel space-no-wrap'>Contact #:</span>
                        <span>{dispatchData['CPURiderInfo'].dispatch_job.rider_mobile_number}</span>
                        <span className='sublabel space-no-wrap'>Provider:</span>
                        <span>{dispatchData['CPURiderInfo'].dispatch_job.rider_provider_name}</span>
                    </div>
                :
                null
            }
        </>
        
    )
}

const mapStateToProps = state => ({
    dispatchData: state.orderData.dispatch_status
})

export default connect(mapStateToProps, { dispatchStatus })(OrderDispatchDetails)
