import { useState, useEffect } from "react";
import { Button, message, Segmented, Table } from "antd";
import { Loader, Plus } from "lucide-react";
import UseApi from "../Hooks/UseApi";
import NoteFormModal from "./NoteFormModal";
import ThreeDotMenu from "../components/ThreeDotMenu";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { TableOutlined, AppstoreOutlined } from "@ant-design/icons";
import CardTable from "../components/CardTable";

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

    const { data: notesData, isPending: NotesLoading } = UseApi({
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
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <ThreeDotMenu
                    items={[
                        {
                            key: "edit",
                            label: "Edit",
                            onClick: () => { setVisible(true); setSelectedNote(record); }
                        },
                        {
                            key: "delete",
                            label: "Delete",
                            onClick: () => { setDeleteModalVisible(true); setSelectedNote(record); }
                        }
                    ]}
                />

            )
        }
    ];

    const [viewMode, setViewMode] = useState("table"); // "table" | "card"

    const [visible, setVisible] = useState(false); // for create/edit modal
    const [DeleteModalVisible, setDeleteModalVisible] = useState(false) // for delete modal
    const [selectedNote, setSelectedNote] = useState(null);

    const { mutate: hanldeCreate, isPending } = UseApi({ url: "notes", method: "post", queryKey: ["notes"] });
    function handleSubmit(values) {

        hanldeCreate(values, {
            onSuccess: () => {
                message.success("Note created");
            },
            onError: (err) => {
                message.error(err.message);
            }
        })
    }

    const { mutate: DeleteNote } = UseApi({ url: "notes", method: "DELETE", queryKey: ['notes'] });

    const handleDelete = async () => {

        try {
            await DeleteNote({ id: selectedNote.id });
            message.success("Note Deleted SuccessFully");
            setDeleteModalVisible(false);
            setSelectedNote(null);
        } catch (err) {
            message.error(err.message);
        }
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
                    <Segmented
                        options={[
                            { label: "Table", value: "table", icon: <TableOutlined /> },
                            { label: "Card", value: "card", icon: <AppstoreOutlined /> },
                        ]}
                        value={viewMode}
                        onChange={(value) => setViewMode(value)}
                        style={{ marginBottom: 16 }}
                    />
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
                    <DeleteConfirmModal
                        visible={DeleteModalVisible}
                        onClose={() => {
                            setDeleteModalVisible(false);
                            setSelectedNote(null);
                        }}
                        onSubmit={handleDelete}
                        initialValues={selectedNote}

                    />
                </div>
            </div>
            {NotesLoading ? <Loader className="rotate-90 animate-spin" /> :
                (viewMode === "card" ?
                    <CardTable
                        columns={columns}
                        dataSource={notesData?.data || []}
                        loading={NotesLoading}
                        pagination={{
                            current: pagination?.current,
                            pageSize: pagination?.pageSize,
                            total: notesData?.count,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} notes`,
                        }}
                        rowKey="id"
                        onChange={handleTableChange}
                    /> :

                    <Table
                        columns={columns}
                        dataSource={notesData?.data || []}
                        loading={NotesLoading}
                        pagination={{
                            current: pagination?.current,
                            pageSize: pagination?.pageSize,
                            total: notesData?.count,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} notes`,
                        }}
                        rowKey="id"
                        onChange={handleTableChange}
                    />)
            }

        </div>
    );
};

export default NotesPage;
