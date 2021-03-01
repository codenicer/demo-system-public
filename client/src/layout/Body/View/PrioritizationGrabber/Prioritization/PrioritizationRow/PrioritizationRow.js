import React from 'react';
import TableRow from '../../../../../../atoms/TableRow/TableRow';
import Batch from '../../../../../../atoms/Batch/Batch';
import OrderID from '../../../../../../molecules/OrderID/OrderID';
import Customer from '../../../../../../atoms/Customer/Customer';
import {sortableHandle} from 'react-sortable-hoc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faBars } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");

const SortHandle = sortableHandle(() => <FontAwesomeIcon className='point' icon={faBars} size='2x' />)

const PrioritizationData = (props) => (
    <div className={`prioritization_data ${props.css}`}>
        {props.children}
    </div>
)

const PrioritizationRow = (props) => {
   
    const { data } = props;
    return (
        <TableRow
        height='auto'
        css='jic aic prioritization_header pad-1'>
            <PrioritizationData css='prioritizatio_row-drag_wrap' >
                <SortHandle />
            </PrioritizationData>
            <OrderID orderid={data['order_id']}>{data.shopify_order_name}</OrderID>
            <span>{data['line_items'].length}</span>
            <div className='grd grd-gp-1 aic jic'>
                <span>{moment(data['delivery_date']).format('MMM. DD, YYYY')}</span>
                <Batch batch={data['delivery_time']} />
            </div>
            <span>{moment(data['created_at']).format('YYYY-MM-DD')}</span>
            <Customer
                id={data['customer_id']}
                firstname={data['first_name']}
                lastname={data['last_name']}
                />
            <div className="sublabel grd text-ac">
                {data['shipping_address']["shipping_address_1"] && <span>{data['shipping_address']["shipping_address_1"]}</span>}
                {data['shipping_address']["shipping_address_2"] && <span>{data['shipping_address']["shipping_address_2"]}</span>}
                {data['shipping_address']["shipping_city"] && <span>{data['shipping_address']["city"]}</span>}
                {data['shipping_address']["shipping_province"] && <span>{data['shipping_address']["shipping_province"]}</span>}
                {data['shipping_address']["shipping_country"] && <span>{data['shipping_address']["shipping_country"]}</span>}
            </div>
        </TableRow>
    );
};

export default PrioritizationRow;