import React, { useState, useEffect } from 'react'
import Button from '../../../atoms/Button/Button'
import HeadViewItem from '../components/HeadViewItem'
import Balloon from '../../../atoms/Balloon/Balloon'
import FilterDrawer from '../components/FilterDrawer'
import Virtualizer from '../../../atoms/Virtualizer/Virtualizer'
import Error from '../../../atoms/Error/Error'
import FilterBadge from '../components/FilterBadge'
import FloristHeadUserCard from '../components/FloristHeadUserCard'
import ModalHoldMobile from '../../ModalHoldMobile/ModalHoldMobile'
import ConfirmationModal from '../../ConfirmationModal/ConfirmationModal'
import { connect } from 'react-redux'
import {
  loadFloristv2,
  updateFloristv2,
} from '../../../scripts/actions/floristActions'
import {
  loadJobsTablet,
  assignJobTablet,
  updateJobsFromTablet,
  holdJobTablet,
  handleLoadJobChangePage,
  socketUpdate,
  updateTableJobListv3,
} from '../../../mobile/floristjobs/florisjobsActions'
import { toast } from 'react-toastify'
import { filters } from './filter.json'
// import socket from '../../../scripts/utils/socketConnect'
import config from '../../../config.json'
import InfiniteLoader from 'react-window-infinite-loader'
import SearchModal from '../components/SearchModal'
import moment from 'moment-timezone'
moment.tz.setDefault('Asia/Manila')
const pagesize = 15

