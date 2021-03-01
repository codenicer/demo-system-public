import React from 'react';
import EditableData from '../../../../../../atoms/EditableData/EditableData';
import EditableAddress from '../../../../../../atoms/EditableAddress/EditableAddress';
import Input from '../../../../../../atoms/Input/Input';
import Modal from '../../../../../../template/Modal/Modal';

const OrderBilling = ({data, type, setBilling, setShipping, name, nameClick, contact, contactClick, address, addressClick}) => {
    let  decider = setBilling
    if(type === 'shipping')  decider = setShipping

    return (
        <div className='grd grd-gp-1 gtc-af aic' style={{gridTemplateRows: 'auto auto auto 1fr'}}>
            <span className='header-3' style={{gridColumn: '1/-1'}}>{`${type.substring(0,1).toUpperCase()}${type.substring(1)}`}</span>
            <span className='sublabel'>Name :</span>
            <EditableData
                edit={name}
                onClick={nameClick}
            >
                <Input value={data[`${type}_name`]} disabled={!name} 
                    onChange={(e) => decider(e.target.value,`${type}_name`)}/>
            </EditableData>
            <span className='sublabel'>Contact info :</span>
            <EditableData
                edit={contact}
                onClick={contactClick}
            >
                <Input value={data[`${type}_phone`]} disabled={!contact}
                     onChange={(e) => decider(e.target.value,`${type}_phone`)}/>
            </EditableData>
            <span className='sublabel'>Address :</span>
            <EditableAddress
                type={type}
                data={data}
                onClick={addressClick}
            />
            {address &&
                <Modal
                    width='500px'
                    clickClose={addressClick}
                    clickCancel={addressClick}
                    clickSubmit={addressClick}
                    label={`Edit ${type} address`}
                >
                    <span className='label'>Address</span>
                    <Input 
                        value={data[`${type}_address_1`]} 
                        css='pad-1' 
                        onChange={(e) => decider(e.target.value, `${type}_address_1`)}/>
                    <span className='label'>Apartment, suite, etc.</span>
                    <Input 
                        value={data[`${type}_address_2`]} 
                        css='pad-1'
                        onChange={(e) => decider(e.target.value,`${type}_address_2` )}/>
                    <span className='label'>City</span>
                    <Input 
                        value={ data[`${type}_city`]} 
                        css='pad-1'
                        onChange={(e) => decider(e.target.value, `${type}_city`)}/>
                    <span className='label'>Province</span>
                    <Input 
                        value={ data[`${type}_province`]} 
                        css='pad-1'
                        onChange={(e) => decider(e.target.value,`${type}_province` )}/>
                    <span className='label'>Country</span>
                    <Input 
                        value={data[`${type}_country`]} 
                        css='pad-1'
                        onChange={(e) => decider(e.target.value,`${type}_country`)}/>
                    <span className='label'>Zip</span>
                    <Input 
                        value={data[`${type}_zip`]} 
                        css='pad-1'
                        onChange={(e) => decider(e.target.value,`${type}_zip`)}/>
                </Modal>
            }
        </div>
    );
};

export default OrderBilling;