import React from 'react';
import Page from '../../../../atoms/Page/Page';
import AddressCard from '../../../../components/AddressCard/AddressCard';
import OrderHistory from './OrderHistory/OrderHistory';
import {clearSelectedCustomer} from '../../../../scripts/actions/customersActions'
import {connect} from 'react-redux'
import './CustomerPage.css';


const CustomerPage = ({data,clearSelectedCustomer}) => {
    const { customerOrder } = data;
    return (
        <Page
            clickClose={clearSelectedCustomer}
        >
            <div className='grd gtr-af grd-gp-1'>
                <div className='customer_page-details grd grd-gp-1 pad-2 bg-white'>
                    <div className='grd gtc-af grd-gp-1 aic jis' style={{gridColumn: '1/-1'}}>
                        <span className='sublabel'>{`Customer ID: ${data['customerInfo']['customer_id']}`}</span>
                        <span className='header-2'>{`${data['customerInfo']['first_name']} ${data['customerInfo']['last_name']}`}</span>
                    </div>
                    <div className='grd aic pad-1 grd-gp-1 acs'>
                        <span className='header-3 ass'>Contact Info</span>
                        <span className='link label'>{data['customerInfo']['email']}</span>
                        <span>Accepts email marketing</span>
                        <span>{data['customerInfo']['phone']}</span>
                    </div>
                    <div className='grd aic pad-1 grd-gp-2 acs'>
                        <span className='header-3 ass'>Default Address</span>
                        <AddressCard
                            data={data['customerInfo']}
                        />
                    </div>
                </div>
                <div className='pad-2 over-hid grd grd-gp-1 gtr-af bg-white'>
                    <span className='header-3'>Order History</span>
                    <div className='over-y-auto scroll'>
                    {customerOrder &&
                        customerOrder.map((data, key) => {
                            console.log(data, 'halfway there oooohhh living on a prayer');
                            return <OrderHistory data={data} key={key}/>
                        })
                        
                    }   
                    </div>       
                </div>
            </div>
        </Page>
    );
};

export default connect(null,{clearSelectedCustomer})(CustomerPage);