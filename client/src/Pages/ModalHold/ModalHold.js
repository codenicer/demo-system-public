import React from 'react';
import Modal from '../../template/Modal/Modal';
import Select from '../../atoms/Select/Select';
import Checkbox from '../../atoms/Checkbox/Checkbox';


const ModalHold = ({level, clickClose, clickCancel, clickSubmit, selectChange, holdreason, holdreasonlist, textChange,value, noteChange , onhold,order_status}) => {
    return (
        <Modal
            width='450px' 
            clickClose={clickClose}
            label={`Create ${level}`}
            clickCancel={clickCancel}
            clickSubmit={clickSubmit}
            submitlabel={`Create ${level}`}
            submitcolor='alert'
        >
            <div className='grd grd-gp-1'>
                <span className='label'>Reason</span>
                <Select onChange={selectChange}>
                    {holdreasonlist &&
                        holdreasonlist.map((dispo, key) => {
                            return <option key={key} value={JSON.stringify(dispo)}>{dispo.name}</option>
                        })
                    }
                    {/* <option value={
                        JSON.stringify({disposition_id:null,name:"Others"})
                    }>Others</option> */}
                </Select>
                {
                    holdreason === 'others' &&
                        <textarea
                            className='pad-1 zoomIn animate-2'
                            rows='7'
                            placeholder='Add details'
                            onChange={textChange}
                        ></textarea>
                }
                <span className='label'>Add Notes :</span>
                    <textarea
                        className='pad-1'
                        rows='7'
                        placeholder='Write notes'
                        onChange={noteChange}
                    ></textarea>
                    {order_status !== 12 ? 
                         <Checkbox
                         // checked={selectedData.some((id => id === rowData.order_id))}
                         onChange={onhold}
                         label="On Hold"
                         color='secondary'
                         defaultChecked={true}
                       /> :
                       <p>This order is already on hold.</p>
                    }
               
                </div>
        </Modal>
    );
};

export default ModalHold;