import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import Container from '../../../atoms/Container/Container'
import Button from '../../../atoms/Button/Button'
import { toast } from 'react-toastify'
import TableHeader from '../../../atoms/TableHeader/TableHeader'
import RoleTableRow from './RoleTableRow'
import './RoleList.css'

//action
import {
  fetchRoles,
  updateRoleStatus,
} from '../../../scripts/actions/roleActions'

const RoleTable = (props) => {
  const { fetchRoles, updateRoleStatus } = props
  const {
    roleData: { roles },
  } = props

  const [pageParams] = useState({
    page: 1,
    pageSize: 15,
    filterall: '',
  })
  const [tableData, setTableData] = useState([])

  function fetchData(params) {
    fetchRoles(params)
  }

  function suspend(role_id) {
    if (
      window.confirm('You are about to suspend this role. Click OK to proceed')
    ) {
      const params = {
        role_id: parseInt(role_id),

        formData: {
          active: 0,
        },
      }

      updateRoleStatus(params, (msg) => {
        toast.success(msg, {
          onClose: () => {
            fetchData(params)
            props.history.push('/system/role/list')
          },
          pauseOnHover: false,
          autoClose: 500,
        })
      })
    }
  }

  function activate(role_id) {
    if (
      window.confirm('You are about to activate this role. Click OK to proceed')
    ) {
      const params = {
        role_id: parseInt(role_id),
        formData: {
          active: 1,
        },
      }

      updateRoleStatus(params, (msg) => {
        toast.success(msg, {
          onClose: () => {
            fetchData(params)
            props.history.push('/system/role/list')
          },
          pauseOnHover: false,
          autoClose: 500,
        })
      })
    }
  }

  //ondidmount
  useEffect(() => {
    fetchData(pageParams)
  }, [])

  useEffect(() => {
    setTableData(roles.rows)
  }, [roles])

  const colHeaders = ['ID', 'Role', 'Description', 'Status', 'Action']

  return (
    <Container css="over-hid grd sslideInRight animate-2 gtr-af">
      <div>
        <div className="grd grd-gp-2 pad-1 gtc-af">
          <span className="header">Role List</span>
          <Button
            css="jss"
            color="secondary"
            onClick={() => props.history.push('/system/role/create')}
          >
            Create New Role
          </Button>
        </div>
        <TableHeader csswrap="width-100" css="role_list-template aic jic">
          {colHeaders.map((x, y) => {
            return <div key={y}>{x}</div>
          })}
        </TableHeader>
      </div>
      <div className="over-y-auto scroll">
        {tableData &&
          tableData.map((record, key) => {
            return (
              <RoleTableRow
                css="role_list-template aic"
                key={key}
                data={record}
                setPermissions={(id) =>
                  props.history.push(`/system/role/set_permission/${id}`)
                }
                editAction={(id) =>
                  props.history.push(`/system/role/edit/${id}`)
                }
                suspendAction={suspend}
                activateAction={activate}
              />
            )
          })}
      </div>
    </Container>
  )
}

const MapStateToProps = (state) => ({
  roleData: state.roleData,
  isFetching: state.webFetchData.isFetching,
})

export default connect(MapStateToProps, { fetchRoles, updateRoleStatus })(
  RoleTable
)
