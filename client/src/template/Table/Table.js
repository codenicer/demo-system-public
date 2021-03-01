import React, { useState, useEffect } from 'react'
import TableHeader from '../../atoms/TableHeader/TableHeader';
import Row from './Row';

function Table({header, children, data}) {
    const [datafields, setDatafields] = useState([]);

    useEffect(() => {
        let arr = React.Children.map(children, child => child.props.dataField);
        setDatafields(arr);
    }, [])

    console.log(datafields);
    return (
        <div>
            <div>
                <span className='header'>{header}</span>
            </div>
            <div>
                <TableHeader>
                    {
                        children
                    }
                </TableHeader>
                <div>
                   {
                       data.map((value, key) => {
                        return <Row key={value} data={value} dataFields={datafields} />
                       })
                   }
                </div>
            </div>
        </div>
    )
}

Table.defaultProps = {
    header: 'Add header'
}

export default Table