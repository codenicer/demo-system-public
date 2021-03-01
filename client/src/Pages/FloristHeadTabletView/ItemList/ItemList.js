import React, { useState, useEffect }from 'react'
import FilterBadge from '../components/FilterBadge'
import TableHeader from '../../../atoms/TableHeader/TableHeader'
import ItemListRow from '../components/ItemListRow'
import {filters} from '../FloristList/filter.json'
import {connect } from 'react-redux'
import socket from '../../../scripts/utils/socketConnect'
import {loadJobsTabletAll,updateJobsFromTablet,jobsTabletAllChangePAge,updateFromSocketAll} from '../../../mobile/floristjobs/florisjobsActions'
import {cancelAssignedTablet,completeJobTablet} from '../../../mobile/floristjobs/florisjobsActions'
import {loadFloristv2} from '../../../scripts/actions/floristActions'
import Virtualizer from '../../../atoms/Virtualizer/Virtualizer'
import Error from '../../../atoms/Error/Error'
import Button from '../../../atoms/Button/Button'
import Balloon from '../../../atoms/Balloon/Balloon'
import SearchModal from '../components/SearchModal';
import FilterDrawer from '../components/FilterDrawer'
import InfiniteLoader from "react-window-infinite-loader";
import moment from 'moment-timezone';
moment.tz.setDefault("Asia/Manila");
const header = ['Order ID', 'Product', 'Assigned to']


