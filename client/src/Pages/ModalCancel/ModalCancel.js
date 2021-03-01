import React from 'react';
import Modal from '../../template/Modal/Modal';
import Select from '../../atoms/Select/Select';

const cancelFrom = ['Internal', 'External'];

const ModalCancel = ({level, clickClose,cancelFromVal, clickCancel, clickSubmit, selectChange, cancelreason, cancelreasonlist, textChange, cancelChange}) => {
    return (
        <Modal
            width='450px' 
            clickClose={clickClose}
            label={`Cancel ${level}`}
            clickCancel={clickCancel}
            clickSubmit={clickSubmit}
            submitlabel={`Cancel ${level}`}
            submitcolor='warning'
            cancellabel='No'
        >
            <div className='grd grd-gp-1'>
                <span className='label'>Reason</span>
                <Select 
                    onChange={selectChange}>
                    {cancelreasonlist &&
                        cancelreasonlist.map((value, key) => {
                            return <option key={key} value={JSON.stringify({
                                ...value,
                                on:false
                            })}>{value.name}</option>
                        })
                    }
                    {/* <option value={JSON.stringify({
                             category:14,
                             name:"",
                             on:true
                    })
                    }>Others</option> */}
                </Select>
                <span className='label'>Cancelled from ?</span>
                <Select
                    value={cancelFromVal}
                    disabled={!cancelreason} 
                    onChange={cancelChange}
                    >
                    {
                        cancelFrom.map((value, key) => {
                            return <option key={key} >{value}</option>
                        })
                    }
                </Select>
                {cancelreason &&
                    <textarea
                        className='pad-1 zoomIn animate-2'
                        rows='15'
                        placeholder='Add details'
                        onChange={textChange}
                    ></textarea>
                }
            </div>
        </Modal>
    );
};

export default ModalCancel;