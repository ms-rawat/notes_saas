import { useState, useEffect } from "react";
import { Button, message, Table } from "antd";
import { Plus } from "lucide-react";
import UseApi from "../Hooks/UseApi";
import NoteFormModal from "./NoteFormModal";

const NotesPage = () => {
    const [filters, setFilters] = useState({ search: "", category: "", dateRange: [] });
    const [loading, setLoading] = useState(false);
    const [categories] = useState([
        { name: "Personal" },
        { name: "Work" },
        { name: "Archived" },
    ]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const { data: notesData, isLoading } = UseApi({
        url: "notes",
        method: "GET",
        params: {
            page: pagination.current,
            limit: pagination.pageSize,
        },
        queryKey: ["notes", pagination.current, pagination.pageSize],
    });

    const handleTableChange = (newPagination) => {
        setPagination({
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        });
    };

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            ellipsis: true,
        },
        {
            title: "Body",
            dataIndex: "body",
            key: "body",
            ellipsis: true,
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            key: "created_at",
            render: (val) => new Date(val).toLocaleString(),
        },
    ];


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
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">All Notes</h1>
                    <p className="text-gray-500 text-sm">Manage and organize your notes easily.</p>
                </div>
                <div>
                    <Button type="primary" onClick={() => setVisible(true)} icon={<Plus size={16} />}>Create Note</Button>

                    <NoteFormModal
                        visible={visible}
                        onClose={() => {
                            setVisible(false);
                            setSelectedNote(null);
                        }}
                        onSubmit={handleSubmit}
                        initialValues={selectedNote}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={notesData}
                loading={isLoading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: notesData?.count,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} notes`,
                }}
                rowKey="id"
                onChange={handleTableChange}
            />
        </div>
    );
};

export default NotesPage;
