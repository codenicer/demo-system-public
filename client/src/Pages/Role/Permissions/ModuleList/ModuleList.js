import React, { useState, useEffect } from 'react';
import Paper from '../../../../atoms/Paper/Paper';
import Checkbox from '../../../../atoms/Checkbox/Checkbox'

const ModuleList = ({data, moduleItems, toggleCheckbox}) => {

    let module_items = data.module_items || [];
    const [ mods, setMods ] = useState(null)

    useEffect(()=>{
      setMods(moduleItems);
    },moduleItems);
    return (
        <Paper css='pad-2 mar-y-1'>
            <div className='grd grd-gp-3 '>

                <div
                    className='grd grd-gp-3 grd-col'
                    >
                    <span className='ass header-2'>Module: {data.description}</span>

                </div>
                <div className='grd  grd-gp-1 ' style={{gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr'}}>


                              {
                                mods !== null && module_items.map((record, key) => {

                                  let checked = moduleItems.indexOf(parseInt(record.module_item_id));

                                  //console.log('checked', record.module_item_id);
                                  //console.log('checked', moduleItems);
                                  //console.log('checked', checked);

                                  return   <Checkbox

                                    defaultChecked={ checked > -1 }

                                    key={key} data={record} label={record.title} value={record.module_item_id} name="hubs[]"  onChange={toggleCheckbox} />

                                })
                              }
                </div>


            </div>
        </Paper>
    );
};

export default ModuleList;