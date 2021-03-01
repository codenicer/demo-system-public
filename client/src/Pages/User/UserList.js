import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { fetchUsers } from '../../scripts/actions/users'
import Container from '../../atoms/Container/Container'
import Button from '../../atoms/Button/Button'
import TableHeader from '../../atoms/TableHeader/TableHeader'
import UserTableRow from './components/UserTableRow'
import Pagination from '../../atoms/Pagination/Pagination'
import './UserList.css'

const UserTable = (props) => {
  const { fetchUsers } = props
  const {
    userData: { all_users },
  } = props

  //   const [pageParams, setPageParams] = useState({
  //     page: 1,
  //     pageSize: 15,
  //     filterall: ""
  //   });
  const [totalRecCount, setTotalRecCount] = useState(13)
  const [tableData, setTableData] = useState([])

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    filterall: '',
  })

  function fetchData(params) {
    fetchUsers(params)
  }

  //ondidmount
  useEffect(() => {
    fetchData(params)
  }, [])

  useEffect(() => {
    console.log('all users data:', all_users)
    setTableData(all_users)
    setTotalRecCount(all_users.count)
  }, [all_users])

  const PageClick = (x) => {
    let retpage = x()
    const newparam = { ...params, page: retpage }
    setParams(newparam)
    fetchData(newparam)
  }

  const colHeaders = [
    'ID',
    'Role',
    'First Name',
    'Last Name',
    'Email',
    'Date Created',
    'Status',
    'Action',
  ]

  return (
    <Container css="over-hid grd slideInRight animate-2 gtr-af">
      <div>
        <div className="grd grd-gp-2 pad-1 gtc-af">
          <span className="header">User List</span>
          <Button
            css="jss"
            color="secondary"
            onClick={() => props.history.push('/system/user/create')}
          >
            Create New User
          </Button>
        </div>
        <TableHeader csswrap="width-100" css="_user_list-template aic jic">
          {colHeaders.map((x, y) => {
            return <div key={y}>{x}</div>
          })}
        </TableHeader>
      </div>

      <div className="over-hid over-y-auto scroll">
        {tableData.rows &&
          tableData.rows.map((record, key) => {
            return (
              <UserTableRow
                css="_user_list-template aic"
                key={key}
                data={record}
                editAction={(id) =>
                  props.history.push(`/system/user/update/${id}`)
                }
              />
            )
          })}
        {totalRecCount && (
          <div className="grd jie">
            <Pagination
              selPage={params.page}
              rows={params.pageSize}
              count={totalRecCount}
              pageClick={PageClick}
            />
          </div>
        )}
      </div>
    </Container>
  )
}

const MapStateToProps = (state) => ({
  userData: state.userData,
  isFetching: state.webFetchData.isFetching,
})

export default connect(MapStateToProps, { fetchUsers })(UserTable)
