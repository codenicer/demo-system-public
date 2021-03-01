import React from 'react'
import {loadSelectedCustomer} from '../../scripts/actions/customersActions'
import {connect} from 'react-redux';

function Customer({firstname, lastname, id, loadSelectedCustomer}) {
    return (
        <div 
            className='point emp label'
            onClick={() => loadSelectedCustomer(id)} >
            {`${firstname} ${lastname}`}
        </div>
    )
}

export default connect(null, {loadSelectedCustomer})(Customer)
