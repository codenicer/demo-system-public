import React from 'react';
import Paper from '../../../../../atoms/Paper/Paper';
import OrderGeneral from './OrderGeneral/OrderGeneral';
import OrderAddress from './OrderAddress/OrderAddress';
import OrderCPUDetails from './OrderCPUDetails/OrderCPUDetails';
import OrderDispatchDetails from './OrderDispatchDetails/OrderDispatchDetails';

const OrderDetails = ({data, date, time, hub, click ,setBilling,setShipping, bname, bcontact, baddress, sname, scontact, saddress, setInfo, paymentmethod, setPaymentName, cpuDate,  cpuTime, cpuHub, setCPUInfo}) => {
  return (
        <Paper css='order_page-order_details grd pad-2 bg-white grd-gp-2'>
            <OrderDispatchDetails 
                data={data}
            />
            {data.job_riders.length > 0 && data.payment.name === 'CPU' && <OrderCPUDetails
                data={data} 
                cpuDate={cpuDate}
                cpuTime={cpuTime}
                cpuHub={cpuHub}
                cpuDateClick={() => click('cpu_date', cpuDate)}
                cpuTimeClick={() => click('cpu_time', cpuTime)}
                cpuHubClick={() => click('cpu_hub', cpuHub)}
                setCPUInfo={setCPUInfo}
            />}
            <OrderGeneral
                data={data}
                date={date}
                time={time}
                hub={hub}
                paymentmethod={paymentmethod}
                setInfo={setInfo}
                setPaymentName={setPaymentName}
                hubClick={() => click('hub', hub)}
                dateClick={() => click('date', date)}
                timeClick={() => click('time', time)}    
                paymentmethodClick={() => click('paymentmethod', paymentmethod)}
            />
            <OrderAddress
                setShipping={setShipping}
                type='shipping'
                data={data['addresses']}
                name={sname}
                nameClick={() => click('sname', sname)}
                contact={scontact}
                contactClick={() => click('scontact', scontact)}
                address={saddress}
                addressClick={() => click('saddress', saddress)}
            />
            <OrderAddress
                setBilling={setBilling}
                type='billing'
                data={data['addresses']}
                name={bname}
                nameClick={() => click('bname', bname)}
                contact={bcontact}
                contactClick={() => click('bcontact', bcontact)}
                address={baddress}
                addressClick={() => click('baddress', baddress)}
            />
        </Paper>
    );
};

export default OrderDetails;
