import { useState, useEffect } from "react";
import { Button, message, Segmented, Table } from "antd";
import { Loader, Plus } from "lucide-react";
import UseApi from "../Hooks/UseApi";
import NoteFormModal from "./NoteFormModal";
import ThreeDotMenu from "../components/ThreeDotMenu";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import { TableOutlined, AppstoreOutlined } from "@ant-design/icons";
import CardTable from "../components/CardTable";
import { useSelector } from "react-redux";
import { selectUser } from "../store/authSlice";
import usePageTitle from "../Hooks/usePageTitle";

const NotesPage = () => {
    usePageTitle("Notes");
    const [filters, setFilters] = useState({ search: "", category: "", dateRange: [] });
    const [loading, setLoading] = useState(false);
    const [categories] = useState([
        { name: "Personal" },
        { name: "Work" },
        { name: "Archived" },
    ]);
    const [notes, setNotes] = useState([]);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const user1 = useSelector(selectUser);
    console.log(user1)
    const { mutate: notesData, isPending: NotesLoading } = UseApi({
        url: "notes/fetch-notes",
        method: "post",
    });

    useEffect(() => {
        notesData({
            owner_id: user1?.id,
            page: pagination.current,
            limit: pagination.pageSize
        }, {
            onSuccess: (r) => {
                console.log(r)
                setNotes(r.data);
                setLoading(false);
            }
        }
        )
    }, [pagination])
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
        <div className="p-6  min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="self-baseline">
                    <h1 className="text-2xl font-semibold text-textsecondary">All Notes </h1>
                    <p className="text-textsurface text-sm">Manage and organize your notes easily.</p>
                </div>

                <div className="self-baseline flex flex-row justify-around gap-1">
                    <div className="self-baseline">
                        <Segmented
                            options={[
                                { label: "", value: "table", icon: <TableOutlined /> },
                                { label: "", value: "card", icon: <AppstoreOutlined /> },
                            ]}
                            value={viewMode}
                            onChange={(value) => setViewMode(value)}
                            style={{ marginBottom: 16 }}
                        />
                    </div>
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
                        dataSource={notes || []}
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
                        dataSource={notes || []}
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
                        className="custom-table"
                    />)
            }

        </div>
    );
};

export default NotesPage;
