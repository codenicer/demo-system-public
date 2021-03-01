import React, {useEffect} from 'react';
import Container from '../../atoms/Container/Container';
import TableHeader from '../../atoms/TableHeader/TableHeader';
import UndeliveredRow from './UndeliveredRow/UndeliveredRow';
import './UndeliveredTable.css';
import {connect} from 'react-redux'

const headerdata = ['Action', 'Order ID', 'Order Item ID', 'Product', 'Contact Person', 'Address', 'Reason'];

const UndeliveredTable = () => {
    useEffect(()=>{
        console.log("Undelivered Table DID MOUNT")
    },[])

    return (
        <Container
            css='pad-1 grd gtr-af grd-gp-2 over-hid'
        >  
            <span className='header'>Undelivered Table</span>
            <div className='grd gtr-af'>
                <TableHeader
                    css='jic undelivered_header'
                >
                    {
                        headerdata.map((value, key) => {
                            return <span key={key} >{value}</span>
                        })
                    }
                </TableHeader>
                <div>
                    <UndeliveredRow />
                    <UndeliveredRow />
                    <UndeliveredRow />
                    <UndeliveredRow />
                </div>
            </div>
        </Container>
    );
};

const transferStatetoProps = state => ({
    isfetching:state.webFetchData.isFetching
})

export default connect(transferStatetoProps,{})(UndeliveredTable);