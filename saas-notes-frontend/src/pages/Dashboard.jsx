import React, { useState } from 'react'
import NoteFormModal from './NoteFormModal';
import UseApi from '../Hooks/UseApi';
import { Button, message } from 'antd';

function Dashboard() {
  const [visible,setVisible] = useState(false);
  const [selectedNote,setSelectedNote] = useState(null);
   
  const {mutate: hanldeCreate, isPending} = UseApi({url: "notes",method:"post",queryKey:["notes"]});
  function handleSubmit(values){
    hanldeCreate(values,{
      onSuccess : () => {
        message.success("Note created");
      },
      onError : (err)=>{
        message.error(err.message);
      }
    })
  }
  return (
    <>
    <Button type="primary" onClick={()=>setVisible(true)}>Create Note</Button>

    <NoteFormModal
    visible={visible}
    onClose={()=>{
      setVisible(false);
      setSelectedNote(null);
    }}
    onSubmit={handleSubmit}
    initialValues={selectedNote}
    />
    </>
  )
}

export default Dashboard