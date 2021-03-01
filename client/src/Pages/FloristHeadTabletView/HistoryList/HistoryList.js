import React, { useEffect, useState } from 'react';
import TableHeader from '../../../atoms/TableHeader/TableHeader';
import Virtualizer from '../../../atoms/Virtualizer/Virtualizer';
import InfiniteLoader from 'react-window-infinite-loader';
import Error from '../../../atoms/Error/Error';
import HistoryRow from '../components/HistoryRow';
import FilterBadge from '../components/FilterBadge';

// actions
import { connect } from 'react-redux';
import { loadJobsTabletHistry, jobsTabletHistoryChangePAge } from '../../../mobile/floristjobs/florisjobsActions';

// package
import moment from 'moment-timezone';

//config
import {filters} from '../FloristList/filter.json'
import SearchModal from '../components/SearchModal';
import DeliveryDateModal from '../components/DeliveryDateModal';

moment.tz.setDefault("Asia/Manila");
const header = ['Order ID', 'Product', 'Completed by']   

const HistoryList = (props) => {
    //========STATE========
    //========STATE========

    // state for delivery date filter
    const [ dateFilter, setDateFilter ] = useState(moment().format('YYYY-MM-DD'))
    // const [ dateFilter, setDateFilter ] = useState(moment().format('2019-10-01'))

    // state for loading on infitnite scroll
    const [ isLoading, setIsLoading ] = useState(false);

    // state for current page and loaded page
    const [page ,setPage] = useState({
        currPage:1,
        pageLoaded:[1]
    })

    //state for delivery time filters
    const [ batchFilter, setBatchFilter ] = useState(filters)

    //state for seach filter
    const [ searchFilter, setSearchFilter ] = useState(null);

    //===========PROPS=========
    //===========PROPS=========

    // props for redux
    const { loadJobsTabletHistry, floristjob, count, jobsTabletHistoryChangePAge } = props;

    //========USE EFFECT========
    //========USE EFFECT========

    // fetch on when dateFilter, batchFilter change
    useEffect(() => {
        let selectedFilter =[]
        batchFilter.forEach(x=>{
            if(x.active) selectedFilter.push(x.name)
        })
        setIsLoading(true);
        loadJobsTabletHistry({delivery_time: selectedFilter, delivery_date: dateFilter, page: page.currPage})
        pageReset()
        selectedFilter = null
    }, [dateFilter, batchFilter])


    // fetch when search filter used and removed
    useEffect(() => {
        if(searchFilter){
            loadJobsTabletHistry({shopify_order_name: searchFilter})
        } else {
            let selectedFilter = []
            batchFilter.forEach(x=>{
                if(x.active) selectedFilter.push(x.name)
            })
            loadJobsTabletHistry({delivery_time: selectedFilter, delivery_date: dateFilter, page: page.currPage})
            selectedFilter = null
        }
        pageReset()
    }, [searchFilter])

    // fetch on scroll down when page changes
    useEffect(() => {
        if(!page.pageLoaded.includes(page.currPage)){
            let selectedFilter =[]
            batchFilter.forEach(x=>{
                if(x.active) selectedFilter.push(x.name)
            })
            setIsLoading(true);
            jobsTabletHistoryChangePAge({delivery_time:selectedFilter, delivery_date: dateFilter, page: page.currPage}, 
                page => {addPage(page); setIsLoading(false)})
            selectedFilter = null
        }
    }, [page.currPage])

    //==========FUNCTIONS===========
    //==========FUNCTIONS===========

    //deatils : handle page reset
    function pageReset(){
        setPage({
            currPage:1,
            pageLoaded:[1]
        })
    }

    // details: handle filter change
    function batchFilterHandler (key) {
        let x = [...batchFilter];
        x[key] = {...x[key], active: !x[key].active};
        setBatchFilter(x);
        x = null
    }
    
    // function for changing state page
    const addPage = (newPage) => {
        const newObjPage = {
            ...page,
            pageLoaded: [...page.pageLoaded, newPage]
        }
        setPage(newObjPage)
    }

    // function of item for virtualized
    const item = ({index, style}) => {
        let content;
        if(!isItemLoaded(index)){
            content = <div className='size-100 bg-white grd aic jic label'>Loading...</div>
        } else {
            const data = floristjob[index];
            content = <HistoryRow data={data} />
        }
        return <div style={style}>{content}</div>
    }

     // function for lazy loading
     const isItemLoaded = index => index < floristjob.length;

    return (
        <div className='grd _florist_head-history-list_wrap'>
            <div className='_florist_header-body-badge_wrap grd grd-col grd-gp-2 aic pad-y-1 jsc'>
                {
                    batchFilter.map((value, key ) => {
                        return <FilterBadge
                            onClick={() => batchFilterHandler(key)}
                            key={key}
                            active={value.active}
                        >{value.label}</FilterBadge>
                    })
                }
                <SearchModal setSearchFilter={setSearchFilter} />
                <DeliveryDateModal dateFilter={e => setDateFilter(e.target.value)}/>
            </div>
            <TableHeader css='grd grd-col grd-col-f aic jic'>
                {
                    header.map((header, key) => {
                        return <div key={key}>{header}</div>
                    })
                }
            </TableHeader>
            <div>
                {floristjob.length > 0 ?
                    <InfiniteLoader
                        isItemLoaded={isItemLoaded}
                        itemCount={floristjob.length !== count ? floristjob.length + 1 : floristjob.length}
                        loadMoreItems={isLoading ? () =>  {} : () => setPage({...page, currPage: page.currPage+1})}
                    >
                        {({ onItemsRendered, ref }) => (
                            <Virtualizer
                                myref={ref}
                                onItemsRendered={onItemsRendered}
                                itemCount={floristjob.length !== count ? floristjob.length + 1 : floristjob.length}
                                itemSize={63}
                            >
                            {item}
                            </Virtualizer>
                        )}
                    </InfiniteLoader>
                    :
                    <Error label='No records found' labelsize={12} iconsize={24} />
                }
            </div>
        </div>
    )
}

const mapStateToProps = state => ({
    floristjob:state.m_floristjobData.florist_job.rows,
    count:state.m_floristjobData.florist_job.count
})

export default connect(mapStateToProps,{loadJobsTabletHistry, jobsTabletHistoryChangePAge})(HistoryList)
