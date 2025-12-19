import { useState, useEffect } from "react";
import { Button, message, Segmented, Table, Tag, Avatar, Tooltip, Input, Select } from "antd";
import { Loader, Plus, Search, Filter } from "lucide-react";
import UseApi from "../../../Hooks/UseApi";
import IssueFormModal from "../components/IssueFormModal";
import ThreeDotMenu from "../../../components/shared/ThreeDotMenu";
import DeleteConfirmModal from "../../../components/shared/DeleteConfirmModal";
import { TableOutlined, AppstoreOutlined, ProjectOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { selectUser } from "../../../store/authSlice";
import usePageTitle from "../../../Hooks/usePageTitle";
import KanbanBoard from "../components/KanbanBoard";

const IssuesPage = () => {
    usePageTitle("Issues");
    const [viewMode, setViewMode] = useState("board"); // "table" | "board"
    const [filters, setFilters] = useState({ search: "", status: null, priority: null, project_id: null });

    // API Hooks
    const { mutate: fetchIssues, isPending: loading } = UseApi({
        url: "issues/fetch",
        method: "post",
    });

    const { data: projects, isPending: loadingProjects } = UseApi({ url: 'projects' });

    const { mutate: deleteIssue } = UseApi({ url: "issues", method: "DELETE", queryKey: ['issues'] });
    const { mutate: createIssue } = UseApi({ url: "issues", method: "post", queryKey: ["issues"] });
    const { mutate: updateIssue } = UseApi({ url: "issues", method: "PUT", queryKey: ["issues"] });

    // State
    const [issues, setIssues] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 50 }); // Higher page size for board
    const [visible, setVisible] = useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [selectedIssue, setSelectedIssue] = useState(null);

    const user = useSelector(selectUser);

    const loadData = () => {
        fetchIssues({
            owner_id: user?.UserId,
            page: pagination.current,
            limit: pagination.pageSize,
            ...filters
        }, {
            onSuccess: (r) => {
                setIssues(r.data);
            }
        });
    };

    useEffect(() => {
        if (user?.UserId) {
            loadData();
        }
    }, [pagination.current, pagination.pageSize, filters, user?.UserId]);

    // Handlers
    const handleSubmit = (values, isEditMode) => {
        const handler = isEditMode ? updateIssue : createIssue;
        handler(values, {
            onSuccess: () => {
                message.success(`Issue ${isEditMode ? 'updated' : 'created'}`);
                loadData();
            },
            onError: (err) => message.error(err.message)
        });
    };

    const handleDelete = async () => {
        deleteIssue({ id: selectedIssue.id }, {
            onSuccess: () => {
                message.success("Issue deleted");
                setDeleteModalVisible(false);
                setSelectedIssue(null);
                loadData();
            }
        });
    };

    const handleCardClick = (issue) => {
        setSelectedIssue(issue);
        setVisible(true);
    };

    // Columns for Table View
    const columns = [
        {
            title: "Type",
            dataIndex: "type",
            width: 80,
            render: (type) => <Tag>{type?.[0]}</Tag>
        },
        {
            title: "Title",
            dataIndex: "title",
            ellipsis: true,
        },
        {
            title: "Project",
            dataIndex: "project_id", // Ideally fetch project name or join in query
            width: 100,
            render: (pid) => {
                const p = (projects?.data || []).find(x => x.project_id === pid);
                return p ? <Tag>{p.project_key}</Tag> : "-";
            }
        },
        {
            title: "Status",
            dataIndex: "status",
            width: 120,
            render: (status) => {
                let color = status === 'DONE' ? 'green' : status === 'IN_PROGRESS' ? 'blue' : 'default';
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: "Priority",
            dataIndex: "priority",
            width: 100,
            render: (priority) => {
                let color = priority === 'CRITICAL' ? 'red' : priority === 'HIGH' ? 'orange' : 'blue';
                return <Tag color={color}>{priority}</Tag>;
            }
        },
        {
            title: "Assignee",
            dataIndex: "assignee_name",
            width: 150,
            render: (name) => name ? <Avatar size="small" className="bg-blue-500">{name[0]}</Avatar> : "-"
        },
        {
            title: "Created At",
            dataIndex: "created_at",
            width: 150,
            render: (val) => new Date(val).toLocaleDateString(),
        },
        {
            title: "Action",
            key: "action",
            width: 80,
            render: (_, record) => (
                <ThreeDotMenu
                    items={[
                        { key: "edit", label: "Edit", onClick: () => { setVisible(true); setSelectedIssue(record); } },
                        { key: "delete", label: "Delete", onClick: () => { setDeleteModalVisible(true); setSelectedIssue(record); } }
                    ]}
                />
            )
        }
    ];

    return (
        <div className="p-6 h-[calc(100vh-64px)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-semibold text-textsecondary">Issues</h1>
                    <p className="text-textsurface text-sm">Track bugs, features, and tasks.</p>
                </div>

                <div className="flex gap-2 items-center">
                    <Select
                        placeholder="Project"
                        allowClear
                        className="w-40"
                        loading={loadingProjects}
                        onChange={v => setFilters(prev => ({ ...prev, project_id: v }))}
                        options={(projects?.data || []).map(p => ({ label: p.name, value: p.project_id }))}
                    />
                    <Select
                        placeholder="Status"
                        allowClear
                        className="w-32"
                        onChange={v => setFilters(prev => ({ ...prev, status: v }))}
                        options={[
                            { label: 'To Do', value: 'TODO' },
                            { label: 'In Progress', value: 'IN_PROGRESS' },
                            { label: 'Done', value: 'DONE' }
                        ]}
                    />
                    <Segmented
                        options={[
                            { label: "Board", value: "board", icon: <ProjectOutlined /> },
                            { label: "List", value: "table", icon: <TableOutlined /> },
                        ]}
                        value={viewMode}
                        onChange={setViewMode}
                    />
                    <Button type="primary" onClick={() => { setSelectedIssue(null); setVisible(true); }} icon={<Plus size={16} />}>
                        Create Issue
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden min-h-0">
                {loading && !issues.length ? (
                    <div className="flex h-full justify-center items-center"><Loader className="animate-spin" /></div>
                ) : (
                    viewMode === "board" ? (
                        <KanbanBoard issues={issues} onCardClick={handleCardClick} />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={issues}
                            loading={loading}
                            pagination={{
                                ...pagination,
                                total: issues.length, // approximation
                                onChange: (page, pageSize) => setPagination({ current: page, pageSize })
                            }}
                            rowKey="id"
                            scroll={{ y: 'calc(100vh - 250px)' }}
                        />
                    )
                )}
            </div>

            {/* Modals */}
            <IssueFormModal
                visible={visible}
                onClose={() => { setVisible(false); setSelectedIssue(null); }}
                onSubmit={handleSubmit}
                initialValues={selectedIssue}
            />
            <DeleteConfirmModal
                visible={deleteModalVisible}
                onClose={() => { setDeleteModalVisible(false); setSelectedIssue(null); }}
                onSubmit={handleDelete}
                initialValues={selectedIssue}
            />
        </div>
    );
};

export default IssuesPage;
