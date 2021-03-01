import React from 'react';
import QueueJobItem from './QueueJobItem';
import Paper from '../../../../atoms/Paper/Paper';
import TableHeader from "../../../../atoms/TableHeader/TableHeader";
import OrderStatusLabel from '../../../../atoms/OrderStatus/OrderStatusLabel';
import '../DispatchHistory.css';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");;

const DispatchQueueJob = ({data, type,  onRemoveItem, onRemoveJob, itemModal,
    hubs,payment_methods


}) => {

    let view_dispatch_job_details = data.details || [];
    const headerData = ['Order ID', 'Item/Amount', 'Delivery Time', 'Contact Person',"Address",
    "Payment Type",'Date Updated', 'Status',  'Remarks'];



  function removeJobItem(dispatch_job_detail_id){
    if(view_dispatch_job_details.length === 1){

      onRemoveJob(data.dispatch_job_id)

    }else{
      onRemoveItem(dispatch_job_detail_id);
    }


  }

    return (
        <Paper css='pad-2 mar-y-1'>
            <div className='grd grd-gp-1'>
                <div 
                  className='grd grd-gp-2'
                  style={{gridTemplateColumns: '1fr auto auto'}}
                >
                  {data.tracking_no &&
                    <div className='ass grd'>
                      <span className='header'>Dispatch Tracking #: {data.tracking_no} </span>
                      <span className='sublabel'>Created: {moment(data.created_at).format('MMMM DD, YYYY hh:mm A')}</span>
                      <span className='sublabel'>Updated: {moment(data.updated_at).format('MMMM DD, YYYY hh:mm A')}</span>
                    </div> 
                  }
                  {!type &&
                  <span
                    color='success'
                    height='42px'
                    css='pad-x-2'
                  >

                    <OrderStatusLabel orderStatus={data.status} />
                  </span>
                  }
                </div>


              {data.rider_provider_id ?
                <>
              <span className='header-2'>Rider Information</span>
              <div className='grd jss grd-col grd-gp-1'>
                <span className='sublabel'>Rider:</span>
                <span className='label'>{data.rider_first_name} {data.rider_last_name}</span>
                <span className='sublabel'>Contact #:</span>
                <span className='label'>{data.rider_mobile_number}</span>
                <span className='sublabel'>Provider</span>
                <span className='label'>{data.rider_provider_name}</span>
              </div>
                </>
                :
                ''
                }


                <div className='grd'>

                    <div>
                        <div>
                            <span className='header-3'>
                                {  view_dispatch_job_details.length === 1 ?
                                    'Item: ' + view_dispatch_job_details.length :
                                    'Items: ' + view_dispatch_job_details.length }


                            </span>
                            <TableHeader
                                csswrap='width-100'
                                css='aic jic history_item-header'
                            >
                                {
                                    headerData.map((value, key) => {
                                        return <span key={key}>{value}</span>
                                    })
                                }
                            </TableHeader>
                        </div>
                              {
                                view_dispatch_job_details && view_dispatch_job_details.map((record, key) => {
                                  return   <QueueJobItem css='aic history_item-row'
                                                         key={key}
                                                         data={record}
                                                         onRemove={removeJobItem}
                                                         hubs={hubs}
                                                         payment_methods={payment_methods}


                                  />

                                })
                              }
                    </div>
                </div>
            </div>
        </Paper>
    );
};

export default DispatchQueueJob;