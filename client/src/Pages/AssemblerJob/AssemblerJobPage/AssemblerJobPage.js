import React, { useState, useEffect,useRef } from "react";
import AssemblerJobItem from "./AssemblerJobItem/AssemblerJobItem";
import Checkbox from "../../../atoms/Checkbox/Checkbox";
import Button from "../../../atoms/Button/Button";
import AssemblerJobRow from "../AssemberJobRow/AssemblerJobRow";
import {
  cancelAssemblyJob,
  handleLoadMyJob,
  updateAssemblyJobPrinted,
  submitAsseblyJob,
  rePrint
} from "../../../scripts/actions/assemblyActions";
import {updateOrderItemStatus,updateOrderCheckAll} from '../../../scripts/actions/order_itemAction'
import ModalHold from "../../ModalHold/ModalHold";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import "./AssemblerJobPage.css";
import Error from "../../../atoms/Error/Error";

const AssemblerJobPage = props => {
  const { history, mobile ,updateOrderCheckAll} = props;

  const [itemOnHold, setItemOnHold] = useState(false);
  const [holdItem, setHoldItem] = useState(false);
  const {
    assembly: { my_assembly_job },
    handleLoadMyJob,
    cancelAssemblyJob,
    updateAssemblyJobPrinted,
    submitAsseblyJob,
    rePrint,
    updateOrderItemStatus
  } = props;

    useEffect(()=>{
        handleLoadMyJob()
    },[])
    

  if (my_assembly_job !== null && my_assembly_job.length > 0) {
    var myjob = my_assembly_job[0];
    var { order } = myjob;
  }

  function handleDarCbOnchange(e) {
    const form = {
      msg_printout_ready: myjob["order"]["msg_printout_ready"],
      dar_printout_ready: e.target.checked,
      order_id: myjob["order"]["order_id"]
    };

    updateAssemblyJobPrinted(form, (type, text) => {
      handleLoadMyJob();
      toast[type](text);
      handleLoadMyJob()
    });
  }

  function handleReprint(type) {
    if (window.confirm(`Do you really want to print ${type} of ${myjob["order"]["shopify_order_name"]}?`)) {
      let order_no = myjob["order"]["shopify_order_name"];
      rePrint(type, order_no, msg => {
        toast.success(msg);
        handleLoadMyJob()
      });
   }
  }

    function handleSumbit(){
        const form = {
            order:{
                order_id:myjob['order_id'],
                  toUpdate:{
                     order_status_id:7
                }
            },
            job_assembler:{
                job_assembler_id:myjob['job_assembler_id'],
                toUpdate:{
                    completed_at:""
                }
            },
            user:{
                toUpdate:{  
                    status:2
                }
            }
          }
        console.log({form})
        submitAsseblyJob(form,(type,text)=>{
            toast[type](text) 
            if(mobile){
              type === "success" && history.push('/system')
              handleLoadMyJob()
            } else {
                type === "success" && history.push('/system/assembly/list')
                handleLoadMyJob()
            }
             
        })
    }

    function handleCancel(){
      const form = {
          order:{
              order_id:myjob['order_id'],
                toUpdate:{
                   order_status_id:5,
              }
          },
          job_assembler:{
              job_assembler_id:myjob['job_assembler_id'],
              toUpdate:{
                  user_id:null,
                  accepted_at:'toNull'
              }
          },
          user:{
              toUpdate:{  
                  status:2
              }
          },
          order_item:{
               where:{
                 order_id:myjob['order_id'],
            },
              toUpdate:{
                  order_item_status_id:5
              }
          }
        }

      cancelAssemblyJob(form,(type,text)=>{
          toast[type](text)
          if(mobile){
            type === "success" && history.push('/system')
            handleLoadMyJob()
          } else {
              type === "success" && history.push('/system/assembly/list')
              handleLoadMyJob()
          }
      })
  }

    
  function testClick(){
    const order_item_id_list = myjob.order.order_items.map(x=>x.order_item_id)
    console.log({order_item_id_list})

    updateOrderCheckAll({
      order_id:myjob.order.order_id,
      order_item_id_list
    },()=>{
        const form = {
          msg_printout_ready:true,
          dar_printout_ready:true,
          order_id: myjob["order"]["order_id"]
        };
          updateAssemblyJobPrinted(form, (type, text) => {
              handleLoadMyJob();
              toast[type](text);
          } );
    })
   

  
    //     console.log(darReady.current.checked = true)
    }

    function handleMsgCbOnchange (e){
        const form = {
            msg_printout_ready:e.target.checked,
            dar_printout_ready:myjob['order']['dar_printout_ready'],
            order_id:myjob['order']['order_id']
        }
        updateAssemblyJobPrinted(form,(type,text)=>{
            handleLoadMyJob()
            toast[type](text)
        })
    }


  function btnSumitDisabler() {
    const index = order["order_items"].findIndex(
      x => x["order_item_status_id"] === 6
    );
  
    if( (order["dar_printout_ready"] === 1 || order["dar_printout_ready"] === 3) &&
      (order["msg_printout_ready"] === 1 || order["msg_printout_ready"] === 3) &&
      index === -1) {
      return false

    }else if ( order["msg_printout_ready"] === 4 ){
      if ((order["dar_printout_ready"] === 1 || order["dar_printout_ready"] === 3) &&
        index === -1){
        return false
      }
      else{
        return true
      }

    }else{
      return true
    }
  }

  myjob && console.log(myjob.order.order_items)


  return (
    <>
      <div className={`over-hid grd slideInUp animate-3 ${itemOnHold && 'gtr-af'}`}>
        <div className='grd over-hid grd-gp-1'>
          {itemOnHold && (
            <div
              style={{ height: "130px", maxHeight: "130px" }}
              className="pad-1 grd grd-gp-1 gtr-af over-hid slideInRight animate-2"
            >
              <span className="header-3">Job on hold</span>
              <div className="over-hid over-y-auto scroll">
                <AssemblerJobRow
                  status="hold"
                  onClick={() => setItemOnHold(false)}
                />
              </div>
            </div>
          )}
            {my_assembly_job !== null && my_assembly_job.length > 0 ? (
              <>
              <span className="header-3 asc">Accepted job</span>
              <div className="accepted_job-wrap pad-2 grd grd-gp-1 over-hid bg-white">
                <div
                  style={{ gridTemplateColumns: "auto .2fr 1fr auto auto auto" }}
                  className="grd grd-gp-1 aic over-hid"
                >
                  <span className="header-2 clr-primary">{` ${
                    myjob["order"]["shopify_order_name"]
                  } | ${myjob["order"]["order_id"]}`}</span>
                    <div  style={{visibility:"hidden"}}>
                          <Button 
                          onClick={testClick}
                          color="primary"
                            >
                          CHECK ALL
                          
                        </Button>
                    </div>
                   
                  <span></span>
                  <Button color="neutral" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    disabled
                    color="alert"
                    onClick={() => setHoldItem(true)}
                  >
                    Hold
                  </Button>
                  <Button
                    onClick={handleSumbit}
                    disabled={btnSumitDisabler()}
                    color="success"
                  >
                    Submit
                  </Button>
                </div>
                <span className="header-3 pad-x-2">{`Item/s: ${
                  myjob["order"]["order_items"].length
                }`}</span>
                <div
                  className="job_page-wrap over-hid over-y-auto scroll"
                  style={{ padding: "0 10%" }}
                >
                  <div
                    className="grd grd-gp-2 aic"
                    style={{ gridTemplateColumns: "auto 1fr auto" }}
                  >
                    <Checkbox
                      checked={myjob["order"]["dar_printout_ready"]}
                      onChange={handleDarCbOnchange}
                      color="secondary"
                    />
                    <span className="label">DAR</span>
                    <Button
                      color="neutral"
                      css="jse"
                      onClick={() => handleReprint("DAR")}
                    >
                      Reprint
                    </Button>
                  </div>
                  {myjob["order"]["message"] && (
                    <div
                      className="grd grd-col grd-gp-2 aic"
                      style={{ gridTemplateColumns: "auto 1fr auto" }}
                    >
                      <Checkbox
                        checked={myjob["order"]["msg_printout_ready"]}
                        onChange={handleMsgCbOnchange}
                        color="secondary"
                      />
                      <span className="label">Message</span>
                      <Button
                        color="neutral"
                        css="jse"
                        onClick={() => handleReprint("MSG")}
                      >
                        Reprint
                      </Button>
                    </div>
                  )}
                  {myjob["order"]["order_items"].map((order_item, i) => {
                    return (
                      <AssemblerJobItem
                        key={i}
                        data={order_item}
                        onChange={(e)=>{
                             updateOrderItemStatus(order_item,myjob["order_id"],e.target.checked,(type,text)=>{
                             handleLoadMyJob()
                             toast[type](text)
                          })
                      }}
                      />
                    );
                  })}
                </div>
              </div>
              </>
            ) : (
              <div className='size-100 grd aic jic'>
                <Error label='No job selected'/>
              </div>
            )}
        </div>
      </div>
      {holdItem && (
        <ModalHold
          clickClose={() => setHoldItem(false)}
          clickCancel={() => setHoldItem(false)}
          clickSubmit={() => {
            setHoldItem(false);
            setItemOnHold(true);
          }}
          level="order"
        />
      )}
    </>
  );
};


const transferStatetoProps = state => ({
    assembly:state.assemblyData,
    isfetching:state.webFetchData.isFetching
})

export default connect(
  transferStatetoProps,
  {cancelAssemblyJob, handleLoadMyJob, updateAssemblyJobPrinted, submitAsseblyJob, rePrint,updateOrderCheckAll, updateOrderItemStatus }
)(AssemblerJobPage);
