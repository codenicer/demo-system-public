import React, { Component } from 'react'
import PrioritizationHeader from './PrioritizationHeader/PrioritizationHeader'
import PrioritizationRow from './PrioritizationRow/PrioritizationRow'
import Pagination from '../../../../../atoms/Pagination/Pagination'
import { sortableContainer, sortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import { connect } from 'react-redux'
import { toast } from 'react-toastify'
import './Prioritization.css'
// import socket from '../../../../../scripts/utils/socketConnect'
import {
  handleLoadOrderByPrio,
  updaTeOrderPrio,
  updatePrioritization,
  prioChangePage,
} from '../../../../../scripts/actions/ordersActions'

const SortableRow = sortableElement(({ data }) => (
  <PrioritizationRow data={data} />
))

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>
})

const pagesize = 15

class Prioritization extends Component {
  state = {
    items: null,
    page: 1,
  }

  proiDidUpdate = (data) => {
    const { page } = this.state
    this.props.updatePrioritization(data, page)
  }

  componentDidMount() {
    //Deleted on socket tuning.
    // socket.on('PRIO_LIST_DID_UPDATE',this.proiDidUpdate)
    this.props.handleLoadOrderByPrio()
  }

  // Deleted on socket tuning.
  // componentWillUnmount(){
  //     socket.off('PRIO_LIST_DID_UPDATE',this.proiDidUpdate)
  // }

  componentDidUpdate(prevProps) {
    if (this.props['prioritization'] !== prevProps['prioritization']) {
      this.setState({ items: this.props.prioritization })
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ items }) => ({
      items: arrayMove(items, oldIndex, newIndex),
    }))
    const { items } = this.state
    const form = {
      list: items,
      selected_index: newIndex,
      selected_order: items[newIndex],
    }
    this.props.updaTeOrderPrio(form, (type, text) => {
      toast[type](text)
    })
  }

  pageClick = (x) => {
    let retpage = x()
    this.setState({ page: retpage })
    this.props.prioChangePage(retpage)
  }

  render() {
    const { items, page } = this.state

    return (
      <div
        className="size-100 over-hid grd"
        style={{ gridTemplateRows: 'min-content min-content 1fr' }}
      >
        <span className="header pad-y-1">Prioritization</span>
        <PrioritizationHeader />
        <div className="over-y-auto scroll">
          <SortableContainer
            onSortEnd={this.onSortEnd}
            useDragHandle
            lockAxis="y"
            lockToContainerEdges
          >
            {items !== null && items.length > 0 ? (
              items.map((data, key) => {
                return <SortableRow key={key} index={key} data={data} />
              })
            ) : (
              <h1>NO CONTENT</h1>
            )}
          </SortableContainer>
          <div className="grd jie">
            <Pagination
              selPage={page}
              count={this.props.count}
              rows={pagesize}
              pageClick={this.pageClick}
            />
          </div>
        </div>
      </div>
    )
  }
}

const transferStatetoProps = (state) => ({
  prioritization: state.orderData.prioritization,
  count: state.orderData.prio_count,
  isfetching: state.webFetchData.isFetching,
})

export default connect(transferStatetoProps, {
  prioChangePage,
  handleLoadOrderByPrio,
  updaTeOrderPrio,
  updatePrioritization,
})(Prioritization)

// componentDidMount(){
//     this.setState({items: this.props.data})
//     }

//     componentDidUpdate(prevProps) {
//     // Typical usage (don't forget to compare props):
//     if (this.props !== prevProps) {
//     this.setState({items: this.props.data})
//     }
//     }

//     onSortEnd = ({oldIndex, newIndex}) => {
//     this.setState(({items}) => ({
//     items: arrayMove(items, oldIndex, newIndex),
//     }))
//     // console.log()
//     this.props.handleRowOnDrop(this.state.items,newIndex,this.state.items[newIndex])
//     // console.log(this.state.items.filter)
//     }