const ItemList = (props) => {

    // ================= STATES ======================
    // ================ STATES ======================

    // sample state for filter
    const [ sampleFilter, setSampleFilter ] = useState(filters)
    
    // sortable butto state
    const [ sortState, setSortState ] = useState({value:null,state:0});

    // new florist job from socket
    // const [floristJobSocket, setFloristJobSocket] = useState(null);

    // state for more filter
    const [ morefilter, setMorefilter ] = useState(null)

    
    const [deliverDate,setDeliveryDate] = useState(moment().format('YYYY-MM-DD'))

    // state for drawer show
    const [ drawer, setDrawer ] = useState(false)

    // page state
    const [page ,setPage] = useState({
        currPage:1,
        pageLoaded:[1]
    })
    //state for search filter 
    const [ searchFilter, setSearchFilter ] = useState(null)
    
    // state for loading on infitnite scroll
    const [ isLoading, setIsLoading ] = useState(false);

    const [jobFloristDidUpdate,setJobFloristDidUpdate] = useState(0)


    // ================ PROPS ======================
    // ================ PROPS ======================

    // FROM REDUX STATE  to props
    const {floristjob,count} = props

    // FROM REDUX ATIONS  to props
    const {loadJobsTabletAll, updateJobsFromTablet,jobsTabletAllChangePAge,updateFromSocketAll } = props


    useEffect(()=>{
        if(jobFloristDidUpdate !== 0){
            if(searchFilter  !== null) {
                 updateFromSocketAll({shopify_order_name:searchFilter})
                    
                }else{
                    let selectedFilter = []
                    sampleFilter.forEach(x=>{
                        if(x.active) selectedFilter.push(x.name)
                    })
                    updateFromSocketAll({delivery_time:selectedFilter,sortByTilte:sortState.value,more_filter:morefilter,page:page.currPage,delivery_date:deliverDate})
                   // fetchData(socketUpdate)
                   selectedFilter = null;
                }
            }
          
           pageReset()
    },[jobFloristDidUpdate])

    // ================= USE EFFECTS =======================
    // ================= USE EFFECTS =======================

    // const jobUpdateSocket = data => {
    //     setJobFloristDidUpdate(data)
    // }


    // details: load florist on did mount
    // useEffect(() => {
        // socket.on('FLORIST_ALL_DID_UPDATE', jobUpdateSocket)
        // return () => {
        //     socket.off('FLORIST_ALL_DID_UPDATE', jobUpdateSocket)
        // };
    // }, [])
    
    //details: update florist job when there is new florist job data from socket
    //   useEffect(()=>{
    //     updateJobsFromTablet(floristJobSocket,sampleFilter,sortState)
    // },[floristJobSocket])

       // details: load jobs depend on filter
    useEffect(()=>{
        let selectedFilter = []
        sampleFilter.forEach(x=>{
            if(x.active) selectedFilter.push(x.name)
        })
        loadJobsTabletAll({delivery_time:selectedFilter,sortByTilte:sortState.value,more_filter:morefilter,page:page.currPage,delivery_date:deliverDate})
        pageReset()
        selectedFilter = null;
    },[sampleFilter,sortState,morefilter,deliverDate])


    useEffect(() => {
        if(searchFilter){
            loadJobsTabletAll({shopify_order_name:searchFilter})
         
        }else{
            let selectedFilter = []
            sampleFilter.forEach(x=>{
                if(x.active) selectedFilter.push(x.name)
            })
            loadJobsTabletAll({delivery_time:selectedFilter,sortByTilte:sortState.value,more_filter:morefilter,page:page.currPage,delivery_date:deliverDate})
            selectedFilter = null;
        }
        pageReset()
    }, [searchFilter])


     // details: Change page or scroll down
     useEffect(()=>{
      
         if(!page.pageLoaded.includes(page.currPage)){
            let selectedFilter =[]
            sampleFilter.forEach(x=>{
                if(x.active) selectedFilter.push(x.name)
            })
            setIsLoading(true)
            jobsTabletAllChangePAge({delivery_time:selectedFilter,sortByTilte:sortState.value,more_filter:morefilter,page:page.currPage},
                page=>{addPage(page); setIsLoading(false)})
            selectedFilter = null;
        }
       
       
    },[page.currPage])

    // =======================FUNCTIONS ======================
    // =======================FUNCTIONS ======================

    //deatils : handle page reset
    function pageReset(){
        setPage({
            currPage:1,
            pageLoaded:[1]
        })
    }

    function handleDiliveryDateChange(e){
        setDeliveryDate(e.target.value)
        setDrawer(false)
    }

  
    
    //details : handle change page loaded 
    function addPage(newLoadedPage){
        let newPageState = {
            ...page,
            pageLoaded:[...page.pageLoaded,newLoadedPage]
        }
         setPage(newPageState)
        newPageState = null;
    }


     // details: handle filter change
     function sampleFilterHandler (key) {
        let x = [...sampleFilter];
        x[key] = {...x[key], active: !x[key].active};
        setSampleFilter(x);
        x = null;
    }

     // details: handle sort button change
    //  function sortBtnHandler (){
    //     if (sortState.state === 2) return setSortState({value:"",state:0});
    //     sortState.state === 0 ? setSortState({value:"ASC",state:1}) : setSortState({value:"DESC",state:2})
    // }

    // function for virtualize
    const item = ({index, style}) => {
        let content;
        if(!isItemLoaded(index)){
            content = <div className='size-100 bg-white grd aic jic label'>Loading...</div>
        } else {
            const job = floristjob[index];
            return <div style={style}>
                <ItemListRow 
                    key={job.job_florist_id} 
                    job={job}
                    css='_florist-head-view_item-list_template aic jic pad-y-1' />
            </div>
        }
        return <div style={style}>{content}</div>
    }

    // function for scroll loader
    const isItemLoaded = index => index < floristjob.length;


    return (
        <>
        <div className='_florist_head-item-list_wrap grd over-hid'>
            <div
                className='_florist_header-body-badge_wrap grd grd-col grd-gp-2 aic pad-y-1 jsc'>
                {
                    sampleFilter.map((value, key) => {
                        return <FilterBadge 
                            onClick={() => sampleFilterHandler(key)}
                            key={key} 
                            active={value.active}>{value.label}</FilterBadge>
                    })
                }   
                  {/* <SortButton onClick={sortBtnHandler} state={sortState.state}  /> */}
                 
                    <SearchModal setSearchFilter={setSearchFilter} />
                <div className='relative'>
                    <Button
                        css='space-no-wrap'
                        color='secondary' 
                        onClick={() => setDrawer(true)}>More filter</Button>
                    {morefilter !== null && <Balloon>{''}</Balloon>}
                </div>
                 
            </div>
            <TableHeader css='_florist-head-view_item-list_template aic jic width-100' >
                {
                    header.map((value, key) => {
                        return <div key={key}>{value}</div>
                    })
                }
            </TableHeader>
            {floristjob !== null && floristjob.length > 0 ?
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
                            itemSize={62}
                        >
                        {item}
                        </Virtualizer>
                    )}
                </InfiniteLoader>
                :
                <Error label='No records found' labelsize={12} iconsize={24} />
            }
        </div>
        {drawer &&
            <FilterDrawer
            
               active={morefilter}
               onClick={setMorefilter}
               clickClose={() => setDrawer(false)}
               dateFilter={handleDiliveryDateChange}
               />
       }
       </>
    )
}


const mapStateToProps = state => ({
    floristjob:state.m_floristjobData.florist_job.rows,
    count:state.m_floristjobData.florist_job.count,
    isfetching:state.webFetchData.isFetching
})

export default connect(mapStateToProps,
    {loadJobsTabletAll,updateJobsFromTablet,cancelAssignedTablet,updateFromSocketAll,jobsTabletAllChangePAge,completeJobTablet,loadFloristv2}
    ) (ItemList)
