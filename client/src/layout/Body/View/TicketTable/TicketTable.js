import React, { useState, useEffect } from 'react'
import TicketTableRow from './TicketTableRow/TicketTableRow'
import TicketPage from './TicketPage/TicketPage'
import Container from '../../../../atoms/Container/Container'
import Input from '../../../../atoms/Input/Input'
import Error from '../../../../atoms/Error/Error'
import Paper from '../../../../atoms/Paper/Paper'
// import socket from '../../../../scripts/utils/socketConnect';
import HubFilter from '../../../../organisms/HubFilter/HubFilter'
import Pagination from '../../../../atoms/Pagination/Pagination'
import {
  handleLoadTickets,
  updateTickets,
  loadSelTicket,
  fitlerTextOnchange,
  changePageTicket,
} from '../../../../scripts/actions/ticketsActions'
import { connect } from 'react-redux'
import Select from 'react-select'
import moment from 'moment'
import filter_config from '../../../../config.json'

const TicketTable = (props) => {
  const pagesize = 15

  const {
    handleLoadTickets,
    updateTickets,
    loadSelTicket,
    fitlerTextOnchange,
    changePageTicket,
  } = props
  const {
    ticket: { tickets, sel_ticket, open_ticket_count },
  } = props
  const { history, match } = props
  const [page, setPage] = useState(1)
  const [selTicket, setSelTicket] = useState('')
  const [hub, setHub] = useState()
  const [textFilter, setTextFilter] = useState('')

  const [timeFilter, setTimeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState(moment().format('MM/DD/YYYY'))

  // const [updateData ,setUpdateData] = useState([])

  const [dispositionFilter, setDispositionFitler] = useState('')

  const { deliverytime, disposition } = filter_config

  //   const ticketListDidUpdate = data=> setUpdateData(data)

  //Deleted on socket tuning.
  // useEffect(()=>{
  //         socket.on('TICKET_LIST_DID_UPDATE',ticketListDidUpdate)

  //         return () =>   socket.off('TICKET_LIST_DID_UPDATE',ticketListDidUpdate)
  // },[])

  // useEffect(()=>{
  //     updateTickets(updateData,{page,hub,textFilter})
  // },[updateData])

  const reloadTicket = () => {
    changePageTicket(page, [
      '',
      dateFilter,
      hub,
      textFilter,
      '',
      timeFilter,
      dispositionFilter,
    ])
    setSelTicket(null)
  }

  const getHubId = (id) => {
    let returnedId = id()
    setHub(returnedId)
  }

  const getSelTicket = (id) => {
    let returnedID = id()
    setSelTicket(returnedID)
  }

  const PageClick = (page) => {
    let retpage = page()
    setPage(retpage)
    changePageTicket(retpage, [
      '',
      dateFilter,
      hub,
      textFilter,
      '',
      timeFilter,
      dispositionFilter,
    ])
  }

  useEffect(() => {
    if (sel_ticket === null) {
      setSelTicket(null)
    }
  }, [sel_ticket])

  useEffect(() => {
    if (hub && hub.length > 0) {
      handleLoadTickets([
        '',
        dateFilter,
        hub,
        textFilter,
        '',
        timeFilter,
        dispositionFilter,
      ])
    }
  }, [hub, dateFilter, timeFilter, dispositionFilter])

  function handleTextFilterOnChange(value) {
    setTextFilter(value)
    fitlerTextOnchange(page, ['', '', hub, value, '', '', ''])
  }

  return (
    <Container width="100%" height="100%" css="grd gtr-af">
      <div
        //  style={{gridTemplateColumns: '.6fr 1fr 1fr 1fr 1fr .3fr'}}
        className="grd grd-gp-1 pad-1"
      >
        <div
          style={{ gridTemplateColumns: '.4fr 1fr 1fr 1fr 1fr 1fr' }}
          className=" grd grd-gp-1"
        >
          <span className="header">Ticket</span>
          <Input
            css="pad-1"
            label="Search ticket.."
            onChange={(e) => handleTextFilterOnChange(e.target.value)}
          />
          <Input
            type="date"
            css="pad-1"
            label="Filter date (created or delivery date)"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
          <Select
            value={timeFilter}
            name="delivery_time"
            placeholder="Delivery time"
            options={deliverytime.map((rec, key) => {
              return { value: rec.id, label: rec.id }
            })}
            onChange={(selecteditem) =>
              setTimeFilter(selecteditem ? selecteditem.value : '')
            }
          />
          <Select
            value={dispositionFilter.label}
            name="delivery_time"
            placeholder="Dispositions"
            options={disposition.map((rec, key) => {
              return { value: rec.id, label: rec.name }
            })}
            onChange={(selecteditem) => {
              setDispositionFitler(selecteditem ? selecteditem : '')
            }}
          />

          <HubFilter getHubID={getHubId} maxBadgeCount={9} />
        </div>
      </div>
      <div
        style={{ gridTemplateColumns: '1fr 2fr' }}
        className="ticket_table-body grd-gp-1 grd over-hid"
      >
        {tickets !== null && tickets.length > 0 ? (
          <>
            <div className="over-y-auto scroll">
              {tickets.map((value, key) => {
                return (
                  <TicketTableRow
                    selTicket={selTicket}
                    onClick={loadSelTicket}
                    getSelTicket={getSelTicket}
                    data={value}
                    key={key}
                  />
                )
              })}
            </div>
            <div className="grd gtr-fa over-hid grd-gp-1">
              <Paper css="over-y-auto slideInRight animate-1">
                {sel_ticket ? (
                  <TicketPage
                    reload_ticket={reloadTicket}
                    match={match}
                    history={history}
                    data={sel_ticket}
                  />
                ) : (
                  <Error label="No ticket selected" />
                )}
              </Paper>
              <div className="grd pad-1">
                <Pagination
                  align="jss"
                  selPage={page}
                  pageClick={PageClick}
                  count={open_ticket_count}
                  rows={pagesize}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <h1>NO CONTENT</h1>
          </>
        )}
      </div>
    </Container>
  )
}

const transferStatetoProps = (state) => ({
  ticket: state.ticketData,
})

export default connect(transferStatetoProps, {
  handleLoadTickets,
  updateTickets,
  loadSelTicket,
  fitlerTextOnchange,
  changePageTicket,
})(TicketTable)
