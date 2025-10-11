import { Table, Tag, Popconfirm, Tooltip } from "antd";
import { Edit, Trash2, FileText } from "lucide-react";

const NotesTable = ({ notes, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <div className="flex items-center gap-2 text-gray-800">
          <FileText size={16} /> {text}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_name",
      key: "category_name",
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
    },
    {
      title: "Actions",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-3">
          <Tooltip title="Edit">
            <Edit
              size={18}
              className="cursor-pointer text-blue-600 hover:text-blue-800"
              onClick={() => onEdit(record)}
            />
          </Tooltip>

          <Popconfirm
            title="Delete this note?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => onDelete(record.note_id)}
          >
            <Tooltip title="Delete">
              <Trash2
                size={18}
                className="cursor-pointer text-red-500 hover:text-red-700"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      rowKey="note_id"
      columns={columns}
      dataSource={notes}
      loading={loading}
      pagination={{ pageSize: 8 }}
      className="rounded-lg shadow-sm border border-gray-200"
    />
  );
};

export default NotesTable;
