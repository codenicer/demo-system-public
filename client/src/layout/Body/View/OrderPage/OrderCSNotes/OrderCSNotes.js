import React,{useEffect,useState} from 'react'
import {loadSelOrderNotes,addOrderNotes} from '../../../../../scripts/actions/order_noteActions'
//import {} from '../../../../../scripts/actions/order_noteActions'
import {connect} from 'react-redux'
import Paper from '../../../../../atoms/Paper/Paper';
import AddComment from '../../../../../molecules/AddComment/AddComment';
import Comment from '../../../../../molecules/Comment/Comment';
import Spinner from '../../../../../atoms/Spinner/Spinner';
import { toast } from 'react-toastify';


function OrderCSNotes(props) {
    const {order_id} = props.order
    const {loadSelOrderNotes,addOrderNotes,} = props
    const {orderNotes:{sel_order_notes},isFetching} = props

    const [note,setNote] = useState("")

    useEffect(()=>{
        loadSelOrderNotes(order_id)
    },[order_id])
  
    function handleSubmitComment(){
        if(note.replace(/\s/g,'').length > 4 ){
            const form = {
                order_id,
                note:note, 
            }
            addOrderNotes(form,(type,text)=>{
               toast[type](text, )
               setNote("")
            })
        }else{
            toast.error(`Please provide a note atleast 5 characters.`)
        }
    }

    function handleKeyPress({charCode}){
        if(charCode === 13){
            handleSubmitComment()
        }
    }
    
    function handleOnChange(e){
        setNote(e.target.value)
    }

    // useEffect(()=>{

    // },[orderNotes])
    return (
        <Paper css='order-page_csnotes grd grd-gp-2 pad-2 over-hid'>
            <span className='header-3'>Notes</span>
            <div className={`grd pad-2 relative over-y-auto scroll ${isFetching === 'success' ? 'acs' : 'aic jic'}`}>
                    { 
                        sel_order_notes !== null && 
                        sel_order_notes.map((data, key) => {
                            return <Comment 
                            firstname={data.user['first_name']}
                            lastname={data.user['last_name']}
                            content={data['note']}
                            time={data['created_at']}
                            key={key} 
                            />
                        })
    
                    }
                    {
                        isFetching !== 'success' &&
                        <Spinner isFetching={isFetching} />
                    }
            </div>
            <AddComment 
                onChange={handleOnChange} 
                onKeyPress={handleKeyPress} 
                onClick={handleSubmitComment}
                value={note}
                label='Notes'/>
        </Paper>
    )
}

const mapStatetoProps = state => ({
    orderNotes:state.orderNoteData,
    isFetching:state.orderNoteData.order_notes_state
})

export default connect(mapStatetoProps,{loadSelOrderNotes,addOrderNotes})(OrderCSNotes)
