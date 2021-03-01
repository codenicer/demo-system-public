import React from 'react'
import ProductPage from '../layout/Body/View/ProductPage/ProductPage';

 const  ProductPageLoadData = ({data:{sel_products}}) =>{
    if(sel_products !== null){
      return  <ProductPage
      data={sel_products}
      />
  
    }else{
     return null
    }
  }

  export default ProductPageLoadData
  