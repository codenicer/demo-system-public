import React from 'react';
import Batch from '../../../../atoms/Batch/Batch';
import OrderID from '../../../../molecules/OrderID/OrderID';
import TableRow from '../../../../atoms/TableRow/TableRow';
import OrderStatus from '../../../../atoms/OrderStatus/OrderStatus';
import Customer from '../../../../atoms/Customer/Customer';
import CpuActions from './CpuActions';

//PACKAGES
import moment from 'moment-timezone';
import account from 'accounting-js';
moment.tz.setDefault("Asia/Manila");

const CpuJobRow = (props) => {
    //=========PROPS=========
    //=========PROPS=========

    //pass down props
    const { data, hub, css, cpuHandler } = props

    return (
        <TableRow
          height='auto'
          css={`grd aic jic pad-y-1 ${css}`}
        >
          <OrderID orderid={data.job_rider.order.order_id}>{data.job_rider.order.shopify_order_name+'-CPU'}</OrderID>
          <OrderStatus orderStatus={data.job_rider['status']} />
          <span className='label text-ac pad-x-1'> {account.formatNumber(data.job_rider.order['total_price'])}</span>
          <div className='grd jic grd-gp-1'>
              <Customer id={data.job_rider.order.customer['customer_id']} firstname={data.job_rider.order.customer['first_name']} lastname={data.job_rider.order.customer['last_name']}/>
              {/* <span>{data['phone']}</span> */}
          </div>
          <div className='grd jic text-ac' style={{width:`250px`}}>
              <span>{data.job_rider.order.addresses['billing_address_1']}</span>
              <span>{data.job_rider.order.addresses['billing_address_2']}</span>
              <span>{`${data.job_rider.order.addresses['billing_city']} ${data.job_rider.order.addresses['billing_zip']}`}</span>
          </div>
          <div className='grd jic grd-gp-1'>
              <span>{moment(data.job_rider['target_pickup_date']).format('MMM. DD, YYYY')}</span>
              <Batch batch={data.job_rider['target_pickup_time']} />
          </div>
          <span className="italic label">{hub ? hub.name : 'No Hub'}</span>
          {data.job_rider.status === 9 &&
            <CpuActions 
                cpuHandler={cpuHandler}
                id={data.dispatch_job_detail_id} />
          } 
        </TableRow>
    );
};

export default CpuJobRow;