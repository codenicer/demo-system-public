import React, { useState } from 'react'
import UniversalSearchbar from '../../components/UniversalSearchbar/UniversalSearchbar'
import SearchResult from '../../organisms/SearchResult/SearchResult';
import {seeMore,clResult} from '../../scripts/actions/gsearchAction'
import {loadSelectedCustomer} from '../../scripts/actions/customersActions'
import {loadSelOrder, clearSelected} from '../../scripts/actions/ordersActions'
import {loadSelectedProduct} from '../../scripts/actions/productActions'
import {connect} from 'react-redux'

 const UniversalSearchHolder = (props) =>{
    const {gsearch,seeMore,loadSelectedCustomer,loadSelOrder,loadSelectedProduct,clResult, clearSelected} = props;
    const [sampleFilter] = useState(['all', 'order', 'customer', 'product']);

    function redirect(data){
      // console.log("RUTHER",{data})
       const {order_id} = data;

      // if(!data['hub_id']){
      //     clearSelected();
      //       props.history.replace(`${props.match.path}/nohub/${data['shopify_order_name']}`);
      // }
      // else if([10,13,14].includes(data['order_status_id'])){
          
      //    clearSelected();
      //     props.history.push(`${props.match.path}/closedorders/${data['shopify_order_name']}`)
      // }else if(data.redirect === "none" || data.redirect === "list"){
          
      //    loadSelOrder(order_id);
      // }else if(data.redirect){
      //   clearSelected();
      //     props.history.push(`${props.match.path}/dispatch/${data.redirect}/${data['shopify_order_name']}`)
      // }else{
        
         loadSelOrder(order_id);
        
      // }
                              
    }
    

    return (
        <UniversalSearchbar
        resultfilter={
          sampleFilter.map((value,i) => {
            return <option key={i} value={value}>{value}</option>
          })
        }
        result={
          <>
              <Result 
                 redirect={redirect}
                 clResult={clResult}
                 loadSelectedCustomer={loadSelectedCustomer}
                 loadSelectedProduct={loadSelectedProduct}
                 gsearch={gsearch} />
              <SeeMore seeMore={seeMore} gsearch={gsearch}/>
          </>
        }
        />)
}



const transferStatetoProps = state => ({
   gsearch:state.gsearchData
})

export default connect(transferStatetoProps,{seeMore,loadSelectedCustomer,loadSelOrder,loadSelectedProduct,clResult, clearSelected})(UniversalSearchHolder)



const SeeMore = (props) =>{

  const {gsearch:{results, remaining, lm_fetch},seeMore} =props
  if( results && results !== null && results.length > 0){
    if(lm_fetch){
      return<div 
        style={{ padding: '.5rem', textAlign: 'center'}}
        >Loading please wait...</div>
    }else if(remaining > 1){
      return<div style={{border: '1px solid black', padding: '.5rem', cursor: 'pointer', textAlign: 'center'}}
                onClick={seeMore}>See more...</div>
    }else{
      return null
    }
  }else{
    return null
  }
}


function labelFilter(data){
    if(data.redirect){
      return `placed by ${data['customer_first_name']} ${data['customer_last_name']} | ${data['delivery_time']} ${data['delivery_date']}`
    }
    return `placed by ${data['customer.first_name']} ${data['customer.last_name']} | ${data['delivery_time']} ${data['delivery_date']}`
}


const Result = (props) =>{
  const {gsearch:{fetching,results},loadSelectedCustomer,loadSelectedProduct,clResult,redirect} = props


  if(fetching === true && results === null){
          return <h1>LOADING...</h1>
  }else if (fetching === false && results !== null){
            if( results){  
              return results.map((data,i)=>{
                  if(data.hasOwnProperty('order_id')){
                      return<SearchResult
                          category='Order'
                          onClick={() => redirect(data)}
                          key={i}
                          header={data['shopify_order_name']}
                          sublabel={labelFilter(data)}
                      />
                  }else if(data.hasOwnProperty('customer_id')){
                      return<SearchResult
                          onClick={() => {loadSelectedCustomer(data['customer_id'],()=>{
                              clResult()
                          })}}
                          category='Customer'
                          key={i}
                          firstname={data['first_name']}
                          lastname={data['last_name']}
                          header={`${data['first_name']} ${data['last_name']}`}
                          sublabel={`${data['email']} | ${data['phone']}`}
                          />
                  }else{
                      return<SearchResult
                      onClick={()=>loadSelectedProduct(data['product_id'],()=>{
                          clResult()
                      })}
                      category={'Product'}
                      key={i}
                      imgsrc={data['img_src']}
                      header={data['title']}
                      sublabel={data['type']}
                    />
                  }
              })
          }else{
              return <h1>NO RESULT FOUND</h1>
          }
  }else{
    return null
  }
}
