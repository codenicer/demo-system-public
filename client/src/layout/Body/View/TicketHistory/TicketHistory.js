import React, { useState, useEffect } from 'react'
import Container from '../../../../atoms/Container/Container'
import Input from '../../../../atoms/Input/Input'
import HubFilter from '../../../../organisms/HubFilter/HubFilter'
import Pagination from '../../../../atoms/Pagination/Pagination'
import Select from '../../../../atoms/Select2/Select'
import TableHeader from '../../../../atoms/TableHeader/TableHeader'
import TicketHistoryRow from './TicketHistoryRow/TicketHistoryRow'
import {
  loadTicketHistory,
  changePageTicketHistory,
  fitlerTextOnchangeOnHistory,
  updateTicketsHistory,
} from '../../../../scripts/actions/ticketsActions'
import { connect } from 'react-redux'
import socket from '../../../../scripts/utils/socketConnect'

import filter_config from '../../../../config.json'

const historyHeader = [
  'Ticket #',
  'Order ID',
  'Subject',
  'Status',
  'Created',
  'Last Updated',
]

const pagesize = 15

function TicketHistory(props) {
  //redux
  const { closed_tickets, closed_ticket_count } = props.ticket

  const {
    loadTicketHistory,
    changePageTicketHistory,
    fitlerTextOnchangeOnHistory,
    updateTicketsHistory,
  } = props

  // filter state

  // const [updateData ,setUpdateData] = useState([])

  const [page, setPage] = useState(1)

  const [hub, setHub] = useState(-1)

  const [textFilter, setTextFilter] = useState('')

  const [dateFilter, setDateFilter] = useState('')

  const [dispositionFilter, setDispositionFilter] = useState('')

  //config
  const { disposition } = filter_config

  // ticket status 2 = closed, 3 = resolved
  const [status, setStatus] = useState('')

  // const ticketHistoryDidUpdate = data => setUpdateData(data)

  //Deleted on socket tuning.
  // useEffect(()=>{

  //     socket.on('CLOSED_TICKET_DID_UPDATE',ticketHistoryDidUpdate)

  //     return () =>  socket.off('CLOSED_TICKET_DID_UPDATE',ticketHistoryDidUpdate)
  // },[])

  // useEffect(()=>{
  //     updateTicketsHistory(updateData,{page,status,dateFilter,hub,textFilter,dispositionFilter})
  // },[updateData])

  const getHubId = (id) => {
    let returnedId = id()
    setHub(returnedId)
  }

  const PageClick = (page) => {
    let retpage = page()
    setPage(retpage)
    changePageTicketHistory(retpage, [
      status,
      dateFilter,
      hub,
      textFilter,
      dispositionFilter,
    ])
  }

  useEffect(() => {
    console.log('hub', hub)
    if (hub !== -1 && hub.length > 0) {
      // console.log(hub,"HUB HERE")
      // console.log("status:",status,"dateFilter:",dateFilter,"textFilter:",textFilter,"hub:",hub)
      loadTicketHistory([
        status,
        dateFilter,
        hub,
        textFilter,
        dispositionFilter,
      ])
    }
  }, [status, dateFilter, hub, dispositionFilter])

  function handleTextFilterOnChange(value) {
    setTextFilter(value)
    fitlerTextOnchangeOnHistory(page, [
      status,
      dateFilter,
      hub,
      value,
      dispositionFilter,
    ])
    // changePageTicketHistory(val)
    // fetch here
  }

  return (
    <Container css="grd gtr-af over-hid">
      <div className="grd grd-gp-1">
        <div className="grd grd-gp-1 gtc-af">
          <span className="header asc">Ticket History</span>
          <HubFilter getHubID={getHubId} maxBadgeCount={9} />
        </div>
        <div
          style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr' }}
          className="grd grd-col grd-gp-1"
        >
          <Input
            type="search"
            css="pad-1"
            label="Filter ticket..."
            value={textFilter}
            onChange={(e) => handleTextFilterOnChange(e.target.value)}
          />
          <Input
            type="date"
            css="pad-1"
            label="Filter date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <Select
            clear={() => setDispositionFilter('')}
            label="Disposition"
            value={dispositionFilter.name}
          >
            {disposition.map((value) => {
              return (
                <span
                  key={value.id}
                  onClick={() => setDispositionFilter(value)}
                >
                  {value.name}
                </span>
              )
            })}
          </Select>
          <Select
            clear={() => setStatus('')}
            label="Ticket status"
            value={status === '' ? '' : status === 3 ? 'Resolved' : 'Close'}
          >
            <span onClick={() => setStatus(2)}>Close</span>
            <span onClick={() => setStatus(3)}>Resolved</span>
          </Select>
        </div>

        <TableHeader
          //css in ticektablerow.css
          css="ticket_history-template aic jic"
        >
          {historyHeader.map((header, key) => {
            return <span key={key}>{header}</span>
          })}
        </TableHeader>
      </div>
      <div className="over-y-auto scroll">
        {closed_tickets &&
          closed_tickets.map((ticket) => (
            <TicketHistoryRow data={ticket} key={ticket.ticket_id} />
          ))}
        <div className="grd">
          <Pagination
            selPage={page}
            pageClick={PageClick}
            count={Number(closed_ticket_count)}
            rows={Number(pagesize)}
          />
        </div>
      </div>
    </Container>
  )
}

const transferStatetoProps = (state) => ({
  ticket: state.ticketData,
})

export default connect(transferStatetoProps, {
  loadTicketHistory,
  changePageTicketHistory,
  fitlerTextOnchangeOnHistory,
  updateTicketsHistory,
})(TicketHistory)
