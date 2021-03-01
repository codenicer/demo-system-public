import React, { useState, useEffect } from 'react';
import Container from "../../atoms/Container/Container";
import Button from "../../atoms/Button/Button";
import TableHeader from "../../atoms/TableHeader/TableHeader";
import RiderProviderTableRow from './RiderProviderTablerow';
import Modal from '../../template/Modal/Modal';
import Input from '../../atoms/Input/Input';
import {connect} from 'react-redux';
import { fetchRiderProviders, addRiderProvider, updateRiderProvider } from "../../scripts/actions/riderProviderActions";
import { toast } from "react-toastify";
import {Route,Switch} from 'react-router-dom'
import './RiderProviderList.css';

const colHeaders = ['ID','Provider Name', 'Address', 'Date Created', 'Action'];

const AllProviders = (props) => {

    const { fetchRiderProviders, riderProviderData: {rider_providers}, addRiderProvider, updateRiderProvider, match, history } = props;
    
    const [riderProviderForm, setRiderProviderForm] = useState({
        name: '',
        address: ''
      });
    
    const [ tableData, setTableData ] = useState([]);
    
    useEffect(()=>{
        fetchData();
    },[]);

    useEffect(()=>{
        console.log(rider_providers, 'rider providers data')
        setTableData([...rider_providers]);
        console.log('rider change')
    },[rider_providers]);


    const fetchData = () => {
        fetchRiderProviders();
        console.log('fetch fetch')
    }

    const modalReset = () => {
        history.push(`${match.path}`)
    }

    const formReset = () => {
        setRiderProviderForm({name: '', address: ''}); 
    }

    const handleChange = e => {
        setRiderProviderForm({ ...riderProviderForm, [e.target.name]: e.target.value });
      }

    const addProviderHandler = () => {
        addRiderProvider(riderProviderForm, msg => {
            toast.success(msg);
        })
        modalReset();
        formReset();
    }

    const editProviderHandler = () => {
        updateRiderProvider(riderProviderForm, msg => {
            toast.success(msg);
        });
        modalReset();
        formReset();
    }

    console.log(match, 'match')
    return (
        <>
        <Container
            css='over-hid grd slideInRight animate-2 gtr-af'>
            <div>
                <div className='grd grd-gp-2 pad-1 gtc-af'>
                    <span className='header'>Rider Provider List</span>
                    <Button 
                        css='jss' 
                        color='secondary' 
                        onClick={() => {
                            formReset(); 
                            history.push(`${match.path}/create`)
                            }
                        }
                            >Add New Provider
                    </Button>
                </div>
                <TableHeader 
                    csswrap='width-100'
                    css='rider-provider_list-template jic aic'>
                    {
                        colHeaders.map((x, y) => {
                            return <div key={y}>{x}</div>
                        })
                    }
                </TableHeader>
            </div>
            <div className='over-y-auto scroll'>
                {
                    tableData.length !== 0 && tableData.map((record, key) => {
                    return <RiderProviderTableRow
                        css='rider-provider_list-template jic aic'
                        key={key}
                        data={record}
                        onClick={() =>  {
                            const {rider_provider_id, name, address} = record;
                            setRiderProviderForm({
                                rider_provider_id,
                                name,
                                address
                            })
                            history.push(`${match.path}/update/${rider_provider_id}`)
                        }}
                    />
                    })
                }

            </div>
        </Container>
        <Switch>
            <Route path={`${match.path}/create`} render={() => {
                return (<Modal
                    width='400px' 
                    clickClose={() => modalReset()}
                    clickCancel={() => modalReset()}
                    clickSubmit={() => addProviderHandler()}
                    disabled={riderProviderForm.name === '' || riderProviderForm.address === '' ? true : false}
                    label='Add Rider Provider'
                    submitlabel='Add'
                    submitcolor='success'
                    >
                    <span className="label">Provider name:</span>
                    <Input
                        css="pad-1"
                        type='search'
                        name="name"
                        value={riderProviderForm.name && riderProviderForm.name}
                        onChange={e => handleChange(e)}
                    />
                    <span className="label">Address:</span>
                    <Input
                        css="pad-1"
                        name="address"
                        type='search'
                        value={riderProviderForm.address && riderProviderForm.address}
                        onChange={e => handleChange(e)}
                    />
                </Modal>)
            }} exact/>
            <Route path={`${match.path}/update/:id`} render={() => {
                return (<Modal
                    width='400px' 
                    clickClose={() => modalReset()}
                    clickCancel={() => modalReset()}
                    clickSubmit={() => editProviderHandler()}
                    disabled={riderProviderForm.name === '' || riderProviderForm.address === '' ? true : false}
                    label='Edit Rider Provider'
                    submitlabel='Edit'
                    submitcolor='success'
                    >
                    <span className="label">Provider name:</span>
                    <Input
                        css="pad-1"
                        type='search'
                        name="name"
                        value={riderProviderForm.name && riderProviderForm.name}
                        onChange={e => handleChange(e)}
                    />
                    <span className="label">Address:</span>
                    <Input
                        css="pad-1"
                        name="address"
                        type='search'
                        value={riderProviderForm.address && riderProviderForm.address}
                        onChange={e => handleChange(e)}
                    />
                </Modal>)
            }}/>
        </Switch>
        </>
    );
};

const MapStateToProps = state => ({
    userData:state.userData,
    isFetching:state.webFetchData.isFetching,
    riderProviderData:state.riderProviderData
})

export default connect(MapStateToProps,{fetchRiderProviders, addRiderProvider, updateRiderProvider})(AllProviders);