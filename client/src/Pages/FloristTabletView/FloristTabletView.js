import React,{useEffect} from 'react'
import {connect } from 'react-redux'
import {loadFloristv2} from '../../scripts/actions/floristActions'
import FloristHeadUserCard from '../FloristHeadTabletView/components/FloristHeadUserCard'



const FloristTabletView = (props) => {
    const { florists, loadFloristv2} = props
    useEffect(()=>{
        loadFloristv2()
      
    },[])

    console.log("florist:",florists)

    return (
        
        <div 
            className='grd size-100 relative pad-1 over-hid _florist-tablet-view_wrap'>
            <div className='_florist-tablet-view_body grd grd-gp-1 over-y-auto scroll'>
            {florists !== null  && florists.map(florist=>{
                return <FloristHeadUserCard
                key={florist.user_info.user_id} 
                jobs={florist.jobs} data={florist.user_info} />  
            })}
            </div>
        </div>
    )
}



const mapStateToProps = state => ({
    florists:state.floristData.florist,
    isfetching:state.webFetchData.isFetching
})


export default connect(mapStateToProps,{loadFloristv2})(FloristTabletView)
