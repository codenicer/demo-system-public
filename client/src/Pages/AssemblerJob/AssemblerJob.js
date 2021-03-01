import React, { useEffect, useState, useRef } from 'react';
import Container from '../../atoms/Container/Container';
import AssemblerJobRow from './AssemberJobRow/AssemblerJobRow';
import {handleLoadAssemblyJob,acceptAssemblyJob,handleLoadMyJob,updateAssemblyJob,fitlerTextOnchange} from '../../scripts/actions/assemblyActions'
import {connect} from 'react-redux'
// import socket from '../../scripts/utils/socketConnect'
import { toast } from 'react-toastify';
import Input from '../../atoms/Input/Input';
import Select from 'react-select';
import HubFilter from '../../organisms/HubFilter/HubFilter';
import {delivery_time} from './delivery_time.json';
import Virtualizer from '../../atoms/Virtualizer/Virtualizer';
import Error from '../../atoms/Error/Error';

const AssemblerJob = (props) => {
    const {handleLoadAssemblyJob,acceptAssemblyJob,handleLoadMyJob,updateAssemblyJob,mobile} = props
    const {assembly:{assembly_jobs,my_assembly_job},history} = props
    
    const [ textFilter, setTextFilter ] = useState('');
    const [ barcodeFilter, setBarcodeFilter ] = useState(false);
    const [dateFilter,setDateFilter ] = useState("");
    const [timeFilter,setTimeFilter ] = useState('');
    
    const [hub,setHub] = useState()

    // const assemblerJobDidUpdate =  data=> updateAssemblyJob(data)


    //deleted on socket tuning.
    // useEffect(()=>{
    //     socket.on('ASSEMBLER_JOB_DID_UPDATE',assemblerJobDidUpdate)
    //    

    //     return () =>  socket.off('ASSEMBLER_JOB_DID_UPDATE',assemblerJobDidUpdate)

    // },[])

    useEffect(()=>{
        handleLoadMyJob()
    },[])

    useEffect(()=>{
           if(hub && hub.length > 0){
                handleLoadAssemblyJob(["",dateFilter,hub,textFilter,"",timeFilter])
           } else if(mobile){
               handleLoadAssemblyJob(['','','',barcodeFilter,'',''])
           }
    },[hub,dateFilter,timeFilter,barcodeFilter, textFilter])


    const getHubId = id => {
        let returnedId = id();
        setHub(returnedId)
    }

    function handleAccept(aj){
        const form = {
            order:{
                order_id:aj['order_id'],
                  toUpdate:{
                     order_status_id:6,
                }
            },
            job_assembler:{
                job_assembler_id:aj['job_assembler_id'],
                toUpdate:{
                    accepted_at:null
                }
            },
            user:{
                toUpdate:{  
                    status:3
                }
            },
            order_item:{
                 where:{
                   order_id:aj['order_id'],
              },
                toUpdate:{
                    order_item_status_id:6
                }
            }
          }

        acceptAssemblyJob(form,(type,text)=>{
            toast[type](text)
            if(mobile){
                type === "success" && history.push('/system/myjob')
                handleLoadMyJob()
            } else {
                type === "success" && history.push('/system/assembly/myjob')
                handleLoadMyJob()
            }
        })
    }

    const barcodeEnter = e => {
        if(e.key === 'Enter') {
            if(mobile){
                setBarcodeFilter(e.target.value)
            } else {
                setTextFilter(e.target.value)
            }
        }
    }

    const item = ({index, style}) => {
        let content = assembly_jobs.rows[index];
        return <div style={style}>
            <AssemblerJobRow
                 btndisabled={my_assembly_job !== null && my_assembly_job.length < 1 ? false : true}
                 key={content.order_id} 
                 onClick={()=>handleAccept(content)}
                 data={content.order}
                />
        </div>
    }

    return ( 
            <Container 
            css={`grd pad-2 grd-gp-2 over-hid relative ${mobile?'gtr-af':'assembly-web'}`}>
                <div className='grd gtc-af grd-gp-1'>
                    <span className='asc space-no-wrap header'>Assembler Job</span>
                    <Input
                        height={mobile ? '40px' : '50px'}
                        fontSize={mobile ? '1.5rem' : '2rem'} 
                        type='search'
                        label='Scan barcode..'
                        maxLength='10'
                        autoFocus
                        onKeyPress={barcodeEnter}
                    />
                </div>
                {!mobile && 
                <div style={{gridTemplateColumns: '1fr 1fr 1fr 1fr'}} className=" grd grd-gp-1">
                            <Input
                                type='search'
                                css='pad-1'
                                label='Search ticket..'
                                onChange={(e)=>setTextFilter(e.target.value)}
                            />
                            <Input
                                height = '20px'
                                type='date'
                                css='pad-1 mar-l-1'
                                label='Filter date'
                                value={dateFilter}
                                onChange={e => setDateFilter(e.target.value)}
                                />
                            <Select
                                value={timeFilter}
                                name="delivery_time"
                                placeholder='Delivery time'
                                options = {
                                    delivery_time.map((rec, key) => {
                                        return {value: rec.value, label: rec.label}
                                    })
                                }
                                onChange={(selecteditem)=> setTimeFilter(selecteditem ? selecteditem.value : "")}
                            />
                            <HubFilter
                                getHubID={getHubId}
                                maxBadgeCount={9}
                            />
                </div>}
                <div className='grd grd-gp-1 gtr-af over-hid size-100'>
                    <span className='header-3'>Job list</span>
                    {assembly_jobs.rows.length > 0 ?
                        <Virtualizer 
                            itemCount={assembly_jobs.rows.length}
                            itemSize={75}
                        >
                            {item}
                        </Virtualizer>
                        :
                        <Error label='No records found' labelsize={12} iconsize={24} />
                    }
                  </div>
            </Container>
      
    ); 
}; 

const transferStatetoProps = state => ({
    assembly:state.assemblyData,
    isfetching:state.webFetchData.isFetching
})

export default connect(transferStatetoProps,{handleLoadAssemblyJob,acceptAssemblyJob,handleLoadMyJob,updateAssemblyJob,fitlerTextOnchange})(AssemblerJob);

// { job && 
//     <AssemblerJobPage 
//         clickCancel={() => setJob(false)}
//     />
// }