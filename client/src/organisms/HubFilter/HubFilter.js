import React, { useState, useEffect, useRef } from 'react';
import Checkbox from '../../atoms/Checkbox/Checkbox';
import Badge from '../../molecules/Badge/Badge';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import './HubFilter.css';

function HubFilter(props) {
    // redux
    const {auth:{user}} = props;
    // props
    const { getHubID, maxBadgeCount, css } = props

    //state
    const [ once, setOnce] = useState();
    const [ hubs, setHubs ] = useState([]);
    const [ filter, setFilter ] = useState([]);
    const [ expand, setExpand] = useState(false);
    const [ count, setCount ] = useState();

    //ref
    const dropDown = useRef();

    //componentdidmount
    useEffect(() => {
        setOnce(true);
    }, [])

    useEffect(() => {
        const availhubs = user.user_info.hubs.map((hub, key) =>
            {
                return ({id: hub['user_hub']['hub_id'], name: hub.name, check: true})
            }
        )
        setHubs(availhubs);
    }, [user])


    useEffect(() => {
        if(once){
            let ar = [...hubs];
            const fil = ar.map((hub) => {
                return {id: hub.id, name: hub.name,}});
            setFilter(fil);
        }
    }, [once])


    useEffect(() => {
        if(once){
            if(filter.length >= 0){
                getHubID(() => {
                    let arrID = [];
                    arrID = filter.map((value) => {
                        return(value.id)
                    })
                    if(arrID.length > 0) {
                        return arrID;
                    } else {
                        return [0];
                    }
                })
                setCount(filter.length)
            }
        }
    }, [filter])

    const filterCheck = (param) => {
        const find = filter.findIndex(fil => fil.id === param.id);
        let newAr = [...filter];
        if(find === -1){
            newAr.push(param);
            setFilter(newAr);
        } else {
            newAr.splice(find, 1);
            setFilter(newAr)
        }
    }

    const filterHandler = (id) => {
        let arr = [...hubs];
        const index = arr.findIndex(hub => hub.id === id);
        arr[index].check = !arr[index].check;
        setHubs(arr);


    }

    return (
        <div
            ref={dropDown}
            tabIndex='0'
            onBlur={() => setExpand(false)}
            className={`grd hub_filter-wrap relative outline no-select ${css}`}>
            <div
                style={{gridTemplateColumns: `${maxBadgeCount < count ? '1fr auto min-content' : '1fr min-content'}`}}
                className='hub_filter-badge_wrap pad-1 grd bg-white br-2 grd-gp-1'>
                <div
                    className='grd grd-gp-1 grd-col aic jis' style={{gridAutoColumns: 'min-content'}} >
                    {
                        filter && filter.slice(0, maxBadgeCount).map((value, key) => {
                            return <Badge key={key} label={value.name} onClick={() => {filterHandler(value.id); filterCheck(value)}}/>
                        })
                    }
                </div>
                {
                    maxBadgeCount < count && !expand &&
                    <span className='asc text-ac point'>View More {count - maxBadgeCount}</span>
                }
                <div
                    onClick={() => setExpand(!expand)}
                    className='hub_filter-btn_wrap point grd aic jic'>
                    <FontAwesomeIcon icon={expand ? faCaretUp : faCaretDown} />
                </div>
            </div>
            {expand &&
            <div
                style={{width: '100%'}}
                className='absolute above-all hub_filter-dropdown_wrap'>
                {maxBadgeCount < count &&
                <div
                    className='grd grd-gp-1 hub_filter-dropdown grd-col mar-y-1 aic jis bg-white pad-2 above-all br-2' style={{gridAutoColumns: '1fr'}} >
                    {
                        filter && filter.map((value, key) => {
                            return <Badge key={key} label={value.name} onClick={() => {filterHandler(value.id); filterCheck(value)}}/>
                        })
                    }
                </div>
                }
                <div
                    className='grd grd-gp-1 hub_filter-dropdown over-hid over-y-auto mar-y-1 br-2 zoomIn animate-1 bg-white pad-2 above-all'
                    style={{gridTemplateColumns: '1fr 1fr 1fr', maxHeight: 300}} >
                    { hubs && hubs.map((hub, key) => {
                        return <Checkbox
                            label={hub.name}
                            key={key}
                            color='secondary'
                            checked={hub.check}
                            onChange={() => {filterHandler(hub.id); filterCheck(hub)}}
                            onMouseDown={(e) => e.preventDefault()}
                        />
                    })}
                </div>
            </div>
            }
        </div>
    )
}

const transferStatetoProps = state => ({
    auth:state.authData,
})

HubFilter.defaultProps = {
    maxBadgeCount: 2,
}

export default connect(transferStatetoProps)(HubFilter)