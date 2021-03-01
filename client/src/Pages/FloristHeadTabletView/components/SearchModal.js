import React, { useState, useRef } from 'react'
import Button from '../../../atoms/Button/Button'
import Input from '../../../atoms/Input/Input'

const SearchModal = (props) => {
    //----PROPS-----
    // pass down props
    const { setSearchFilter } = props;

    //-----STATE-----
    // state to show the input on ui
    const [ show, setShow ] = useState(false);

    //ref for input
    const searchInput = useRef(null);

    //----FUNCTIONS
    // set search filter on enter key
    const searchHandler = (e) => {
        if(e.key === 'Enter' || e === 'click'){
            setSearchFilter(searchInput.current.value)
        }
    }

    return (
        <>
            <Button
                color={!show ? 'secondary' : 'warning'}
                onClick={() => {setShow(!show)
                                 setSearchFilter(null)}}
            >{!show ? 'Search ': 'Cancel'}</Button>
            {show &&
                <div className='fixed florist_head-search_modal grd gtc-fa'>
                    <Input
                        myref={searchInput} 
                        label='Enter FS number..' 
                        autoFocus 
                        onKeyPress={e =>  searchHandler(e)}
                        />
                    <Button
                        color='success'
                        onClick={() => searchHandler('click')}
                    >Search</Button>
                </div>
            }
        </>
    )
}

export default SearchModal
