import React, { useState, useEffect } from 'react';
import Input from '../../../../atoms/Input/Input';
import Button from '../../../../atoms/Button/Button';

//redux
import { connect } from 'react-redux';
import { getTrackingNo } from './../../../../scripts/actions/dispatchActions';
import { fetchAvailableRiders, fetchRiderProviders } from './../../../../scripts/actions/riderActions';


//package
import CreatableSelect from "react-select/lib/Creatable";
import ProcessBtn from './ProcessBtn';

const ProcessWrap = (props) => {
    //======PROPS=======
    //======PROPS=======

    //redux props
    const { getTrackingNo, tracking_data, rider_data, fetchAvailableRiders, rider_fetch, fetchRiderProviders, provider_fetch, provider_data } = props;

    // pass down props
    const { selectedData, setSelectedData } = props

    //======STATE=======
    //======STATE=======

    const [riderType, setRiderType] = useState("");

    //state for rider form
    const [ riderForm, setRiderForm ] = useState({
        rider_id:0,
        rider_provider_id:0,
        rider_provider_name:'',
        first_name:'',
        last_name:'',
        mobile_number:'',
        tracking_no:'',
      });

    //object for rider options
    const [ riderOption, setRiderOption ] = useState([])

    //object for provider options
    const [ providerOption, setProviderOption ] = useState([])

    const [disabled, setDisabled] = useState(true);

    //======FUNCTIONS======
    //======FUNCTIONS======

    const riderHandler = input => {
        if(input){
            console.log(input, 'why')
            //check if rider is existed
            if(input.hasOwnProperty('data')){
                //destructure data object
                const { first_name, last_name, mobile_number, rider_id, rider_provider_id, rider_provider_name } = input.data
                
                setRiderForm({
                    ...riderForm,
                    first_name,
                    last_name,
                    mobile_number,
                    rider_id,
                    rider_provider_id,
                    rider_provider_name
                })
                //send this params to create new rider
            } else {
                console.log('im here')
                setRiderForm({
                    ...riderForm,
                    first_name: input.value,
                    rider_id: input.value
                })
            }
        } else {
            setRiderForm({
                ...riderForm,
                rider_id:0,
                rider_provider_id:0,
                rider_provider_name:'',
                first_name:'',
                last_name:'',
                mobile_number:'',
            })
        }
    }
    
    const providerHandler = input => {
        if(input){
            setRiderForm({
                ...riderForm,
                rider_provider_id: input.value,
                rider_provider_name: input.name
            })
        } else {
            setRiderForm({
                ...riderForm,
                rider_provider_id: 0,
                rider_provider_name: '',
            })
        }
    }   

    const riderTypeHandler = e => {
        if(e){
            setDisabled(false);
            setRiderType(e.value);
            if(e.value === "IN HOUSE"){
                getTrackingNo();
            }
            else{
                setRiderForm({tracking_no: ""});
            }
        }
    }

    //=======USE EFFECT======
    //=======USE EFFECT======

    useEffect(() => {
        fetchAvailableRiders()
        fetchRiderProviders()
    }, [])

    useEffect(() => {
        if(rider_data){
            let riderList = rider_data.map(rider => {
                return {
                    key: rider.rider_id, 
                    data: rider, 
                    value: rider.rider_id, 
                    label: `${rider.code ? rider.code + ' - ' : ''} ${rider.first_name} ${rider.last_name} (${rider.mobile_number})`}
            })
            setRiderOption(riderList);
        }
    }, [rider_data])

    useEffect(() => {
        if(provider_data){
            let providerList = provider_data.map(provider => {
                return {
                    key: provider.rider_provider_id,
                    value: provider.rider_provider_id,
                    label: provider.name
                }
            })
            setProviderOption(providerList);
        }
    }, [provider_data])

    useEffect(() => {
        setRiderForm({...riderForm, tracking_no: tracking_data})
    }, [tracking_data])
 

    return (
        <div
            style={{zIndex: 10}}
            className='grd gtc-af pad-1 bg-white br-2 slideInDown animate-2'>
            <div className='grd grd-gp-1'>
                <div className='grd gtr-af'>
                    <div className='grd'>
                        <span className='asc header-2'>Rider information:</span>
                       
                    </div>
                    <div
                        style={{gridTemplateColumns: '320px 320px', gridTemplateRows: 'auto 1fr'}}
                        className='grd grd-gp-1 pad-1'>
                        <span className='sublabel'>Rider Type:</span>
                            <CreatableSelect
                                name="rider_id"
                                isClearable
                                isValidNewOption={() => false}
                                placeholder='Rider Type'
                                options={[
                                    {
                                    data: "IN HOUSE",
                                    value: "IN HOUSE",
                                    label: "IN HOUSE"
                                    },
                                    {
                                    data: "ON DEMAND",
                                    value: "ON DEMAND",
                                    label: "ON DEMAND"
                                    },
                                    {
                                    data: "3 PL",
                                    value: "3 PL",
                                    label: "3 PL"
                                    }
                                ]}
                                onChange={e => riderTypeHandler(e)}
                                value={riderType}
                
                            />

{/* <span
                            style={{gridColumn: '2 / -1', gridRow: '1 / 2'}}
                            className='sublabel'>Lastname:</span>
                        <Input
                            css='pad-1 over-hid'
                            name="last_name"
                            readOnly={!isNaN(riderForm.rider_id)}
                            value={ riderForm.last_name ? riderForm.last_name : ''}
                            onChange={e => setRiderForm({...riderForm, [e.target.name]: e.target.value})}
                        /> */}
                        <span  style={{gridColumn: '2 / -1', gridRow: '1 / 2'}} className='asc sublabel'>Tracking #</span>
                        <Input
                            onChange={e => setRiderForm({tracking_no: e.target.value})}
                            css='pad-1'
                            name="tracking_no"
                            id="tracking_no"
                            placeholder={`Enter rider provider's tracking number`}
                            disabled={disabled}
                            value={riderForm['tracking_no']}
                        /> 
                            {/* <Button 
                                css='zoomIn animate-2'
                                color='secondary'
                                onClick={getTrackingNo}
                            >Generate</Button> */}
                    </div>
                    <div
                        style={{gridTemplateColumns: '320px 320px', gridTemplateRows: 'auto 1fr auto 1fr'}}
                        className='grd grd-gp-1 pad-1'>
                        <span className='sublabel'>Firstname:</span>
                        <CreatableSelect
                            isLoading={rider_fetch}
                            name="rider_id"
                            isClearable
                            isValidNewOption={() => false}
                            placeholder='Enter first name or mobile number to search'
                            options={riderOption}
                            onChange={e => riderHandler(e)}
                            disabled={disabled}
                            value={ riderForm.rider_id ? riderForm.rider_id : 0}
            
                        />
                        <span
                            style={{gridColumn: '2 / -1', gridRow: '1 / 2'}}
                            className='sublabel'>Lastname:</span>
                        <Input
                            css='pad-1 over-hid'
                            name="last_name"
                            readOnly={!isNaN(riderForm.rider_id)}
                            value={ riderForm.last_name ? riderForm.last_name : ''}
                            disabled={disabled}
                            onChange={e => setRiderForm({...riderForm, [e.target.name]: e.target.value})}
                        />
                        <span className='sublabel'>Contact #:</span>
                        <Input
                            css='pad-1 over-hid'
                            name="mobile_number"
                            readOnly={!isNaN(riderForm.rider_id)}
                            value={ riderForm.mobile_number ? riderForm.mobile_number : ''}
                            disabled={disabled}
                            onChange={e => setRiderForm({...riderForm, [e.target.name]: e.target.value})}
                        />
                        <span
                            style={{gridColumn: '2 / -1', gridRow: '3 / 4'}}
                            className='sublabel'>Provider:</span>
                       <CreatableSelect
                            isLoading={provider_fetch}
                            isValidNewOption={() => false}
                            name="rider_provider_id"
                            isClearable
                            placeholder={`Provider`}
                            readOnly={!isNaN(riderForm.rider_id)}
                            options= {providerOption}
                            onChange={e =>  providerHandler(e)}
                            disabled={disabled}
                            value={ riderForm.rider_provider_id ? riderForm.rider_provider_id : 0}
                        />
                    </div>
                </div>
            </div>
            <div className='grd grd-gp-1 gtc-fa'>
                <div
                    style={{gridTemplateColumns: '1fr 1fr', gridAutoRows: 'min-content'}}
                    className='grd grd-gp-1'>
                    {
                    selectedData.map((record, key) => {
                        return <div 
                        key={key} 
                        style={{order: key}}>{record['shopify_order_name']} {record['jobtype'] === 'delivery' ? record['title'] : record['total']}</div>
                    })
                    }
                </div>
                <div
                    style={{gridTemplateRows: 'auto 1fr 1fr'}}
                    className='grd grd-gp-1'
                >
                    <span className='asc jse header-2'>{`Selected item/s: ${selectedData.length}`}</span>
                    <ProcessBtn 
                        type='Advance Booking'
                        selectedData={selectedData}
                        setSelectedData={setSelectedData}
                        color='success'
                        riderForm={riderForm}
                        setRiderForm={setRiderForm}
                        getTrackingNo={getTrackingNo}
                    />
                    <ProcessBtn 
                        type='Assign to Rider'
                        selectedData={selectedData}
                        setSelectedData={setSelectedData}
                        color='secondary'
                        riderForm={riderForm}
                        setRiderForm={setRiderForm}
                    />
                </div>
            </div>
        </div>
    )
}

const mapStatetoProps = state => ({
    tracking_data: state.dispatchData.tracking_data.tracking_no,
    rider_data: state.riderData.available_riders,
    provider_data: state.riderData.rider_providers,
    rider_fetch: state.riderData.rider_fetch,
    provider_fetch: state.riderData.provider_fetch
})

export default connect(mapStatetoProps, { getTrackingNo, fetchAvailableRiders, fetchRiderProviders }) (ProcessWrap)
