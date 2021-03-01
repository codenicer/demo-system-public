import React from 'react';
import Paper from '../../../../../atoms/Paper/Paper';
import EditableData from '../../../../../atoms/EditableData/EditableData';

const OrderNotes = ({data,setInfo, message, notes, click}) => {
    return (
        <Paper css='order_page-notes grd grd-gp-1 pad-2'>
            <span className='header-3'>Message</span>
            <EditableData
                edit={message}
                onClick={() => click('message', message)}
            >
                <textarea 
                    onChange={(e) =>setInfo(e.target.value,"message")}
                    value={data['message'] ? data['message'] : ''} 
                    disabled={!message} 
                    className='pad-1'
                    rows={15}
                    >
                </textarea>
            </EditableData>
            <span className='header-3'>Instruction</span>
            <EditableData
                edit={notes}
                onClick={() => click('notes', notes)}
            >
                <textarea 
                    onChange={(e) =>setInfo(e.target.value,"note")}
                    value={data['note'] ? data['note'] : ''} 
                    disabled={!notes} 
                    className='pad-1'
                    rows={15}
                    >
                </textarea>
            </EditableData>
        </Paper>
    );
};

export default OrderNotes;