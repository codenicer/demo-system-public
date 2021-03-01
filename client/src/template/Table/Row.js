import React from 'react'
import TableRow from '../../atoms/TableRow/TableRow';

function Row({data, dataFields}) {
    console.log(data, 'data', dataFields, 'dataFields')
    return (
        <TableRow>
            {
                dataFields.map((field, key) => {
                    return console.log(data[field])
                })
            }
        </TableRow>
    )
}
export default Row
