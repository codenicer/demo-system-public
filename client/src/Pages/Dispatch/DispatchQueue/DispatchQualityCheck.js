import React, {useEffect, useState} from 'react';
import { connect } from "react-redux";
import Page from '../../../atoms/Page/Page';
import Button from '../../../atoms/Button/Button';
import AssemblerJobItem from '../../AssemblerJob/AssemblerJobPage/AssemblerJobItem/AssemblerJobItem';
import { fetchOrderByOrderName } from '../../../scripts/actions/ordersActions';
import Checkbox from '../../../atoms/Checkbox/Checkbox';
import _ from 'lodash';
import {toast} from 'react-toastify';


const DispatchQualityCheck = (props) => {

    const [ qcOrder, setQcOrder ] = useState(null);
    const [ checkList , setCheckList ] = useState({});
    const {fetchOrderByOrderName} = props;
    const {clickClose,onQualityCheck, setQualityCheck, data} = props;
    const { orderData:{order}} = props;
    console.log('DATA QUALITY CHECK', data);
    useEffect(()=>{
        if(data['shopify_order_name']){
            setCheckList({})
            fetchOrderByOrderName(data['shopify_order_name']);
        }

    }, [data]);

    useEffect(()=> {
        setQcOrder(order);

        if(order && order.length){
            const {order_id, order_items} = order[0];
            let obj = {}
            order_items.forEach((item) => {
                obj = {
                    ...obj,
                    [item.order_item_id]: false
                }
            })

            setCheckList({
                ...obj,
                [`${order_id}-DAR`]: false,
                [`${order_id}-MSG`]: false
            })
        }






    }, [order]);

    function checkAssembly(){

        let isOK = true;
        //onQualityCheck
        console.log('checkList', checkList);
        _.each(checkList, item=> {

            if(item ===  false){
                isOK = false;
                toast.error('Please make sure that all items are ready and properly accounted for.');

                return false;
            }

        });

        if(isOK){
            setQualityCheck(qcOrder[0]['order_id']);
            setCheckList({});
        }



        return true;


    }

    function setCheckbox(e){
        console.log('setCheckbox', e.target.value);
        console.log('setCheckbox selected', e.target.checked);
      //  if(e.target.checked){
            setCheckList({
                ...checkList,
                [e.target.value]: !checkList[e.target.value]
            })
      //  }
    }




    //console.log('this:', qcOrder);
    return (

        <Page
            clickClose={clickClose}
            >
            <div 
                style={{gridTemplateRows: 'auto auto 1fr'}}
                className='pad-1 bg-white br-2 grd'>
                <div className='mar-y-2 header'>Quality Check</div>

                { qcOrder !== null ?
                    <>
                    <div
                        style={{gridTemplateColumns: '1fr auto auto'}}
                        className='grd pad-x-2 grd-gp-1'>



                        <span className='header-2'>{qcOrder[0]['shopify_order_name']}</span>
                        <Button
                            color='warning'
                            onClick={clickClose}
                        >
                            Cancel
                        </Button>  <Button
                            color='success'
                            onClick={checkAssembly}
                        >
                            Submit
                        </Button>
                        { qcOrder !== null  ?
                        <span className='header-3 pa-x-1'>{  qcOrder[0]['order_items'].length > 1? `Items:${qcOrder[0]['order_items'].length}`: `Item:${qcOrder[0]['order_items'].length}`  }</span>
                            :''}
                    </div>
                    < div
                    style = {{padding: '0 10%'}}
                    className='over-y-auto scroll'
                    >
                    <div
                    className="job_page-wrap grd grd-gp-2 aic"
                    style={{ gridTemplateColumns: "auto 1fr auto" }}
                    >
                        {qcOrder ?
                    <Checkbox
                    color="secondary"
                    value={`${qcOrder[0]['order_id']}-DAR`}
                    onChange={setCheckbox}
                    checked={checkList[`${qcOrder[0]['order_id']}-DAR`]?checkList[`${qcOrder[0]['order_id']}-DAR`]:false}
                    />
                        :''}
                    <span className="label">DAR</span>
                    <Button
                    color="neutral"
                    css="jse"
                    >
                    Reprint
                    </Button>
                    </div>

                    <div
                    className="grd grd-col grd-gp-2 aic"
                    style={{gridTemplateColumns: "auto 1fr auto"}}
                    >
                        {qcOrder !== null?
                    <Checkbox
                    color="secondary"
                    value={`${qcOrder[0]['order_id']}-MSG`}
                    onChange={setCheckbox}
                    checked={checkList[`${qcOrder[0]['order_id']}-MSG`]?checkList[`${qcOrder[0]['order_id']}-MSG`]:false}
                    />
                        :''}
                    <span className="label">Message</span>
                    <Button
                    color="neutral"
                    css="jse"
                    >
                    Reprint
                    </Button>
                    </div>

                        { qcOrder !== null && qcOrder[0].order_items.map((row,i) =>
                    <AssemblerJobItem
                    type='qualityCheck'
                    data={row}
                    key={i}
                    onChange={setCheckbox}
                    />


                        )}</div>
                        </>
                    :''
                }
            </div>
        </Page>
    )
}

const mapStatetoProps = state => ({
    orderData: state.orderData,

});

export default connect(
    mapStatetoProps,
    {
        fetchOrderByOrderName
    }
)(DispatchQualityCheck);
