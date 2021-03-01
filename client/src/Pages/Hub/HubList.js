import React, { useEffect, useState } from 'react'
import Container from '../../atoms/Container/Container'
import HubCaption from './HubCaption/HubCaption'
import HubHeader from './HubHeader/HubHeader'
import HubRow from './HubRow/HubRow'
import { connect } from 'react-redux'
import { fetchHubs } from '../../scripts/actions/hubActions'
import Pagination from '../../atoms/Pagination/Pagination'

const HubTable = (props) => {
  const {
    hub: { hub_list, hubs },
    fetchHubs,
  } = props
  const [hubsList, setHubs] = useState([])
  const [hubcount, setHubCount] = useState(0)
  const [params, setParams] = useState({
    page: 1,
    pageSize: 0,
    filterall: null,
  })

  useEffect(() => {
    if (params.pageSize) {
      fetchHubs(params)
    }
  }, [params])

  useEffect(() => {
    if (hubs.length > 0) {
      fetchHubs(params)
    }
  }, [hubs])

  useEffect(() => {
    setParams({
      ...params,
      pageSize: 15, //by default
    })
  }, [])

  useEffect(() => {
    setHubs(hub_list.rows)
    setHubCount(hub_list.count)
  }, [hub_list])
  //get selected page
  const PageClick = (x) => {
    let retpage = x()
    setParams({
      ...params,
      page: retpage,
    })
  }

  return (
    <Container css="relative over-hid grd gtr-af slideInRight animate-2">
      <div>
        <HubCaption />
        <HubHeader />
      </div>
      <div className="over-y-auto scroll">
        {hubsList &&
          hubsList.map((hub, key) => {
            return <HubRow key={key} data={hub} />
          })}
      </div>
      <div className="grd">
        <Pagination
          selPage={params.page}
          pageClick={PageClick}
          count={hubcount}
          rows={params.pageSize}
        />
      </div>
    </Container>
  )
}

const transferStatetoProps = (state) => ({
  hub: state.hubData,
  isFetching: state.webFetchData.isFetching,
})

export default connect(transferStatetoProps, { fetchHubs })(HubTable)
