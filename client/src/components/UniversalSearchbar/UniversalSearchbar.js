import React, { useState } from "react";
import Input from "../../atoms/Input/Input";
import Paper from "../../atoms/Paper/Paper";
import Button from '../../atoms/Button/Button';
import "./UniversalSearchbar.css";
import { goSearch, clResult } from "../../scripts/actions/gsearchAction";
import { connect } from "react-redux";
import _ from "lodash";

//styles 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './UniversalSearchbar.css';


const UniversalSearchbar = (props) => {
    const {resultfilter,clResult, result, goSearch,gsearch:{results}} = props;
    const [focus, setFocus] = useState({input: false, drop: false, filter: false})
    const [input,setInput] = useState(null)
    
function handleSearch(e){
    if(e.charCode === 13){
        if(input.toLowerCase().includes("cpu")){
            goSearch(input.slice(0,input.length-4))   
        }else{
            goSearch(input)
        }
    }
    
}


    return (
        <div className='universal-search aic grd relative' >
            <div className='universal-search_icon-wrap'>
                <FontAwesomeIcon icon={faSearch}/>
                
            </div>
            <Input
                css='header-searchbar pad-1 relative'
                type='text'
                label='Search FS number, customer name or email..'
                onMouseDown={() => setFocus({...focus, input: true})}
                onKeyPress={(e) => handleSearch(e) }
                onChange={(e)=>setInput(e.target.value)}
                onBlur={focus.input ? () => {
                    clResult(); setFocus({...focus, input: false})} : null} />
            <Button
                onClick={()=>goSearch(input)}
                color='primary'
                css='height-100'
            >Search</Button>
            { results !== null ? 
                <Paper 
                    css='searchbar_result_preview shadow pad-2 absolute zoomIn animate-1 above-all'
                    tabIndex='0'
                    onMouseDown={() => {setFocus({...focus, drop: true, input: false})}}
                    onMouseUp={() => {setFocus({...focus, filter: false})}}
                    onBlur={focus.filter  ? null : (focus.drop ? () => {setFocus({input: false, drop: false, filter: false});clResult();}: null)} 
                >
                    <div className='searchbar_result_preview-header grd gtc-mfm grd-gp-1 aic'>
                        <span className='subheader'>Result</span>
                        <span className='jse'>Include</span>
                        <select label='all'
                            onMouseUp={(e) => e.stopPropagation()}
                            onMouseDown={(e) => {e.stopPropagation(); setFocus({input: false, drop: false, filter: true})}}
                            onBlur={focus.drop === false && focus.input === false ? () => {setFocus({input: false, filter: false});clResult()} : null}
                        >   
                            {resultfilter}
                        </select>
                    </div>
                    <div className='searchbar_result_preview-body over-y-auto scroll pad-1'>
                        {result}
                    </div>
                </Paper> 
                :
                null
            }
        </div>
    )
};


const transferStatetoProps = state => ({
    gsearch:state.gsearchData
 })
 

export default connect(transferStatetoProps,{goSearch,clResult})(UniversalSearchbar);