const FloristList = (props) => {
  // ================= STATES ======================
  // ================ STATES ======================
  const [selJob, setSelJob] = useState([])

  //state for selected florist
  const [selectedFlorist, setSelectedFlorist] = useState(null)

  // sortable butto state
  const [sortState, setSortState] = useState({ value: null, state: 0 })

  // hold reason state
  const [holdReason, setHoldReason] = useState(null)

  // sample state for filter
  const [sampleFilter, setSampleFilter] = useState(filters)

  // // new florist data from  socket
  // const [floristSocket,setFloristSocket] = useState(null)

  // new florist job from socket
  // const [floristJobSocket,setFloristJobSocket] = useState(null)

  // state for more filter drawer
  const [morefilter, setMorefilter] = useState(null)

  // state for product filter
  const [productFilter, setProductFilter] = useState(null)

  //state for search filter
  const [searchFilter, setSearchFilter] = useState(null)

  const [deliverDate, setDeliveryDate] = useState(moment().format('YYYY-MM-DD'))

  const [page, setPage] = useState({
    currPage: 1,
    pageLoaded: [1],
  })

  // hold modal state
  const [hold, setHold] = useState(false)
  const [confirm, setConfirm] = useState(false)

  //filter drawer state
  const [drawer, setDrawer] = useState(false)

  // state for loading on infitnite scroll
  const [isLoading, setIsLoading] = useState(false)

  // ================ PROPS ======================
  // ================ PROPS ======================

  // FROM REDUX STATE  to props
  const { florists, floristjob, count } = props

  // FROM REDUX ATIONS  to props
  const {
    assignJobTablet,
    loadJobsTablet,
    holdJobTablet,
    loadFloristv2,
    updateFloristv2,
    handleLoadJobChangePage,
    updateTableJobListv3,
    socketUpdate,
  } = props

  // get florst hold reason on config file
  const { floristDisposition } = config

  // ================= USE EFFECTS =======================
  // ================= USE EFFECTS =======================

  // functions for socket
  const floristUpdateSocket = (data) => {
    console.log('floristUpdateSocket')
    updateFloristv2(data)
  }

  const jobUpdateSocket = (data) => {
    console.log('jobUpdateSocket', data)
    updateTableJobListv3(data)
    // setJobFloristDidUpdate(data.length)
  }

  // details: load florist on did mount
  useEffect(() => {
    //socket tuning needed an update
    // socket.on('FLORIST_V2_DID_UPDATE', floristUpdateSocket)
    // socket.on('TABLET_FLORIST_JOB_UPDATE', jobUpdateSocket)
    loadFloristv2()
    // return () => {
    //     socket.off('FLORIST_V2_DID_UPDATE', floristUpdateSocket)
    //     socket.off('JOBFLORIST_UPDATE', jobUpdateSocket)
    // }
  }, [])

  //details: update florist when there is new florist data from socket
  // useEffect(()=>{
  //     updateFloristv2(floristSocket)
  // },[floristSocket])

  // details: load jobs depend on filter
  useEffect(() => {
    fetchData(loadJobsTablet)

    pageReset()
  }, [sampleFilter, sortState, morefilter, productFilter, deliverDate])

  // details: clear selected florist when there is no selected job
  useEffect(() => {
    if (selJob.length === 0) {
      setSelectedFlorist(null)
      resetHoldModalState()
    }
  }, [selJob])

  // details: Change page or scroll down
  useEffect(() => {
    if (!page.pageLoaded.includes(page.currPage)) {
      setIsLoading(true)
      fetchData(handleLoadJobChangePage, { page: page.currPage }, (page) => {
        addPage(page)
        setIsLoading(false)
      })
    }
  }, [page.currPage])

  //test useeefect to console the changes on search filter
  useEffect(() => {
    if (searchFilter) {
      loadJobsTablet({
        shopify_order_name: searchFilter,
      })
    } else {
      fetchData(loadJobsTablet)
    }
    pageReset()
  }, [searchFilter])

  // =======================FUNCTIONS ======================
  // =======================FUNCTIONS ======================

  function fetchData(action, params, callback) {
    let selectedFilter = []

    sampleFilter.forEach((x) => {
      if (x.active) selectedFilter.push(x.name)
    })

    let defaulparams = {
      ...params,
      delivery_time: selectedFilter,
      sortByTilte: sortState.value,
      more_filter: morefilter,
      title: productFilter,
      delivery_date: deliverDate,
    }

    action(defaulparams, callback && callback)
    selectedFilter = null
    defaulparams = null
  }

  //handle select all job
  function selectAllJob() {
    const selected_ids = floristjob.map((x) => x.order_item_id)
    setSelJob(selected_ids)
  }

  // delivery date change handle
  function handleDiliveryDateChange(e) {
    setDeliveryDate(e.target.value)
    setDrawer(false)
  }

  //deatils : handle page reset
  function pageReset() {
    setPage({
      currPage: 1,
      pageLoaded: [1],
    })
  }

  //details : handle change page loaded
  function addPage(newLoadedPage) {
    let newPageState = {
      ...page,
      pageLoaded: [...page.pageLoaded, newLoadedPage],
    }
    setPage(newPageState)

    newPageState = null
  }

  // details: handle filter change
  function sampleFilterHandler(key) {
    let x = [...sampleFilter]
    x[key] = { ...x[key], active: !x[key].active }
    setSampleFilter(x)
    x = null
  }

  // details: handle selected job change
  function selectHandler(id) {
    let selected_data = selJob
    !selected_data.includes(id)
      ? (selected_data = [...selected_data, id])
      : (selected_data = selected_data.filter((x) => x !== id))

    setSelJob(selected_data)
    selected_data = null
  }

  //details: handle selecte florist change
  function handleSelFlorist(florist) {
    selectedFlorist !== null && selectedFlorist.user_id === florist.user_id
      ? setSelectedFlorist(null)
      : setSelectedFlorist(florist)
  }

  // details: handle sort button change
  // function searchCancel (){

  // if (sortState.state === 2) return setSortState({value:"",state:0});
  // sortState.state === 0 ? setSortState({value:"ASC",state:1}) : setSortState({value:"DESC",state:2})
  // }

  //details:  handle clear all selected
  function clearSelected() {
    setSelJob([])
    setSelectedFlorist(null)
  }

  //details: check if job is compenent state are active/selected
  function setActive(id) {
    return selJob.includes(id)
  }

  //details: check if florist component state are active/selected
  function setActiveFlorist(id) {
    return selectedFlorist && selectedFlorist.user_id === id
  }

  function clearFilterHadler() {
    setProductFilter(null)
    clearSelected()
  }

  //details: reset all hold modal state to default
  function resetHoldModalState() {
    setConfirm(false)
    setHold(false)
    setHoldReason(null)
  }

  // ================ FUNCTIONS CONNECTED TO REDUX ACTIONS =================
  // ================ FUNCTIONS CONNECTED TO REDUX ACTIONS =================

  //details: handle submit assign
  function handleSubmit() {
    if (selectedFlorist === null)
      return toast.error('Please select a florist first.')
    assignJobTablet(selJob, selectedFlorist.user_id, (type, msg) => {
      clearSelected()
      toast[type](msg)
    })
  }

  //details: handle hold submit
  function handleHoldSubmit() {
    let toHold = { order_item_id_list: selJob, hold_info: holdReason }
    holdJobTablet(toHold, (type, msg) => {
      clearSelected()
      toast[type](msg)
    })
    toHold = null
  }

  const item = ({ index, style }) => {
    let content
    if (!isItemLoaded(index)) {
      content = (
        <div className="size-100 bg-white grd aic jic label">Loading...</div>
      )
    } else {
      const data = floristjob[index]
      content = (
        <HeadViewItem
          selected={setActive(data.order_item_id)}
          data={data}
          onClick={() => selectHandler(data.order_item_id)}
          onHold={setProductFilter}
        />
      )
    }
    return <div style={style}>{content}</div>
  }

  // function for lazy loading
  const isItemLoaded = (index) => index < floristjob.length

  return (
    <>
      <div className="grd _florist_header-view-body grd-gp-1 pad-x-1 over-hid relative">
        {selJob.length !== 0 && (
          <div
            style={{ left: 0, top: 0, zIndex: 1, height: 60, width: '90%' }}
            className="fixed pad-x-1 grd aic br-2 bg-white shadow slideInDown animate-2"
          >
            <div className="grd _florist_header-view_action-modal_label-wrap grd-gp-1">
              <span className="asc header-3">Selected: {selJob.length}</span>
              <span className="italic header-3 asc">
                Assigned to:{' '}
                {selectedFlorist
                  ? selectedFlorist.first_name + ' ' + selectedFlorist.last_name
                  : ''}
              </span>
              <Button onClick={() => clearSelected()} color="primary">
                Clear
              </Button>
            </div>
            <div className="grd grd-col grd-col-f grd-gp-1">
              <Button onClick={() => setHold(true)} color="warning">
                Hold
              </Button>
              <Button
                disabled={selectedFlorist === null}
                onClick={handleSubmit}
                color="success"
              >
                Assign
              </Button>
            </div>
          </div>
        )}
        <div className="_florist_header-body-badge_wrap grd grd-col grd-gp-2 jsc aic">
          {sampleFilter.map((value, key) => {
            return (
              <FilterBadge
                onClick={() => sampleFilterHandler(key)}
                key={key}
                active={value.active}
              >
                {value.label}
              </FilterBadge>
            )
          })}
          {productFilter ? (
            <Button onClick={selectAllJob}>Select All</Button>
          ) : (
            <SearchModal setSearchFilter={setSearchFilter} />
          )}
          {/* <SortButton onClick={sortBtnHandler} state={sortState.state}  /> */}
          {!productFilter ? (
            <div className="relative">
              <Button
                css="space-no-wrap"
                color="secondary"
                onClick={() => setDrawer(true)}
              >
                More filter
              </Button>
              {morefilter !== null && <Balloon>{''}</Balloon>}
            </div>
          ) : (
            <Button
              css="space-no-wrap"
              color="warning"
              onClick={clearFilterHadler}
            >
              Clear Filter
            </Button>
          )}
        </div>
        <div>
          <div style={{ float: 'right' }} className="label pad-y-1">
            Total Item/s: {count}
          </div>
          {floristjob !== null && floristjob.length > 0 ? (
            <InfiniteLoader
              isItemLoaded={isItemLoaded}
              itemCount={
                floristjob.length !== count
                  ? floristjob.length + 1
                  : floristjob.length
              }
              loadMoreItems={
                isLoading
                  ? () => {}
                  : () => setPage({ ...page, currPage: page.currPage + 1 })
              }
            >
              {({ onItemsRendered, ref }) => (
                <Virtualizer
                  myref={ref}
                  onItemsRendered={onItemsRendered}
                  itemCount={
                    floristjob.length !== count
                      ? floristjob.length + 1
                      : floristjob.length
                  }
                  itemSize={105}
                >
                  {item}
                </Virtualizer>
              )}
            </InfiniteLoader>
          ) : (
            <Error label="No records found" labelsize={12} iconsize={24} />
          )}
        </div>
        <div className="_florist_header-body-user_wrap grd grd-gp-1 aic over-y-auto scroll">
          {florists !== null &&
            florists.length !== 0 &&
            florists.map((florist) => {
              return (
                <FloristHeadUserCard
                  head={true}
                  active={setActiveFlorist(florist.user_info.user_id)}
                  onClick={() => handleSelFlorist(florist.user_info)}
                  count={selJob.length}
                  key={florist.user_info.user_id}
                  jobs={florist.jobs}
                  data={florist.user_info}
                />
              )
            })}
        </div>
      </div>
      {hold && (
        <ModalHoldMobile
          clickClose={() => setHold(false)}
          clickBack={() => setHold(false)}
        >
          {floristDisposition.map((value) => {
            return (
              <Button
                height="42px"
                color="warning"
                onClick={() => {
                  setHoldReason(value)
                  setConfirm(true)
                }}
                key={value.id}
              >
                {value['name']}
              </Button>
            )
          })}
        </ModalHoldMobile>
      )}
      {confirm && (
        <ConfirmationModal
          mobile={true}
          label="Are you sure you want to hold the item/s ?"
          submitlabel="Yes, hold the item/s"
          submitcolor="warning"
          clickSubmit={handleHoldSubmit}
          clickCancel={resetHoldModalState}
        />
      )}
      {drawer && (
        <FilterDrawer
          active={morefilter}
          onClick={setMorefilter}
          clickClose={() => setDrawer(false)}
          dateFilter={handleDiliveryDateChange}
        />
      )}
    </>
  )
}

const mapStateToProps = (state) => ({
  floristjob: state.m_floristjobData.florist_job.rows,
  count: state.m_floristjobData.florist_job.count,
  florists: state.floristData.florist,
  isfetching: state.webFetchData.isFetching,
})

export default connect(mapStateToProps, {
  loadFloristv2,
  assignJobTablet,
  loadJobsTablet,
  holdJobTablet,
  updateJobsFromTablet,
  handleLoadJobChangePage,
  socketUpdate,
  updateTableJobListv3,
  updateFloristv2,
})(FloristList)
